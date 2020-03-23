const Warlock = require('node-redis-warlock');
const redis = require('redis').createClient();
const warlock = new Warlock(redis);
const CronJob = require('cron').CronJob;
var utils = require('../../commons/utils').utils;
var config = require('../../env/config.js').getConf();
var User = require('../users/users');
var login = require('../login/login');
var mailer = require('../email/mailer');
const async = require('async');
var _ = require('underscore');
var logger = require('../../logger.js');
function executeOnce(key, callback) {
  warlock.lock(key, 20000, function (err, unlock) {
    if (err) {
      logger.info('something wwent wrong ', err);
      return;
    }
    if (typeof unlock === 'function') {
      setTimeout(function () {
        callback(unlock);
      }, 1000);
    }
  });

 
}



function dailyJobs(unlock) {
  async.parallel([
      removeAllInActiveSessions,
      accountActivationEmails,
    ],
    (err) => {
      if (err) {
        logger.error(err);
      }
      unlock();
    });
}

let daily = new CronJob({
  cronTime: config.jobs.daily_jobs_time,
  onTick: function () {    
    executeOnce('every-day-lock',  function(unlock) {
      // Do here any stuff that should be done only once...    
      dailyJobs(unlock);        
      unlock();          
    });
  },
  start: true,
  runOnInit: true
});

// Remove all inactive session since yesterday.
let removeAllInActiveSessions = function (done) {
  logger.info('Job 1 called @ ', utils.getSystemTime());
  var current = new Date();
  var yesterdayTime = current.setDate(current.getDate() - 1);
  var query = {
    "loginTime": {
      "$lt": yesterdayTime
    },
    "$where": "this.deviceId.length < 20" // mobile session shouldn;t be removed.
  }
  login.getList(query, function (resp) {
    _.forEach(resp.result, function (session) {
      login.remove(session.token, function (err) {
        if (err) {
          logger.error('Job 1 failed > ', session.token);
          //done(err);
        } else {
          logger.info('removed id : ', session.token);
          //done();
        }
      });
    })
  });
}

let accountActivationEmails = function (done) {
  let now = utils.getSystemTime();
  logger.info('Job 2 called @ ', now);
  let twoDaysBackTime = utils.subtractTime(now, 2, 'day');
  let query = {
    creationTime: {
      '$lte': parseInt(twoDaysBackTime)
    },
    isActive: false,
    roleId: 1
  }
  User.getList(query, function (res) {
    var inactiveUsers = res.result;
    _.forEach(inactiveUsers, function (user) {
      if (user.parents.length > 0) {
        var emailRequest = {
          template: utils.CONSTANTS.EMAIL.REMINDER_EMAIL_ALERTS,
          to: user.parents[0].email,
          name: user.firstName + ' ' + (user.lastName ? user.lastName : ''),
          email: user.email,
          profilePicture: user.profilePicture,
          mailMessage: 'Your student is waiting for your approval on profile activation. Kindly go to spikeview and make this profile active.',
          link: config.server_url
        }
        mailer.sendMail(emailRequest, function (res) {
          logger.info('Mail sent status : ', res.status, 'for email : ', emailRequest.to);
        });
      }
    });
  });
}
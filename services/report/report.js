module.exports = function (app) {
    app.post('/ui/report', function (req, res) { //To Create education
        try {
            create(req.body, function (response) {
                res.json(response);
            });
        } catch (e) {
            res.json(e);
        }
    });
    app.get('/ui/report', function (req, res) { //To get education
        try {
            getList(req.query, function (response) {
                res.json(response);
            });
        } catch (e) {
            res.json(e);
        }
    });
    app.put('/ui/report', function (req, res) { //To update education
        try {
            update(req.body, function (response) {
                res.json(response);
            });
        } catch (e) {
            res.json(e);
        }
    });
    app.delete('/ui/report', function (req, res) { //To delete education
        try {
            remove(req.body, function (response) {
                res.json(response);
            });
        } catch (e) {
            res.json(e);
        }
    });
}

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var ReportSchema = new Schema(require('./reportSchema').reportSchema, {
    collection: 'report'
});
var ReportModel = mongoose.model('report', ReportSchema);
var ReportController = require('./reportController');
var utils = require('../../commons/utils').utils;
var CONSTANTS = utils.CONSTANTS;
var USER_CODES = utils.CONSTANTS.USERS;
var user = require('../users/users');
var REQUEST_CODES = CONSTANTS.REQUEST_CODES;
var REPORT = utils.CONSTANTS.REPORT;
var VALIDATE = utils.CONSTANTS.VALIDATE;
var mongoUtils = utils.mongoUtils;
var _ = require('underscore');
var Feed = require('../feeds/feed');
var login = require('../login/login');
var mailer = require('../email/mailer');
var mobileNotification = require('../pushNotification/fcm');
var Group = require('../group/group');
var config = require('../../env/config.js').getConf();
var logger = require('../../logger.js');

function create(report, callback) {
    var reportAPI;
    var errorList = [];
    try {
        reportAPI = ReportController.ReportAPI(report);
    } catch (e) {
        errorList.push(e.error[0]);
        callback({
            status: REQUEST_CODES.FAIL,
            message: errorList
        });
        return;
    }
    if (!reportAPI.getReportedBy()) {
        var e = {
            status: VALIDATE.FAIL,
            message: utils.formatText(VALIDATE.REQUIRED, 'Reported By')
        };
        errorList.push(e);
    }
    if (!reportAPI.getReportType()) {
        var e = {
            status: VALIDATE.FAIL,
            message: utils.formatText(VALIDATE.REQUIRED, 'Report Type')
        };
        errorList.push(e);
    }
    if (!reportAPI.getReportTypeId()) {
        var e = {
            status: VALIDATE.FAIL,
            message: utils.formatText(VALIDATE.REQUIRED, 'Report type id')
        };
        errorList.push(e);
    }
    if (errorList.length) {
        callback({
            status: REQUEST_CODES.FAIL,
            message: errorList
        });
        return;
    } else {
        var reportModel = new ReportModel(reportAPI);
        mongoUtils.getNextSequence('reportId', function (oSeq) {
            reportModel.reportId = oSeq;
            reportModel.reportDate = utils.getSystemTime();
            reportModel.save(function (error) {
                if (error) {
                    callback({
                        status: REQUEST_CODES.FAIL,
                        message: error
                    });
                    return;
                } else {
                    let feedPostedBy;
                    if(report.reportType == CONSTANTS.REPORT_TYPE.FEED){                       
                        Feed.getList({feedId: parseInt(report.reportTypeId.feedId)},function(res){
                            if(res.result && res.result.length > 0){
                                let feed= res.result[0];
                                feedPostedBy= feed.postedBy
                                sendMailAndNotification(report,feedPostedBy);
                                let feedReportedBy = feed['reportedBy'] ?feed['reportedBy'] : [] ;                               
                                feedReportedBy.push(reportAPI.getReportedBy());
                                feed['reportedBy']= feedReportedBy;   
                            
                                if(report.isHide){
                                    let feedHideBy = feed['hideBy'] ?feed['hideBy'] : [] ;                               
                                    feedHideBy.push(reportAPI.getReportedBy());
                                    feed['hideBy']= feedHideBy;  
                                }  
                                Feed.update(feed,callback);
                            }
                        })
                    }else if(report.reportType == CONSTANTS.REPORT_TYPE.GROUPFEED){
                            Feed.getList({feedId: parseInt(report.reportTypeId.feedId)},function(res){
                                if(res.result && res.result.length > 0){
                                    let feed= res.result[0];
                                    feedPostedBy= feed.postedBy
                                    sendMailAndNotification(report,feedPostedBy);
                                    let feedReportedBy = feed['reportedBy'] ?feed['reportedBy'] : [] ;                               
                                    feedReportedBy.push(reportAPI.getReportedBy());
                                    feed['reportedBy']= feedReportedBy;    
                                    
                                    if(report.isHide){
                                        let feedHideBy = feed['hideBy'] ?feed['hideBy'] : [] ;                               
                                        feedHideBy.push(reportAPI.getHideBy());
                                        feed['hideBy']= feedHideBy;  
                                    }  
                                    Feed.update(feed,callback);
                                }
                            })
                        }else if(report.reportType == CONSTANTS.REPORT_TYPE.GROUP){
                                Group.getList({feedId: parseInt(report.reportTypeId.groupId)},function(res){
                                    if(res.result && res.result.length > 0){
                                        let group= res.result[0];
                                        sendMailAndNotification(report,group.createdBy);
                                        // let groupReportedBy = group['reportedBy'] ?group['reportedBy'] : [] ;                               
                                        // groupReportedBy.push(reportAPI.getReportedBy());
                                        // group['reportedBy']= groupReportedBy;                               
                                        // Group.update(group,callback);
                                    }
                                })
                            }else if(report.reportType == CONSTANTS.REPORT_TYPE.PROFILE){                               
                                        sendMailAndNotification(report,report.reportTypeId.userId);                                      
                             }  
                    
                    callback({
                        status: REQUEST_CODES.SUCCESS,
                        message: REPORT.CREATE_SUCCESS,
                        result: {
                            reportId: reportModel.reportId
                        }
                    });
                    return;
                }
            });
        });
    }
}

function sendMailAndNotification(report,feedPostedBy){   
    login.getDeviceIds(USER_CODES.BOTID, function (resp) {
        let deviceIds = resp.result;
        user.getList({
            userId: report.reportedBy
        }, function (res) {
            let userRe = res.result[0];
            user.getList({
                userId: feedPostedBy
            }, function (resReportFor) {               
                let reportFor = resReportFor.result[0];
                // var message = {
                //     deviceIds: deviceIds,
                //     userId: USER_CODES.BOTID,
                //     name: '',
                //     actedBy: userRe.userId,
                //     profilePicture: userRe.profilePicture,
                //     body: userRe.firstName + ' has reported '+ reportFor.firstName +'s '+report.reportType,
                //     textName: userRe.firstName + ' ' + (userRe.lastName ? userRe.lastName : ''),
                //     textMessage : userRe.firstName + ' has reported '+ reportFor.firstName +'s '+report.reportType
                // };
                // mobileNotification.sendNotification(message);
              
                if (reportFor.profilePicture) {
                    reportFor.profilePicture = config.apps.azure.base_url + config.apps.azure.container + '/' + reportFor.profilePicture;
                } else {
                    reportFor.profilePicture = config.spikeview.child_profile;
                }            
                let birthDate = new Date(reportFor.dob);
                var today = new Date();         
          
                let age = today.getFullYear() - birthDate.getFullYear();                  
                  
                let reportForDetail="<div><strong>Issue Details:</strong><div>{"+reportFor.firstName + ' ' + (reportFor.lastName ? reportFor.lastName : '')+"} {"+reportFor.email+"}"+"{"+report.reason+"} </div></div><div>"+age+"</div>";
               
                var emailRequest = {
                    template: CONSTANTS.EMAIL.ADMIN_REPORT_MAIL,
                    to: config.apps.email.from_whom,
                    name: userRe.firstName + ' ' + (userRe.lastName ? userRe.lastName : ''),
                    email: userRe.email,
                    reasonType: report.reasonType,
                    profilePicture: userRe.profilePicture ? userRe.profilePicture : '',                                                
                    mailMessage: reportForDetail ? reportForDetail : ''                                                                
                };
                mailer.sendMail(emailRequest, function (res) {
                    logger.info('Mail sent status : ', res.status, 'for User : ', userRe.email);
                });
            })
        })
    })
}

function update(report, callback) {                        
    ReportModel.update({
        'reportId': report.reportId
    }, {
        $set: report
    }, function (error) {
        if (error) {
            callback({
                status: REQUEST_CODES.FAIL,
                message: error
            });
            return;
        } else {
                callback({
                        status: REQUEST_CODES.SUCCESS,
                        message: REPORT.UPDATE_SUCCESS
                });
                return;               
        }
    })       
}

function remove(query, callback) {
    ReportModel.remove(query, function (error) {
      if (error) {
        callback({
          status: REQUEST_CODES.FAIL,
          message: REQUEST_CODES.FAIL_MSG
        });
        return;
      } else {
        callback({
          status: REQUEST_CODES.SUCCESS,
          message: utils.formatText(REPORT.DELETE_SUCCESS, query.reportId)
        });
        return;
      }
    });
}

function getList(query, callback) {
    ReportModel.find(query, function (error, records) {
        if (error) {
          callback({
            status: DB_CODES.FAIL,
            error: error
          });
          return;
        } else {
          records = records.map(function (record) {
            return new ReportController.ReportAPI(record);
          });
          callback({
            status: REQUEST_CODES.SUCCESS,
            result: records
          });
          return;
        }
      });
}

module.exports.create = create;
module.exports.getList = getList;
module.exports.remove = remove;
module.exports.update = update;
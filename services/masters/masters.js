module.exports = function (app) {
  app.get('/app/masters/data', function (req, res) {
    try {
      getMasterData(req.query, function (response) {
        res.json(response);
      });
    } catch (e) {
      res.json(e);
    }
  });
};

var Importance = require('../masters/importance/importance');
var Competencies = require('../masters/competencyType/competencyType');
var Skills = require('../masters/skills/skills');
var utils = require('../../commons/utils').utils;
var CONSTANTS = utils.CONSTANTS;
var REQUEST_CODES = CONSTANTS.REQUEST_CODES;

function getMasterData(query, callback) {
  async.series({
      skills: function (callback) {
        Skills.getList({}, function (res) {
          if (res.status == REQUEST_CODES.SUCCESS) {
            callback(null, res.result);
          } else {
            callback(null, []);
          }
        });
      },
      importance: function (callback) {
        Importance.getList({}, function (res) {
          if (res.status == REQUEST_CODES.SUCCESS) {
            callback(null, res.result);
          } else {
            callback(null, []);
          }
        });
      },
      competencies: function (callback) {
        Competencies.getList({}, function (res) {
          if (res.status == REQUEST_CODES.SUCCESS) {
            callback(null, res.result);
          } else {
            callback(null, []);
          }
        });
      }
    },
    function (err, results) {
      callback({
        status: REQUEST_CODES.SUCCESS,
        result: results
      });
    }
  );
}
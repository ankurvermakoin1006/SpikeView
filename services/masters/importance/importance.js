module.exports = function (app) {
    app.post('/ui/importance', function (req, res) {
        try {
            create(req.body, function (response) {
                res.json(response);
            });
        } catch (e) {
            res.json(e);
        }
    });
    app.get('/ui/importance', function (req, res) {
        try {
            getList(req.query, function (response) {
                res.json(response);
            });
        } catch (e) {
            res.json(e);
        }
    });
    
}

var mongoose = require('mongoose'), Schema = mongoose.Schema;
var ImportanceSchema = new Schema(require('./importanceSchema').importanceSchema, { collection: 'importance'});
var ImportanceModel = mongoose.model('importance', ImportanceSchema);
var ImportanceController = require('./importanceController');
var utils = require('../../../commons/utils').utils;
var mongoUtils = utils.mongoUtils;
var CONSTANTS = utils.CONSTANTS;
var DB_CODES = CONSTANTS.DATABASE_CODES;
var REQUEST_CODES = CONSTANTS.REQUEST_CODES;
var IMPORTANCE_CODES = utils.CONSTANTS.IMPORTANCE;

function create(importance, callback) {
    var importanceAPI;
    var errorList = [];
    try {
        importanceAPI = ImportanceController.ImportanceAPI(importance);
    } catch (e) {
        errorList.push(e.error[0]);
        callback({
            status: REQUEST_CODES.FAIL,
            error: errorList
        });
        return;
    }
    var importanceModel = new ImportanceModel(importanceAPI);
    mongoUtils.getNextSequence('importanceId', function (oSeq) {
        importanceModel.importanceId = oSeq;
        importanceModel.save(function (error) {
            if (error) {
                callback({
                    status: DB_CODES.FAIL,
                    error: error
                });
                return;
            } else {
                callback({
                    status: REQUEST_CODES.SUCCESS,
                    result: utils.formatText(IMPORTANCE_CODES.CREATE_SUCCESS, importanceModel.importanceId),
                    importanceId: importanceModel.importanceId
                });
                return;
            }
        });
    });
}

function getList(query, callback) {
    ImportanceModel.find(query, function (error, records) {
        if (error) {
            callback({
                status: REQUEST_CODES.FAIL,
                error: error
            });
            return;
        } else {
            records = records.map(function (records) {
                return new ImportanceController.ImportanceAPI(records);
            });
            callback({
                status: REQUEST_CODES.SUCCESS,
                result: records
            });
            return;
        }
    });
}

module.exports.getList = getList;
module.exports.create = create;

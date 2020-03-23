module.exports = function (app) {
    app.get('/ui/interests', function (req, res) {
        try {
            getList(req.query, function (response) {
                res.json(response);
            });
        }
        catch (e) {
            res.json(e);
        }
    });
    app.post('/ui/interests', function (req, res) {
        try {
            create(req.body, function (response) {
                res.json(response);
            });
        } catch (error) {
            res.json(error)
        }
    });
}

var mongoose = require('mongoose'), Schema = mongoose.Schema;
var InterestsSchema = new Schema(require('./interestsSchema').interestsSchema, { collection: 'interests' });
var InterestsModel = mongoose.model('interests', InterestsSchema);
var InterestsController = require('./interestsController');
var utils = require('../../commons/utils').utils;
var mongoUtils = utils.mongoUtils;
var CONSTANTS = utils.CONSTANTS;
var REQUEST_CODES = CONSTANTS.REQUEST_CODES;
var _ = require('underscore');
var INTERESTS_CODES = utils.CONSTANTS.INTERESTS;

function getList(query, callback) {
    InterestsModel.find(query, function (error, records) {
        if (error) {
            callback({
                status: DB_CODES.FAIL,
                error: error
            });
            return;
        }
        else {
            callback({
                status: REQUEST_CODES.SUCCESS,
                result: records
            });
            return;
        }
    });
}

function create(interests, callback) {
    var interestsAPI;
    var errorList = [];
    try {
        interestsAPI = InterestsController.InterestsAPI(interests);
    }
    catch (e) {
        callback({
            status: REQUEST_CODES.FAIL,
            error: errorList
        });
        return;
    }

    var interestsModel = new InterestsModel(interestsAPI);
    mongoUtils.getNextSequence('interestsId', function (oSeq) {
        interestsModel.interestsId = oSeq;
        interestsModel.save(function (error) {
            if (error) {
                callback({
                    status: REQUEST_CODES.FAIL,
                    error: error
                });
                return;
            }
            else {
                callback({
                    status: REQUEST_CODES.SUCCESS,
                    message: utils.formatText(INTERESTS_CODES.CREATE_SUCCESS, interestsModel.interestsId),
                    result: InterestsModel.interestsId
                });
                return;
            }
        });
    });
}

module.exports.create = create;
module.exports.getList = getList;
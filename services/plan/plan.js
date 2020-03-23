module.exports = function (app) {
    app.post('/ui/plan', function (req, res) {
        try {
            create(req.body, function (response) {
                res.json(response);
            });
        } catch (error) {
            res.json(error);
        }
    });
    app.get('/ui/plan', function (req, res) {
        try {
            getList(req.query, function (response) {
                res.json(response);
            });
        }
        catch (e) {
            res.json(e);
        }
    });
}

var mongoose = require('mongoose'), Schema = mongoose.Schema;
var PlanSchema = new Schema(require('./planSchema').planSchema, { collection: 'plan' });
var PlanModel = mongoose.model('plan', PlanSchema);
var PlanController = require('./planController');
var utils = require('../../commons/utils').utils;
var mongoUtils = utils.mongoUtils;
var CONSTANTS = utils.CONSTANTS;
var REQUEST_CODES = CONSTANTS.REQUEST_CODES;
var _ = require('underscore');
var PLAN_CODES = utils.CONSTANTS.PLAN;

function getList(query, callback) {
    PlanModel.find(query, function (error, records) {
        if (error) {
            console.log(error);
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

function create(plan, callback) {
    var planAPI;
    var errorList = [];
    try {
        planAPI = PlanController.PlanAPI(plan);
    }
    catch (e) {
        errorList.push(e.error[0]);
        callback({
            status: REQUEST_CODES.FAIL,
            error: errorList
        });
        return;
    }

    var planModel = new PlanModel(planAPI);
    mongoUtils.getNextSequence('planId', function (oSeq) {
        planModel.planId = oSeq;
        planModel.save(function (error) {
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
                    message: utils.formatText(PLAN_CODES.CREATE_SUCCESS, planModel.planId),
                    result: planModel.planId
                });
                return;
            }
        });
    });
}

module.exports.getList = getList;
module.exports.create = create;
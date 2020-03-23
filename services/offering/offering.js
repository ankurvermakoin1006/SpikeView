module.exports = function (app) {
    app.get('/ui/offering', function (req, res) {
        try {
            getList(req.query, function (response) {
                res.json(response);
            });
        }
        catch (e) {
            res.json(e);
        }
    });
    app.post('/ui/offering', function (req, res) {
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
var OfferingSchema = new Schema(require('./offeringSchema').offeringSchema, { collection: 'offering' });
var OfferingModel = mongoose.model('offering', OfferingSchema);
var OfferingController = require('./offeringController');
var utils = require('../../commons/utils').utils;
var mongoUtils = utils.mongoUtils;
var CONSTANTS = utils.CONSTANTS;
var REQUEST_CODES = CONSTANTS.REQUEST_CODES;
var _ = require('underscore');
var OFFERING_CODES = utils.CONSTANTS.OFFERING;

function getList(query, callback) {
    OfferingModel.find(query, function (error, records) {
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

function create(offering, callback) {
    var offeringAPI;
    var errorList = [];
    try {
        offeringAPI = OfferingController.OfferingAPI(offering);
    }
    catch (e) {
        callback({
            status: REQUEST_CODES.FAIL,
            error: errorList
        });
        return;
    }

    var offeringModel = new OfferingModel(offeringAPI);
    mongoUtils.getNextSequence('offeringId', function (oSeq) {
        offeringModel.offeringId = oSeq;
        offeringModel.save(function (error) {
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
                    message: utils.formatText(OFFERING_CODES.CREATE_SUCCESS, offeringModel.offeringId),
                    result: OfferingModel.offeringId
                });
                return;
            }
        });
    });
}

module.exports.create = create;
module.exports.getList = getList;
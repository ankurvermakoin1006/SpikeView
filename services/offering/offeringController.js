var commons = require('../../commons/constants');
var utils = require('../../commons/utils').utils;
var CONSTANTS = commons.CONSTANTS;
var REQUEST_CODES = CONSTANTS.REQUEST_CODES;
var VALIDATE = commons.CONSTANTS.VALIDATE;
var validate = utils.validate;

var Offering = function () {
    return {
        offeringId: 0,
        name: null
    }
};

function OfferingAPI(offeringRecord) {
    var offering = new Offering();

    offering.getOfferingId = function () {
        return this.offeringId;
    };
    offering.setOfferingId = function (offeringId) {
        if (offeringId) {
            if (validate.isInteger(offeringId)) {
                this.offeringId = offeringId;
            } else {
                throw {
                    status: VALIDATE.FAIL,
                    error: utils.formatText(VALIDATE.NOT_A_INTEGER, offeringId, 'offeringId')
                };
            }
        }
    };

    offering.getName = function () {
        return this.name;
    };
    offering.setName = function (name) {
        this.name = name;
    };

    if (offeringRecord) {
        var errorList = [];

        try {
            offering.setOfferingId(offeringRecord.offeringId);
        } catch (error) {
            errorList.push(error);
        }
        try {
            offering.setName(offeringRecord.name);
        } catch (error) {
            errorList.push(error);
        }
        if (errorList.length) {
            throw {
                status: REQUEST_CODES.FAIL,
                error: errorList
            };
        }
    }
    return offering;
}

module.exports.OfferingAPI = OfferingAPI;
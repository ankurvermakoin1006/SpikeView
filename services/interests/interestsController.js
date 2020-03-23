var commons = require('../../commons/constants');
var utils = require('../../commons/utils').utils;
var CONSTANTS = commons.CONSTANTS;
var REQUEST_CODES = CONSTANTS.REQUEST_CODES;
var VALIDATE = commons.CONSTANTS.VALIDATE;
var validate = utils.validate;

var Interests = function () {
    return {
        interestsId: 0,
        name: null
    }
};

function InterestsAPI(interestsRecord) {
    var interests = new Interests();

    interests.getInterestsId = function () {
        return this.interestsId;
    };
    interests.setInterestsId = function (interestsId) {
        if (interestsId) {
            if (validate.isInteger(interestsId)) {
                this.interestsId = interestsId;
            } else {
                throw {
                    status: VALIDATE.FAIL,
                    error: utils.formatText(VALIDATE.NOT_A_INTEGER, interestsId, 'interestsId')
                };
            }
        }
    };

    interests.getName = function () {
        return this.name;
    };
    interests.setName = function (name) {
        this.name = name;
    };

    if (interestsRecord) {
        var errorList = [];

        try {
            interests.setInterestsId(interestsRecord.interestsId);
        } catch (error) {
            errorList.push(error);
        }
        try {
            interests.setName(interestsRecord.name);
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
    return interests;
}

module.exports.InterestsAPI = InterestsAPI;
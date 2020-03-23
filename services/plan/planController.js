var commons = require('../../commons/constants');
var utils = require('../../commons/utils').utils;
var CONSTANTS = commons.CONSTANTS;
var REQUEST_CODES = CONSTANTS.REQUEST_CODES;
var VALIDATE = commons.CONSTANTS.VALIDATE;
var validate = utils.validate;

var Plan = function () {
    return {
        planId: 0,
        name: null,
        description: null,
        amount: 0,
        userLimit: 0
    }
};

function PlanAPI(planRecord) {
    var plan = new Plan();

    plan.getPlanId = function () {
        return this.plan;
    };
    plan.setPlanId = function (planId) {
        if (planId) {
            if (validate.isInteger(planId)) {
                this.planId = planId;
            } else {
                throw {
                    status: VALIDATE.FAIL,
                    error: utils.formatText(VALIDATE.NOT_A_INTEGER, planId, 'planId')
                };
            }
        }
    };

    plan.getName = function () {
        return this.name;
    };
    plan.setName = function (name) {
        this.name = name;
    };

    plan.getDescription = function () {
        return this.description;
    };
    plan.setDescription = function (description) {
        this.description = description;
    };

    plan.getAmount = function () {
        return this.amount;
    };
    plan.setAmount = function (amount) {
        this.amount = amount;
    };

    plan.getUserLimit = function () {
        return this.userLimit;
    };
    plan.setUserLimit = function (userLimit) {
        this.userLimit = userLimit;
    };

    if (planRecord) {
        var errorList = [];

        try {
            plan.setPlanId(planRecord.planId);
        } catch (error) {
            errorList.push(error);
        }
        try {
            plan.setName(planRecord.name);
        } catch (error) {
            errorList.push(error);
        }
        try {
            plan.setDescription(planRecord.description);
        } catch (error) {
            errorList.push(error);
        }
        try {
            plan.setAmount(planRecord.amount);
        } catch (error) {
            errorList.push(error);
        }
        try {
            plan.setUserLimit(planRecord.userLimit);
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
    return plan;
}

module.exports.PlanAPI = PlanAPI;
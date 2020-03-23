var commons = require('../../commons/constants');
var utils = require('../../commons/utils').utils;
var CONSTANTS = commons.CONSTANTS;
var REQUEST_CODES = CONSTANTS.REQUEST_CODES;
var VALIDATE = commons.CONSTANTS.VALIDATE;
var validate = utils.validate;

var Subscription = function () {
    return {
        subscribeId: 0,
        userId: 0,
        followerId: 0,
        followerName: null,
        dateTime: null,
        status: null,
        isActive: null
    }
};

function SubscriptionAPI(subscriptionRecord) {
    var subscription = new Subscription();
    subscription.getSubscribeId = function () {
        return this.subscribeId;
    };
    subscription.setSubscribeId = function (subscribeId) {
        if (subscribeId) {
            if (validate.isInteger(subscribeId)) {
                this.subscribeId = subscribeId;
            } else {
                throw {
                    status: VALIDATE.FAIL,
                    error: utils.formatText(VALIDATE.NOT_A_INTEGER, subscribeId, 'subscribeId')
                };
            }
        }
    };
    subscription.getUserId = function () {
        return this.userId;
    };
    subscription.setUserId = function (userId) {
        this.userId = userId;
    }

    subscription.getFollowerId = function () {
        return this.followerId;
    };
    subscription.setFollowerId = function (followerId) {
        this.followerId = followerId;
    }

    subscription.getFollowerName = function () {
        return this.followerName;
    };
    subscription.setFollowerName = function (followerName) {
        this.followerName = followerName;
    }   
    
    subscription.getDateTime = function () {
        return this.dateTime;
    };
    subscription.setDateTime = function (dateTime) {
        this.dateTime = dateTime;
    }
    subscription.getStatus = function () {
        return this.status;
    };
    subscription.setStatus = function (status) {
        this.status = status;
    };
    subscription.getIsActive = function () {
        return this.isActive;
    };
    subscription.setIsActive = function (isActive) {
        this.isActive = isActive;
    }

    if (subscriptionRecord) {
        var errorList = [];
        try {
            subscription.setSubscribeId(subscriptionRecord.subscribeId);
        } catch (e) {
            errorList.push(e);
        }
        try {
            subscription.setUserId(subscriptionRecord.userId);
        } catch (e) {
            errorList.push(e);
        }
        try {
            subscription.setFollowerId(subscriptionRecord.followerId);
        } catch (e) {
            errorList.push(e);
        }
        try {
            subscription.setFollowerName(subscriptionRecord.followerName);
        } catch (e) {
            errorList.push(e);
        }
        try {
            subscription.setDateTime(subscriptionRecord.dateTime);
        } catch (e) {
            errorList.push(e);
        }
        try {
            subscription.setStatus(subscriptionRecord.status);
        } catch (e) {
            errorList.push(e);
        }
                
        try {
            subscription.setIsActive(subscriptionRecord.isActive);
        } catch (e) {
            errorList.push(e);
        }
        
        if (errorList.length) {
            throw {
                status: REQUEST_CODES.FAIL,
                error: errorList
            };
        }
    }
    return subscription;
}

module.exports.SubscriptionAPI = SubscriptionAPI;
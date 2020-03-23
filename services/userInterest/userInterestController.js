var utils = require('../../commons/utils').utils;
var VALIDATE = utils.CONSTANTS.VALIDATE;
var validate = utils.validate;

var UserInterest = function () {
    return {
        userInterestId :0,
        userId : 0,      
        level1:null,      
        level2 : null      
    }
};

function UserInterestAPI(userInterestRecord) {
    var userInterest = new UserInterest();
    userInterest.getUserInterestId = function () {
        return this.userInterestId;
    };
    userInterest.setUserInterestId = function (userInterestId) {
        if (userInterestId) {
            if (validate.isInteger(userInterestId)) {
                this.userInterestId = userInterestId;
            } else {
                throw {
                    status: VALIDATE.FAIL,
                    message: utils.formatText(VALIDATE.NOT_A_INTEGER, userInterestId, 'userInterestId')
                };
            }
        }
    };
    userInterest.getUserId = function () {
        return this.userId;
    };
    userInterest.setUserId = function (userId) {
        this.userId = userId;
    }    
    userInterest.getLevel1= function () {
        return this.level1;
    };
    userInterest.setLevel1 = function (level1) {
        this.level1 = level1;
    };
    userInterest.getLevel2= function () {
        return this.level2;
    };
    userInterest.setLevel2 = function (level2) {
        this.level2 = level2;
    };
   
      
    if (userInterestRecord) {
        var errorList = [];
        try {
            userInterest.setUserInterestId(userInterestRecord.userInterestId);
        } catch (e) {
            errorList.push(e);
        }
        try {
            userInterest.setUserId(userInterestRecord.userId);
        } catch (e) {
            errorList.push(e);
        }       
        try {
            userInterest.setLevel1(userInterestRecord.level1);
        } catch (e) {
            errorList.push(e);
        }
        try {
            userInterest.setLevel2(userInterestRecord.level2);
        } catch (e) {
            errorList.push(e);
        }             
    }    
    return userInterest;
}


module.exports.UserInterestAPI = UserInterestAPI;


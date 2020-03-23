var utils = require('../../commons/utils').utils;
var CONSTANTS = utils.CONSTANTS;
var REQUEST_CODES = CONSTANTS.REQUEST_CODES;
var VALIDATE = utils.CONSTANTS.VALIDATE;
var validate = utils.validate;

var Connection = function () {
    return {
        connectId: 0,
        userId: null,
        userRoleId: 0,
        partnerId: null,
        partnerRoleId: 0,
        partnerName: null,
        dateTime: 0,
        status: null
    }
};

function ConnectionsAPI(record) {
    var connection = new Connection();

    connection.getConnectId = function () {
        return this.connectId;
    };
    connection.setConnectId = function (connectId) {
        this.connectId = connectId
    };

    connection.getUserId = function () {
        return this.userId;
    };
    connection.setUserId = function (userId) {
        if (userId) {
            if (validate.isInteger(userId)) {
                this.userId = userId;
            } else {
                throw {
                    status: VALIDATE.FAIL,
                    error: utils.formatText(VALIDATE.NOT_A_INTEGER, userId, 'userId')
                };
            }
        }
    };

    connection.getUserRoleId = function () {
        return this.userRoleId;
    };
    connection.setUserRoleId = function (userRoleId) {      
        this.userRoleId = userRoleId;         
    };

    connection.getPartnerId = function () {
        return this.partnerId;
    };
    connection.setPartnerId = function (partnerId) {
        if (partnerId) {
            if (validate.isInteger(partnerId)) {
                this.partnerId = partnerId;
            } else {
                throw {
                    status: VALIDATE.FAIL,
                    error: utils.formatText(VALIDATE.NOT_A_INTEGER, partnerId, 'partnerId')
                };
            }
        }
    };
    connection.getPartnerRoleId = function () {
        return this.partnerRoleId;
    };
    connection.setPartnerRoleId = function (partnerRoleId) {      
        this.partnerRoleId = partnerRoleId;         
    };
    connection.getPartnerName = function () {
        return this.partnerName;
    };
    connection.setPartnerName = function (partnerName) {
        this.partnerName = partnerName;
    };
    connection.getDateTime = function () {
        return this.dateTime;
    };
    connection.setDateTime = function (dateTime) {
        this.dateTime = dateTime;
    };
    connection.getStatus = function () {
        return this.status;
    };
    connection.setStatus = function (status) {
        this.status = status;
    };
  
    if (record) {
        var errorList = [];
        try {
            connection.setConnectId(record.connectId);
        }
        catch (e) {
            errorList.push(e);
        }
        try {
            connection.setUserId(record.userId)
        }
        catch (e) {
            errorList.push(e);
        }
        try {
            connection.setUserRoleId(record.userRoleId)
        }
        catch (e) {
            errorList.push(e);
        }
        try {
            connection.setPartnerId(record.partnerId);
        }
        catch (e) {
            errorList.push(e);
        }
        try {
            connection.setPartnerRoleId(record.partnerRoleId)
        }
        catch (e) {
            errorList.push(e);
        }
        try {
            connection.setPartnerName(record.partnerName);
        }
        catch (e) {
            errorList.push(e);
        }
        try {
            connection.setDateTime(record.dateTime);
        }
        catch (e) {
            errorList.push(e);
        }
        try {
            connection.setStatus(record.status);
        }
        catch (e) {
            errorList.push(e);
        }
               
        if (errorList.length) {
            throw {
                status: REQUEST_CODES.FAIL,
                error: errorList
            };
        }
    }
    return connection;
}

module.exports.ConnectionsAPI = ConnectionsAPI;
var utils = require('../../commons/utils').utils;
var VALIDATE = utils.CONSTANTS.VALIDATE;

var SocketUser = function () {
    return {
        socketUserId: 0,
        userRecord: new Object()       
    }
};

function SocketUserAPI(socketUserRecord) {
    var socketUser = new SocketUser();

    socketUser.getSocketUserId = function () {
        return this.socketUserId;
    };
    socketUser.setSocketUserId = function (socketUserId) {
        if (socketUserId) {
            this.socketUserId = socketUserId;
        } else {
            throw {
                status: VALIDATE.FAIL,
                error: utils.formatText(VALIDATE.NOT_A_INTEGER, socketUserId, 'socketUserId')
            };
        }
    };   

    socketUser.getUserRecord = function () {
        return this.userRecord;
    };
    socketUser.setUserRecord = function (userRecord) {
        this.userRecord = userRecord;
    };

    if (socketUserRecord) {
        var errorList = [];
        try {
            socketUser.setSocketUserId(socketUserRecord.socketUserId);
        } catch (e) {
            errorList.push(e);
        }
        try {
            socketUser.setUserRecord(socketUserRecord.userRecord);
        } catch (e) {
            errorList.push(e);
        }
    }
    return socketUser;
}

module.exports.SocketUserAPI = SocketUserAPI;
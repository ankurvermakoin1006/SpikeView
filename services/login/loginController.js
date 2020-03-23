var utils = require('../../commons/utils').utils;
var CONSTANTS = utils.CONSTANTS;
var REQUEST_CODES = CONSTANTS.REQUEST_CODES;
var VALIDATE = utils.CONSTANTS.VALIDATE;
var validate = utils.validate;

var Login = function () {
    return {
        userId: 0,
        user: {},
        token: null,
        deviceId: null,
        loginTime: null
    }
};

function LoginAPI(record) {
    var login = new Login();

    login.getUserId = function () {
        return this.userId;
    };
    login.setUserId = function (userId) {
        this.userId = userId
    };
    login.getUser = function () {
        return this.user;
    };
    login.setUser = function (user) {
        this.user = user
    };
    login.getToken = function () {
        return this.token;
    };
    login.setToken = function (token) {
        this.token = token;
    };
    login.getDeviceId = function () {
        return this.deviceId;
    };
    login.setDeviceId = function (deviceId) {
        this.deviceId = deviceId;
    }
    login.getLoginTime = function () {
        return this.loginTime;
    };
    login.setLoginTime = function (loginTime) {
        this.loginTime = loginTime;
    };

    if (record) {
        var errorList = [];
        try {
            login.setUserId(record.userId);
        } catch (e) {
            errorList.push(e);
        }
        try {
            login.setUser(record.user);
        } catch (e) {
            errorList.push(e);
        }
        try {
            login.setToken(record.token);
        } catch (e) {
            errorList.push(e);
        }
        try {
            login.setDeviceId(record.deviceId);
        } catch (e) {
            errorList.push(e);
        }
        try {
            login.setLoginTime(record.loginTime);
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
    return login;
}

module.exports.LoginAPI = LoginAPI;

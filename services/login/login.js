module.exports = function (app) {
    app.post('/app/login', function (req, res) { //To login User
        try {
            login(req, function (response) {
                if (response.status == REQUEST_CODES.SUCCESS) {
                    let loggedUser = response.result;
                    loggedUser.deviceId = req.body.deviceId;
                    generateToken(loggedUser, function (response) {
                        if (response.result.roleId == USER_CODES.PARENT_ROLE) {
                            var Users = require('../users/users');
                            Users.getStudentsByParent(response.result.userId, function (resp) {
                                response.result.students = resp.result;
                                res.json(response);
                            });
                        } else {
                            res.json(response);
                        }
                    });
                } else {
                    res.json(response);
                }
            });
        } catch (e) {
            res.json(e);
        }
    });
    app.post('/ui/logout', function (req, res) { //To logout User
        try {
            logout(req, function (response) {
                res.json(response);
            });
        } catch (e) {
            res.json(e);
        }
    });
}

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var LoginSchema = new Schema(require('./loginSchema').loginTokenSchema, {
    collection: 'loginToken'
});
var LoginModel = mongoose.model('loginToken', LoginSchema);
var LoginController = require('./loginController');
var utils = require('../../commons/utils').utils;
var crypto = require('crypto');
var CONSTANTS = utils.CONSTANTS;
var REQUEST_CODES = CONSTANTS.REQUEST_CODES;
var USER_CODES = utils.CONSTANTS.USERS;
var VALIDATE = utils.CONSTANTS.VALIDATE;
var LOGIN = utils.CONSTANTS.LOGIN;
var _ = require('underscore');

function login(req, callback) {
    var email = req.body.email;
    var password = req.body.password;
    if (email.length === 0 || password.length === 0) {
        if (email.length === 0 && password.length !== 0) {
            callback({
                Status: REQUEST_CODES.FAIL,
                message: LOGIN.NO_EMAIL
            });
            return;
        } else if (password.length == 0 && email.length !== 0) {
            callback({
                Status: REQUEST_CODES.FAIL,
                message: LOGIN.NO_PASSWORD
            });
            return;
        } else {
            callback({
                Status: REQUEST_CODES.FAIL,
                message: LOGIN.NO_CREDENTIALS
            });
            return;
        }
    } else {
        var Users = require('../users/users');
        Users.getList({
            email: email.toLowerCase()
        }, function (res) {
            if (res.result.length == 0) {
                return callback({
                    status: REQUEST_CODES.FAIL,
                    message: LOGIN.INVALID_CREDENTIALS
                });
            } else {
                var user = res.result;
                if (user.length !== 0) {
                    if (user[0].isArchived !== false) {
                        return callback({
                            status: REQUEST_CODES.FAIL,
                            message: LOGIN.USER_ARCHIVED
                        });
                    }
                    var authObject = {
                        user: user[0],
                        password: password
                    }
                    validateCredentials(authObject, callback);
                } else {
                    return callback({
                        status: REQUEST_CODES.FAIL,
                        message: LOGIN.USER_NOT_REGISTERED
                    });
                }
            }
        });
    }
}

function logout(req, callback) {
    let authHeader=   req.headers.authorization
    let loginReq = req.body;

    var token = authHeader.split(' ').map(function (val) {
        return val;
    })[1];
    getList({
        token: token
    }, function (res) {
        var loginInfo = res.result[0]; 
      
        let deleteQuery = null;
        
        if(loginReq.deviceId){
            deleteQuery = {
                $and :[{userId: parseInt(loginInfo.userId)},
                    {deviceId :loginReq.deviceId }]         
                }
        }else{
            deleteQuery = {
                userId: parseInt(loginInfo.userId)        
            }
        }
        LoginModel.deleteMany(deleteQuery, function (error) {
            if (error) {
                callback({
                    status: REQUEST_CODES.FAIL,
                    error: REQUEST_CODES.FAIL_MSG
                });
                return;
            } else {
                 callback({
                status: REQUEST_CODES.SUCCESS,
                message: LOGIN.LOGOUT_SUCCESS
            });
            return; 
            }
        });
    });
}

function remove(token, callback) {
    LoginModel.remove({
        token: token
    }, function (err) {
        if (err) {
            callback({
                status: REQUEST_CODES.FAIL,
                message: REQUEST_CODES.FAIL_MSG
            });
            return;
        } else {
            callback({
                status: REQUEST_CODES.SUCCESS,
                message: LOGIN.LOGOUT_SUCCESS
            });
            return;
        }
    });
}

function getList(query, callback) {
    LoginModel.find(query, function (error, records) {
        if (error) {
            callback({
                status: REQUEST_CODES.FAIL,
                message: error
            });
            return;
        } else {
            callback({
                status: REQUEST_CODES.SUCCESS,
                result: records
            });
            return;
        }
    });
}

function create(login, callback) {
    var loginAPI = LoginController.LoginAPI(login);
    var errorList = [];
    if (!loginAPI.getUserId()) {
        var e = {
            status: VALIDATE.FAIL,
            message: utils.formatText(VALIDATE.REQUIRED, 'UserId')
        };
        errorList.push(e);
    }
    if (!loginAPI.getToken()) {
        var e = {
            status: VALIDATE.FAIL,
            message: utils.formatText(VALIDATE.REQUIRED, 'Token')
        };
        errorList.push(e);
    }
    if (!loginAPI.getLoginTime()) {
        var e = {
            status: VALIDATE.FAIL,
            message: utils.formatText(VALIDATE.REQUIRED, 'Login Time')
        };
        errorList.push(e);
    }
    if (errorList.length) {
        callback({
            status: REQUEST_CODES.WARNING,
            message: errorList
        });
        return;
    } else {
        var loginModel = new LoginModel(loginAPI);
        loginModel.save(function (error) {
            if (error) {
                callback({
                    status: REQUEST_CODES.FAIL,
                    message: REQUEST_CODES.FAIL_MSG
                });
                return;
            } else {
                callback({
                    status: REQUEST_CODES.SUCCESS,
                    message: utils.formatText(LOGIN.LOGIN_SUCCESS, loginModel.userId)
                });
                return;
            }
        });
    }
}

function validateCredentials(authObject, callback) {
    if (USER_CODES.PASSWORD_PREFIX + utils.encryptText(utils.decrypt(authObject.password) + authObject.user.salt) == authObject.user.password) {
        return callback({
            status: REQUEST_CODES.SUCCESS,
            message: 'Login successful!!',
            result: authObject.user
        });
    } else {
        callback({
            status: REQUEST_CODES.FAIL,
            message: LOGIN.INVALID_CREDENTIALS
        });
    }
}

function getDeviceIds(userId, callback) {
    let deviceIds = [];
    getList({
        userId: parseInt(userId)
    }, function (res) {
        if (res.status == REQUEST_CODES.SUCCESS) {
            _.forEach(res.result, function (device) {
                if (device.deviceId && device.deviceId.length > 20)
                    deviceIds.push(device.deviceId);
            });
            callback({
                status: REQUEST_CODES.SUCCESS,
                result: _.uniq(deviceIds)
            });
            return;
        } else {
            return 0;
        }
    });
}

function findLoggedInUser(req, callback) {
    var token = req.headers.authorization.split(' ').map(function (val) {
        return val;
    })[1];
    getList({
        token: token
    }, function (res) {
        callback({
            status: REQUEST_CODES.SUCCESS,
            result: res.result[0].user
        });
        return;
    });
}

function generateToken(user, callback) {
    var token = crypto.createHash('md5').update(user.userId + (new Date().getTime()).toString()).digest('hex');
    user = _.omit(JSON.parse(JSON.stringify(user)), '_id', 'password');

    var loginRecord = {
        userId: user.userId,
        user: user,
        token: token,
        deviceId: user.deviceId,
        loginTime: utils.IsoToUtcDate(new Date())
    }
    create(loginRecord, function (res) {
        if (res.status == REQUEST_CODES.SUCCESS) {
            user = _.extend(user, {
                token: token
            });
            callback({
                status: REQUEST_CODES.SUCCESS,
                message: LOGIN.LOGIN_SUCCESS,
                result: user
            });
            return;
        } else {
            callback({
                status: REQUEST_CODES.FAIL,
                message: LOGIN.TOKEN_FAILED
            });
            return;
        }
    })
}

function verifyToken(authHeader, callback) {
    var spike = authHeader.split(' ').map(function (val) {
        return val;
    })[0];
    var token = authHeader.split(' ').map(function (val) {
        return val;
    })[1];
    if (spike != LOGIN.TOKEN_PREFIX) {
        callback({
            status: REQUEST_CODES.FAIL,
            message: CONSTANTS.AUTHORIZATION.TOKEN_VERIFICATION_FAILED
        });
        return;
    } else {
        getList({
            token: token
        }, function (res) {
            if (res.status != REQUEST_CODES.SUCCESS) {
                callback({
                    status: REQUEST_CODES.FAIL,
                    message: REQUEST_CODES.FAIL_MSG
                });
                return;
            } else {
                var records = res.result;
                if (records.length != 0) {
                    var Users = require('../users/users');
                    Users.getList({
                        userId: records[0].userId
                    }, function (res) {
                        if (res.status == REQUEST_CODES.SUCCESS && res.result.length > 0) {
                            callback({
                                status: REQUEST_CODES.SUCCESS,
                                message: CONSTANTS.AUTHORIZATION.TOKEN_VERIFICATION_PASSED,
                                result: records
                            });
                            return;
                        } else {
                            callback({
                                status: REQUEST_CODES.FAIL,
                                message: CONSTANTS.AUTHORIZATION.TOKEN_VERIFICATION_FAILED,
                                result: records
                            });
                            return;
                        }
                    });
                } else {
                    callback({
                        status: REQUEST_CODES.FAIL,
                        message: CONSTANTS.AUTHORIZATION.TOKEN_VERIFICATION_FAILED,
                        result: records
                    });
                    return;
                }
            }
        });
    }
}

module.exports.getDeviceIds = getDeviceIds;
module.exports.validateCredentials = validateCredentials;
module.exports.verifyToken = verifyToken;
module.exports.getList = getList;
module.exports.remove = remove;
module.exports.findLoggedInUser = findLoggedInUser;
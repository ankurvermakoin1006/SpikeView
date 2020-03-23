module.exports = function (app) {
    app.post('/ui/share/profile', function (req, res) {
        try {
            shareProfile(req, function (response) {
                res.json(response);
            });
        } catch (e) {
            res.json(e);
        }
    });
    app.get('/ui/share/profile', function (req, res) {
        try {
            getShareConfig(req, function (response) {
                res.json(response);
            });
        } catch (e) {
            res.json(e);
        }
    });
    app.get('/ui/share/profile/list', function (req, res) {
        try {
            getSharedProfileList(req.query, function (response) {
                res.json(response);
            });
        } catch (e) {
            res.json(e);
        }
    });
    app.put('/ui/share/profile', function (req, res) {
        try {
            update(req.body, function (response) {
                res.json(response);
            });
        } catch (e) {
            res.json(e);
        }
    });
    app.delete('/ui/share/profile', function (req, res) {
        try {
            remove(req.body, function (response) {
                res.json(response);
            });
        } catch (e) {
            res.json(e);
        }
    });
}

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var SharedProfilesSchema = new Schema(require('./sharedProfilesSchema').sharedProfilesSchema, {
    collection: 'sharedProfiles'
});
var SharedProfilesModel = mongoose.model('sharedProfiles', SharedProfilesSchema);
var SharedProfilesController = require('./sharedProfilesController');
var utils = require('../../commons/utils').utils;
var mongoUtils = utils.mongoUtils;
var CONSTANTS = utils.CONSTANTS;
var REQUEST_CODES = CONSTANTS.REQUEST_CODES;
var SHARED_PROFILE_CODES = utils.CONSTANTS.SHARED_PROFILE;
var Users = require('../users/users');
var USER_CODES = utils.CONSTANTS.USERS;
var mailer = require('../email/mailer');
var config = require('../../env/config.js').getConf();
var login = require('../login/login');
var _ = require('underscore');
var mobileNotification = require('../pushNotification/fcm');
var recommendation = require('../recommendation/recommendation');
var logger = require('../../logger.js');
function shareProfile(req, callback) {
    var data = req.body;
    var deviceIds;
    var link = null;
    data.isActive = true;
    data.isViewed = false;
    if (data.sharedType) {
        if (data.sharedType == SHARED_PROFILE_CODES.SHARED_AS_MESSAGE) {
            create(data, function (resp) {
                if (resp.status == REQUEST_CODES.SUCCESS) {
                    link = config.server_url + SHARED_PROFILE_CODES.SHARE_PROFILE_CONTEXT + resp.result.sharedId;
                    callback({
                        status: REQUEST_CODES.SUCCESS,
                        message: SHARED_PROFILE_CODES.CREATE_SUCCESS,
                        result: {
                            sharedId: resp.result.sharedId,
                            link: link
                        }
                    });
                    return;
                } else {
                    callback({
                        status: REQUEST_CODES.FAIL,
                        message: resp.message,
                    });
                    return;
                }
            });
        } else if (data.sharedType == SHARED_PROFILE_CODES.SHARED_AS_EMAIL) {
            var password = null;
            var user = null;
            Users.getList({
                email: data.email.toLowerCase()
            }, function (resp) {
                if (resp.result.length > 0) {
                    user = resp.result[0];
                    data.shareTo = user.userId;
                    login.getDeviceIds(user.userId, function (resp) {
                        deviceIds = resp.result;
                    });
                    if (user.roleId == USER_CODES.GUEST_ROLE) {
                        password = utils.encrypt(user.tempPassword);
                    }
                    create(data, function (resp) {
                        if (resp.status == REQUEST_CODES.SUCCESS) {
                            Users.getList({
                                userId: data.profileOwner
                            }, function (response) {
                                let profileOwner = response.result[0];
                                link = config.server_url + SHARED_PROFILE_CODES.SHARE_PROFILE_CONTEXT + resp.result.sharedId + '/' + user.email + '/' + password;
                                let emailRequest = {
                                    template: CONSTANTS.EMAIL.SHARE_PROFILE,
                                    to: user.email,
                                    name: profileOwner.firstName + ' ' + (profileOwner.lastName ? profileOwner.lastName : ''),
                                    email: profileOwner.email,
                                    profilePicture: profileOwner.profilePicture,
                                    link: link,
                                    mailMessage: profileOwner.firstName  + ' ' + (profileOwner.lastName ? profileOwner.lastName : '') + ' shared profile with you, summarizing their life experiences and achievements. Please take a look at:'
                                }
                                mailer.sendMail(emailRequest, function (resp) {
                                    logger.info('Profile share email sent to : ', data.email, 'status : ', resp.status);
                                });
                                var message = {
                                    deviceIds: deviceIds,
                                    userId: user.userId,
                                    name: user.firstName,
                                    actedBy: profileOwner.userId,
                                    profilePicture: profileOwner.profilePicture,
                                    body: profileOwner.firstName + ' shared profile with you, Please check.',
                                    textName: profileOwner.firstName + ' ' + (profileOwner.lastName ? profileOwner.lastName : ''),
                                    textMessage : 'shared profile with you, Please check.'
                                };
                                mobileNotification.sendNotification(message);
                                callback({
                                    status: REQUEST_CODES.SUCCESS,
                                    message: SHARED_PROFILE_CODES.CREATE_SUCCESS,
                                    result: {
                                        sharedId: resp.result.sharedId,
                                        link: link
                                    }
                                });
                                return;
                            });
                        } else {
                            callback({
                                status: REQUEST_CODES.FAIL,
                                message: resp.message,
                            });
                            return;
                        }
                    });
                } else { // share profile out of spikeview
                    user = {
                        firstName: data.firstName,
                        lastName: data.lastName,
                        email: data.email,
                        roleId: USER_CODES.GUEST_ROLE,
                        isPasswordChanged: true,
                        isActive: true
                    };
                    Users.create(user, function (resp) {
                        data.shareTo = resp.userId;
                        password = utils.encrypt(resp.password);
                        create(data, function (resp) {
                            if (resp.status == REQUEST_CODES.SUCCESS) {
                                Users.getList({
                                    userId: data.profileOwner
                                }, function (response) {
                                    let profileOwner = response.result[0];
                                    link = config.server_url + SHARED_PROFILE_CODES.SHARE_PROFILE_CONTEXT + resp.result.sharedId + '/' + user.email + '/' + password;
                                    let emailRequest = {
                                        template: CONSTANTS.EMAIL.SHARE_PROFILE,
                                        to: user.email,
                                        name: profileOwner.firstName + ' ' + (profileOwner.lastName ? profileOwner.lastName : ''),
                                        email: profileOwner.email,
                                        profilePicture: profileOwner.profilePicture,
                                        link: link,
                                        mailMessage: profileOwner.firstName + ' ' + (profileOwner.lastName ? profileOwner.lastName : '') + ' shared profile with you, summarizing their life experiences and achievements. Please take a look at:'
                                    }
                                    mailer.sendMail(emailRequest, function (resp) {
                                        logger.info('Profile share email sent to : ', data.email, 'status : ', resp.status);
                                    });
                                    callback({
                                        status: REQUEST_CODES.SUCCESS,
                                        message: SHARED_PROFILE_CODES.CREATE_SUCCESS,
                                        result: {
                                            sharedId: resp.result.sharedId,
                                            link: link
                                        }
                                    });
                                    return;
                                });
                            } else {
                                callback({
                                    status: REQUEST_CODES.FAIL,
                                    message: resp.message,
                                });
                                return;
                            }
                        });
                    });
                }
            });
        } else {
            callback({
                status: REQUEST_CODES.FAIL,
                message: utils.formatText(SHARED_PROFILE_CODES.UNKNOWN_SHARETYPE, data.shareType)
            });
            return;
        }
    } else {
        callback({
            status: REQUEST_CODES.FAIL,
            message: SHARED_PROFILE_CODES.MISSING_SHARETYPE
        });
        return;
    }
}

function getShareConfig(req, callback) {
    var token = req.headers.authorization.split(' ').map(function (val) {
        return val;
    })[1];
    var loggedInUser;
    var allowedUsers = [];
    login.getList({
        token: token
    }, function (res) {
        if (res.status == REQUEST_CODES.SUCCESS) {
            loggedInUser = res.result[0].userId;
            getList(req.query, function (ress) {
                if (ress.status == REQUEST_CODES.SUCCESS) {
                    var shareConfig = ress.result[0];
                    Users.getList({
                        userId: shareConfig.profileOwner
                    }, function (res) {
                        var profileOwner = res.result[0];
                        allowedUsers.push(parseInt(shareConfig.profileOwner));
                        allowedUsers.push(parseInt(shareConfig.shareTo));
                        _.forEach(profileOwner.parents, function (parent) {
                            allowedUsers.push(parseInt(parent.userId));
                        });
                        Users.getList({
                            userId: loggedInUser
                        }, function (response) {
                            let dbUser = response.result[0];
                            _.forEach(response.result[0].parents, function (parent) {
                                allowedUsers.push(parent.userId);
                            });
                            if (_.contains(allowedUsers, loggedInUser)) {
                                let query = {
                                    userId: {
                                        $in: [parseInt(loggedInUser), parseInt(shareConfig.profileOwner)]
                                    }
                                }
                                Users.getList(query, function (res) {
                                    if (res.result.length > 1) {
                                        if (!res.result[0].isActive || !res.result[1].isActive) {
                                            callback({
                                                status: REQUEST_CODES.FAIL,
                                                message: CONSTANTS.SHARED_PROFILE.UN_AUTHORISED_ACCESS
                                            });
                                            return;
                                        } else {
                                            shareConfig.lastViewedTime = utils.getSystemTime();
                                            shareConfig.isViewed = true;
                                            update(shareConfig, function (res) {
                                                if (dbUser.roleId === USER_CODES.GUEST_ROLE) {
                                                    // create his/her account with student role and send credientials
                                                    recommendation.sendSpikeviewCredentialsToGuestUser(dbUser.userId);
                                                }
                                                callback({
                                                    status: REQUEST_CODES.SUCCESS,
                                                    result: ress.result
                                                });
                                                return;
                                            });
                                        }
                                    } else {
                                        if (!res.result[0].isActive) {
                                            callback({
                                                status: REQUEST_CODES.FAIL,
                                                message: CONSTANTS.SHARED_PROFILE.UN_AUTHORISED_ACCESS
                                            });
                                            return;
                                        } else {
                                            shareConfig.lastViewedTime = utils.getSystemTime();
                                            shareConfig.isViewed = true;
                                            update(shareConfig, function (res) {
                                                if (dbUser.roleId === USER_CODES.GUEST_ROLE) {
                                                    // create his/her account with student role and send credientials
                                                    recommendation.sendSpikeviewCredentialsToGuestUser(dbUser.userId);
                                                }
                                                callback({
                                                    status: REQUEST_CODES.SUCCESS,
                                                    result: ress.result
                                                });
                                                return;
                                            });
                                        }
                                    }
                                });
                            } else {
                                callback({
                                    status: REQUEST_CODES.FAIL,
                                    message: CONSTANTS.SHARED_PROFILE.UN_AUTHORISED_ACCESS
                                });
                                return;
                            }
                        });
                    })
                } else {
                    callback({
                        status: REQUEST_CODES.FAIL,
                        message: CONSTANTS.SHARED_PROFILE.NOT_FOUND
                    });
                    return;
                }
            });
        } else {
            callback({
                status: REQUEST_CODES.FAIL,
                message: CONSTANTS.SHARED_PROFILE.UN_AUTHORISED_ACCESS
            });
            return;
        }
    });
}

function getSharedProfileList(query, callback) {
    let roleId=  query.roleId ? parseInt(query.roleId): null;
    SharedProfilesModel.aggregate(
        [{
                $match: {
                    profileOwner: parseInt(query.profileOwner),                   
                    $or:[
                        {profileOwnerRoleId: roleId},
                        {profileOwnerRoleId : {  $exists: false }}
                    ], 
                    shareTo: {
                         $exists: false
                    }
                }
            },
            {
                $sort: {
                    shareTime: -1
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "shareTo",
                    foreignField: "userId",
                    as: "sharedPerson"
                }
            },
            {
                $unwind: {
                    "path": "$sharedPerson",
                    "preserveNullAndEmptyArrays": true
                }
            },
            {
                $project: {
                    sharedId: "$sharedId",
                    sharedType: "$sharedType",
                    profileOwner: "$profileOwner",
                    shareTime: "$shareTime",
                    isActive: "$isActive",
                    isViewed: "$isViewed",
                    lastViewedTime: "$lastViewedTime",
                    shareConfiguration: "$shareConfiguration",
                    shareTo: "$shareTo",
                    shareToFirstName: "$sharedPerson.firstName",
                    shareToLastName: "$sharedPerson.lastName",
                    shareToprofilePicture: "$sharedPerson.profilePicture",
                    shareToEmail: "$sharedPerson.email"

                }
            }
        ]
    ).exec(function (error, data) {
        if (error) {
            callback({
                status: REQUEST_CODES.FAIL,
                message: error
            });
        } else {
            callback({
                status: REQUEST_CODES.SUCCESS,
                result: data
            });
        }
    });
}

function getList(query, callback) {
    SharedProfilesModel.find(query, function (error, records) {
        if (error) {
            callback({
                status: REQUEST_CODES.FAIL,
                message: error
            });
            return;
        } else {
            records = records.map(function (record) {
                return new SharedProfilesController.SharedProfilesAPI(record);
            });
            callback({
                status: REQUEST_CODES.SUCCESS,
                result: records
            });
            return;
        }
    });
}

function create(sharedProfiles, callback) {
    var sharedProfilesAPI;
    var errorList = [];
    try {
        sharedProfilesAPI = SharedProfilesController.SharedProfilesAPI(sharedProfiles);
    } catch (e) {
        errorList.push(e.error[0]);
        callback({
            status: REQUEST_CODES.FAIL,
            message: errorList
        });
        return;
    }

    if (errorList.length) {
        callback({
            status: REQUEST_CODES.FAIL,
            message: errorList
        });
        return;
    } else {
        var sharedProfilesModel = new SharedProfilesModel(sharedProfilesAPI);
        mongoUtils.getNextSequence('sharedId', function (oSeq) {
            sharedProfilesModel.sharedId = oSeq;
            sharedProfilesModel.save(function (error) {
                if (error) {
                    callback({
                        status: REQUEST_CODES.FAIL,
                        message: error
                    });
                    return;
                } else {
                    callback({
                        status: REQUEST_CODES.SUCCESS,
                        message: utils.formatText(SHARED_PROFILE_CODES.CREATE_SUCCESS, sharedProfilesModel.sharedId),
                        result: {
                            sharedId: sharedProfilesModel.sharedId
                        }
                    });
                    return;
                }
            });
        });
    }
}

function remove(query, callback) {
    SharedProfilesModel.remove(query, function (error) {
        if (error) {
            callback({
                status: REQUEST_CODES.FAIL,
                error: error
            });
            return;
        } else {
            callback({
                status: REQUEST_CODES.SUCCESS,
                message: SHARED_PROFILE_CODES.DELETE_SUCCESS
            });
            return;
        }
    });
}

function update(sharedProfiles, callback) {
    SharedProfilesModel.update({
        'sharedId': sharedProfiles.sharedId
    }, {
        $set: sharedProfiles
    }, function (error) {
        if (error) {
            callback({
                status: REQUEST_CODES.FAIL,
                message: error
            });
            return;
        } else {
            callback({
                status: REQUEST_CODES.SUCCESS,
                message: SHARED_PROFILE_CODES.UPDATE_SUCCESS
            });
            return;
        }
    });
}

module.exports.getList = getList;
module.exports.create = create;
module.exports.update = update;
module.exports.remove = remove;
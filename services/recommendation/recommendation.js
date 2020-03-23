module.exports = function (app) {
    app.post('/ui/recommendation', function (req, res) { //To Create recommendation
        try {
            requestRecommendation(req.body, function (response) {
                res.json(response);
            });
        } catch (e) {
            res.json(e);
        }
    });
    app.put('/ui/recommendation', function (req, res) { //To reply recommendation request
        try {
            responseRecommendation(req.body, function (response) {
                res.json(response);
            });
        } catch (e) {
            res.json(e);
        }
    });
    app.put('/ui/add/recommendation', function (req, res) { //To add recommendation in profile
        try {
            update(req.body, function (response) {
                res.json(response);
            });
        } catch (e) {
            res.json(e);
        }
    });
    app.get('/ui/recommendation', function (req, res) {
        try {
            getList(req.query, function (response) {
                res.json(response);
            });
        } catch (e) {
            res.json(e);
        }
    });
    app.get('/ui/user/recommendations', function (req, res) {
        try {
            getRecommendationByUser(req.query.userId, function (response) {
                res.json(response);
            });
        } catch (e) {
            res.json(e);
        }
    });
    app.put('/ui/user/recommendationsByStatus', function (req, res) {
        try {
            getRecommendationByUserAndStatus(req.body, function (response) {
                res.json(response);
            });
        } catch (e) {
            res.json(e);
        }
    });
    app.put('/ui/recommendation/addLike', function (req, res) {
        try {
            addLike(req.body, function (response) {
                res.json(response);
            });
        } catch (e) {
            res.json(e);
        }
    });
    app.delete('/ui/recommendation', function (req, res) {
        try {
            remove(req.body, function (response) {
                res.json(response);
            });
        } catch (e) {
            res.json(e);
        }
    });

    app.get('/ui/requestedRecommendation', function (req, res) {
        try {
            requestedRecommendation(req.query, function (response) {
                res.json(response);
            });
        } catch (e) {
            res.json(e);
        }
    });

    app.put('/ui/edit/recommendation', function (req, res) {
        try {
            updateRecommendation(req.body, function (response) {
                res.json(response);
            });
        } catch (e) {
            res.json(e);
        }
    });
}

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var RecommendationSchema = new Schema(require('./recommendationSchema').recommendationSchema, {
    collection: 'recommendations'
});
var RecommendationModel = mongoose.model('recommendations', RecommendationSchema);
var RecommendationController = require('./recommendationController');
var utils = require('../../commons/utils').utils;
var Connection = require('../connection/connections');
var CONSTANTS = utils.CONSTANTS;
var REQUEST_CODES = CONSTANTS.REQUEST_CODES;
var RECOMMENDATION_CODES = utils.CONSTANTS.RECOMMENDATION;
var VALIDATE = utils.CONSTANTS.VALIDATE;
var mongoUtils = utils.mongoUtils;
var USER_CODES = CONSTANTS.USERS;
var Users = require('../users/users');
var config = require('../../env/config.js').getConf();
var mailer = require('../email/mailer');
var _ = require('underscore');
var logger = require('../../logger.js');
function create(recommendation, callback) {
    var recommendationAPI;
    var errorList = [];
    try {
        recommendationAPI = RecommendationController.RecommendationAPI(recommendation);
    } catch (e) {
        errorList.push(e.error[0]);
        callback({
            status: REQUEST_CODES.FAIL,
            error: errorList
        });
        return;
    }
    if (!recommendationAPI.getCompetencyTypeId()) {
        var e = {
            status: VALIDATE.FAIL,
            error: utils.formatText(VALIDATE.REQUIRED, 'Competency Type')
        };
        errorList.push(e);
    }
    if (!recommendationAPI.getTitle()) {
        var e = {
            status: VALIDATE.FAIL,
            error: utils.formatText(VALIDATE.REQUIRED, 'Title')
        };
        errorList.push(e);
    }
    if (!recommendationAPI.getRequest()) {
        var e = {
            status: VALIDATE.FAIL,
            error: utils.formatText(VALIDATE.REQUIRED, 'Request')
        };
        errorList.push(e);
    }
    if (!recommendationAPI.getStage()) {
        var e = {
            status: VALIDATE.FAIL,
            error: utils.formatText(VALIDATE.REQUIRED, 'Stage')
        };
        errorList.push(e);
    }
    if (errorList.length) {
        callback({
            status: REQUEST_CODES.FAIL,
            error: errorList
        });
        return;
    } else {
        var recommendationModel = new RecommendationModel(recommendationAPI);
        mongoUtils.getNextSequence('recommendationId', function (oSeq) {
            recommendationModel.recommendationId = oSeq;
            recommendationModel.requestedDate = utils.getSystemTime();
            recommendationModel.isActive = true;
            recommendationModel.save(function (error) {
                if (error) {
                    callback({
                        status: REQUEST_CODES.FAIL,
                        error: error
                    });
                    return;
                } else {
                    var password = null;
                    if (recommendation.password) {
                        password = utils.encrypt(recommendation.password);
                    }

                    console.log(' recommendation.profileImage ', recommendation.profileImage ,' recommendation.profileImage ',(recommendation.profileImage == "" || !recommendation.profileImage)  ? null : recommendation.profileImage);
                    var emailRecommendationRequest = {
                        template: CONSTANTS.EMAIL.RECOMMENDATION_REQUEST,
                        to: recommendation.email,
                        email: recommendation.requesterEmail,
                        name: recommendation.name,
                        profilePicture: (recommendation.profileImage == "" || recommendation.profileImage == "null" || !recommendation.profileImage)  ? null : recommendation.profileImage,
                        link: config.server_url + '/recommendation/' + recommendation.recommenderId + '/' + recommendationModel.recommendationId + '/' + recommendation.email + '/' + password
                    }
                    mailer.sendMail(emailRecommendationRequest, function (res) {
                        logger.info('Recommendation mail sent to : ', recommendation.email, 'status : ', res.status);
                    });
                    callback({
                        status: REQUEST_CODES.SUCCESS,
                        message: RECOMMENDATION_CODES.CREATE_SUCCESS,
                        result: {
                            recommendationId: recommendationModel.recommendationId
                        }
						
                    });
                    return;
                }
            });
        });
    }
}

function updateRecommendation(recommendation, callback) {
    RecommendationModel.update({
        recommendationId: recommendation.recommendationId
      }, {
        $set: recommendation
      },
      function (error) {
        if (error) {
          callback({
            status: REQUEST_CODES.FAIL,
            message: REQUEST_CODES.FAIL_MSG
          });
          return;
        } else {
          callback({
            status: REQUEST_CODES.SUCCESS,
            message: utils.formatText(RECOMMENDATION_CODES.EDIT_SUCCESS, recommendation.recommendationId)
          });
          return;
        }
      }
    );
  }

function requestRecommendation(recommendation, callback) {
    var query = {
        email: recommendation.email.toLowerCase()
    }
    Users.getList(query, function (response) {
        if (response.result.length > 0) {
            var existingUser = response.result[0];
            recommendation.recommenderId = existingUser.userId;
            if (existingUser.roleId == USER_CODES.GUEST_ROLE) {
                recommendation.password = existingUser.tempPassword;
            }
            create(recommendation, callback);
        } else {
            var recommender = {
                firstName: recommendation.firstName,
                lastName: recommendation.lastName,
                roleId: USER_CODES.GUEST_ROLE,
                email: recommendation.email.toLowerCase(),
                title: recommendation.recommenderTitle,
                isActive: true
            };
            Users.create(recommender, function (resp) {
                if (resp.status == REQUEST_CODES.SUCCESS) {
                    recommendation.recommenderId = resp.userId;
                    recommendation.password = resp.password;
                    create(recommendation, callback);
                } else {
                    callback({
                        status: REQUEST_CODES.FAIL,
                        message: resp.message
                    });
                    return;
                }
            });
        }
    });
}

function remove(query, callback) {
    RecommendationModel.remove(query, function (error) {
        if (error) {
            callback({
                status: REQUEST_CODES.FAIL,
                message: error
            });
            return;
        } else {
            callback({
                status: REQUEST_CODES.SUCCESS,
                message: RECOMMENDATION_CODES.DELETE_SUCCESS
            });
            return;
        }
    });
}

function getList(query, callback) {
    RecommendationModel.find(query, function (error, records) {
        if (error) {
            callback({
                status: REQUEST_CODES.FAIL,
                message: utils.formatText(REQUEST_CODES.FAIL_MSG, RECOMMENDATION_CODES.GET_API)
            });
            return;
        } else {
            records = records.map(function (record) {
                return new RecommendationController.RecommendationAPI(record);
            });
            callback({
                status: REQUEST_CODES.SUCCESS,
                result: records
            });
            return;
        }
    });
}

function getRecommendationCount(query, callback) {
    RecommendationModel.count(query, function (error, count) {
        if (error) {
            callback({
                status: REQUEST_CODES.FAIL,
                message: utils.formatText(REQUEST_CODES.FAIL_MSG, RECOMMENDATION_CODES.GET_API)
            });
            return;
        } else {
            callback({
                status: REQUEST_CODES.SUCCESS,
                result: count
            });
            return;
        }
    });
}

function getRecommendationByUser(userId, callback) {
    RecommendationModel.aggregate(
        [{
                $match: {
                    $or :[{
                    userId: parseInt(userId)},
                    {$and:[{recommenderId: parseInt(userId)},
                        {stage:RECOMMENDATION_CODES.REQUESTED}]},
                        {$and:[{recommenderId: parseInt(userId)},
                            {stage: RECOMMENDATION_CODES.REPLIED}]}
                    
                    ],

                }
            },
            {
                "$sort": {
                    "recommendationId": -1
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "recommenderId",
                    foreignField: "userId",
                    as: "recommender"
                }
            },
            {
                $unwind: "$recommender"
            },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "userId",
                    as: "user"
                }
            },
            {
                $unwind: "$user"
            },
        ]
    ).exec(function (error, data) {
        if (error) {
            callback({
                status: REQUEST_CODES.FAIL,
                message: error
            });
        } else {            
      
            let recommendationByUserJson={};
            let recommendationByUser=[];
            let requestedRecommendation=[];
            let approvedRecommendation=[];
            
            data.forEach(function(dataRes){
                if(dataRes.stage == RECOMMENDATION_CODES.REQUESTED && dataRes.recommenderId === parseInt(userId)){
                    requestedRecommendation.push(dataRes);
                }else if(dataRes.stage == RECOMMENDATION_CODES.REPLIED && dataRes.recommenderId === parseInt(userId)){
                    approvedRecommendation.push(dataRes);
                }else{
                    recommendationByUser.push(dataRes);
                }
            })

            // recommendationByUserJson['recommendationByUser']=recommendationByUser;
            // recommendationByUserJson['requested']=requestedRecommendation;
            // recommendationByUserJson['approved']=approvedRecommendation;

            callback({
                status: REQUEST_CODES.SUCCESS,                
                result: recommendationByUser,
                requested:requestedRecommendation,
                approved: approvedRecommendation,
            });
        }
    });
}


function getRecommendationByUserAndStatus(data, callback) {
    let query='';
    if(data.status == RECOMMENDATION_CODES.REQUESTED || data.status == RECOMMENDATION_CODES.REPLIED){       
            query= { 
                $and:[{recommenderId: parseInt(data.userId)},
                    {stage:data.status}                       
                ]}
    }else{
        query= {
            userId: parseInt(data.userId)
        }     
    }

    RecommendationModel.aggregate(
        [{
                $match:query
            },
            {
                "$sort": {
                    "recommendationId": -1
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "recommenderId",
                    foreignField: "userId",
                    as: "recommender"
                }
            },
            {
                $unwind: "$recommender"
            },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "userId",
                    as: "user"
                }
            },
            {
                $unwind: "$user"
            },
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
                result: data,               
            });
        }
    });
}

function getRecommendationByCompetency(userId, callback) {
    RecommendationModel.aggregate(
        [{
                $match: {
                    userId: parseInt(userId)
                }
            },
            {
                "$sort": {
                    "recommendationId": -1
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "recommenderId",
                    foreignField: "userId",
                    as: "recommender"
                }
            },
            {
                $unwind: "$recommender"
            },
            {
                $group: {
                    _id: "$competencyTypeId",
                    recommendation: {
                        $push: "$$ROOT"
                    }
                }
            },
            {
                $lookup: {
                    from: "competencyType",
                    localField: "recommendation.competencyTypeId",
                    foreignField: "competencyTypeId",
                    as: "competency"
                }
            },
            {
                $unwind: "$competency"
            },
            {
                $project: {
                    recommendation: "$recommendation",
                    name: "$competency.level2",
                    level1: "$competency.level1"
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

function responseRecommendation(recommendation, callback) {
    if (recommendation.stage == RECOMMENDATION_CODES.REPLIED) {
        recommendation.repliedDate = utils.getSystemTime();
        update(recommendation, function (res) {
            if (res.status == REQUEST_CODES.SUCCESS) {
           //     sendSpikeviewCredentialsToGuestUserWithThankYou(recommendation.recommendationId,recommendation.recommenderId);
                callback({
                    status: REQUEST_CODES.SUCCESS,
                    message: RECOMMENDATION_CODES.RESPONSE_RECOMMENDATION
                });
                return;
            } else {
                callback({
                    status: REQUEST_CODES.FAIL,
                    message: res.error
                });
                return;
            }
        });
    } else {
        update(recommendation, function (res) {
            if (res.status == REQUEST_CODES.SUCCESS) {
                callback({
                    status: REQUEST_CODES.SUCCESS,
                    message: RECOMMENDATION_CODES.UPDATE_SUCCESS
                });
                return;
            } else {
                callback({
                    status: REQUEST_CODES.FAIL,
                    message: res.error
                });
                return;
            }
        });
    }

}

function sendSpikeviewCredentialsToGuestUserWithThankYou(recommendationId,guestUserId) {
    if (guestUserId) {
        Users.getList({
            userId: parseInt(guestUserId)
        }, function (res) {
            let guestUser = res.result[0];
            if (guestUser.roleId == USER_CODES.GUEST_ROLE) {
                guestUser.roleId = USER_CODES.STUDENT_ROLE;
                guestUser.isPasswordChanged = false;
                guestUser.isActive = true;
                guestUser.isArchived = false;
                Users.update(guestUser, function (res) {
                    var emailRequest = {
                        template: CONSTANTS.EMAIL.GUEST_TO_STUDENT_ACCOUNT_CONVERSION,
                        to: guestUser.email,
                        email: guestUser.email,
                        password: guestUser.tempPassword,
                        mailMessage: CONSTANTS.EMAIL.GUEST_ACCOUNT_CREATION_EMAIL_MESSAGE,
                        link: config.server_url + '/autoLogin/' + guestUser.email + '/' + utils.encrypt(guestUser.tempPassword)
                    };
                    mailer.sendMail(emailRequest, function (res) {
                        logger.info('Mail sent status : ', res.status, 'for User : ', guestUser.email);
                    });

                    var emailRequestForNewUser = {
                        template: CONSTANTS.EMAIL.THANK_YOU_EMAIL,
                        to: guestUser.email,
                        name: guestUser.firstName,
                        email: guestUser.email,
                        mailMessage: "Learn more and create your own spikeview at spikeview.com!",
                    };
                    mailer.sendMail(emailRequestForNewUser, function (res) {
                        logger.info('Mail sent status : ', res.status, 'for User : ', guestUser.email);
                    });
                    // create bot connection
                    var botRequest = {
                        userId: guestUser.userId,
                        partnerId: USER_CODES.BOTID,
                        dateTime: utils.getSystemTime(),
                        status: 'Accepted',
                        isActive: true
                    };
                    Connection.create(botRequest, function (res) {
                        logger.info('bot connection created : ', res.status);
                    });
                });
            } else {
                // send a welcom email to existing user for their recommendation.              
                getList({
                    recommendationId: parseInt(recommendationId,10)
                }, function (recRes) {
                    if (recRes.result.length > 0) {
                        let recommendation= recRes.result[0];
                        Users.getList({
                            userId: parseInt(recommendation.userId)
                        }, function (res) {
                            let user = res.result[0];
                           
                            var emailRequest = {
                                template: CONSTANTS.EMAIL.THANK_YOU_EMAIL,
                                to: guestUser.email,
                                name: user.firstName,
                                email: guestUser.email,
                                mailMessage: "",
                            };
                            mailer.sendMail(emailRequest, function (res) {
                                logger.info('Mail sent status : ', res.status, 'for User : ', guestUser.email);
                            });
                        }) 
                    }
                })
            }
        });
    }
}


function sendSpikeviewCredentialsToGuestUser(guestUserId) {
    if (guestUserId) {
        Users.getList({
            userId: parseInt(guestUserId)
        }, function (res) {
            let guestUser = res.result[0];
            if (guestUser.roleId == USER_CODES.GUEST_ROLE) {
                guestUser.roleId = USER_CODES.STUDENT_ROLE;
                guestUser.isPasswordChanged = false;
                guestUser.isActive = true;
                guestUser.isArchived = false;
                Users.update(guestUser, function (res) {
                    var emailRequest = {
                        template: CONSTANTS.EMAIL.GUEST_TO_STUDENT_ACCOUNT_CONVERSION,
                        to: guestUser.email,
                        email: guestUser.email,
                        password: guestUser.tempPassword,
                        mailMessage: CONSTANTS.EMAIL.GUEST_ACCOUNT_CREATION_EMAIL_MESSAGE,
                        link: config.server_url + '/autoLogin/' + guestUser.email + '/' + utils.encrypt(guestUser.tempPassword)
                    };
                    mailer.sendMail(emailRequest, function (res) {
                        logger.info('Mail sent status : ', res.status, 'for User : ', guestUser.email);
                    });

                    var emailRequestForNewUser = { 
                        template: CONSTANTS.EMAIL.THANK_YOU_EMAIL,
                        to: guestUser.email,                   
                        email: guestUser.email,
                        mailMessage: "Learn more and create your own spikeview at spikeview.com!",
                    };
                    mailer.sendMail(emailRequestForNewUser, function (res) {
                        logger.info('Mail sent status : ', res.status, 'for User : ', guestUser.email);
                    });

                    // create bot connection
                    var botRequest = {
                        userId: guestUser.userId,
                        partnerId: USER_CODES.BOTID,
                        dateTime: utils.getSystemTime(),
                        status: 'Accepted',
                        isActive: true
                    };
                    Connection.create(botRequest, function (res) {
                        logger.info('bot connection created : ', res.status);
                    });
                });
            } else {             

                var emailRequest = { 
                    template: CONSTANTS.EMAIL.THANK_YOU_EMAIL,
                    to: guestUser.email,                   
                    email: guestUser.email,
                    mailMessage: "",
                };
                mailer.sendMail(emailRequest, function (res) {
                    logger.info('Mail sent status : ', res.status, 'for User : ', guestUser.email);
                });
            }
        });
    }
}

function update(recommendation, callback) {
    RecommendationModel.update({
        'recommendationId': recommendation.recommendationId
    }, {
        $set: recommendation
    }, function (error) {
        if (error) {
            callback({
                status: REQUEST_CODES.FAIL,
                message: utils.formatText(REQUEST_CODES.FAIL_MSG, RECOMMENDATION_CODES.PUT_API)
            });
            return;
        } else {
            callback({
                status: REQUEST_CODES.SUCCESS,
                message: RECOMMENDATION_CODES.UPDATE_SUCCESS
            });
            return;
        }
    });
}

function addLike(data, callback) {
    var like = {
        userId: data.userId
    };
    getList({
        recommendationId: data.recommendationId
    }, function (res) {
        if (res.result.length > 0) {
            var recommendation = res.result[0];
            if (data.isLike) {
                recommendation.likes.push(like)
                recommendation.likes = _.uniq(recommendation.likes, JSON.stringify);
            } else {
                recommendation.likes = _.filter(recommendation.likes, function (obj) {
                    return obj.userId != data.userId
                });
            }
            update(recommendation, function (resp) {
                if (resp.status == REQUEST_CODES.SUCCESS) {
                    callback({
                        status: REQUEST_CODES.SUCCESS
                    });
                    return;
                } else {
                    return resp;
                }
            });
        } else {
            callback({
                status: REQUEST_CODES.FAIL,
                message: REQUEST_CODES.FAIL_MSG
            });
            return;
        }
    });
}

function requestedRecommendation(query, callback){ 
        RecommendationModel.aggregate(
            [{
                    $match: {
                        $and:[{recommenderId: parseInt(query.userId)},
                            {stage: RECOMMENDATION_CODES.REQUESTED}]    
                    }
                },
                {
                    "$sort": {
                        "recommendationId": -1
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "userId",
                        foreignField: "userId",
                        as: "recommendationUser"
                    }
                },
                {
                    $unwind: "$recommendationUser"
                },   
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

module.exports.create = create;
module.exports.getList = getList;
module.exports.update = update;
module.exports.getRecommendationCount = getRecommendationCount;
module.exports.getRecommendationByCompetency = getRecommendationByCompetency;
module.exports.requestRecommendation = requestRecommendation;
module.exports.sendSpikeviewCredentialsToGuestUser = sendSpikeviewCredentialsToGuestUser;
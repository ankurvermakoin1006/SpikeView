module.exports = function (app) {
    app.post('/ui/achievement', function (req, res) { //To Create achievement
        try {
            create(req.body, function (response) {
                res.json(response);
            });
        } catch (e) {
            res.json(e);
        }
    });
    app.get('/ui/achievement', function (req, res) { //To get achievement
        try {
            getList(req.query, function (response) {
                res.json(response);
            });
        } catch (e) {
            res.json(e);
        }
    });
    app.put('/ui/achievement', function (req, res) { //To update achievement
        try {
            update(req.body, function (response) {
                res.json(response);
            });
        } catch (e) {
            res.json(e);
        }
    });
    app.delete('/ui/achievement', function (req, res) { //To delete achievement
        try {
            remove(req.body, function (response) {
                res.json(response);
            });
        } catch (e) {
            res.json(e);
        }
    });
    app.get('/ui/achievementByLevel2/:userId/:roleId', function (req, res) { //To get by level2
        try {
            getAchievementByLevel2(req.params, function (response) {
                res.json(response);
            });
        } catch (e) {
            res.json(e);
        }
    });
    app.get('/ui/achievementByLevel2/:userId', function (req, res) { //To get by level2
        try {
            getAchievementByLevel2(req.params, function (response) {
                res.json(response);
            });
        } catch (e) {
            res.json(e);
        }
    });
    app.get('/ui/spider/chart/:userId/:sharedId/:roleId', function (req, res) {
        try {
            getDataForSpiderChartWithImportance(req.params, function (response) {
                res.json(response);
            });
        } catch (e) {
            res.json(e);
        }
    });
    app.get('/ui/spider/chart/:userId/:sharedId', function (req, res) {
        try {
            getDataForSpiderChartWithImportance(req.params, function (response) {
                res.json(response);
            });
        } catch (e) {
            res.json(e);
        }
    });
    app.put('/ui/achievement/addLike', function (req, res) {
        try {
            addLike(req.body, function (response) {
                res.json(response);
            });
        } catch (e) {
            res.json(e);
        }
    });
    app.get('/ui/interestAddAll', function (req, res) {
        try {
            userInterestAddAll(req.params, function (response) {
                res.json(response);
            });
        } catch (e) {
            res.json(e);
        }
    });


    
}

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var AchievementSchema = new Schema(require('./achievementSchema').achievementSchema, {
    collection: 'achievement'
});
var AchievementModel = mongoose.model('Achievement', AchievementSchema);
var AchievementController = require('./achievementController');
var utils = require('../../commons/utils').utils;
var User = require('../users/users');
var CONSTANTS = utils.CONSTANTS;
var REQUEST_CODES = CONSTANTS.REQUEST_CODES;
var ACHIEVEMENT_CODES = utils.CONSTANTS.ACHIEVEMENT;
var VALIDATE = utils.CONSTANTS.VALIDATE;
var mongoUtils = utils.mongoUtils;
var USER_CODES = CONSTANTS.USERS;
var _ = require('underscore');
var SharedProfiles = require('../sharedProfiles/sharedProfiles');
var Recommendation = require('../recommendation/recommendation')
var importance = require('../masters/importance/importance');
var UserInterest = require('../userInterest/userInterest');
var CompetencyType = require('../masters/competencyType/competencyType');
var logger = require('../../logger.js');
function create(achievement, callback) {   
    var achievementAPI;
    var errorList = [];
    try {
        achievementAPI = AchievementController.AchievementAPI(achievement);
    } catch (e) {
        errorList.push(e.error[0]);
        callback({
            status: REQUEST_CODES.FAIL,
            result: errorList
        });
        return;
    }
    if (!achievementAPI.getCompetencyTypeId()) {
        var e = {
            status: VALIDATE.FAIL,
            message: utils.formatText(VALIDATE.REQUIRED, 'Competency Type')
        };
        errorList.push(e);
    }
    if (!achievementAPI.getTitle()) {
        var e = {
            status: VALIDATE.FAIL,
            message: utils.formatText(VALIDATE.REQUIRED, 'Title')
        };
        errorList.push(e);
    }
    if (!achievementAPI.getDescription()) {
        var e = {
            status: VALIDATE.FAIL,
            message: utils.formatText(VALIDATE.REQUIRED, 'Description')
        };
        errorList.push(e);
    }
    // if (achievementAPI.getImportance()) {
    //     var e = {
    //         status: VALIDATE.FAIL,
    //         message: utils.formatText(VALIDATE.REQUIRED, 'Importance')
    //     };
    //     errorList.push(e);
    // }
    // if (achievementAPI.getImportance() && (achievementAPI.getImportance() < 0 || achievementAPI.getImportance() > 11)) {
    //     var e = {
    //         status: VALIDATE.FAIL,
    //         message: ACHIEVEMENT_CODES.NOT_IN_RANGE
    //     };
    //     errorList.push(e);
    // }
    if (errorList.length) {
        callback({
            status: REQUEST_CODES.FAIL,
            result: errorList
        });
        return;
    } else {
        var achievementModel = new AchievementModel(achievementAPI);
        if (achievementModel.importance == null) {
            achievementModel.importance = 0;
        }    
        getList({
            userId: achievementModel.userId
            }, function (achievementRes) {
                if (achievementRes.result.length === 0) {                    
                    User.getList({
                        userId: achievementModel.userId
                    }, function (res) {
                        if (res.result.length > 0) {
                            var student = res.result[0];
                            student['isAchievement']= true;
                        }
                        User.update(student, function (res){ 
                            addAchievement(achievementModel,callback);                        
                    })                                
                })
            }else{
                addAchievement(achievementModel,callback);  
            }                          
        })                      
    }      
}

function addAchievement(achievementModel,callback){
    mongoUtils.getNextSequence('achievementId', function (oSeq) {
        achievementModel.achievementId = oSeq;
        achievementModel.createdTimestamp = utils.getSystemTime();
        achievementModel.save(function (error) {
            if (error) {
                callback({
                    status: REQUEST_CODES.FAIL,
                    message: error
                });
                return;
            } else {  
                userInterestAdd(achievementModel.competencyTypeId,achievementModel);                           
                if (achievementModel.guide.promptRecommendation) {
                    User.getList({
                        userId: achievementModel.userId
                    }, function (res) {
                        let requester = res.result[0]
                        let recommendationRequest = {
                            "firstName": achievementModel.guide.firstName,
                            "lastName": achievementModel.guide.lastName,
                            "email": achievementModel.guide.email,                                           
                            "request": achievementModel.description,
                            "interactionStartDate": achievementModel.fromDate,
                            "interactionEndDate": achievementModel.toDate,
                            "skills": achievementModel.skills,
                            "asset": achievementModel.asset,
                            "isActive": true,
                            "userId": achievementModel.userId,                           
                            "name": requester.firstName,
                            "profileImage": requester.profilePicture,
                            "requesterEmail": requester.email,
                            "competencyTypeId": achievementModel.competencyTypeId,
                            "level2Competency": achievementModel.level2Competency,
                            "level3Competency": achievementModel.level3Competency,
                            "stage": utils.CONSTANTS.RECOMMENDATION.REQUESTED,
                            "title": achievementModel.guide.title,
                            "recommenderTitle": achievementModel.guide.recommenderTitle                                                     
                        }                        
                        Recommendation.requestRecommendation(recommendationRequest, function (res) {                                                                                       
                            callback({
                                        status: REQUEST_CODES.SUCCESS,
                                        message: ACHIEVEMENT_CODES.CREATE_SUCCESS,
                                        result: {
                                            achievementId: achievementModel.achievementId
                                        }
                                    });
                                    return;                                                       
                            });
                    });
                } else {                    
                    callback({
                            status: REQUEST_CODES.SUCCESS,
                            message: ACHIEVEMENT_CODES.CREATE_SUCCESS,
                            result: {
                                achievementId: achievementModel.achievementId
                            }
                            });
                    return;  
                }                    
            }                   
        })
    }) 
}

function userInterestAdd(competencyTypeId,data){   
            let userInterestArr= []; 
            let userId=  parseInt(data.userId);           
            let params={
                userId: userId              
            }

            getAchievementByLevel2(params,function(res){                
                let array = res.result;
             
                array.forEach(function(item){
                    if(userInterestArr.length == 0){
                        userInterestArr.push({level1: item.level1 , level2 : item.name, count : item.achievement.length});
                    }else{
                        let interestIndex = userInterestArr.findIndex(todo => todo.level1 == item.level1 && todo.level2 == item.name);
                        if(interestIndex == -1){
                            userInterestArr.push({level1: item.level1 , level2 : item.name, count : item.achievement.length});
                        }
                    }
                });
                userInterestArr= userInterestArr.sort(function(a, b){return b.count-a.count});  
                let countAdd=0,sameCount=0;                       
                UserInterest.remove({userId: parseInt(userId)},function(res){
                    userInterestArr.forEach(function(data, index){
                        let userInterestData ={
                            userId: userId,                          
                            level1: data.level1,
                            level2: data.level2
                        } 
                        if(index == 0){
                            countAdd= parseInt(data.count);
                            UserInterest.create(userInterestData); 
                        }                       
                        if((index == 1 && sameCount==0) || (index >=2 && countAdd == parseInt(data.count))){ 
                            if(countAdd !== parseInt(data.count)){
                                countAdd= parseInt(data.count);
                                sameCount=1;  
                            }
                            UserInterest.create(userInterestData);
                        } 
                    });
                });    
            });  
}


function userInterestAddAll(competencyTypeId,userId){  
   
    User.getList({},function(res){
        let userList= res.result;
        userList.forEach(function(dataUser){
            let userInterestArr= [];    
            getAchievementByLevel2(dataUser,function(res){                
                let array = res.result;
             
                array.forEach(function(item){
                    if(userInterestArr.length == 0){
                        userInterestArr.push({level1: item.level1 , level2 : item.name, count : item.achievement.length});
                    }else{
                        let interestIndex = userInterestArr.findIndex(todo => todo.level1 == item.level1 && todo.level2 == item.name);
                        if(interestIndex == -1){
                            userInterestArr.push({level1: item.level1 , level2 : item.name, count : item.achievement.length});
                        }
                    }
                });
                userInterestArr= userInterestArr.sort(function(a, b){return b.count-a.count});                         
               
                    userInterestArr.forEach(function(data, index){
                        let userInterestData ={
                            userId: dataUser.userId,
                            roleId: dataUser.roleId,
                            level1: data.level1,
                            level2: data.level2
                        }                        
                        if(index < 2){
                            UserInterest.create(userInterestData);
                        }    
                    });
                  
            }); 
           })           
        })
        }


function update(achievement, callback) {
    AchievementModel.lastModifiedTimestamp= utils.getSystemTime();
  
    getList({achievementId:parseInt(achievement.achievementId,10)}, function (res) {
    let promptRecommendation= res.result[0].guide && res.result[0].guide.promptRecommendation ? res.result[0].guide.promptRecommendation :false;    
        AchievementModel.update({
            'achievementId': achievement.achievementId
        }, {
            $set: achievement
        }, function (error) {
            if (error) {
                callback({
                    status: REQUEST_CODES.FAIL,
                    message: error
                });
                return;
            } else {                             
                if (achievement.guide.promptRecommendation && !promptRecommendation) {
                    User.getList({
                        userId: achievement.userId
                    }, function (res) {
                        let requester = res.result[0];                      
                        getList({
                            achievementId: achievement.achievementId
                        }, function (res) {
                            let dbAchievement = res.result[0];
                            let recommendationRequest = {
                                "firstName": achievement.guide.firstName,
                                "lastName": achievement.guide.lastName,
                                "email": achievement.guide.email,                                
                                "request": dbAchievement.description,
                                "interactionStartDate": dbAchievement.fromDate,
                                "interactionEndDate": dbAchievement.toDate,
                                "skills": dbAchievement.skills,
                                "asset": dbAchievement.asset,
                                "isActive": true,
                                "userId": dbAchievement.userId,                                
                                "name": requester.firstName,
                                "profileImage": requester.profilePicture,
                                "requesterEmail": requester.email,
                                "competencyTypeId": dbAchievement.competencyTypeId,
                                "level2Competency": dbAchievement.level2Competency,
                                "level3Competency": dbAchievement.level3Competency,
                                "stage": utils.CONSTANTS.RECOMMENDATION.REQUESTED,
                                "title": achievement.guide.title,      
                                "recommenderTitle": achievement.guide.recommenderTitle                            
                            }
                            Recommendation.requestRecommendation(recommendationRequest, function (res) {
                                callback({
                                    status: REQUEST_CODES.SUCCESS,
                                    message: utils.formatText(ACHIEVEMENT_CODES.UPDATE_SUCCESS, achievement.achievementId)
                                });
                                return;
                            });
                        });
                    });
                } else {
                    callback({
                        status: REQUEST_CODES.SUCCESS,
                        message: utils.formatText(ACHIEVEMENT_CODES.UPDATE_SUCCESS, achievement.achievementId)
                    });
                    return;
                }
            }
        });
    });    
}

function remove(query, callback) {
    getList({achievementId:query.achievementId}, function (res) {
        let userId= res.result[0].userId;
        
        AchievementModel.remove(query, function (error) {
            if (error) {
                callback({
                    status: REQUEST_CODES.FAIL,
                    message: error
                });
                return;
            } else {
                User.getList({userId:userId}, function (userRes) {
                    if (userRes.result.length > 0) {
                        var student = userRes.result[0];
                        student['isAchievement']= false;
                        User.update(student, function (res){                   
                                callback({
                                    status: REQUEST_CODES.SUCCESS,
                                    message: ACHIEVEMENT_CODES.DELETE_SUCCESS
                                });
                                return;
                            })
                        }else{
                            callback({
                                status: REQUEST_CODES.SUCCESS,
                                message: ACHIEVEMENT_CODES.DELETE_SUCCESS
                            });
                            return;             
                        }
                    })
                }    
            })
            userInterestAdd("",userId);
        });
}

function getList(query, callback) {
    AchievementModel.find(query, function (error, records) {
        if (error) {
            callback({
                status: REQUEST_CODES.FAIL,
                message: error
            });
            return;
        } else {
            records = records.map(function (record) {
                return new AchievementController.AchievementAPI(record);
            });
            callback({
                status: REQUEST_CODES.SUCCESS,
                result: records
            });
            return;
        }
    });
}

function getAchievementCount(query, callback) {
    AchievementModel.count(query, function (error, count) {
        if (error) {
            callback({
                status: REQUEST_CODES.FAIL,
                message: error
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

function getAchievementByLevel2(params, callback) {
    let userId= parseInt(params.userId);   
    User.getList({
        userId: userId
    }, function (res) {
        if (res.result.length > 0) {
            var user = res.result[0];
            AchievementModel.aggregate(
                [{
                        $match: {
                            userId: user.userId                            
                        }
                    },
                    {
                        $sort: {
                            importance: -1,
                        }
                    },
                    {
                        $group: {
                            _id: "$competencyTypeId",
                            achievement: {
                                $push: "$$ROOT"
                            }
                        }
                    },
                    {
                        $lookup: {
                            from: "competencyType",
                            localField: "achievement.competencyTypeId",
                            foreignField: "competencyTypeId",
                            as: "level2"
                        }
                    },
                    {
                        $unwind: "$level2"
                    },                  
                    {
                        $project: {
                            achievement: "$achievement",
                            name: "$level2.level2",
                            level1: "$level2.level1"
                        }
                    },
                    {
                        $sort: {
                            "level1": 1,
                        }
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
        } else {
            callback({
                status: REQUEST_CODES.FAIL,
                message: utils.formatText(USER_CODES.USER_NOT_FOUND, userId)
            });
            return;

        }
    });
}

function getDataForSpiderChartWithImportance(params, callback) {
    var masterImportance = [];
    importance.getList({}, function (res) {
        if (res.result && res.result.length > 0) {
            masterImportance = res.result;
            getDataForSpiderChart(params, function (resp) {
                if (resp.result && resp.result.length > 0) {
                    _.map(resp.result, function (obj) {
                        _.forEach(masterImportance, function (imp) {
                            if (obj.importance == imp.importanceId) {
                                return obj.importanceTitle = imp.title;
                            }
                        })
                    });
                    callback({
                        status: REQUEST_CODES.SUCCESS,
                        result: resp.result
                    });
                } else {
                    callback({
                        status: REQUEST_CODES.SUCCESS,
                        message: REQUEST_CODES.NO_DATA_FOUND,
                        result: []
                    });
                    return;
                }
            });
        }
    });
}

function getDataForSpiderChart(params, callback) {
    var userId = parseInt(params.userId);
    var roleId = parseInt(params.roleId);
    var sharedId = parseInt(params.sharedId);

    User.getList({
        userId: userId
    }, function (res) {
        if (res.result.length > 0) {
            var user = res.result[0];
            AchievementModel.aggregate(
                [{
                        $match: {
                            userId: user.userId,
                            $or:[
                                {roleId: roleId},
                                {roleId : {  $exists: false }}
                            ],
                            isActive: true
                        }
                    },
                    {
                        $group: {
                            _id: "$competencyTypeId",
                            achievement: {
                                $push: "$$ROOT"
                            }
                        }
                    },
                    {
                        $lookup: {
                            from: "competencyType",
                            localField: "achievement.competencyTypeId",
                            foreignField: "competencyTypeId",
                            as: "level2"
                        }
                    },
                    {
                        $unwind: "$level2"
                    },
                    {
                        $project: {
                            importance: {
                                $max: "$achievement.importance"
                            },
                            name: "$level2.level2"
                        }
                    },
                    {
                       $sort:{ _id: 1 }
                    }                   
                ]
            ).exec(function (error, data) {
                if (error) {
                    callback({
                        status: REQUEST_CODES.FAIL,
                        message: error
                    });
                } else {                              
                if (sharedId && data && data.length > 0) {
                    var filterData = [];
                    SharedProfiles.getList({
                        sharedId: sharedId
                    }, function (res) {
                        res.result[0].shareConfiguration.forEach((config) => {
                            data.forEach((obj) => {
                                if (config.competencyTypeId == obj._id && obj.importance >= config.importance) {
                                    filterData.push(obj);
                                }
                            });
                        });
                        callback({
                            status: REQUEST_CODES.SUCCESS,
                            result: filterData
                        });
                    });                    
                }else {
                        callback({
                            status: REQUEST_CODES.SUCCESS,
                            result: data
                        });
                    }
                }
            });
        } else {
            callback({
                status: REQUEST_CODES.FAIL,
                message: utils.formatText(USER_CODES.USER_NOT_FOUND, userId)
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
        achievementId: data.achievementId
    }, function (res) {
        if (res.result.length > 0) {
            var achievement = res.result[0];
            if (data.isLike) {
                achievement.likes.push(like)
                achievement.likes = _.uniq(achievement.likes, JSON.stringify);
            } else {
                achievement.likes = _.filter(achievement.likes, function (obj) {
                    return obj.userId != data.userId
                });
            }
            update(achievement, function (resp) {
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

module.exports.create = create;
module.exports.getList = getList;
module.exports.update = update;
module.exports.getAchievementCount = getAchievementCount;
module.exports.getAchievementByLevel2 = getAchievementByLevel2;
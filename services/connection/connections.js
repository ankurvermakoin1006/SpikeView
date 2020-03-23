module.exports = function (app) {
    app.post('/ui/connect', function (req, res) {
        try {
            makeConnectionRequest(req.body, function (response) {
                res.json(response);
            });
        } catch (e) {
            res.json(e);
        }
    });
    app.get('/ui/connect/list', function (req, res) {
        try {
            getConnectionsData(req.query, function (response) {
                res.json(response);
            });
        } catch (e) {
            res.json(e);
        }
    });
    app.get('/ui/connect/commonList', function (req, res) {
        try {
            getCommonConnetionsData(req.query, function (response) {
                res.json(response);
            });
        } catch (e) {
            res.json(e);
        }
    });
    app.get('/ui/connect/listByStaus', function (req, res) {
        try {
            getConnetionsListByStatus(req.query, function (response) {
                res.json(response);
            });
        } catch (e) {
            res.json(e);
        }
    });
    app.get('/ui/connect/status', function (req, res) {
        try {
            getCustomList(req.query, function (response) {
                res.json(response);
            });
        } catch (e) {
            res.json(e);
        }
    });
    app.get('/ui/connect', function (req, res) {
        try {
            getList(req.query, function (response) {
                res.json(response);
            });
        } catch (e) {
            res.json(e);
        }
    });
    app.get('/ui/connect/chatList', function (req, res) {
        try {
            getChatList(req.query, function (response) {
                res.json(response);
            });
        } catch (e) {
            res.json(e);
        }
    });
    app.put('/ui/connect', function (req, res) {
        try {
            update(req.body, function (response) {
                res.json(response);
            });
        } catch (e) {
            res.json(e);
        }
    });
    app.delete('/ui/connect', function (req, res) {
        try {
            remove(req.body, function (response) {
                res.json(response);
            });
        } catch (e) {
            res.json(e);
        }
    });
    app.post('/ui/connect/inviteMultipleMemberForConnection', function (req, res) {      
        try {         
            addMultipleMembersForConnection(req.body, function (response) {
                res.json(response);
            });
        } catch (e) {
            res.json(e);
        }
    });
    app.get('/ui/connection/connectionPartnerUpdate', function (req, res) {
        //To search on spikeview
        try {
            connectionPartnerUpdate(req.body, function (response) {
            res.json(response);
          });
        } catch (e) {
          res.json(e);
        }
      });
}

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var ConnectionsSchema = new Schema(require('./connectionsSchema').connectionsSchema, {
    collection: 'connections'
});
var mobileNotification = require('../pushNotification/fcm');
var ConnectionsModel = mongoose.model('connections', ConnectionsSchema);
var ConnectionsController = require('./connectionsController');
var login = require('../login/login');
var utils = require('../../commons/utils').utils;
var user = require('../users/users');
var logger = require('../../logger.js');
var mongoUtils = utils.mongoUtils;
var CONSTANTS = utils.CONSTANTS;
var USER_CODES = utils.CONSTANTS.USERS;
var REQUEST_CODES = CONSTANTS.REQUEST_CODES;
var CONNECTION_CODES = utils.CONSTANTS.CONNECTION;


function connectionPartnerUpdate(req,callback){
    getList({},function(res){
       let connectionList = res.result;
       connectionList.forEach(function(data){
        data.userRoleId=null;
        data.partnerRoleId=null;
        update(data,callback);
       })
    })
}


function makeConnectionRequest(data, callback) {
    var query = {
        userId: data.userId,
        userRoleId: data.userRoleId,
        partnerId: data.partnerId,
        partnerRoleId: data.partnerRoleId
    }
    getList(query, function (res) {
        if (res.result.length > 0) {
            callback({
                status: REQUEST_CODES.FAIL,
                message: CONNECTION_CODES.DUPLICATE_REQUEST
            });
            return;
        } else {
            query = {
                userId: data.partnerId,
                partnerId: data.userId,
                userRoleId: data.userRoleId,
                partnerRoleId: data.partnerRoleId
            }
            getList(query, function (res) {
                if (res.result.length > 0) {
                    callback({
                        status: REQUEST_CODES.FAIL,
                        message: CONNECTION_CODES.DUPLICATE_REQUEST
                    });
                    return;
                } else {
                    create(data, callback);
                }
            });
        }
    });
}

function create(connection, callback) {
    var connectionAPI;
    var errorList = [];
    try {
        connectionAPI = ConnectionsController.ConnectionsAPI(connection);
    } catch (e) {
        errorList.push(e.error[0]);
        callback({
            status: REQUEST_CODES.FAIL,
            error: errorList
        });
        return;
    }
    var connectionsModel = new ConnectionsModel(connectionAPI);
    mongoUtils.getNextSequence('connectId', function (oSeq) {
        connectionsModel.connectId = oSeq;
        connectionsModel.save(function (error) {
            if (error) {
                callback({
                    status: REQUEST_CODES.FAIL,
                    error: error
                });
                return;
            } else {
                let Header = require('../header/header');
                let data = {
                    userId: connectionsModel.partnerId,
                    roleId: connectionsModel.partnerRoleId,
                    connectionCount: 1,
                    messagingCount: '',
                    notificationCount: ''
                };
                Header.update(data, function (res) {
                    logger.info('header updated', res.status);
                });
                login.getDeviceIds(connectionsModel.partnerId, function (resp) {
                    let deviceIds = resp.result;
                    user.getList({
                        userId: connectionsModel.partnerId
                    }, function (res) {
                        let partner = res.result[0];
                        user.getList({
                            userId: connectionsModel.userId
                        }, function (res) {
                            let user = res.result[0];
                            var message = {
                                deviceIds: deviceIds,
                                userId: partner.userId,
                                roleId: connectionsModel.partnerRoleId,
                                name: partner.firstName,
                                actedBy: user.userId,
                                profilePicture: user.profilePicture,
                                body: user.firstName + ' sent you spikeview connection request',
                                textName: user.firstName + ' ' + (user.lastName ? user.lastName : ''),
                                textMessage : 'sent you spikeview connection request'
                            };
                            mobileNotification.sendNotification(message);
                        });
                    })
                });
                callback({
                    status: REQUEST_CODES.SUCCESS,
                    message: CONNECTION_CODES.CREATE_SUCCESS,
                    result: {
                        connectId: connectionsModel.connectId
                    }
                });
                return;
            }
        });
    });
}

//Added only to remove notification
function createConnectionForParentAddStudent(connection, callback) {
    var connectionAPI;
    var errorList = [];
    try {
        connectionAPI = ConnectionsController.ConnectionsAPI(connection);
    } catch (e) {
        errorList.push(e.error[0]);
        callback({
            status: REQUEST_CODES.FAIL,
            error: errorList
        });
        return;
    }
    var connectionsModel = new ConnectionsModel(connectionAPI);
    mongoUtils.getNextSequence('connectId', function (oSeq) {
        connectionsModel.connectId = oSeq;
        connectionsModel.save(function (error) {
            if (error) {
                callback({
                    status: REQUEST_CODES.FAIL,
                    error: error
                });
                return;
            } else {
                    let Header = require('../header/header');
                    let data = {
                        userId: connectionsModel.partnerId,
                        roleId: connectionsModel.partnerRoleId,
                        connectionCount: 1,
                        messagingCount: '',
                        notificationCount: ''
                    };
                    Header.update(data, function (res) {
                        logger.info('header updated', res.status);
                    });                   

                callback({
                    status: REQUEST_CODES.SUCCESS,
                    message: CONNECTION_CODES.CREATE_SUCCESS,
                    result: {
                        connectId: connectionsModel.connectId
                    }
                });
                return;
            }
        });
    });
}

function getList(query, callback) {
    ConnectionsModel.find(query, function (error, records) {
        if (error) {
            callback({
                status: REQUEST_CODES.FAIL,
                error: error
            });
            return;
        } else {
            records = records.map(function (records) {
                return new ConnectionsController.ConnectionsAPI(records);
            });
            callback({
                status: REQUEST_CODES.SUCCESS,
                result: records
            });
            return;
        }
    });
}

function getConnectionsData(query, callback) {
    getConnectionList(query, function(res){
         var resultOfConnectionList = res.result;
         query.status=4; 
         getMutualFriends(query, function(res){            
            var resultOfMutualFriends = res.result;
            resultOfConnectionList.PeopleYouMayKnow = resultOfMutualFriends;
            callback({
                status: REQUEST_CODES.SUCCESS,
                result: resultOfConnectionList
            });
            return;
         })
    })
}

function getCommonConnetionsData(query, callback) {
    getLimitedConnectionList(query, function(res){
         var resultOfConnectionList = res.result;
         getMutualFriends(query, function(res){
            var resultOfMutualFriends = res.result['PeopleYouMayKnow'];
            resultOfConnectionList.PeopleYouMayKnow = resultOfMutualFriends;
            resultOfConnectionList.PeopleYouMayKnowCount = res.result['PeopleYouMayKnowCount'];
            callback({
                status: REQUEST_CODES.SUCCESS,
                result: resultOfConnectionList
            });
            return;
         })
    })
}

function getConnetionsListByStatus(query, callback) {
    if(parseInt(query.status,10) === CONSTANTS.CONNECTION_STATUS.ACCEPTED || parseInt(query.status,10) === CONSTANTS.CONNECTION_STATUS.REQUESTED || parseInt(query.status,10) === CONSTANTS.CONNECTION_STATUS.SENT_REQUEST){
        getConnectionListByStatus(query, function(res){                
                callback({
                    status: REQUEST_CODES.SUCCESS,
                    result: res.result
                });
                return;
            })
    }
    else{
        if(query.status == CONSTANTS.CONNECTION_STATUS.PEOPLE_YOU_MAY_KNOW){
            getMutualFriendsPagination(query, function(res){
                var resultOfConnectionList = {};
                var resultOfMutualFriends = res.result;
                resultOfConnectionList.PeopleYouMayKnow = resultOfMutualFriends;
                callback({
                    status: REQUEST_CODES.SUCCESS,
                    result: resultOfConnectionList
                });
                return;
            })
        }    
    }
}

function getMutualFriends(query, callback) { 
    let roleId= query.roleId ? parseInt(query.roleId) : null;
    getList({$and : [{$or: [ { userId: parseInt(query.userId) },      
            {$or:[
                {userRoleId: roleId},
                {userRoleId : {  $exists: false }}
            ]},
         ]},
        {partnerId:{$ne:USER_CODES.BOTID}}, 
    {status: { $in:[CONSTANTS.CONNECTION.ACCEPTED,CONSTANTS.CONNECTION.REQUESTED]}}]}, function (conRec) {   
        let connectedUserId = [];      
      

        let connectedUserWithUserId=[];
        conRec.result && conRec.result.forEach(function(data){              
            connectedUserId.push(parseInt(data['userId'],10) === parseInt(query.userId) ? data['partnerId'] : data['userId']);
        });      
        connectedUserWithUserId= connectedUserId;
        connectedUserWithUserId.push(parseInt(query.userId));   
      
        // getList({$and: [{$or: [{userId:{$in:connectedUserId}},{partnerId:{$in:connectedUserId}}]},{partnerId:{$ne:USER_CODES.BOTID}}, {status: { $eq:CONSTANTS.CONNECTION.ACCEPTED}}]}, function (result1) {    
        //     let mutualUserId = [];
        //     let PeopleYouMayKnowCount= 0;
        //     result1.result && result1.result.forEach( function(data) {               
        //         logger.info('getMutualFriends method --> retrieved mutual friend list');
        //         if(mutualUserId.indexOf(data['partnerId']) <= -1 && mutualUserId.indexOf(data['userId']) <= -1
        //            && parseInt(data['partnerId'],10) !== parseInt(query.userId) && 
        //            parseInt(data['userId'],10) !== parseInt(query.userId)
        //           ){             
        //             let adduser =  connectedUserId.indexOf(parseInt(data['userId'])) <= -1 ?                                   
        //                             data['userId']:connectedUserId.indexOf(parseInt(data['partnerId'])) <= -1 ?
        //                              data['partnerId'] :"addUser"; 
        //             if(adduser!=="addUser"){ 
        //                 PeopleYouMayKnowCount =PeopleYouMayKnowCount+1;
        //                 if(query.status){                                     
        //                         mutualUserId.push(connectedUserId.indexOf(parseInt(data['userId'])) <= -1 ?                                   
        //                                             data['userId']:data['partnerId']);
        //                     }
        //                 else{
        //                     if(mutualUserId.length < 11){                    
        //                         mutualUserId.push(connectedUserId.indexOf(parseInt(data['userId'])) <= -1 ?                                   
        //                                             data['userId']:data['partnerId']);
        //                     }
        //                 } 
        //             }       
        //         }
        //     });
        //     let resResult = {};
        //     getMutualFriendList(mutualUserId, function(res) {      
        //         resResult['PeopleYouMayKnow']= res;
        //         resResult['PeopleYouMayKnowCount']= PeopleYouMayKnowCount;
        //         callback({
        //             status: REQUEST_CODES.SUCCESS,
        //             result: resResult
        //         });
        //     });
        // })  
        let limit= 10;
        let skip =  0;    

        ConnectionsModel.aggregate(
            [                   
                {  $match: {
                    $and: [{
                        $or: [ {$and: [{userId:{$in:connectedUserId}},
                            {partnerId:{$nin:connectedUserWithUserId }},
                            {partnerId:{$ne:USER_CODES.BOTID}}]},
                        { $and : [{partnerId:{$in:connectedUserId}},
                            {userId:{$nin:connectedUserWithUserId }},
                            {partnerId:{$ne:USER_CODES.BOTID}}]} ] },                              
                        {status: { $eq:CONSTANTS.CONNECTION.ACCEPTED}}]}                               
                },   
                {"$group":{_id: "$connectId","userId": {"$addToSet":"$userId"},"partnerId": {"$addToSet":"$partnerId"}}},    
                {"$sort":{"_id":1}},          
                {"$skip":skip},                
                {"$limit": limit }                        
            ]
        ).exec(function (error, resultMutualFriendList) {
            if (error) {
                logger.error('getMutualFriendsPagination method --> mutual friend list retrieval error');
                callback({
                    status: REQUEST_CODES.FAIL,
                    message: error
                });
            }          

            logger.info('getMutualFriendsPagination method --> retrieved mutual friend list');
            let mutualUserId = [];
            let PeopleYouMayKnowCount= 0;
        
            resultMutualFriendList && resultMutualFriendList.forEach( function(data) {             
                if(mutualUserId.indexOf(data['partnerId'][0]) <= -1 && mutualUserId.indexOf(data['userId'][0]) <= -1                   
                ){             
                    let adduser =  connectedUserId.indexOf(parseInt(data['userId'][0])) <= -1 ?                                   
                                    data['userId'][0]:connectedUserId.indexOf(parseInt(data['partnerId'][0])) <= -1 ?
                                    data['partnerId'][0] :"addUser"; 
                    if(adduser!=="addUser"){  
                                PeopleYouMayKnowCount =PeopleYouMayKnowCount+1;                                   
                                mutualUserId.push(connectedUserId.indexOf(parseInt(data['userId'][0])) <= -1 ?                                   
                                                    data['userId'][0]:data['partnerId'][0]);
                    }
                }
            });
            let resResult = {};
            getMutualFriendList(mutualUserId, function(res) { 
                resResult['PeopleYouMayKnow']= res;
                resResult['PeopleYouMayKnowCount']= PeopleYouMayKnowCount;     
                callback({
                    status: REQUEST_CODES.SUCCESS,
                    result: resResult
                });
            });
        })
    }) 
 } 


 function getMutualFriendsPagination(query, callback) { 
    let limit= 15;
    let skip = limit*parseInt(query.skip,10) || 0;   
    let roleId= query.roleId ? parseInt(query.roleId) : null;
    getList({$and : [{$or: [{$and:[{ userId: parseInt(query.userId)},      
        {$or:[
            {userRoleId: roleId},
            {userRoleId : {  $exists: false }}
        ]},
        ]},
        
         {$and:[{ partnerId: parseInt(query.userId) },         
            {$or:[
                {partnerRoleId: roleId},
                {partnerRoleId : {  $exists: false }}
            ]},
          ]}]},
          {partnerId:{$ne:USER_CODES.BOTID}}, {status: { $in:[CONSTANTS.CONNECTION.ACCEPTED,CONSTANTS.CONNECTION.REQUESTED]}}]}, function (conRec) {   
        let connectedUserId = [];        
        let connectedUserWithUserId=[];
        conRec.result && conRec.result.forEach(function(data){              
            connectedUserId.push(parseInt(data['userId'],10) === parseInt(query.userId) ? 
                                  data['partnerId'] : data['userId']);
        });      
        connectedUserWithUserId= connectedUserId;
        connectedUserWithUserId.push(parseInt(query.userId));   
          
        ConnectionsModel.aggregate(
            [                   
                {  $match: {
                    $and: [{
                        $or: [ {$and: [{userId:{$in:connectedUserId}},
                            {partnerId:{$nin:connectedUserWithUserId }},
                            {partnerId:{$ne:USER_CODES.BOTID}}]},
                        { $and : [{partnerId:{$in:connectedUserId}},
                            {userId:{$nin:connectedUserWithUserId }},
                            {partnerId:{$ne:USER_CODES.BOTID}}]} ] },                              
                        {status: { $eq:CONSTANTS.CONNECTION.ACCEPTED}}]}                               
                },   
                {"$sort":{"dateTime":1}}, 
                {"$skip":skip},                
                {"$limit": limit },    
                {"$group":{_id: "$connectId","userId": {"$addToSet":"$userId"},"partnerId": {"$addToSet":"$partnerId"}}},    
             ]
        ).exec(function (error, resultMutualFriendList) {
            if (error) {
                logger.error('getMutualFriendsPagination method --> mutual friend list retrieval error');
                callback({
                    status: REQUEST_CODES.FAIL,
                    message: error
                });
            }          

            logger.info('getMutualFriendsPagination method --> retrieved mutual friend list');
            let mutualUserId = [];
        
            resultMutualFriendList && resultMutualFriendList.forEach( function(data) {             
                if(mutualUserId.indexOf(data['partnerId'][0]) <= -1 && mutualUserId.indexOf(data['userId'][0]) <= -1                   
                ){             
                    let adduser =  connectedUserId.indexOf(parseInt(data['userId'][0])) <= -1 ?                                   
                                    data['userId'][0]:connectedUserId.indexOf(parseInt(data['partnerId'][0])) <= -1 ?
                                    data['partnerId'][0] :"addUser"; 
                    if(adduser!=="addUser"){                                     
                                mutualUserId.push(connectedUserId.indexOf(parseInt(data['userId'][0])) <= -1 ?                                   
                                                    data['userId'][0]:data['partnerId'][0]);
                    }
                }
            });
            getMutualFriendList(mutualUserId, function(res) {      
                callback({
                    status: REQUEST_CODES.SUCCESS,
                    result: res
                });
            });
        })
    }) 
 } 


 function getSearchConnectionList(userId,query, callback) { 
    getList({$and : [{$or: [ { userId: parseInt(userId), partnerId:{ $in:query} }, {userId: { $in:query},
         partnerId: parseInt(userId) } ]},{status: { $in:[CONSTANTS.CONNECTION.ACCEPTED,CONSTANTS.CONNECTION.REQUESTED]}}]}, function (conRec) {      
            callback({             
                result: conRec.result
            });
            return;           
    }) 
 }

function getConnectionList(query, callback) {
    let roleId= query.roleId ? parseInt(query.roleId) : null;
    ConnectionsModel.aggregate(
        [{
                $match: {
                    $and: [{
                        $or: [
                            {$and:[  {
                                        partnerId: parseInt(query.userId)
                                    },
                                    {$or:[
                                        {partnerRoleId: roleId},
                                        {partnerRoleId : {  $exists: false }}
                                    ]}                                  
                                ]} ,
                            {$and: [
                                    {
                                        userId: parseInt(query.userId)
                                    },
                                    {$or:[
                                        {userRoleId: roleId},
                                        {userRoleId : {  $exists: false }}
                                    ]} 
                                ]}
                            ]
                            
                    }]
                }
            },
            {
                $sort: {
                    dateTime: -1
                }
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
            {
                $match: {
                    "user.isArchived": false
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "partnerId",
                    foreignField: "userId",
                    as: "partner"
                }
            },
            {
                $unwind: "$partner"
            },
            {
                $match: {
                    "partner.isArchived": false
                }
            },
            {
                $group: {
                    _id: "$status",
                    connection: {
                        $push: "$$ROOT"
                    }
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
            let result = {};
            data.forEach(function (data) {
                if (data._id === CONSTANTS.CONNECTION.ACCEPTED) {
                    return result[data._id] = data.connection.map(function (conData) {                       
                        if ((conData.userId !== parseInt(query.userId, 10) && conData.userRoleId ? 
                                                                conData.userRoleId !== roleId:null) 
                                      ||   conData.userId !== parseInt(query.userId, 10)                   
                                                            ) {
                                let user = conData['user'];
                                let partner = conData['partner'];
                                conData['partner'] = user;
                                conData['user'] = partner;
                        }                        
                        return conData;
                    });
                } else if (data._id === CONSTANTS.CONNECTION.REQUESTED) {
                    let resultArray = [];

                    let sentRequest = [];
                    data.connection.forEach(function (conData) {
                        if ((conData.partnerId === parseInt(query.userId, 10)
                                                && conData.partnerRoleId ? 
                                                conData.partnerRoleId !== roleId:null) ||
                                conData.partnerId === parseInt(query.userId, 10)
                               ) {
                            let user = conData['user'];
                            let partner = conData['partner'];
                            conData['partner'] = user;
                            conData['user'] = partner;
                            resultArray.push(conData);
                        } else if (conData.userId === parseInt(query.userId, 10)) {
                           sentRequest.push(conData);
                        }
                    })
                    if (resultArray.length > 0) {
                        result[data._id] = resultArray;
                    };
                    if (sentRequest.length > 0) {
                        result['sentRequest'] = sentRequest;
                    };
                } 
            })
            callback({
                status: REQUEST_CODES.SUCCESS,
                result: result
            });
        }
    });
}


function getConnectionListByStatus(query, callback) {  
    let queryJson= [];
    let roleId= query.roleId ? parseInt(query.roleId) : null;
   if(parseInt(query.status) == CONSTANTS.CONNECTION_STATUS.REQUESTED){
        queryJson=[
              { 
                $and:[{partnerId: parseInt(query.userId)},
                    {$or:[
                        {partnerRoleId: roleId},
                        {partnerRoleId : {  $exists: false }}
                    ]} 
                ]
              }
        ]
    }else if(parseInt(query.status) == CONSTANTS.CONNECTION_STATUS.SENT_REQUEST){
        queryJson=  [
                { 
                $and:[{userId: parseInt(query.userId)},   
                    {$or:[
                        {userRoleId: roleId},
                        {userRoleId : {  $exists: false }}
                    ]}         
                    ]
                }    
            ]
    }else{
        queryJson=  [{$or : [
            {$and:[{
                partnerId: parseInt(query.userId)
            }, {$or:[
                {partnerRoleId: roleId},
                {partnerRoleId : {  $exists: false }}
                ]} ]}
            
            ,{$and:[{
                userId: parseInt(query.userId)},
                {$or:[
                    {userRoleId: roleId},
                    {userRoleId : {  $exists: false }}
                ]}]
        }]}];
    }        

    ConnectionsModel.aggregate(
        [{
                $match: {
                    $and: [
                        queryJson[0]
                    ,                  
                    {status: { $eq: parseInt(query.status) == CONSTANTS.CONNECTION_STATUS.ACCEPTED ? CONSTANTS.CONNECTION.ACCEPTED
                    :(parseInt(query.status) == CONSTANTS.CONNECTION_STATUS.REQUESTED || parseInt(query.status) == CONSTANTS.CONNECTION_STATUS.SENT_REQUEST)
                      ? CONSTANTS.CONNECTION.REQUESTED
                    :CONSTANTS.CONNECTION.REJECTED
                    }}                 
                ]
                }
            },
            {
                $sort: {
                    dateTime: -1
                }
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
            {
                $match: {
                    "user.isArchived": false
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "partnerId",
                    foreignField: "userId",
                    as: "partner"
                }
            },
            {
                $unwind: "$partner"
            },
            {
                $match: {
                    "partner.isArchived": false
                }
            },
            {"$skip": query.skip*15 || 0 },
            {"$limit": 15 },   
            {
                $group: {
                    _id: "$status",
                    connection: {
                        $push: "$$ROOT"
                    }
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
            let result = {};
            data.forEach(function (resData) {
                if (resData._id === CONSTANTS.CONNECTION.ACCEPTED && parseInt(query.status) == CONSTANTS.CONNECTION_STATUS.ACCEPTED) {
                    return result[resData._id] = resData.connection.map(function (conData) {
                        if (conData.userId !== parseInt(query.userId, 10)) {
                            let user = conData['user'];
                            let partner = conData['partner'];
                            conData['partner'] = user;
                            conData['user'] = partner;
                        }
                        return conData;
                    });
                } 
              
                if (resData._id === CONSTANTS.CONNECTION.REQUESTED && (parseInt(query.status) == CONSTANTS.CONNECTION_STATUS.REQUESTED || parseInt(query.status) == CONSTANTS.CONNECTION_STATUS.SENT_REQUEST)) {
                    let resultArray = [];
                    let sentRequest = [];
                    resData.connection.forEach(function (conData) { 
                        if (conData.partnerId == parseInt(query.userId, 10) && parseInt(query.status) == CONSTANTS.CONNECTION_STATUS.REQUESTED) {
                          
                            let user = conData['user'];
                            let partner = conData['partner'];
                            conData['partner'] = user;
                            conData['user'] = partner;
                            resultArray.push(conData);
                           
                        } else if (conData.userId === parseInt(query.userId, 10) && parseInt(query.status) == CONSTANTS.CONNECTION_STATUS.SENT_REQUEST) {
                           sentRequest.push(conData);
                        }
                    })
                    if (resultArray.length > 0) {
                        result[resData._id] = resultArray;
                    };
                    if (sentRequest.length > 0) {
                        result['sentRequest'] = sentRequest;
                    };
                } 
            })
            callback({
                status: REQUEST_CODES.SUCCESS,
                result: result
            });
        }
    });
}

function getLimitedConnectionList(query, callback) {
    let roleId= query.roleId ? parseInt(query.roleId) : null;
    ConnectionsModel.aggregate(
        [{
                $match: {
                    $and: [{
                        $or: [  
                               {$and:[
                                        {
                                            partnerId: parseInt(query.userId)
                                        },
                                        {$or : [{
                                                partnerRoleId: roleId
                                            },{
                                                partnerRoleId : {  $exists: false }
                                            }
                                        ]}
                                    ]    
                                },
                                
                                {$and:[
                                    {
                                            userId: parseInt(query.userId)
                                        },                                       
                                        {$or : [{
                                                userRoleId: roleId
                                            },{
                                                userRoleId : {  $exists: false }
                                            }
                                        ]}
                                    ]    
                                },
                                ]
                    }]
                }
            },
            {
                $sort: {
                    dateTime: -1
                }
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
            {
                $match: {
                    "user.isArchived": false
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "partnerId",
                    foreignField: "userId",
                    as: "partner"
                }
            },
            {
                $unwind: "$partner"
            },
            {
                $match: {
                    "partner.isArchived": false
                }
            },
            {
                $group: {
                    _id: "$status",
                    connection: {
                        $push: "$$ROOT"
                    }
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
            let result = {},requestedCount=0,sentRequestCount=0;
            data.forEach(function (data) {
                if (data._id === CONSTANTS.CONNECTION.ACCEPTED) {
                    let resultAcceptedArray = [];                    
                   data.connection.forEach(function (conData) {
                        if (conData.userId !== parseInt(query.userId, 10)) {
                            let user = conData['user'];
                            let partner = conData['partner'];
                            conData['partner'] = user;
                            conData['user'] = partner;
                        }
                        if(resultAcceptedArray.length > 3){                           
                            return false
                        }
                        resultAcceptedArray.push(conData);
                    });
                    if (resultAcceptedArray.length > 0) {
                        result[data._id] = resultAcceptedArray;
                        result['acceptedCount']=  data.connection.length;
                    };
                } else if (data._id === CONSTANTS.CONNECTION.REQUESTED) {
                    let resultArray = [];
                    let sentRequest = [];

                    data.connection.forEach(function (conData) {
                        if(resultArray.length > 3 && sentRequest.length > 3){                           
                           return false
                        }
                        if (conData.partnerId === parseInt(query.userId, 10)) {
                            let user = conData['user'];
                            let partner = conData['partner'];
                            conData['partner'] = user;
                            conData['user'] = partner;
                            if(resultArray.length < 3){    
                                resultArray.push(conData);
                            } 
                            requestedCount=  requestedCount +1 ;   
                        } else if (conData.userId === parseInt(query.userId, 10)) {
                            if(sentRequest.length < 3){  
                               sentRequest.push(conData);
                            }   
                            sentRequestCount = sentRequestCount+1 ;   
                        }
                    })
                    if (resultArray.length > 0) {
                        result[data._id] = resultArray;
                        result['requestedCount'] = requestedCount;
                    };
                    if (sentRequest.length > 0) {
                        result['sentRequest'] = sentRequest;
                        result['sentRequestCount']= sentRequestCount
                    };
                } 
            })
            callback({
                status: REQUEST_CODES.SUCCESS,
                result: result
            });
        }
    });
}



function getChatList(query, callback) {
    let roleId= query.roleId ? parseInt(query.roleId) : null;
    ConnectionsModel.aggregate(
        [{
                $match: {
                    $and: [{
                           $or: [  
                               {$and:[
                                        {
                                            partnerId: parseInt(query.userId)
                                        },
                                        {$or : [{
                                                partnerRoleId: roleId
                                            },{
                                                partnerRoleId : {  $exists: false }
                                            }
                                        ]}
                                    ]    
                                },
                                
                                {$and:[
                                    {
                                            userId: parseInt(query.userId)
                                        },
                                        {$or : [{
                                            userRoleId: roleId
                                            },{
                                                userRoleId : {  $exists: false }
                                            }
                                        ]}                                        
                                    ]    
                                },
                                ]
                        },
                    {
                        status: {
                            $eq: 'Accepted'
                        }
                    }]
                }
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
            {
                $match: {
                    "user.isArchived": false
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "partnerId",
                    foreignField: "userId",
                    as: "partner"
                }
            },
            {
                $unwind: "$partner"
            },
            {
                $match: {
                    "partner.isArchived": false
                }
            },
            {
                $group: {
                    _id: "$status",
                    connection: {
                        $push: "$$ROOT"
                    }
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
            let result = {};
            data.forEach(function (data) {
                if (data._id === CONSTANTS.CONNECTION.ACCEPTED) {
                    return result[data._id] = data.connection.map(function (conData) {
                        conData['status'] = "";
                        if (conData.userId !== parseInt(query.userId, 10)) {
                            conData['partner'] = conData['user'];
                        }
                        return conData;
                    });
                } else {
                    return result[data._id] = data.connection;
                }
            });
            callback({
                status: REQUEST_CODES.SUCCESS,
                result: result
            });
        }
    });
}

function update(connection, callback) {
    ConnectionsModel.update({
        'connectId': connection.connectId
    }, {
        $set: connection
    }, function (error) {
        if (error) {
            callback({
                status: REQUEST_CODES.FAIL,
                error: error
            });
            return;
        } else {
            callback({
                status: REQUEST_CODES.SUCCESS,
                message: CONNECTION_CODES.UPDATE_SUCCESS
            });
            return;

        }
    });
}

function remove(query, callback) {
    let userId= query.userId ? parseInt(query.userId):null;

    let connectId= query.connectId;

    if(userId){
        user.getList({userId:  userId},function(res){
        let user= res.result[0];       
        getList({connectId: connectId},function(connectRes){
            let connectData= connectRes.result[0];
            let partnerId=null;
            if(connectData.userId == userId){
                partnerId= connectData.partnerId;
            }else{
                partnerId= connectData.userId;
            }
            let parentList= user.parents;
            let parentIndex= parentList.findIndex(todo => todo.userId == partnerId );
            if(parentIndex !== -1){
                if (user.dob && utils.calculateAge(new Date(user.dob), new Date()) < USER_CODES.STUDENT_MININUM_REQUIRED_AGE){
                    callback({
                        status: REQUEST_CODES.SUCCESS,
                        message: CONNECTION_CODES.PARENT_REMOVE_MINOR
                    });
                    return;
                }
            }else{
                ConnectionsModel.remove(query, function (error) {
                    if (error) {
                        callback({
                            status: REQUEST_CODES.FAIL,
                            error: error
                        });
                        return;
                    } else {
                        callback({
                            status: REQUEST_CODES.SUCCESS,
                            message: CONNECTION_CODES.DELETE_SUCCESS
                        });
                        return;
                    }
                });
            }  
        })
        })   
    }else{
        ConnectionsModel.remove(query, function (error) {
            if (error) {
                callback({
                    status: REQUEST_CODES.FAIL,
                    error: error
                });
                return;
            } else {
                callback({
                    status: REQUEST_CODES.SUCCESS,
                    message: CONNECTION_CODES.DELETE_SUCCESS
                });
                return;
            }
        });
    } 
}

function getCustomList(query, callback) {
    let roleId= query.roleId ? parseInt(query.roleId) : null;
    var query1 = {
        $and:[{userId: parseInt(query.partnerId)},
                    {$or : [{
                        partnerRoleId: query.partnerRoleId ? parseInt(query.partnerRoleId): null
                    },{
                        partnerRoleId : {  $exists: false }
                    }
                ]}
              ], 
        $and:[{partnerId: parseInt(query.userId)},            
              {$or : [{
                    userRoleId: query.userRoleId ? parseInt(query.userRoleId): null 
                },{
                    userRoleId : {  $exists: false }
                }
            ]} 
        ]
    }
    ConnectionsModel.find(query, function (error, records) {
        if (error) {
            callback({
                status: REQUEST_CODES.FAIL,
                error: error
            });
            return;
        } else if (records.length > 0) {
            records = records.map(function (records) {
                return new ConnectionsController.ConnectionsAPI(records);
            });
            callback({
                status: REQUEST_CODES.SUCCESS,
                result: records
            });
            return;
        } else {
            ConnectionsModel.find(query1, function (error, records) {
                if (error) {
                    logger.error('getCustomList method --> error');
                    callback({
                        status: REQUEST_CODES.FAIL,
                        error: error
                    });
                    return;
                } else {
                    records = records.map(function (records) {
                        return new ConnectionsController.ConnectionsAPI(records);
                    });
                    callback({
                        status: REQUEST_CODES.SUCCESS,
                        result: records
                    });
                    return;
                }
            });
        }
    });
}

function getMutualFriendList(mutualUserId, callback) {
    user.getList({
        userId: {
            $in: mutualUserId
        }
    }, function (conRec) {
        callback(
            conRec.result
        );
    });
}

function getConnectionCount(studentList,roleId, callback) {  
    var d = new Date();
    d.setDate(d.getDate()-7);
   return ConnectionsModel.aggregate([     
        { 
            $match:{                     
               $and:[{$or:
                [{$and:[{partnerId: { $in:studentList}},
                  {$or:[{partnerRoleId : USER_CODES.STUDENT_ROLE },{partnerRoleId : {  $exists: false }}]} 
                ]},
               {$and:[{userId: { $in:studentList}},               
                    {$or:[{userRoleId : USER_CODES.STUDENT_ROLE},{userRoleId : {  $exists: false }}]} 
                 ]}               
                  ]}, { status: {
                $eq: CONSTANTS.CONNECTION.ACCEPTED
            }},
            {dateTime:{$gte: d.getTime()}} ]             
            }
          }
    // // Group by each tag
    //  { "$group": {
    //      _id: "$partnerId",
    //      "count": { "$sum": 1 }
    //  }},

    //  // Rename the _id for your output
    //  { "$project": {
    //     "_id": 0,
    //     "userId": "$_id",
    //     "count": 1
    //  }}
    ]).exec();
}

function getRequestedConnections(data,callback) {
    let userId= parseInt(data.userId);     
    let roleId= data.roleId ?  parseInt(data.roleId) : null;     
    var d = new Date();
    d.setDate(d.getDate()-7);
    
    let resQuery=[];
    if(data.roleId){
        resQuery= [
            {
                $or:[{$and:[{partnerId: userId},{$or:[{partnerRoleId:USER_CODES.STUDENT_ROLE},
                    {partnerRoleId : {  $exists: false }} ]} ]},
                  {$and:[{userId:userId},{$or:[{userRoleId:USER_CODES.STUDENT_ROLE},
                       {userRoleId : {  $exists: false }}]}  ]}
                 ]
            } 
        ]
    }else{
        resQuery= [
            {
                $or:[{partnerId: userId},
                {userId:userId}
               ]
            } 
        ]
    } 
 
    return ConnectionsModel.aggregate([     
        { 
            $match:{                     
               $and:[
                    resQuery[0]
                     , { status: {
                        $eq: 'Accepted'
                    }},
                   {dateTime: {$gte: d.getTime()}}
                ]             
            }
          },
          {
            $sort:{ dateTime: -1 }
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
            $match: {
                "user.isArchived": false
            }
        },
        { 
            $lookup: {
                from: "users",
                localField: "partnerId",
                foreignField: "userId",
                as: "partnerUser"
            }
        },
        {
            $match: {
                "partnerUser.isArchived": false
            }
        },
    
    ]).exec(function (error, data) {
        if (error) {
            callback({
                status: REQUEST_CODES.FAIL,
                message: error
            });
        } else { 
           
            let resResult= []; 
       
            user.getList({userId:userId},function(userRes){             
                let user= userRes.result[0];
                
                data.forEach(function(dataRes){
                   let resResultJson={};
                   resResultJson['actedBy']= user.firstName + " "+(user.lastName ? user.lastName: "");
                   resResultJson['profileImage']= user.profilePicture;
                   resResultJson['message1']= " became new connection with "
                
                   let userArr= dataRes.user[0];                  
                   if(userId ==userArr.userId){                    
                     let postedByUserRes1= dataRes.partnerUser[0];
                     resResultJson['actedOn']= postedByUserRes1.firstName + ' ' + (postedByUserRes1.lastName ? postedByUserRes1.lastName: "");
                   }else{
                    let postedByUserRes= dataRes.user[0];
                    resResultJson['actedOn']= postedByUserRes.firstName + ' ' + (postedByUserRes.lastName ? postedByUserRes.lastName: "");
                   }
                   resResultJson['actedUserId']= user.userId;
                   resResultJson['actedRoleId']= user.roleId;
                   resResultJson['message2']= "."                 
                   resResult.push(resResultJson);
                }) 
            callback({
                status: REQUEST_CODES.SUCCESS,
                result: resResult
            });
        }) 
        }
    })    
}




 function getChatMessageCount(studentListAll,roleId, callback) {  

    var d = new Date();
    d.setDate(d.getDate()-7);
    return ConnectionsModel.aggregate([     
         { 
             $match:{                     
                $and:[{$or:[{$and:[{partnerId: { $in:studentListAll}},                      
                        {$or:[{partnerRoleId :USER_CODES.STUDENT_ROLE},{partnerRoleId : {  $exists: false }}]}                
                     ]},
                    
                    {$and:[{userId: { $in:studentListAll}},                     
                        {$or:[{userRoleId : USER_CODES.STUDENT_ROLE},{userRoleId : {  $exists: false }}]} 
                      ]}                     
                    ]}, { status: {
                 $eq: 'Accepted'
             }}]             
             }
         },
         { 
            $lookup: {
                from: "message",
                localField: "connectId",
                foreignField: "connectorId",
                as: "messageUser"
            }
        },
        {"$unwind":"$messageUser"},
        {
            $match:{
                "messageUser.time": {$gte: d.getTime()}
            }
         },
    //  // Group by each tag
    //   { "$group": {
    //       _id: "$partnerId",
    //       "count": { "$sum": 1 }
    //   }}, 
    //   // Rename the _id for your output
    //   { "$project": {
    //      "_id": 0,
    //      "partnerId": "$_id",
    //      "count": 1
    //   }}
     ]).exec();     
 }

 function getChatMessageInfo(data,callback) {  
    let userId= parseInt(data.userId);   
    let roleId= data.roleId ? parseInt(data.roleId) : null;   
    var d = new Date();
    d.setDate(d.getDate()-7);

    let resQuery=[];
  //  if(data.roleId){
        resQuery= [
            {
                $or:[{$and:[{partnerId: userId},
                    {$or:[{partnerRoleId: USER_CODES.STUDENT_ROLE},
                        {partnerRoleId : {  $exists: false }}]}
                ]},
                  {$and:[{userId:userId},                    
                        {$or:[{userRoleId: USER_CODES.STUDENT_ROLE},
                            {userRoleId : {  $exists: false }}
                      ]}
                   ]}
                 ]
            } 
        ]
    // }else{
    //     resQuery= [
    //         {
    //             $or:[{partnerId: userId},
    //             {userId:userId}
    //            ]
    //         } 
    //     ]
    // } 

    return ConnectionsModel.aggregate([     
         { 
             $match:{                     
                $and:[
                    resQuery[0]
                         ,
                     { status: {
                 $eq: 'Accepted'
             }}]             
             }
         },
         { 
            $lookup: {
                from: "message",
                localField: "connectId",
                foreignField: "connectorId",
                as: "messageUser"
            }
        },
        {"$unwind":"$messageUser"},
        {
            $match:{
                "messageUser.time": {$gte: d.getTime()}
            }
         },
     // Group by each tag
      { "$group": {
          _id: "$partnerId",
          "count": { "$sum": 1 }
      }}, 
      // Rename the _id for your output
      { "$project": {
         "_id": 0,
         "partnerId": "$_id",
         "count": 1
      }}
     ]).exec(function (error, data) {
        if (error) {
            callback({
                status: REQUEST_CODES.FAIL,
                message: error
            });
        } else {          
            let resResult= []; 
       
            user.getList({userId:userId},function(userRes){             
                let user= userRes.result[0];
                
                data.forEach(function(dataRes){
                   let resResultJson={};
                   resResultJson['actedBy']= user.firstName + " "+(user.lastName ? user.lastName: "");
                   resResultJson['profileImage']= user.profilePicture;
                   resResultJson['message1']=' have '+dataRes.count+" chats";
                   
                resResultJson['actedOn']= "";
                
                resResultJson['actedUserId']= user.userId;
                resResultJson['actedRoleId']= user.roleId;
                resResultJson['message2']= "."              
                resResult.push(resResultJson);
                }) 
            callback({
                status: REQUEST_CODES.SUCCESS,
                result: resResult
            });       
        })
    }
    })      
 }



 function getMessagesOfPartner(studentListAll,roleId, callback) {      
    var d = new Date();
    d.setDate(d.getDate()-7);  
    let m= d.getTime();
    return ConnectionsModel.aggregate([     
        { 
            $match:{                     
               $and:[{$or:[
                {$and:[{partnerId: { $in:studentListAll}},
                    {$or:[{partnerRoleId: USER_CODES.STUDENT_ROLE},
                        {partnerRoleId : {  $exists: false }}
                    ]}
                ]},
            {$and:[{userId: { $in:studentListAll}},
                
                    // {userRoleId:parseInt(roleId)}
                ]}
                 ]}, { status: {
                $eq: 'Accepted'
            }}]             
            }
        },
        { 
           $lookup: {
               from: "message",
               localField: "connectId",
               foreignField: "connectorId",
               as: "messageUser"
           }
       },      
       {$unwind: { path: "$messageUser" }},
        {
            $match:{
                "messageUser.time": {$gte: d.getTime()}
            }
        },
        {$sort: {"messageUser.time": -1}}   
   ]).exec();   
 }


 function getMessagesOfPartnerInfo(data, callback) {  
    let userId= parseInt(data.userId);   
    let roleId= data.roleId ?  parseInt(data.roleId) : null;   
    var d = new Date();
    d.setDate(d.getDate()-7);
     ConnectionsModel.aggregate([     
        { 
            $match:{                     
               $and:[{$or:[
                {$and:[{partnerId: userId},
                    {$or:[{partnerRoleId: USER_CODES.STUDENT_ROLE},
                        {partnerRoleId : {  $exists: false }}]}
                 ]},
                {$and:[{userId: userId},                   
                    {$or:[{userRoleId: USER_CODES.STUDENT_ROLE},
                        {userRoleId : {  $exists: false }}]}
                   ]}
                ]}, { status: {
                $eq: 'Accepted'
            }}]             
            }
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
            $match: {
                "user.isArchived": false
            }
        },       
        { 
            $lookup: {
                from: "users",
                localField: "partnerId",
                foreignField: "userId",
                as: "partner"
            }
        },
        {
            $match: {
                "partner.isArchived": false
            }
        },    
        {$unwind: { path: "$partner" }}, 
        { 
            $lookup: {
                from: "message",
                localField: "connectId",
                foreignField: "connectorId",
                as: "messageUser"
            }
        }, 
        {$unwind: { path: "$messageUser" }}, 
        { 
            $match:{                     
                "messageUser.time": {$gte: d.getTime()}                         
            }
        },   
         
        { "$group": {  "_id":{ _id: "$messageUser.connectorId", "partner": "$partner","user":"$user"},
        
        "count": { "$sum": 1 }}},
        { "$sort": { "count": -1 } },
        { "$limit": 3 },
        // Rename the _id for your output
        { "$project": {"_id": 0,
            "comments.userId": "$_id._id",
            "partnerUserId":  "$_id.partner.userId",
            "partnerFirstName" : "$_id.partner.firstName",
            "partnerLastName" : "$_id.partner.lastName",
            "firstName" : "$_id.user.firstName",
            "lastName" : "$_id.user.lastName",
             "count": 1}}    
       
     ]).exec(function (error, data) {
        if (error) {
            callback({
                status: REQUEST_CODES.FAIL,
                message: error
            });
        } else {            
            let resResult= []; 
       
             user.getList({userId:userId},function(userRes){             
                let user= userRes.result[0];
                
                data.forEach(function(dataRes){
                   let resResultJson={};
                   resResultJson['actedBy']= user.firstName + " "+(user.lastName ? user.lastName: "");
                   resResultJson['profileImage']= user.profilePicture;
                   
                   resResultJson['message1']=' had '+dataRes.count+" conversation with ";

                
                   if(dataRes.partnerUserId == user.userId)
                     resResultJson['actedOn']= dataRes.firstName + ' ' + (dataRes.lastName ? dataRes.lastName: "");   
                   else 
                     resResultJson['actedOn']= dataRes.partnerFirstName + ' ' + (dataRes.partnerLastName ? dataRes.partnerLastName: "");                   
                   resResultJson['actedUserId']= user.userId;
                   resResultJson['actedRoleId']= USER_CODES.STUDENT_ROLE;
                   resResultJson['message2']= "."

                   resResult.push(resResultJson);
               }) 
            callback({
                status: REQUEST_CODES.SUCCESS,
                result: resResult
            });       
        })
    }
    })      
 }

 //Multiple Invitation in connection for both user and email
function addMultipleMembersForConnection(body, callback) {   

    let users = body.users;
    let nonuserEmails = body.nonusers;
    let userId= parseInt(body.userId);
    let invitedBy = body.invitedBy;    

    let userList=[];
    
    users.forEach(function(data){
        userList.push(parseInt(data.userId));
    })
   
        user.getList({userId:{$in:userList}},function(userRes){             
            let userResList= userRes.result;
           
            userResList.forEach(function (data) {
               getList({
                        $or:[
                            {$and:[
                                {$and:[{userId:userId},                                                  
                                 {partnerId: parseInt(data.userId)},
                                ]},                   
                            
                              {$and:[
                                    {userId:parseInt(data.userId)},                                                                  
                                 {partnerId: userId}                                                    
                                
                        ]}]}] 
                       },function(conRes){
                      
                         if(conRes.result.length == 0){                          
                            let connectionRequest = {
                                userId: userId,
                                partnerId: parseInt(data.userId),
                                dateTime: utils.getSystemTime(),
                                status: utils.CONSTANTS.CONNECTION.ACCEPTED,
                                isActive: true
                              };
                             
                             create(connectionRequest, function (res) {
                                callback({
                                    status: REQUEST_CODES.SUCCESS,
                                    message: CONNECTION_CODES.CREATE_SUCCESS                                                   
                                });         
                              });   

                         }
                       })
                    })
                })

  
                if (nonuserEmails && nonuserEmails.length > 0) {
                
                    let emailArr= [];                   
                    nonuserEmails.forEach(function(data){
                        emailArr.push(data.email);
                    });                  
                    user.getUserListByEmails(emailArr, function (res){
                        if (nonuserEmails.length > 0) {                       
                            nonuserEmails.forEach(function(data){
                                let emailIndexPresent= res.result.findIndex(todo => todo.email == data.email);                                
                                if(emailIndexPresent !==-1){             
                                    let requestedUserId = res.result[emailIndexPresent].userId;
                                        // need to check if this userId already in group memeberlist.                                        
                                                                         
                                            let connectionRequest = {
                                                userId: userId,
                                                partnerId: requestedUserId,
                                                dateTime: utils.getSystemTime(),
                                                status: utils.CONSTANTS.CONNECTION.ACCEPTED,
                                                isActive: true
                                              };                                          
                                             create(connectionRequest, function (res) {
                                                callback({
                                                    status: REQUEST_CODES.SUCCESS,
                                                    message: CONNECTION_CODES.CREATE_SUCCESS                                                   
                                                });                                                
                                              });                                         
                                    }
                            else {
                                let newMember = {
                                    firstName: data.firstName,
                                    lastName: data.lastName,
                                    roleId: USER_CODES.STUDENT_ROLE,
                                    email: data.email,
                                    title: '',
                                    isActive: true,
                                    sendingEmail: false,
                                    isPasswordChanged: true
                                };
                                user.create(newMember, function (resp) {                                 
                                    if (resp.status == REQUEST_CODES.SUCCESS) {                                         
                                   
                                        let connectionRequest = {
                                            userId: userId,
                                            partnerId: resp.userId,
                                            dateTime: utils.getSystemTime(),
                                            status: utils.CONSTANTS.CONNECTION.ACCEPTED,
                                            isActive: true
                                          };
                                         create(connectionRequest, function (res) {
                                            callback({
                                                status: REQUEST_CODES.SUCCESS,
                                                message: CONNECTION_CODES.CREATE_SUCCESS                                                   
                                            });                                            
                                          });                                  
                                    } else {
                                        callback({
                                            status: REQUEST_CODES.FAIL,
                                            message: resp.message
                                        });
                                        return;
                                    }
                                });
                            }
                        }) 
                       }
                    });
                }                   
                else {
                    callback({
                        status: REQUEST_CODES.FAIL,
                        message: REQUEST_CODES.MISSING_MANDATORY
                    });
                }
}

 

module.exports.getList = getList;
module.exports.create = create;
module.exports.update = update;
module.exports.getChatList = getChatList;
module.exports.getMutualFriendList = getMutualFriendList;
module.exports.getSearchConnectionList = getSearchConnectionList;
module.exports.createConnectionForParentAddStudent = createConnectionForParentAddStudent;
module.exports.getConnectionCount = getConnectionCount;
module.exports.getRequestedConnections = getRequestedConnections;
module.exports.getChatMessageCount = getChatMessageCount;
module.exports.getChatMessageInfo = getChatMessageInfo;
module.exports.getMessagesOfPartner = getMessagesOfPartner;
module.exports.getMessagesOfPartnerInfo = getMessagesOfPartnerInfo;


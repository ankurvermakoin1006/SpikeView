module.exports = function (app) {
    app.post('/ui/message', function (req, res) { //To create Message
        try {
            saveChatHistory(req.body, function (response) {
                res.json(response);
            });
        } catch (e) {
            res.json(e);
        }
    });
    app.get('/ui/message', function (req, res) { //To get Message
        try {
            getChatHistory(req.query, function (response) {
                res.json(response);
            });
        } catch (e) {
            res.json(e);
        }
    });
    app.get('/ui/message/chatHistory', function (req, res) { //To get Message
        try {
            getUpdatedChatHistory(req.query, function (response) {
                res.json(response);
            });
        } catch (e) {
            res.json(e);
        }
    });
    app.put('/ui/message', function (req, res) { //To Update Message
        try {
            update(req.body, function (response) {
                res.json(response);
            });
        } catch (e) {
            res.json(e);
        }
    });
    app.delete('/ui/message', function (req, res) { //To remove Message
        try {
            remove(req.body, function (response) {
                res.json(response);
            });
        } catch (e) {
            res.json(e);
        }
    });
    app.delete('/ui/messages', function (req, res) { //To remove multiple Messages
        try {
            removeMany(req.body, function (response) {
                res.json(response);
            });
        } catch (e) {
            res.json(e);
        }
    });
    app.delete('/ui/messages/deleteMessage', function (req, res) { //To remove multiple Messages
        try {
            deleteMessage(req.body, function (response) {
                res.json(response);
            });
        } catch (e) {
            res.json(e);
        }
    });
    app.get('/ui/message/friendList/info', function (req, res) {
        try {
            getFriendListWithLastMessageAndUnreadCountDetails(req.query, function (response) {
                res.json(response);
            });
        } catch (e) {
            res.json(e);
        }
    });
    app.get('/ui/message/spikeViewBotFriend/info', function (req, res) {
        try {
            getSpikeViewBoatWithLastMessageAndUnreadCountDetails(req.query, function (response) {
                res.json(response);
            });
        } catch (e) {
            res.json(e);
        }
    });
}

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var MessageSchema = new Schema(require('./messageSchema').messageSchema, {
    collection: 'message'
});
var MessageModel = mongoose.model('message', MessageSchema);
var MessageController = require('./messageController');
var MessageCount = require('./messageCount');
var utils = require('../../commons/utils').utils;
var Connection = require('../connection/connections');
var Users = require('../users/users');
var mongoUtils = utils.mongoUtils;
var CONSTANTS = utils.CONSTANTS;
var REQUEST_CODES = CONSTANTS.REQUEST_CODES;
var MESSAGE_CODES = utils.CONSTANTS.MESSAGE;
var FCM = require('../pushNotification/fcm');
var login = require('../login/login');
var _ = require('underscore');
var logger = require('../../logger.js');
var USER_CODES = utils.CONSTANTS.USERS;

function getChatHistory(query, callback) {
    var messageCount = {
        'connectorId': query.connectorId,
        'count': 0
    }
    MessageCount.update(messageCount, function (resp) {        
        getList(query, callback);
    });
}


function getUpdatedChatHistory(query, callback) {
    var messageCount = {
        'connectorId': query.connectorId,
        'count': 0
    }
    let mongoQuery={
        'connectorId': query.connectorId,
        'deletedBy':{$ne:query.userId}
    }
    MessageCount.update(messageCount, function (resp) {        
        getList(mongoQuery, callback);
    });
}

function getFriendListWithLastMessageAndUnreadCountDetails(query, callback) {
    var friendList = [];
    var friendListWithLastMessageAndCountInfo = null;

    Connection.getChatList(query, function (res) {
        //logger.info('res.result.Accepted', res.result);
        if (res.status == REQUEST_CODES.SUCCESS) {
            let connectIds = _.pluck(res.result.Accepted, 'connectId');
            MessageCount.getList({
                connectorId: {
                    $in: connectIds
                },
                deleteBy: {$ne: parseInt(query.userId, 10)}
            }, function (resp) {
                if (resp.status == REQUEST_CODES.SUCCESS) {
                    friendListWithLastMessageAndCountInfo = resp.result;
                } else {
                    callback({
                        status: REQUEST_CODES.FAIL,
                        message: resp.message
                    });
                    return;
                }
                //logger.info('res.result.Accepted', res.result);
                let spikeViewBotFriend=null,partnerListForActiveStatus=[];
                _.forEach(res.result.Accepted, function (connection) {
                    let friend = {};                  
             //       if(connection.userId !== CONSTANTS.USERS.BOTID && connection.partnerId !== CONSTANTS.USERS.BOTID){ spikeview bot connection add code
                        if (connection.userId !== parseInt(query.userId, 10)) {
                            friend.connectId = connection.connectId,
                                friend.userId = connection.partnerId,
                                friend.firstName = connection.partner.firstName;
                            friend.lastName = connection.partner.lastName;
                            friend.profilePicture = connection.partner.profilePicture;
                            partnerListForActiveStatus.push(parseInt(connection.userId));
                            friend.partnerId = connection.userId,
                                friend.partnerFirstName = connection.user.firstName;
                            friend.partnerLastName = connection.user.lastName;
                            friend.partnerProfilePicture = connection.user.profilePicture;
                        } else {
                            friend.connectId = connection.connectId,
                                friend.userId = connection.userId,
                                friend.firstName = connection.user.firstName;
                            friend.lastName = connection.user.lastName;
                            friend.profilePicture = connection.user.profilePicture;
                            partnerListForActiveStatus.push(parseInt(connection.partnerId));
                            friend.partnerId = connection.partnerId,
                                friend.partnerFirstName = connection.partner.firstName;
                            friend.partnerLastName = connection.partner.lastName;
                            friend.partnerProfilePicture = connection.partner.profilePicture;
                        }
                        friend.lastMessage = '';
                        friend.unreadMessages = 0;
                        friend.lastTime = 0;
                        _.forEach(friendListWithLastMessageAndCountInfo, function (messageCount) {
                            if (connection.connectId == messageCount.connectorId) {                                
                                friend.textSentBy= messageCount.sender;                               
                                friend.lastMessage = messageCount.text;
                                friend.lastTime = messageCount.time;
                                if (parseInt(query.userId, 10) !== messageCount.sender)
                                    friend.unreadMessages = messageCount.count;
                                return;
                            }
                        })                   
                        if(connection.partnerId === CONSTANTS.USERS.BOTID && parseInt(query.userId,10) !== CONSTANTS.USERS.BOTID){                          
                            spikeViewBotFriend= friend;                            
                        }else{
                            friendList.push(friend);
                        }    
                 //      }
                    });                 
               
                Users.getList({$and:[{userId:{$in:partnerListForActiveStatus}},{isArchived:false}]},function(userRes){                                     
                    if(userRes.result.length > 0){
                        let userList= userRes.result;
                        friendList= friendList.map(function(item){                        
                            let index= userList.findIndex(todo => todo.userId == item.partnerId);                           
                            if(index !== -1){
                                item['isActive']= userList[index].isActive;                              
                            }    
                            return item;
                        })
                
                        //logger.info('res.result.Accepted', res.result.Accepted);
                        if (res.result.Accepted && (res.result.Accepted.length == friendList.length)) {
                        //    friendList.sort(function (a, b) {
                        //         if (a.lastTime < b.lastTime) return 1;
                        //         if (a.lastTime > b.lastTime) return -1;
                        //         return 0;
                        //     })
                        friendList=  friendList.sort(function(a, b) {
                                return b.lastTime - a.lastTime;
                            });   

                            if(spikeViewBotFriend) 
                            friendList.unshift(spikeViewBotFriend);
                            callback({
                                status: REQUEST_CODES.SUCCESS,
                                result: friendList  //default return value (no sorting)
                                
                            });
                            return;
                        } else {
                            friendList=  friendList.sort(function(a, b) {
                                return b.lastTime - a.lastTime;
                            }); 

                            if(spikeViewBotFriend)                    
                                friendList.unshift(spikeViewBotFriend);                      
                            
                            callback({
                                status: REQUEST_CODES.SUCCESS,
                                result: friendList
                            });
                            return;
                        }
                    }
                })
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

function getSpikeViewBoatWithLastMessageAndUnreadCountDetails(query, callback) {
    var friendList = [];
    var friendListWithLastMessageAndCountInfo = null;

    Connection.getChatList(query, function (res) {
        //logger.info('res.result.Accepted', res.result);
        if (res.status == REQUEST_CODES.SUCCESS) {
            let connectIds = _.pluck(res.result.Accepted, 'connectId');
            MessageCount.getList({
                connectorId: {
                    $in: connectIds
                },
                deleteBy: {$ne: parseInt(query.userId, 10)}
            }, function (resp) {
                if (resp.status == REQUEST_CODES.SUCCESS) {
                    friendListWithLastMessageAndCountInfo = resp.result;
                } else {
                    callback({
                        status: REQUEST_CODES.FAIL,
                        message: resp.message
                    });
                    return;
                }
                //logger.info('res.result.Accepted', res.result);
                _.forEach(res.result.Accepted, function (connection) {
                    let friend = {};
                    if(connection.partnerId === CONSTANTS.USERS.BOTID){
                        if (connection.userId !== parseInt(query.userId, 10)) {
                            friend.connectId = connection.connectId,
                                friend.userId = connection.partnerId,
                                friend.firstName = connection.partner.firstName;
                            friend.lastName = connection.partner.lastName;
                            friend.profilePicture = connection.partner.profilePicture;

                            friend.partnerId = connection.userId,
                                friend.partnerFirstName = connection.user.firstName;
                            friend.partnerLastName = connection.user.lastName;
                            friend.partnerProfilePicture = connection.user.profilePicture;
                        } else {
                            friend.connectId = connection.connectId,
                                friend.userId = connection.userId,
                                friend.firstName = connection.user.firstName;
                            friend.lastName = connection.user.lastName;
                            friend.profilePicture = connection.user.profilePicture;

                            friend.partnerId = connection.partnerId,
                                friend.partnerFirstName = connection.partner.firstName;
                            friend.partnerLastName = connection.partner.lastName;
                            friend.partnerProfilePicture = connection.partner.profilePicture;
                        }
                        friend.lastMessage = '';
                        friend.unreadMessages = 0;
                        friend.lastTime = 0;
                        _.forEach(friendListWithLastMessageAndCountInfo, function (messageCount) {
                            if (connection.connectId == messageCount.connectorId) {
                                friend.lastMessage = messageCount.text;
                                friend.lastTime = messageCount.time;
                                if (parseInt(query.userId, 10) !== messageCount.sender)
                                    friend.unreadMessages = messageCount.count;
                                return;
                            }
                        })

                        friendList.push(friend);
                       }
                    });
                 
                //logger.info('res.result.Accepted', res.result.Accepted);
                if (res.result.Accepted && (res.result.Accepted.length == friendList.length)) {
                    callback({
                        status: REQUEST_CODES.SUCCESS,
                        result: friendList.sort(function (a, b) {
                            if (a.lastTime < b.lastTime) return 1;
                            if (a.lastTime > b.lastTime) return -1;
                            return 0; //default return value (no sorting)
                        })
                    });
                    return;
                } else {
                    callback({
                        status: REQUEST_CODES.SUCCESS,
                        result: friendList
                    });
                    return;
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

function saveChatHistory(data, callback) {
    // send mobile notification and save history.
    let Header = require('../header/header');
    let headerRequest = {
        userId: data.receiver,
        connectionCount: '',
        messagingCount: 1,
        notificationCount: ''
    };
    Header.update(headerRequest, function (res) {
        logger.info('header updated', res.status);
    });
    login.getDeviceIds(parseInt(data.receiver), function (resp) {
        deviceIds = resp.result;
        var message = {
            deviceIds: deviceIds,
            userId: data.receiver,
            name: 'spikeview',
            body: 'you have a spikeview message.',
            textName: '',
            textMessage : 'you have a spikeview message.'
        };
        FCM.sendPushNotification(message);
        data.text= data.text.trim();
        create(data, function (resp) {
            if (resp.status == REQUEST_CODES.SUCCESS) {
                MessageCount.createLastMessageAndReadCount(data, callback);
            } else {
                callback({
                    status: REQUEST_CODES.FAIL,
                    message: resp.message
                });
                return;
            }
        });
    });
}

function saveBroadCasetChatHistory(data, callback) {
    // send mobile notification and save history.
    let Header = require('../header/header');
    let headerRequest = {
        userId: data.receiver,
        connectionCount: '',
        messagingCount: 1,
        notificationCount: ''
    };
    Header.update(headerRequest, function (res) {
        logger.info('header updated', res.status);
    });
    login.getDeviceIds(parseInt(data.receiver), function (resp) {
        deviceIds = resp.result;
        var message = {
            deviceIds: deviceIds,
            userId: data.receiver,
            name: 'spikeview',
            body: 'you have a spikeview message.',
            textName: '',
            textMessage : 'you have a spikeview message.'
        };
        FCM.sendPushNotification(message);
        data.text= data.text.trim();
        Connection.getList({$and : [{$or: [ { userId: USER_CODES.BOTID}, { partnerId: USER_CODES.BOTID } ]},
           {status: { $in:[CONSTANTS.CONNECTION.ACCEPTED]}}]}, function (conRec) {   
                    let connectedUserId = [];        

                    conRec.result && conRec.result.forEach(function(data){              
                    connectedUserId.push({receiver:parseInt(data['userId'],10) === USER_CODES.BOTID ? data['partnerId'] : data['userId'],connectId:data.connectId});
                    }); 
                  
           connectedUserId.forEach(function(item){            
            let data1 = {     
                connectorId: item.connectId,         
                sender:  data.sender,
                receiver:item.receiver,
                text:data.text,
                time:data.time,
                type: 1
              };              
            create(data1, function (res) {                   
                logger.info('connection created : ', res.status);
                if (resp.status == REQUEST_CODES.SUCCESS) {
                    MessageCount.createLastMessageAndReadCount(data1, function (res) { 
                    if (resp.status == REQUEST_CODES.SUCCESS) {
                      
                    }
                })}
              });
        })
        callback({
                        status: REQUEST_CODES.FAIL,
                        message: resp.message
                    });
                    return;

        // create(data, function (resp) {
        //     if (resp.status == REQUEST_CODES.SUCCESS) {
        //         MessageCount.createLastMessageAndReadCount(data, callback);
        //     } else {
        //         callback({
        //             status: REQUEST_CODES.FAIL,
        //             message: resp.message
        //         });
        //         return;
        //     }
         });
    });
}



function getList(query, callback) {
    MessageModel.find(query, function (error, records) {
        if (error) {
            callback({
                status: REQUEST_CODES.FAIL,
                message: error
            });
            return;
        } else {
            records = records.map(function (record) {
                return new MessageController.MessageAPI(record);
            });

            callback({
                status: REQUEST_CODES.SUCCESS,
                result: records
            });
            return;
        }
    });
}

function create(message, callback) {
    var messageAPI;
    var errorList = [];
    message['time'] = (new Date()).getTime();
    try {
        messageAPI = MessageController.MessageAPI(message);
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
        var messageModel = new MessageModel(messageAPI);
        mongoUtils.getNextSequence('messageId', function (oSeq) {
            messageModel.messageId = oSeq;
            messageModel.save(function (error) {
                if (error) {
                    callback({
                        status: REQUEST_CODES.FAIL,
                        message: error
                    });
                    return;
                } else {
                    callback({
                        status: REQUEST_CODES.SUCCESS,
                        message: utils.formatText(MESSAGE_CODES.CREATE_SUCCESS, messageModel.messageId),
                        result: {
                            messageId: messageModel.messageId
                        }
                    });
                    return;
                }
            });
        });
    }
}

function remove(query, callback) {
    MessageModel.remove(query, function (error) {
        if (error) {
            callback({
                status: REQUEST_CODES.FAIL,
                error: error
            });
            return;
        } else {
            callback({
                status: REQUEST_CODES.SUCCESS,
                message: utils.formatText(MESSAGE_CODES.DELETE_SUCCESS, query.messageId),
                result: {
                    messageId: messageModel.messageId
                }
            });
            return;
        }
    });
}

function removeMany(data, callback) {
    let deleteQuery = {
        messageId: {
            $in: data.messageIds
        }
    }
    MessageModel.deleteMany(deleteQuery, function (error) {
        if (error) {
            callback({
                status: REQUEST_CODES.FAIL,
                error: error
            });
            return;
        } else {
            callback({
                status: REQUEST_CODES.SUCCESS,
                message: MESSAGE_CODES.DELETE_SUCCESS
            });
            return;
        }
    });
}

function deleteMessage(request, callback) {   
    if(request.deletedBy){    
        let deleteQuery = {
            messageId: request.messageId            
        }
        MessageModel.remove(deleteQuery, function (error) {          
            if (error) {
                callback({
                    status: REQUEST_CODES.FAIL,
                    error: error
                });
                return;
            } else {
                callback({
                    status: REQUEST_CODES.SUCCESS,
                    message: MESSAGE_CODES.DELETE_SUCCESS
                });
                return;
            }
        });
    }else{
        getList({messageId: request.messageId}, function(res) {
            if(res.result.length > 0){    
                let data=  res.result[0];  
                data['deletedBy']= request.userId;
                MessageModel.update({
                    'messageId': data.messageId
                }, {
                    $set: data
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
                            message: utils.formatText(MESSAGE_CODES.UPDATE_SUCCESS, request.connectorId),
                            result: {
                                connectorId: request.connectorId
                            }
                        });
                        return;
                    }
                });
            }else {
                callback({
                    status: REQUEST_CODES.FAIL,
                    message: 'Message not found' 
                });
                return;
            }    
        })    
    }    
}

function update(message, callback) {
    MessageModel.update({
        'connectorId': message.connectorId
    }, {
        $set: message
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
                message: utils.formatText(MESSAGE_CODES.UPDATE_SUCCESS, message.connectorId),
                result: {
                    connectorId: message.connectorId
                }
            });
            return;
        }
    });
}

module.exports.getList = getList;
module.exports.create = create;
module.exports.saveChatHistory = saveChatHistory;
module.exports.update = update;
module.exports.remove = remove;
module.exports.saveBroadCasetChatHistory = saveBroadCasetChatHistory;

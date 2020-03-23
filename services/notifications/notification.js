module.exports = function (app) {    
    app.get('/ui/notification', function (req, res) {    //To get Notification
		try {
			getList(req.query, function (response) {
				res.json(response);
			});
		} catch (e) {
			res.json(e);
		}
	});
	app.post('/ui/notification', function (req, res) {   //To create Notification
        try {
            create(req.body, function (response) {
               res.json(response);
            });
        } catch (e) {
            res.json(e);
        }
    });    
 	app.put('/ui/notification', function (req, res) {    //To Update Notification
		try {
			update(req.body, function (response) {
				res.json(response);
			});
		} catch (e) {
        	res.json(e);
		}
    });
    app.put('/ui/read/notification', function (req, res) {    //To Update Notification
		try {
			readNotification(req.body, function (response) {
				res.json(response);
			});
		} catch (e) {
        	res.json(e);
		}
    });
    app.delete('/ui/notification', function (req, res) {
		try {
			remove(req.body, function (response) {
				res.json(response);
			});
		} catch (e) {
			res.json(e);
		}
    });	
}

var mongoose = require('mongoose'),	Schema = mongoose.Schema;
var NotificationSchema = new Schema(require('./notificationSchema').notificationSchema, { collection: 'notification' });
var NotificationModel = mongoose.model('notification', NotificationSchema);
var NotificationController = require('./notificationController');
var utils = require('../../commons/utils').utils;
var mongoUtils = utils.mongoUtils;
var CONSTANTS = utils.CONSTANTS;
var DB_CODES = CONSTANTS.DATABASE_CODES;
var REQUEST_CODES = CONSTANTS.REQUEST_CODES;
var NOTIFICATION_CODES = utils.CONSTANTS.NOTIFICATION;
var logger = require('../../logger.js');
function getList(query, callback) {
    let skip = parseInt(query.skip, 10) || 0;
    NotificationModel.find({userId: query.userId}, function (error, records) {
        if (error) {
            callback({
                status: DB_CODES.FAIL,
                message: error
            });
            return;
        } else {
            records = records.map(function (record) {
                return new NotificationController.NotificationAPI(record);
            });
            NotificationModel.update({userId: query.userId}, { isRead: true }, { multi: true }, function (error) {
                if (error) {
                    logger.info('error on read notification', error);
                } 
            });
            callback({
                status: REQUEST_CODES.SUCCESS,
                result: records
            });
            return;
        }
    }).sort( { dateTime: -1 } ).skip(skip*10).limit( 10 );
    
}

function create(notification, callback) {
    var notificationAPI;
    var errorList = []; 
    try {
        notificationAPI = NotificationController.NotificationAPI(notification);
    }
    catch (e) {
        errorList.push(e.error[0]);
        callback({
            status: REQUEST_CODES.FAIL,
            error: errorList
        });
        return;
    }
    var notificationModel = new NotificationModel(notificationAPI);
    mongoUtils.getNextSequence('notificationId', function (oSeq) {
        notificationModel.notificationId = oSeq;        
        notificationModel.save(function (error) {
            if (error) {
                callback({
                    status: REQUEST_CODES.FAIL,
                    error: error
                });
                return;
            }
            else {   
                let Header = require('../header/header');  
                let data = {
                    userId: notificationModel.userId,
                    roleId: '',
                    connectionCount: '',
                    messagingCount: '',
                    notificationCount: 1
                };
                Header.update(data,function(res){
                    logger.info('header updated', res.status);
                });
                callback({
                    status: REQUEST_CODES.SUCCESS,
                    message: NOTIFICATION_CODES.CREATE_SUCCESS,
                    result: { notificationId: notificationModel.notificationId }
                });
                return;              
            }
        });
    });
}

function update(notification, callback) { 
    NotificationModel.update({ 'notificationId': notification.notificationId }, { $set: notification  }, function (error) {
        if (error) {
            callback({
                status: REQUEST_CODES.FAIL,
                message: error
            });
            return;
        } else {
            callback({
                status: REQUEST_CODES.SUCCESS,
                message: utils.formatText(NOTIFICATION_CODES.UPDATE_SUCCESS, notification.notificationId), 
            });
            return;
        }
    });
}

function readNotification(notification, callback) { 
    NotificationModel.update({userId: notification.userId}, {isRead: notification.isRead}, {multi: true}, function (error) {
        if (error) {
            callback({
                status: REQUEST_CODES.FAIL,
                message: error
            });
            return;
        } else {
            callback({
                status: REQUEST_CODES.SUCCESS,
                message: utils.formatText(NOTIFICATION_CODES.UPDATE_SUCCESS, notification.notificationId), 
            });
            return;
        }
    });
}


function remove(query, callback) {
    NotificationModel.remove(query, function (error) {
        if (error) {
            callback({
                status: REQUEST_CODES.FAIL,
                error: error
            });
            return;
        } else {
            callback({
                status: REQUEST_CODES.SUCCESS,
                message: NOTIFICATION_CODES.DELETE_SUCCESS
            });
            return;
        }
    });
}

module.exports.getList = getList;
module.exports.create = create;
module.exports.update = update;
var config = require('../../env/config.js').getConf();
var utils = require('../../commons/utils').utils;
var notification = require('../notifications/notification');
var FCM = require('fcm-push');
var serverkey = config.apps.fcm.key;
var fcm = new FCM(serverkey);
var logger = require('../../logger.js');
var sendPushNotification = function (message) {
    message.deviceIds.forEach(deviceId => {
        let mobileNotification = {
            // to: deviceId,
            // collapse_key: '<insert-collapse-key>',
            // data: {
            //     userId: message.userId,
            //     name: message.firstName
            // },
            // notification: {
            //     title: 'spikeview',
            //     body: 'You have received a new spikeview message.',
            //     click_action: 16
            // }


            "to": deviceId,
            "collapse_key": '<insert-collapse-key>',
            "notification": {
                "title": "spikeview",
                "body": 'You have received a new spikeview message.',
                "sound": "default",
                "badge": "1"
              },
              "data": {
                "title": "spikeview",
                "body": 'You have received a new spikeview message.',
                "userId": message.userId,
                "name": message.firstName,                   
                "sound": "default",
                "badge": "1"
              },
              "priority": "high"
            

        };
        fcm.send(mobileNotification, function (error, resp) {
            if (error) {
                logger.error("Something has gone wrong ! ", error);
            } else {
                logger.info("Mobile Notification sent ");
            }
        })
    });
};

var sendNotification = function (message) {
    let dbNotification = {
        userId: message.userId,
        actedBy: message.actedBy,
        profilePicture: message.profilePicture,
        text: message.body,
        textName: message.textName,
        textMessage: message.textMessage,
        isRead: false,
        dateTime: utils.getSystemTime()
    }
    notification.create(dbNotification, function (res) {
        message.deviceIds.forEach(deviceId => {
            let mobileNotification = {
            //     "to": deviceId,
            //  //   "collapse_key": '<insert-collapse-key>',
            //     "data": {
            //         "userId": message.userId,
            //         "name": message.name,
            //         "sound": "default",
            //         "badge": "1"
            //     },
            //     "notification": {
            //         "title": "spikeview",
            //         "body": message.body,
            //         "click_action": 16,
            //         "textName": message.textName,
            //         "textMessage": message.textMessage,
            //         "sound": "default",
            //         "badge": "1"
            //     },
            //     "priority": "high"


                "to": deviceId,
                "collapse_key": '<insert-collapse-key>',
                "notification": {
                    "title": "spikeview",
                    "body": message.body,
                    "sound": "default",
                    "badge": "1"
                  },
                  "data": {
                    "title": "spikeview",
                    "body": message.body,
                    "userId": message.userId,
                    "name": message.name,                   
                    "sound": "default",
                    "badge": "1"
                  },
                  "priority": "high"
                


            };

            logger.info('final payload : ', mobileNotification);
            fcm.send(mobileNotification, function (error, resp) {
                if (error) {
                    logger.error("Something has gone wrong ! ", error);
                } else {
                    logger.info("Mobile & DB Notification sent");
                }
            })
        });
    });
};

module.exports = {
    sendNotification: sendNotification,
    sendPushNotification: sendPushNotification
}
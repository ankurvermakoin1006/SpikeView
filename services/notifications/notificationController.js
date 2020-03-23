var utils = require('../../commons/utils').utils;
var VALIDATE = utils.CONSTANTS.VALIDATE;
var validate = utils.validate;

var Notification = function () {
    return {
        notificationId :0,
        userId :0,
        roleId: 0,
        actedBy:0,
        postId : 0,
        profilePicture:null,
        text:null,
        textName: null,
        textMessage: null,
        dateTime: 0,
        isRead: false
    }
};

function NotificationAPI(notificationRecord) {
    var notification = new Notification();  
    notification.getNotificationId = function () {
        return this.notificationId;
    };
    notification.setNotificationId = function (notificationId) {
        if (notificationId) {
            if (validate.isInteger(notificationId)) {
                this.notificationId = notificationId;
            } else {
                throw {
                    status: VALIDATE.FAIL,
                    message: utils.formatText(VALIDATE.NOT_A_INTEGER, notificationId, 'notificationId')
                };
            }
        }
    };
    notification.getUserId = function () {
        return this.userId
    };
    notification.setUserId = function (userId) {
        if (userId) {
            if (validate.isInteger(userId)) {
                this.userId = userId;
            } else {
                throw {
                    status: VALIDATE.FAIL,
                    message: utils.formatText(VALIDATE.NOT_A_INTEGER, userId, 'userId')
                };
            }
        }
    };
    notification.getRoleId = function () {
        return this.roleId
    };
    notification.setRoleId = function (roleId) {       
                this.roleId = roleId;           
    };
    notification.getActedBy = function () {
        return this.actedBy
    };
    notification.setActedBy = function (actedBy) {
        if (actedBy) {
            if (validate.isInteger(actedBy)) {
                this.actedBy = actedBy;
            } else {
                throw {
                    status: VALIDATE.FAIL,
                    message: utils.formatText(VALIDATE.NOT_A_INTEGER, actedBy, 'actedBy')
                };
            }
        }
    };
    notification.getProfilePicture = function () {
        return this.profilePicture;
    };
    notification.setProfilePicture = function (profilePicture) {
        this.profilePicture = profilePicture;
    };
    notification.getPostId = function () {
        return this.postId;
    };
    notification.setPostId = function (postId) {
        if (postId) {
            if (validate.isInteger(postId)) {
                this.postId = postId;
            } else {
                throw {
                    status: VALIDATE.FAIL,
                    message: utils.formatText(VALIDATE.NOT_A_INTEGER, postId, 'postId')
                };
            }
        }
    };
    notification.getText = function () {
        return this.text;
    };
    notification.setText = function (text) {
        if (text) {
            if (text.length <= 500) {
                this.text = text;
            } else {
                throw {
                    status: VALIDATE.FAIL,
                    error: utils.formatText(VALIDATE.VALUE_TOO_BIG, text, 'Text')
                };
            }
        }
    };
    notification.getTextName = function () {
        return this.textName;
    };
    notification.setTextName = function (textName) {
        this.textName = textName;
    };
    notification.getTextMessage = function () {
        return this.textMessage;
    };
    notification.setTextMessage = function (textMessage) {
        if (textMessage) {
            if (textMessage.length <= 500) {
                this.textMessage = textMessage;
            } else {
                throw {
                    status: VALIDATE.FAIL,
                    error: utils.formatText(VALIDATE.VALUE_TOO_BIG, textMessage, 'TextMessage')
                };
            }
        }
    };
    notification.getDateTime = function () {
        return this.dateTime;
    };
    notification.setDateTime = function (dateTime) {
        if (dateTime) {
            if (validate.isInteger(dateTime)) {
                this.dateTime = dateTime;
            } else {
                throw {
                    status: VALIDATE.FAIL,
                    message: utils.formatText(VALIDATE.NOT_A_INTEGER, dateTime, 'dateTime')
                };
            }
        }
    };
    notification.getIsRead = function () {
        return this.isRead;
    };
    notification.setIsRead = function (isRead) {
            this.isRead = isRead;
    };
    
    if (notificationRecord) {
        var errorList = [];
        try {
            notification.setNotificationId(notificationRecord.notificationId);
        } catch (e) {
            errorList.push(e);
        }
        try {
            notification.setUserId(notificationRecord.userId);
        } catch (e) {
            errorList.push(e);
        }
        try {
            notification.setRoleId(notificationRecord.roleId);
        } catch (e) {
            errorList.push(e);
        }
        try {
            notification.setActedBy(notificationRecord.actedBy);
        } catch (e) {
            errorList.push(e);
        }
        try {
            notification.setProfilePicture(notificationRecord.profilePicture);
        } catch (e) {
            errorList.push(e);
        }
        try {
            notification.setPostId(notificationRecord.postId);
        } catch (e) {
            errorList.push(e);
        }
        try {
            notification.setText(notificationRecord.text);
        } catch (e) {
            errorList.push(e);
        } 
        try {
            notification.setTextName(notificationRecord.textName);
        } catch (e) {
            errorList.push(e);
        } 
        try {
            notification.setTextMessage(notificationRecord.textMessage);
        } catch (e) {
            errorList.push(e);
        } 
        try {
            notification.setDateTime(notificationRecord.dateTime);
        } catch (e) {
            errorList.push(e);
        }
        try {
            notification.setIsRead(notificationRecord.isRead);
        } catch (e) {
            errorList.push(e);
        }
    }    
    return notification;
}

module.exports.NotificationAPI = NotificationAPI;
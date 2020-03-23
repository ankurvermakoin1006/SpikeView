var utils = require('../../commons/utils').utils;
var VALIDATE = utils.CONSTANTS.VALIDATE;
var validate = utils.validate;

var Header = function () {
    return {
        headerId :0,
        userId :0,
        roleId: 0,
        connectionCount : 0,
        messagingCount:0,
        notificationCount: 0,
        groupCount:0
    }
};

function HeaderAPI(headerRecord) {
    var header = new Header();  
    header.getHeaderId = function () {
        return this.headerId;
    };
    header.setHeaderId = function (headerId) {
        if (headerId) {
            if (validate.isInteger(headerId)) {
                this.headerId = headerId;
            } else {
                throw {
                    status: VALIDATE.FAIL,
                    message: utils.formatText(VALIDATE.NOT_A_INTEGER, headerId, 'headerId')
                };
            }
        }
    };
    header.getUserId = function () {
        return this.userId
    };
    header.setUserId = function (userId) {
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
    header.getRoleId = function () {
        return this.roleId
    };
    header.setRoleId = function (roleId) {       
                this.roleId = roleId;            
    };
    header.getConnectionCount = function () {
        return this.connectionCount;
    };
    header.setConnectionCount = function (connectionCount) {
        if (connectionCount) {
            if (validate.isInteger(connectionCount)) {
                this.connectionCount = connectionCount;
            } else {
                throw {
                    status: VALIDATE.FAIL,
                    message: utils.formatText(VALIDATE.NOT_A_INTEGER, connectionCount, 'connectionCount')
                };
            }
        }
    };
    header.getMessagingCount = function () {
        return this.messagingCount;
    };
    header.setMessagingCount = function (messagingCount) {  
        if (messagingCount) {
            if (validate.isInteger(messagingCount)) {
                this.messagingCount = messagingCount;
            } else {               
                throw {
                    status: VALIDATE.FAIL,
                    message: utils.formatText(VALIDATE.NOT_A_INTEGER, messagingCount, 'messagingCount')
                };
            }
        }
    };
    header.getNotificationCount = function () {
        return this.notificationCount;
    }; 
    header.setNotificationCount = function (notificationCount) {  
        if (notificationCount) {
            if (validate.isInteger(notificationCount)) {
                this.notificationCount = notificationCount;
            } else {               
                throw {
                    status: VALIDATE.FAIL,
                    message: utils.formatText(VALIDATE.NOT_A_INTEGER, notificationCount, 'notificationCount')
                };
            }
        }
    };
    header.getGroupCount = function () {
        return this.groupCount;
    }; 
    header.setGroupCount = function (groupCount) {  
        if (groupCount) {
            if (validate.isInteger(groupCount)) {
                this.groupCount = groupCount;
            } else {               
                throw {
                    status: VALIDATE.FAIL,
                    message: utils.formatText(VALIDATE.NOT_A_INTEGER, groupCount, 'groupCount')
                };
            }
        }
    };  

    if (headerRecord) {
        var errorList = [];
        try {
           header.setHeaderId(headerRecord.headerId);
        } catch (e) {
            errorList.push(e);
        }
        try {
            header.setUserId(headerRecord.userId);
        } catch (e) {
            errorList.push(e);
        }
        try {
            header.setRoleId(headerRecord.roleId);
        } catch (e) {
            errorList.push(e);
        }
        try {
            header.setConnectionCount(headerRecord.connectionCount);
        } catch (e) {
            errorList.push(e);
        }
        try {
            header.setMessagingCount(headerRecord.messagingCount);
        } catch (e) {
            errorList.push(e);
        } 
        try {
            header.setNotificationCount(headerRecord.notificationCount);
        } catch (e) {
            errorList.push(e);
        }   
        try {
            header.setGroupCount(headerRecord.groupCount);
        } catch (e) {
            errorList.push(e);
        }             
    }    
    return header;
}

module.exports.HeaderAPI = HeaderAPI;
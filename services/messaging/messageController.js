var utils = require('../../commons/utils').utils;
var VALIDATE = utils.CONSTANTS.VALIDATE;
var validate = utils.validate;

var Message = function () {
    return {
        messageId :0,
        connectorId : 0,
        sender:0,
        receiver: 0,
        deletedBy:0,
        time : 0,
        text : null,
        type : 0,
        status : 0 // 0 = unread, 1 = read        
    }
};

function MessageAPI(messageRecord) {
    var message = new Message();  
    message.getMessageId = function () {
        return this.messageId;
    };
    message.setMessageId = function (messageId) {
        if (messageId) {
            if (validate.isInteger(messageId)) {
                this.messageId = messageId;
            } else {
                throw {
                    status: VALIDATE.FAIL,
                    message: utils.formatText(VALIDATE.NOT_A_INTEGER, messageId, 'messageId')
                };
            }
        }
    };
    message.getConnectorId = function () {
        return this.connectorId;
    };
    message.setConnectorId = function (connectorId) {
        if (connectorId) {
            if (validate.isInteger(connectorId)) {
                this.connectorId = connectorId;
            } else {
                throw {
                    status: VALIDATE.FAIL,
                    message: utils.formatText(VALIDATE.NOT_A_INTEGER, connectorId, 'connectorId')
                };
            }
        }
    };
    message.getSender = function () {
        return this.sender;
    };
    message.setSender = function (sender) {
        if (sender) {
            if (validate.isInteger(sender)) {
                this.sender = sender;
            } else {
                throw {
                    status: VALIDATE.FAIL,
                    message: utils.formatText(VALIDATE.NOT_A_INTEGER, sender, 'sender')
                };
            }
        }
    };
    message.getReceiver = function () {
        return this.receiver;
    };
    message.setReceiver = function (receiver) {  
        if (receiver) {
            if (validate.isInteger(receiver)) {
                this.receiver = receiver;
            } else {               
                throw {
                    status: VALIDATE.FAIL,
                    message: utils.formatText(VALIDATE.NOT_A_INTEGER, receiver, 'receiver')
                };
            }
        }
    };
    message.getDeletedBy = function () {
        return this.deletedBy;
    };
    message.setDeletedBy = function (deletedBy) {  
        if (receiver) {
            if (validate.isInteger(deletedBy)) {
                this.deletedBy = deletedBy;
            } else {               
                throw {
                    status: VALIDATE.FAIL,
                    message: utils.formatText(VALIDATE.NOT_A_INTEGER, deletedBy, 'deletedBy')
                };
            }
        }
    };
    message.getText = function () {
        return this.text;
    };
    message.setText = function (text) {
        this.text = text;
    }
    message.getTime = function () {
        return this.time;
    };
    message.setTime = function (time) {
        this.time = time;
    }
    message.getType = function () {
        return this.type;
    };
    message.setType = function (type) {
        if (type) {
            if (validate.isInteger(type)) {
                this.type = type;
            } else {
                throw {
                    status: VALIDATE.FAIL,
                    message: utils.formatText(VALIDATE.NOT_A_INTEGER, type, 'type')
                };
            }
        }
    };   
    message.getStatus = function () {
        return this.status;
    };
    message.setStatus = function (status) {
        this.status = status;
    };

    if (messageRecord) {
        var errorList = [];
        try {
           message.setMessageId(messageRecord.messageId);
        } catch (e) {
            errorList.push(e);
        }
        try {
            message.setConnectorId(messageRecord.connectorId);
        } catch (e) {
            errorList.push(e);
        }
        try {
            message.setSender(messageRecord.sender);
        } catch (e) {
            errorList.push(e);
        }
        try {
            message.setReceiver(messageRecord.receiver);
        } catch (e) {
            errorList.push(e);
        } 
        try {
            message.setDeletedBy(messageRecord.deletedBy);
        } catch (e) {
            errorList.push(e);
        } 
        try {
            message.setText(messageRecord.text);
        } catch (e) {
            errorList.push(e);
        }
        try {
            message.setTime(messageRecord.time);
        } catch (e) {
            errorList.push(e);
        }
        try {
            message.setType(messageRecord.type);
        } catch (e) {
            errorList.push(e);
        }
        try {
            message.setStatus(messageRecord.status);
        } catch (e) {
            errorList.push(e);
        }               
    }    
    return message;
}

module.exports.MessageAPI = MessageAPI;
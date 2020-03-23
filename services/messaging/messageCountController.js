var utils = require('../../commons/utils').utils;
var VALIDATE = utils.CONSTANTS.VALIDATE;
var validate = utils.validate;

var MessageCount = function () {
    return {
        connectorId : 0,
        sender:0,
        receiver: 0,
        time : 0,
        text : null,
        count : 1
    }
};

function MessageCountAPI(messageRecord) {
    var message = new MessageCount();  
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
    message.getCount = function () {
        return this.count;
    };
    message.setCount = function (count) {
        this.count = count;
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
            message.setCount(messageRecord.count);
        } catch (e) {
            errorList.push(e);
        }
    }    
    return message;
}

module.exports.MessageCountAPI = MessageCountAPI;
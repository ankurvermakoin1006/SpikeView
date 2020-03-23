module.exports = function (app) {    
	app.put('/ui/message/count', function (req, res) {//To Update Message
		try {
			update(req.body, function (response) {
				res.json(response);
			});
		} catch (e) {
			res.json(e);
		}
	});
}
var mongoose = require('mongoose'),	Schema = mongoose.Schema;
var MessageCountSchema = new Schema(require('./messageCountSchema').messageCountSchema, { collection: 'messageCount' });
var MessageCountModel = mongoose.model('messageCount', MessageCountSchema);
var MessageCountController = require('./messageCountController');
var utils = require('../../commons/utils').utils;
var CONSTANTS = utils.CONSTANTS;
var REQUEST_CODES = CONSTANTS.REQUEST_CODES;
var MESSAGE_CODES = utils.CONSTANTS.MESSAGE;

function createLastMessageAndReadCount(data, callback) {
    getList({ connectorId : data.connectorId }, function(response) {
        if (response.result.length === 0) {
            data.count = 1;
            create(data, callback);
        } else {
            if (data.status === 0) {
                var lastMessageCount = response.result[0];
                data.count = lastMessageCount.count + 1;
            }
            update(data, callback);
        }
    })
}

function create(message, callback) {   
    var messageAPI;
    var errorList = [];
    message['time'] = (new Date()).getTime();
    try{
        messageAPI = MessageCountController.MessageCountAPI(message);    
    }catch(e) {
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
       var messageCountModel = new MessageCountModel(messageAPI);
        messageCountModel.save(function (error) {
            if (error) {
                callback({
                    status: REQUEST_CODES.FAIL,
                    message: error
                });
                return;
            } else {              
                callback({
                    status: REQUEST_CODES.SUCCESS,
                    message: 'Message count updated successfully',
                    result: { connectorId : messageCountModel.connectorId}
                });
                return;
            }
        });
    }
}

function update(message, callback) {
    MessageCountModel.update({ 'connectorId': message.connectorId }, { $set: message }, function (error) {
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
                result: {connectorId : message.connectorId}
            });
            return;
        }
    });
}

function getList(query, callback) {
    MessageCountModel.find(query, function (error, records) {
        if (error) {
            callback({
                status: REQUEST_CODES.FAIL,
                message: error
            });
            return;
        } else {
            records = records.map(function (record) {
                return new MessageCountController.MessageCountAPI(record);
            });

            callback({
                status: REQUEST_CODES.SUCCESS,
                result: records
            });
            return;
        }
    });
}

function update(message, callback) {
    MessageCountModel.update({ 'connectorId': message.connectorId }, { $set: message }, function (error) {
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
                result: {connectorId : message.connectorId}
            });
            return;
        }
    });
}

module.exports.createLastMessageAndReadCount = createLastMessageAndReadCount;
module.exports.getList = getList;
module.exports.update = update;



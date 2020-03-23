module.exports = function (app) {
    app.post('/ui/socketUser', function (req, res) {
        try {
            create(req.body, function (response) {
                res.json(response);
            });
        } catch (e) {
            res.json(e);
        }
    });
    app.get('/ui/socketUser', function (req, res) {
        try {
            getList(req.query, function (response) {
                res.json(response);
            });
        } catch (e) {
            res.json(e);
        }
    });
    app.put('/ui/socketUser', function (req, res) {
        try {
            update(req.body, function (response) {
                res.json(response);
            });
        } catch (e) {
            res.json(e);
        }
    });
    app.delete('/ui/socketUser', function (req, res) {
        try {
            remove(req.body, function (response) {
                res.json(response);
            });
        } catch (e) {
            res.json(e);
        }
    });
}

var mongoose = require('mongoose'), Schema = mongoose.Schema;
var SocketUserSchema = new Schema(require('./socketUserSchema').socketUserSchema, { collection: 'socketUser' });
var SocketUserModel = mongoose.model('socketUser', SocketUserSchema);
var SocketUserController = require('./socketUserController');
var utils = require('../../commons/utils').utils;
var mongoUtils = utils.mongoUtils;
var CONSTANTS = utils.CONSTANTS;
var REQUEST_CODES = CONSTANTS.REQUEST_CODES;
var SKILLS_CODES = utils.CONSTANTS.SKILLS;

function create(socketUser) {  
    var socketUserAPI;
    var errorList = [];
    try {
        socketUserAPI = SocketUserController.SocketUserAPI(socketUser);
    } catch (e) {
        errorList.push(e.error[0]);
        callback({
            status: REQUEST_CODES.FAIL,
            error: errorList
        });
        return;
    }
    var socketUserModel = new SocketUserModel(socketUserAPI);
    mongoUtils.getNextSequence('socketUserId', function (oSeq) {
        socketUserModel.socketUserId = oSeq;
        socketUserModel.save(function (error) {
            if (error) {
                callback({
                    status: REQUEST_CODES.FAIL,
                    error: error
                });
                return;
            }
        });
    });
}

function getList(query, callback) {
    SocketUserModel.find(query, function (error, records) {
        if (error) {
            callback({
                status: REQUEST_CODES.FAIL,
                error: error
            });
            return;
        } else {
            records = records.map(function (records) {
                return new SocketUserController.SocketUserAPI(records);
            });
            callback({
                status: REQUEST_CODES.SUCCESS,
                result: records
            });
            return;
        }
    });
}

function update(socketUser) {  
    SocketUserModel.update({ 'socketUserId': socketUser.socketUserId }, { $set: socketUser }, function (error) {
        if (error) {
            callback({
                status: REQUEST_CODES.FAIL,
                error: error
            });
            return;
        }
    });
}

function remove(socketUser, callback) {
    SocketUserModel.remove(socketUser, function (error) {
        if (error) {
            callback({
                status: REQUEST_CODES.FAIL,
                error: error
            });
            return;
        } else {
            callback({
                status: REQUEST_CODES.SUCCESS,
                message: utils.formatText(SKILLS_CODES.DELETE_SUCCESS, socketUser.socketUserId)
            });
        }
    });
}

module.exports.getList = getList;
module.exports.create = create;
module.exports.update = update;
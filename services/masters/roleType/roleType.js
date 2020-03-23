module.exports = function (app) {
    app.post('/ui/roleType', function (req, res) {
        try {
            create(req.body, function (response) {
                res.json(response);
            });
        }
        catch (e) {
            res.json(e);
        }
    });
    app.get('/app/roleType', function (req, res) {
        try {
            getList(req.query, function (response) {
                res.json(response);
            });
        }
        catch (e) {
            res.json(e);
        }
    });
    app.put('/ui/roleType', function (req, res) {
        try {
            update(req.body, function (response) {
                res.json(response);
            });
        }
        catch (e) {
            res.json(e);
        }
    });
    app.delete('/ui/roleType', function (req, res) {
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
var RoleTypeSchema = new Schema(require('./roleTypeSchema').roleTypeSchema, { collection: 'roleType' });
var RoleTypeModel = mongoose.model('roleType', RoleTypeSchema);
var RoleTypeController = require('./roleTypeController');
var config = require('../../../env/config.js').getConf();
var utils = require('../../../commons/utils').utils;
var mongoUtils = utils.mongoUtils;
var CONSTANTS = utils.CONSTANTS;
var REQUEST_CODES = CONSTANTS.REQUEST_CODES;
var COMMON_CODES = CONSTANTS.COMMON_CODES;
var ROLE_TYPE_CODES = utils.CONSTANTS.ROLE_TYPE;
var VALIDATE = utils.CONSTANTS.VALIDATE;

function create(roleType, callback) {
    var roleTypeAPI;
    var errorList = [];
    try {
        roleTypeAPI = RoleTypeController.RoleTypeAPI(roleType);
    }
    catch (e) {
        errorList.push(e.error[0]);
        callback({
            status: REQUEST_CODES.FAIL,
            message: errorList
        });
        return;
    }
    var roleTypeModel = new RoleTypeModel(roleType);
    mongoUtils.getNextSequence('roleTypeId', function (oSeq) {
        roleTypeModel.roleTypeId = oSeq;        
        roleTypeModel.save(function (error) {
            if (error) {
                callback({
                    status: REQUEST_CODES.FAIL,
                    message: REQUEST_CODES.FAIL_MSG
                });
                return;
            }
            else {
                callback({
                    status: REQUEST_CODES.SUCCESS,
                    result: utils.formatText(ROLE_TYPE_CODES.CREATE_SUCCESS, roleTypeModel.roleTypeId),
                    roleTypeId: roleTypeModel.roleTypeId
                });
                return;
            }
        });
    });
}

function getList(query, callback) {
    RoleTypeModel.find(query).sort([['roleTypeId', 1]]).exec(function (error, records) {
        if (error) {
            callback({
                status: REQUEST_CODES.FAIL,
                message: REQUEST_CODES.FAIL_MSG
            });
            return;
        }
        else {
            records = records.map(function (records) {
                return new RoleTypeController.RoleTypeAPI(records);
            });
            callback({
                status: REQUEST_CODES.SUCCESS,
                result: records
            });
            return;
        }
    });
}

function update(roleType, callback) {
    RoleTypeModel.update({ 'roleTypeId': roleType.roleTypeId }, { $set: roleType }, function (error) {
        if (error) {
            callback({
                status: REQUEST_CODES.FAIL,
                message: REQUEST_CODES.FAIL_MSG
            });
            return;
        } else {
            callback({
                status: REQUEST_CODES.SUCCESS,
                result: utils.formatText(ROLE_TYPE_CODES.UPDATE_SUCCESS, roleType.roleTypeId)
            });
            return;
        }
    });
}
function remove(roleType, callback) {
    RoleTypeModel.remove(roleType, function (error) {
        if (error) {
            callback({
                status: REQUEST_CODES.FAIL,
                message: REQUEST_CODES.FAIL_MSG
            });
            return;
        }
        else {
            callback({
                status: REQUEST_CODES.SUCCESS,
                result: utils.formatText(ROLE_TYPE_CODES.DELETE_SUCCESS, roleType.roleTypeId)
            });
        }
    });
}

module.exports.getList = getList;
module.exports.create = create;
module.exports.update = update;
module.exports.remove = remove;
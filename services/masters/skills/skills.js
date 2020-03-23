module.exports = function (app) {
    app.post('/ui/skills', function (req, res) {
        try {
            create(req.body, function (response) {
                res.json(response);
            });
        } catch (e) {
            res.json(e);
        }
    });
    app.get('/ui/skills', function (req, res) {
        try {
            getList(req.query, function (response) {
                res.json(response);
            });
        } catch (e) {
            res.json(e);
        }
    });
    app.put('/ui/skills', function (req, res) {
        try {
            update(req.body, function (response) {
                res.json(response);
            });
        } catch (e) {
            res.json(e);
        }
    });
    app.delete('/ui/skills', function (req, res) {
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
var SkillsSchema = new Schema(require('./skillsSchema').skillsSchema, { collection: 'skills' });
var SkillsModel = mongoose.model('skills', SkillsSchema);
var SkillsController = require('./skillsController');
var utils = require('../../../commons/utils').utils;
var mongoUtils = utils.mongoUtils;
var CONSTANTS = utils.CONSTANTS;
var REQUEST_CODES = CONSTANTS.REQUEST_CODES;
var SKILLS_CODES = utils.CONSTANTS.SKILLS;

function create(skills, callback) {
    var skillsAPI;
    var errorList = [];
    try {
        skillsAPI = SkillsController.SkillsAPI(skills);
    } catch (e) {
        errorList.push(e.error[0]);
        callback({
            status: REQUEST_CODES.FAIL,
            error: errorList
        });
        return;
    }
    var skillModel = new SkillsModel(skillsAPI);
    mongoUtils.getNextSequence('skillId', function (oSeq) {
        skillModel.skillId = oSeq;
        skillModel.save(function (error) {
            if (error) {
                callback({
                    status: REQUEST_CODES.FAIL,
                    error: error
                });
                return;
            } else {
                callback({
                    status: REQUEST_CODES.SUCCESS,
                    message: utils.formatText(SKILLS_CODES.CREATE_SUCCESS, skillModel.skillId),
                    result: { skillId: skillModel.skillId }
                });
                return;
            }
        });
    });
}

function getList(query, callback) {
    SkillsModel.find(query, function (error, records) {
        if (error) {
            callback({
                status: REQUEST_CODES.FAIL,
                error: error
            });
            return;
        } else {
            records = records.map(function (records) {
                return new SkillsController.SkillsAPI(records);
            });
            callback({
                status: REQUEST_CODES.SUCCESS,
                result: records
            });
            return;
        }
    });
}

function update(skills, callback) {
    SkillsModel.update({ 'skillId': skills.skillId }, { $set: skills }, function (error) {
        if (error) {
            callback({
                status: REQUEST_CODES.FAIL,
                error: error
            });
            return;
        } else {
            callback({
                status: REQUEST_CODES.SUCCESS,
                message: utils.formatText(SKILLS_CODES.UPDATE_SUCCESS, skills.skillId)
            });
            return;
        }
    });
}

function remove(skills, callback) {
    SkillsModel.remove(skills, function (error) {
        if (error) {
            callback({
                status: REQUEST_CODES.FAIL,
                error: error
            });
            return;
        } else {
            callback({
                status: REQUEST_CODES.SUCCESS,
                message: utils.formatText(SKILLS_CODES.DELETE_SUCCESS, skills.skillId)
            });
        }
    });
}

module.exports.getList = getList;

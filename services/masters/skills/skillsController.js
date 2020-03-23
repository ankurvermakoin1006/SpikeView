var utils = require('../../../commons/utils').utils;
var VALIDATE = utils.CONSTANTS.VALIDATE;

var Skills = function () {
    return {
        skillId: 0,
        title: null,
        description: null
    }
};

function SkillsAPI(skillsRecord) {
    var skills = new Skills();

    skills.getSkillId = function () {
        return this.skillId;
    };
    skills.setSkillId = function (skillId) {
        if (skillId) {
            this.skillId = skillId;
        } else {
            throw {
                status: VALIDATE.FAIL,
                error: utils.formatText(VALIDATE.NOT_A_INTEGER, skillId, 'skillId')
            };
        }
    };

    skills.getTitle = function () {
        return this.title;
    };
    skills.setTitle = function (title) {
        if (title) {
            if (title.length <= 200) {
                this.title = title;
            } else {
                throw {
                    status: VALIDATE.FAIL,
                    error: utils.formatText(VALIDATE.VALUE_TOO_BIG, title, 'title')
                };
            }
        }
    };

    skills.getDescription = function () {
        return this.description;
    };
    skills.setDescription = function (description) {
        if (description) {
            if (description.length <= 300) {
                this.description = description;
            } else {
                throw {
                    status: VALIDATE.FAIL,
                    error: utils.formatText(VALIDATE.VALUE_TOO_BIG, description, 'description')
                };
            }
        }
    };

    if (skillsRecord) {
        var errorList = [];
        try {
            skills.setSkillId(skillsRecord.skillId);
        } catch (e) {
            errorList.push(e);
        }
        try {
            skills.setTitle(skillsRecord.title);
        } catch (e) {
            errorList.push(e);
        }
        try {
            skills.setDescription(skillsRecord.description);
        } catch (e) {
            errorList.push(e);
        }

    }
    return skills;
}

module.exports.SkillsAPI = SkillsAPI;
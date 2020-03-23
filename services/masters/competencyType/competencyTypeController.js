var utils = require('../../../commons/utils').utils;
var CONSTANTS = utils.CONSTANTS;
var REQUEST_CODES = CONSTANTS.REQUEST_CODES;
var COMPETENCY_CODES = CONSTANTS.COMPETENCY;
var VALIDATE = utils.CONSTANTS.VALIDATE;
var validate = utils.validate;

var CompetencyType = function () {
    return {
        competencyTypeId: 0,
        title: null,
        description: null,
        level1: null,
        level2: null,
        level3: new Array()
    }
};

function CompetencyTypeAPI(competencyTypeRecord) {
    var competencyType = new CompetencyType();

    competencyType.getCompetencyTypeId = function () {
        return this.competencyTypeId;
    };
    competencyType.setCompetencyTypeId = function (competencyTypeId) {
        if (competencyTypeId) {
            this.competencyTypeId = competencyTypeId
        }
        else {
            throw {
                status: VALIDATE.FAIL,
                error: utils.formatText(VALIDATE.NOT_A_INTEGER, competencyTypeId, 'competencyTypeId')
            };
        }
    };

    competencyType.getTitle = function () {
        return this.title;
    };
    competencyType.setTitle = function (title) {
        if (title) {
            if (title.length <= 200) {
                this.title = title;
            }
            else {
                throw {
                    status: VALIDATE.FAIL,
                    error: utils.formatText(VALIDATE.VALUE_TOO_BIG, title, 'title')
                };
            }
        }
    };

    competencyType.getDescription = function () {
        return this.description;
    };
    competencyType.setDescription = function (description) {
        if (description) {
            if (description.length <= 300) {
                this.description = description;
            }
            else {
                throw {
                    status: VALIDATE.FAIL,
                    error: utils.formatText(VALIDATE.VALUE_TOO_BIG, description, 'description')
                };
            }
        }
    };

    competencyType.getLevel1 = function () {
        return this.level1;
    };
    competencyType.setLevel1 = function (level1) {
        if (level1) {
            if (level1.length <= 100) {
                this.level1 = level1;
            }
            else {
                throw {
                    status: VALIDATE.FAIL,
                    error: utils.formatText(VALIDATE.VALUE_TOO_BIG, level1, 'level1')
                };
            }
        }
    };

    competencyType.getLevel2 = function () {
        return this.level2;
    };
    competencyType.setLevel2 = function (level2) {
        if (level2) {
            if (level2.length <= 300) {
                this.level2 = level2;
            }
            else {
                throw {
                    status: VALIDATE.FAIL,
                    error: utils.formatText(VALIDATE.VALUE_TOO_BIG, level2, 'level2')
                };
            }
        }
    };

    competencyType.getLevel3 = function () {
        return this.level3;
    };
    competencyType.setLevel3 = function (level3) {
        if (level3) {
            if (level3.length <= 300) {
                this.level3 = level3;
            }
            else {
                throw {
                    status: VALIDATE.FAIL,
                    error: utils.formatText(VALIDATE.VALUE_TOO_BIG, level3, 'level3')
                };
            }
        }
    };

    if (competencyTypeRecord) {
        var errorList = [];
        try {
            competencyType.setCompetencyTypeId(competencyTypeRecord.competencyTypeId);
        }
        catch (e) {
            errorList.push(e);
        }
        try {
            competencyType.setTitle(competencyTypeRecord.title);
        }
        catch (e) {
            errorList.push(e);
        }
        try {
            competencyType.setDescription(competencyTypeRecord.description);
        }
        catch (e) {
            errorList.push(e);
        }
        try {
            competencyType.setLevel1(competencyTypeRecord.level1);
        }
        catch (e) {
            errorList.push(e);
        }
        try {
            competencyType.setLevel2(competencyTypeRecord.level2);
        }
        catch (e) {
            errorList.push(e);
        }
        try {
            competencyType.setLevel3(competencyTypeRecord.level3);
        }
        catch (e) {
            errorList.push(e);
        }
    }
    return competencyType;
}

module.exports.CompetencyTypeAPI = CompetencyTypeAPI;
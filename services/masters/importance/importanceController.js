var utils = require('../../../commons/utils').utils;
var VALIDATE = utils.CONSTANTS.VALIDATE;

var ImportanceType = function () {
    return {
        importanceId: 0,
        title: null,
        description: null
    }
};

function ImportanceAPI(importanceRecord) {
    var importance = new ImportanceType();

    importance.getImportanceId = function () {
        return this.importanceId;
    };
    importance.setImportanceId = function (importanceId) {
        if (importanceId) {
            this.importanceId = importanceId;
        } else {
            throw {
                status: VALIDATE.FAIL,
                error: utils.formatText(VALIDATE.NOT_A_INTEGER, importanceId, 'importanceId')
            };
        }
    };

    importance.getTitle = function () {
        return this.title;
    };
    importance.setTitle = function (title) {
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

    importance.getDescription = function () {
        return this.description;
    };
    importance.setDescription = function (description) {
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

    if (importanceRecord) {
        var errorList = [];
        try {
            importance.setImportanceId(importanceRecord.importanceId);
        } catch (e) {
            errorList.push(e);
        }
        try {
            importance.setTitle(importanceRecord.title);
        } catch (e) {
            errorList.push(e);
        }
        try {
            importance.setDescription(importanceRecord.description);
        } catch (e) {
            errorList.push(e);
        }

    }
    return importance;
}

module.exports.ImportanceAPI = ImportanceAPI;
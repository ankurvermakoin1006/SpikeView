var commons = require('../../commons/constants');
var utils = require('../../commons/utils').utils;
var CONSTANTS = commons.CONSTANTS;
var REQUEST_CODES = CONSTANTS.REQUEST_CODES;
var VALIDATE = commons.CONSTANTS.VALIDATE;
var validate = utils.validate;

var Education = function () {
    return {
        educationId: 0,
        organizationId: 0,
        userId: 0,
        institute: null,
        city: null,
        logo: null,
        fromGrade: null,
        toGrade: null,
        fromYear: null,
        toYear: null,
        description: null,
        isActive: null
    }
};

function EducationAPI(educationRecord) {
    var education = new Education();
    education.getEducationId = function () {
        return this.educationId;
    };
    education.setEducationId = function (educationId) {
        if (educationId) {
            if (validate.isInteger(educationId)) {
                this.educationId = educationId;
            } else {
                throw {
                    status: VALIDATE.FAIL,
                    error: utils.formatText(VALIDATE.NOT_A_INTEGER, educationId, 'educationId')
                };
            }
        }
    };
    education.getUserId = function () {
        return this.userId;
    };
    education.setUserId = function (userId) {
        this.userId = userId;
    }
    education.getOranizationId = function () {
        return this.organizationId;
    };
    education.setOrganizationId = function (organizationId) {
        this.organizationId = organizationId;
    }
    education.getInstitute = function () {
        return this.institute;
    };
    education.getLogo = function () {
        return this.logo;
    };
    education.setLogo = function (logo) {
        this.logo = logo;
    } 
    education.setInstitute = function (institute) {
        this.institute = institute;
    }
    education.getCity = function () {
        return this.city;
    };
    education.setCity = function (city) {
        this.city = city;
    } 
    education.getFromGrade = function () {
        return this.fromGrade;
    };
    education.setFromGrade = function (fromGrade) {
        this.fromGrade = fromGrade;
    }
    education.getToGrade = function () {
        return this.toGrade;
    };
    education.setToGrade = function (toGrade) {
        this.toGrade = toGrade;
    }
    education.getFromYear = function () {
        return this.fromYear;
    };
    education.setFromYear = function (fromYear) {
        this.fromYear = fromYear;
    }
    education.getToYear = function () {
        return this.toYear;
    };
    education.setToYear = function (toYear) {
        this.toYear = toYear;
    }
    education.getDescription = function () {
        return this.description;
    };
    education.setDescription = function (description) {
        this.description = description;
    }
    education.IsActive = function () {
        return this.isActive;
    };
    education.setIsActive = function (isActive) {
        this.isActive = isActive;
    }

    if (educationRecord) {
        var errorList = [];
        try {
            education.setEducationId(educationRecord.educationId);
        } catch (e) {
            errorList.push(e);
        }
        try {
            education.setUserId(educationRecord.userId);
        } catch (e) {
            errorList.push(e);
        }
        try {
            education.setOrganizationId(educationRecord.organizationId);
        } catch (e) {
            errorList.push(e);
        }
        try {
            education.setInstitute(educationRecord.institute);
        } catch (e) {
            errorList.push(e);
        }
        try {
            education.setCity(educationRecord.city);
        } catch (e) {
            errorList.push(e);
        }
        try {
            education.setFromGrade(educationRecord.fromGrade);
        } catch (e) {
            errorList.push(e);
        }
        try {
            education.setToGrade(educationRecord.toGrade);
        } catch (e) {
            errorList.push(e);
        }
        try {
            education.setFromYear(educationRecord.fromYear);
        } catch (e) {
            errorList.push(e);
        }
        try {
            education.setToYear(educationRecord.toYear);
        } catch (e) {
            errorList.push(e);
        }
        try {
            education.setDescription(educationRecord.description);
        } catch (e) {
            errorList.push(e);
        }
        try {
            education.setIsActive(educationRecord.isActive);
        } catch (e) {
            errorList.push(e);
        }
        try {
            education.setLogo(educationRecord.logo);
        } catch (e) {
            errorList.push(e);
        }
        if (errorList.length) {
            throw {
                status: REQUEST_CODES.FAIL,
                error: errorList
            };
        }
    }
    return education;
}

module.exports.EducationAPI = EducationAPI;
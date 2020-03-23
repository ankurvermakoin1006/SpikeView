var utils = require('../../commons/utils').utils;
var VALIDATE = utils.CONSTANTS.VALIDATE;
var validate = utils.validate;

var Organizations = function () {
    return {
        organizationId :0,
        name : null,
        description:null,
        address : {},
        type : null, 
        isActive : false
    }
};

function OrganizationsAPI(organizationRecord) {
    var organization = new Organizations();
    organization.getOrganizationId = function () {
        return this.organizationId;
    };
    organization.setOrganizationId = function (organizationId) {
        if (organizationId) {
            if (validate.isInteger(organizationId)) {
                this.organizationId = organizationId;
            } else {
                throw {
                    status: VALIDATE.FAIL,
                    message: utils.formatText(VALIDATE.NOT_A_INTEGER, organizationId, 'organizationId')
                };
            }
        }
    };
    organization.getName = function () {
        return this.name;
    };
    organization.setName = function (name) {
        if (name) {
            if (name.length <= 50) {
                this.name = name;
            } else {
                throw {
                    status: VALIDATE.FAIL,
                    message: utils.formatText(VALIDATE.VALUE_TOO_BIG, name, 'Name')
                };
            }
        }
    };
    organization.getDescription = function () {
        return this.description;
    };
    organization.setDescription = function (description) {
        if (description) {
            if (description.length <= 50) {
                this.description = description;
            } else {
                throw {
                    status: VALIDATE.FAIL,
                    message: utils.formatText(VALIDATE.VALUE_TOO_BIG, description, 'Description')
                };
            }
        }
    }; 
    organization.getLogo = function () {
        return this.logo;
    };
    organization.setLogo = function (logo) {
        this.logo = logo;
    } 
    organization.getType= function () {
        return this.type;
    };
    organization.setType = function (type) {
        this.type = type;
    };
    organization.getAddress = function () {
        return this.address;
    };
    organization.setAddress = function (address) {
        this.address = address;
    }
    organization.getIsActive = function () {
        return this.isActive;
    };
    organization.setIsActive = function (isActive) {
        this.isActive = isActive;
    }
      
    if (organizationRecord) {
        var errorList = [];
        try {
            organization.setOrganizationId(organizationRecord.organizationId);
        } catch (e) {
            errorList.push(e);
        }
        try {
            organization.setName(organizationRecord.name);
        } catch (e) {
            errorList.push(e);
        }
        try {
            organization.setDescription(organizationRecord.description);
        } catch (e) {
            errorList.push(e);
        }
        try {
            organization.setType(organizationRecord.type);
        } catch (e) {
            errorList.push(e);
        } 
        try {
            organization.setAddress(organizationRecord.address);
        } catch (e) {
            errorList.push(e);
        }
        try {
            organization.setLogo(organizationRecord.logo);
        } catch (e) {
            errorList.push(e);
        }
        try {
            organization.setIsActive(organizationRecord.isActive);
        } catch (e) {
            errorList.push(e);
        }           
    }    
    return organization;
}


module.exports.OrganizationsAPI = OrganizationsAPI;


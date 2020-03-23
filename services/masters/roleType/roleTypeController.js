var utils = require('../../../commons/utils').utils;
var CONSTANTS = utils.CONSTANTS;
var REQUEST_CODES = CONSTANTS.REQUEST_CODES;
var ROLE_TYPE_CODES = CONSTANTS.ROLE_TYPE;
var VALIDATE = utils.CONSTANTS.VALIDATE;
var validate = utils.validate;

var RoleType = function () {
    return {
        roleTypeId: 0,
        roleName: null,
        description: null,
        image: null      
    }
};

function RoleTypeAPI(roleTypeRecord) {
    var roleType = new RoleType();

    roleType.getRoleTypeId = function () {
        return this.roleTypeId;
    };
    roleType.setRoleTypeId = function (roleTypeId) {
        if (roleTypeId) {
            if (validate.isInteger(roleTypeId)) {
                this.roleTypeId = roleTypeId
            }
            else {
                throw {
                    status: VALIDATE.FAIL,
                    error: utils.formatText(VALIDATE.NOT_A_INTEGER, roleTypeId, 'roleTypeId')
                };
            }
        }
    };    

    roleType.getRoleName = function () {
        return this.roleName;
    };
    roleType.setRoleName = function (roleName) {
        if (roleName) {
            if (roleName.length <= 200) {
                this.roleName = roleName;
            }
            else {
                throw {
                    status: VALIDATE.FAIL,
                    error: utils.formatText(VALIDATE.VALUE_TOO_BIG, roleName, 'RoleName')
                };
            }
        }
    };

    roleType.getDescription = function () {
        return this.description;
    };
    roleType.setDescription = function (description) {
        if (description) {
            if (description.length <= 200) {
                this.description = description;
            }
            else {
                throw {
                    status: VALIDATE.FAIL,
                    error: utils.formatText(VALIDATE.VALUE_TOO_BIG, description, 'Description')
                };
            }
        }
    };
    roleType.getImage = function () {
        return this.image;
    };
    roleType.setImage = function (image) {       
        this.image = image;          
    };
    if (roleTypeRecord) {
        var errorList = [];
        try {
            roleType.setRoleTypeId(roleTypeRecord.roleTypeId);
        }
        catch (e) {
            errorList.push(e);
        }
        try {
            roleType.setRoleName(roleTypeRecord.roleName);
        }
        catch (e) {
            errorList.push(e);
        }
        try {
            roleType.setDescription(roleTypeRecord.description);
        }
        catch (e) {
            errorList.push(e);
        }
        try {
            roleType.setImage(roleTypeRecord.image);
        }
        catch (e) {
            errorList.push(e);
        }
        if (errorList.length) {
            throw {
                status: REQUEST_CODES.FAIL,
                error: errorList
            };
        }
    }
    return roleType;
}

module.exports.RoleTypeAPI = RoleTypeAPI;
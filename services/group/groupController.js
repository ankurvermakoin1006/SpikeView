var utils = require('../../commons/utils').utils;
var CONSTANTS = utils.CONSTANTS;
var REQUEST_CODES = CONSTANTS.REQUEST_CODES;
var VALIDATE = utils.CONSTANTS.VALIDATE;
var validate = utils.validate;

var Group = function () {
    return {
        groupId: 0,
        groupName: null,
        members: new Array(),
        type: null,
        creationDate: 0,
        createdBy: 0,
        isActive: true,
        aboutGroup: null,
        otherInfo: null,
        groupImage: null
    }
};

function GroupAPI(groupRecord) {
    var group = new Group();

    group.getGroupId = function () {
        return this.groupId;
    };
    group.setGroupId = function (groupId) {
        if (groupId) {
            if (validate.isInteger(groupId)) {
                this.groupId = groupId
            } else {
                throw {
                    status: VALIDATE.FAIL,
                    error: utils.formatText(VALIDATE.NOT_A_INTEGER, groupId, 'groupId')
                };
            }
        }
    };

    group.getGroupName = function () {
        return this.groupName;
    };
    group.setGroupName = function (groupName) {
        this.groupName = groupName;
    };

    group.getMembers = function () {
        return this.members;
    };
    group.setMembers = function (members) {
        this.members = members;
    };

    group.getType = function () {
        return this.type;
    };
    group.setType = function (type) {
        this.type = type;
    };

    group.getCreationDate = function () {
        return this.zip;
    };
    group.setCreationDate = function (creationDate) {
        this.creationDate = creationDate
    };

    group.getCreatedBy = function () {
        return this.createdBy;
    };
    group.setCreatedBy = function (createdBy) {
        this.createdBy = createdBy;
    };

    group.getRoleId = function () {
        return this.roleId;
    };
    group.setRoleId = function (roleId) {
        this.roleId = roleId;
    };

    group.getIsActive = function () {
        return this.isActive;
    };
    group.setIsActive = function (isActive) {
        this.isActive = isActive;
    };

    group.getAboutGroup = function () {
        return this.aboutGroup;
    };
    group.setAboutGroup = function (aboutGroup) {
        this.aboutGroup = aboutGroup;
    };

    group.getOtherInfo = function () {
        return this.otherInfo;
    };
    group.setOtherInfo = function (otherInfo) {
        this.otherInfo = otherInfo;
    };

    group.getGroupImage = function () {
        return this.groupName;
    };
    group.setGroupImage = function (groupImage) {
        this.groupImage = groupImage;
    };

    if (groupRecord) {
        var errorList = [];
        try {
            group.setGroupId(groupRecord.groupId);
        } catch (e) {
            errorList.push(e);
        }
        try {
            group.setGroupName(groupRecord.groupName)
        } catch (e) {
            errorList.push(e);
        }
        try {
            group.setMembers(groupRecord.members);
        } catch (e) {
            errorList.push(e);
        }
        try {
            group.setType(groupRecord.type);
        } catch (e) {
            errorList.push(e);
        }
        try {
            group.setCreationDate(groupRecord.creationDate);
        } catch (e) {
            errorList.push(e);
        }
        try {
            group.setCreatedBy(groupRecord.createdBy);
        } catch (e) {
            errorList.push(e);
        }
        try {
            group.setRoleId(groupRecord.roleId);
        } catch (e) {
            errorList.push(e);
        }
        try {
            group.setIsActive(groupRecord.isActive);
        } catch (e) {
            errorList.push(e);
        }
        try {
            group.setAboutGroup(groupRecord.aboutGroup);
        } catch (e) {
            errorList.push(e);
        }
        try {
            group.setOtherInfo(groupRecord.otherInfo);
        } catch (e) {
            errorList.push(e);
        }
        try {
            group.setGroupImage(groupRecord.groupImage);
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
    return group;
}

module.exports.GroupAPI = GroupAPI;
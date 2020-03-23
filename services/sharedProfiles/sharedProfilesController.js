var utils = require('../../commons/utils').utils;
var VALIDATE = utils.CONSTANTS.VALIDATE;
var validate = utils.validate;

var SharedProfiles = function () {
    return {
        sharedId: 0,
        sharedType: null,
        sharedView: null,
        theme: null,
        profileOwner: 0,
        profileOwnerRoleId:0,
        shareTo: 0,
        shareRoleId: 0,     
        shareTime: 0,
        shareConfiguration: new Array(),
        soundtrack: new Array(),
        isActive: true,
        isViewed: false,
        lastViewedTime: 0
    }
};

function SharedProfilesAPI(sharedProfilesRecord) {
    var sharedProfiles = new SharedProfiles();
    sharedProfiles.getSharedId = function () {
        return this.sharedId;
    };
    sharedProfiles.setSharedId = function (sharedId) {
        if (sharedId) {
            if (validate.isInteger(sharedId)) {
                this.sharedId = sharedId;
            } else {
                throw {
                    status: VALIDATE.FAIL,
                    message: utils.formatText(VALIDATE.NOT_A_INTEGER, sharedId, 'sharedId')
                };
            }
        }
    };
    sharedProfiles.getProfileOwner = function () {
        return this.profileOwner;
    };
    sharedProfiles.setProfileOwner = function (profileOwner) {
        this.profileOwner = profileOwner;
    };
    sharedProfiles.getProfileOwnerRoleId = function () {
        return this.profileOwnerRoleId;
    };
    sharedProfiles.setProfileOwnerRoleId = function (profileOwnerRoleId) {
        this.profileOwnerRoleId = profileOwnerRoleId;
    };
    sharedProfiles.getShareRoleId = function () {
        return this.shareRoleId;
    };
    sharedProfiles.setShareRoleId = function (shareRoleId) {
        this.shareRoleId = shareRoleId;
    };
    sharedProfiles.getSharedType = function () {
        return this.sharedType;
    };
    sharedProfiles.setSharedType = function (sharedType) {
        this.sharedType = sharedType;
    };
    sharedProfiles.getSharedView = function () {
        return this.sharedView;
    };
    sharedProfiles.setSharedView = function (sharedView) {
        this.sharedView = sharedView;
    };
    sharedProfiles.getShareTo = function () {
        return this.shareTo;
    };
    sharedProfiles.setShareTo = function (shareTo) {
        this.shareTo = shareTo;
    };
    sharedProfiles.getShareTime = function () {
        return this.shareTime;
    };
    sharedProfiles.setShareTime = function (shareTime) {
        this.shareTime = shareTime;
    };
    sharedProfiles.getShareConfiguration = function () {
        return this.shareConfiguration;
    };
    sharedProfiles.setShareConfiguration = function (shareConfiguration) {
        this.shareConfiguration = shareConfiguration;
    };
    sharedProfiles.getIsActive = function () {
        return this.isActive;
    };
    sharedProfiles.setIsActive = function (isActive) {
        this.isActive = isActive;
    };
    sharedProfiles.getIsViewed = function () {
        return this.isViewed;
    };
    sharedProfiles.setIsViewed = function (isViewed) {
        this.isViewed = isViewed;
    };
    sharedProfiles.getLastViewedTime = function () {
        return this.lastViewedTime;
    };
    sharedProfiles.setLastViewedTime = function (lastViewedTime) {
        this.lastViewedTime = lastViewedTime;
    };
    sharedProfiles.getTheme = function () {
        return this.theme;
    };
    sharedProfiles.setTheme = function (theme) {
        this.theme = theme;
    };
    sharedProfiles.getSoundtrack = function () {
        return this.soundtrack;
    };
    sharedProfiles.setSoundtrack = function (soundtrack) {
        this.soundtrack = soundtrack;
    };

    if (sharedProfilesRecord) {
        var errorList = [];
        try {
            sharedProfiles.setSharedId(sharedProfilesRecord.sharedId);
        } catch (e) {
            errorList.push(e);
        }
        try {
            sharedProfiles.setProfileOwner(sharedProfilesRecord.profileOwner);
        } catch (e) {
            errorList.push(e);
        }
        try {
            sharedProfiles.setSharedType(sharedProfilesRecord.sharedType);
        } catch (e) {
            errorList.push(e);
        }
        try {
            sharedProfiles.setSharedView(sharedProfilesRecord.sharedView);
        } catch (e) {
            errorList.push(e);
        }
        try {
            sharedProfiles.setProfileOwnerRoleId(sharedProfilesRecord.profileOwnerRoleId);
        } catch (e) {
            errorList.push(e);
        }
        try {
            sharedProfiles.setShareRoleId(sharedProfilesRecord.shareRoleId);
        } catch (e) {
            errorList.push(e);
        }
        try {
            sharedProfiles.setShareTo(sharedProfilesRecord.shareTo);
        } catch (e) {
            errorList.push(e);
        }
        try {
            sharedProfiles.setShareTime(sharedProfilesRecord.shareTime);
        } catch (e) {
            errorList.push(e);
        }
        try {
            sharedProfiles.setShareConfiguration(sharedProfilesRecord.shareConfiguration);
        } catch (e) {
            errorList.push(e);
        }
        try {
            sharedProfiles.setIsActive(sharedProfilesRecord.isActive);
        } catch (e) {
            errorList.push(e);
        }
        try {
            sharedProfiles.setIsViewed(sharedProfilesRecord.isViewed);
        } catch (e) {
            errorList.push(e);
        }
        try {
            sharedProfiles.setLastViewedTime(sharedProfilesRecord.lastViewedTime);
        } catch (e) {
            errorList.push(e);
        }
        try {
            sharedProfiles.setTheme(sharedProfilesRecord.theme);
        } catch (e) {
            errorList.push(e);
        }
        try {
            sharedProfiles.setSoundtrack(sharedProfilesRecord.soundtrack);
        } catch (e) {
            errorList.push(e);
        }
    }
    return sharedProfiles;
}

module.exports.SharedProfilesAPI = SharedProfilesAPI;
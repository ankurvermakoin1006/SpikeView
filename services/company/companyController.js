var commons = require('../../commons/constants');
var utils = require('../../commons/utils').utils;
var CONSTANTS = commons.CONSTANTS;
var REQUEST_CODES = CONSTANTS.REQUEST_CODES;
var VALIDATE = commons.CONSTANTS.VALIDATE;
var validate = utils.validate;

var Company = function () {
    return {
        companyId: 0,
        userId: 0,
        roleId: 0,
        name: null,
        address: null,
        phone: null,
        url: null,
        about: null,
        offer: new Array(),
        asset: new Array(),
        createdAt: 0,
        isActive: false,
        profilePicture: null,
        coverPicture: null
    }
};

function CompanyAPI(companyRecord) {
    var company = new Company();

    company.getCompanyId = function () {
        return this.companyId;
    };
    company.setCompanyId = function (companyId) {
        if (companyId) {
            if (validate.isInteger(companyId)) {
                this.companyId = companyId;
            } else {
                throw {
                    status: VALIDATE.FAIL,
                    error: utils.formatText(VALIDATE.NOT_A_INTEGER, companyId, 'companyId')
                };
            }
        }
    };

    company.getUserId = function () {
        return this.userId;
    };
    company.setUserId = function (userId) {
        this.userId = userId;
    };

    company.getRoleId = function () {
        return this.roleId;
    };
    company.setRoleId = function (roleId) {
        this.roleId = roleId;
    };

    company.getName = function () {
        return this.name;
    };
    company.setName = function (name) {
        this.name = name;
    };

    company.getAddress = function () {
        return this.address;
    };
    company.setAddress = function (address) {
        this.address = address;
    };

    company.getPhone = function () {
        return this.phone;
    };
    company.setPhone = function (phone) {
        this.phone = phone;
    };

    company.getUrl = function () {
        return this.url;
    };
    company.setUrl = function (url) {
        this.url = url;
    };

    company.getAbout = function () {
        return this.about;
    };
    company.setAbout = function (about) {
        this.about = about;
    };

    company.getOffer = function () {
        return this.offer;
    };
    company.setOffer = function (offer) {
        this.offer = offer;
    };

    company.getAsset = function () {
        return this.asset;
    };
    company.setAsset = function (asset) {
        this.asset = asset;
    };

    company.getCreatedAt = function () {
        return this.createdAt;
    };
    company.setCreatedAt = function (createdAt) {
        this.createdAt = createdAt;
    };

    company.getIsActive = function () {
        return this.isActive;
    };
    company.setIsActive = function (isActive) {
        this.isActive = isActive;
    };

    company.getProfilePicture = function () {
        return this.profilePicture;
    };
    company.setProfilePicture = function (profilePicture) {
        this.profilePicture = profilePicture;
    };

    company.getCoverPicture = function () {
        return this.coverPicture;
    };
    company.setCoverPicture = function (coverPicture) {
        this.coverPicture = coverPicture;
    };

    if (companyRecord) {
        var errorList = [];
        try {
            company.setCompanyId(companyRecord.companyId);
        } catch (e) {
            errorList.push(e);
        }
        try {
            company.setUserId(companyRecord.userId);
        } catch (e) {
            errorList.push(e);
        }
        try {
            company.setRoleId(companyRecord.roleId);
        } catch (e) {
            errorList.push(e);
        }
        try {
            company.setName(companyRecord.name);
        } catch (e) {
            errorList.push(e);
        }
        try {
            company.setAddress(companyRecord.address);
        } catch (e) {
            errorList.push(e);
        }
        try {
            company.setPhone(companyRecord.phone);
        } catch (e) {
            errorList.push(e);
        }
        try {
            company.setUrl(companyRecord.websiteUrl);
        } catch (e) {
            errorList.push(e);
        }
        try {
            company.setAbout(companyRecord.about);
        } catch (e) {
            errorList.push(e);
        }
        try {
            company.setOffer(companyRecord.offer);
        } catch (e) {
            errorList.push(e);
        }
        try {
            company.setAsset(companyRecord.asset);
        } catch (e) {
            errorList.push(e);
        }
        try {
            company.setIsActive(companyRecord.isActive);
        } catch (e) {
            errorList.push(e);
        }
        try {
            company.setProfilePicture(companyRecord.profilePicture);
        } catch (e) {
            errorList.push(e);
        }
        try {
            company.setCoverPicture(companyRecord.coverPicture);
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
    return company;
}

module.exports.CompanyAPI = CompanyAPI;
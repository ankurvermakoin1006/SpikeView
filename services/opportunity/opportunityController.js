var commons = require('../../commons/constants');
var utils = require('../../commons/utils').utils;
var CONSTANTS = commons.CONSTANTS;
var REQUEST_CODES = CONSTANTS.REQUEST_CODES;
var VALIDATE = commons.CONSTANTS.VALIDATE;
var validate = utils.validate;

var Opportunity = function () {
    return {
        opportunityId: 0,
        userId: 0,
        roleId: 0,
        jobTitle: null,
        jobType: null,
        jobLocation: null,
        project: null,
        duration: null,
        status: null,
        asset: new Array(),
        fromDate: 0,
        toDate: 0,
        groupId: 0,
        targetAudience: Boolean,
        title: null,
        location: null,
        gender: null,
        age: new Array(),
        interestType: new Object(),
        interests: new Array(),
        companyId: 0,
        offerId: 0,
        serviceTitle: null,
        serviceDesc: null,
        isActive: true,
        expiresOn: 0,
        withdraw: Boolean,
        callToAction: new Array,
        userList: new Array,
        likes: new Array,
        comments: new Array,
        shareText: null,
        shareTime: 0,
        tags: new Array,
        lastActivityTime: 0,
        group: new Array(),
        parents: new Array(),
        inquiry: new Array
    }
};

function OpportunityAPI(opportunityRecord) {
    var opportunity = new Opportunity();

    opportunity.getOpportunityId = function () {
        return this.opportunityId;
    };
    opportunity.setOpportunityId = function (opportunityId) {
        if (opportunityId) {
            if (validate.isInteger(opportunityId)) {
                this.opportunityId = opportunityId;
            } else {
                throw {
                    status: VALIDATE.FAIL,
                    error: utils.formatText(VALIDATE.NOT_A_INTEGER, opportunityId, 'opportunityId')
                };
            }
        }
    };

    opportunity.getUserId = function () {
        return this.userId;
    };
    opportunity.setUserId = function (userId) {
        this.userId = userId;
    };
    opportunity.getRoleId = function () {
        return this.roleId;
    };
    opportunity.setRoleId = function (roleId) {
        this.roleId = roleId;
    };
    opportunity.getJobTitle = function () {
        return this.jobTitle;
    };
    opportunity.setJobTitle = function (jobTitle) {
        this.jobTitle = jobTitle;
    };

    opportunity.getJobType = function () {
        return this.jobType;
    };
    opportunity.setJobType = function (jobType) {
        this.jobType = jobType;
    };

    opportunity.getJobLocation = function () {
        return this.jobLocation;
    };
    opportunity.setJobLocation = function (jobLocation) {
        this.jobLocation = jobLocation;
    };

    opportunity.getProject = function () {
        return this.project;
    };
    opportunity.setProject = function (project) {
        this.project = project;
    };

    opportunity.getDuration = function () {
        return this.duration;
    };
    opportunity.setDuration = function (duration) {
        this.duration = duration;
    };

    opportunity.getStatus = function () {
        return this.status;
    };
    opportunity.setStatus = function (status) {
        this.status = status;
    };

    opportunity.getAsset = function () {
        return this.asset;
    };
    opportunity.setAsset = function (asset) {
        this.asset = asset;
    };

    opportunity.getFromDate = function () {
        return this.status;
    };
    opportunity.setFromDate = function (fromDate) {
        this.fromDate = fromDate;
    };

    opportunity.getToDate = function () {
        return this.toDate;
    };
    opportunity.setToDate = function (toDate) {
        this.toDate = toDate;
    };

    opportunity.getGroupId = function () {
        return this.groupId;
    };
    opportunity.setGroupId = function (groupId) {
        this.groupId = groupId;
    };

    opportunity.getTargetAudience = function () {
        return this.targetAudience;
    };
    opportunity.setTargetAudience = function (targetAudience) {
        this.targetAudience = targetAudience;
    };

    opportunity.getTitle = function () {
        return this.title;
    };
    opportunity.setTitle = function (title) {
        this.title = title;
    };

    opportunity.getLocation = function () {
        return this.location;
    };
    opportunity.setLocation = function (location) {
        this.location = location;
    };

    opportunity.getGender = function () {
        return this.gender;
    };
    opportunity.setGender = function (gender) {
        this.gender = gender;
    };

    opportunity.getAge = function () {
        return this.age;
    };
    opportunity.setAge = function (age) {
        this.age = age;
    };

    opportunity.getInterestType = function () {
        return this.interestType;
    };
    opportunity.setInterestType = function (interestType) {
        this.interestType = interestType;
    };
    opportunity.getInterests = function () {
        return this.interests;
    };
    opportunity.setInterests = function (interests) {
        this.interests = interests;
    };

    opportunity.getCompanyId = function () {
        return this.companyId;
    };
    opportunity.setCompanyId = function (companyId) {
        this.companyId = companyId;
    };

    opportunity.getOfferId = function () {
        return this.offerId;
    };
    opportunity.setOfferId = function (offerId) {
        this.offerId = offerId;
    };

    opportunity.getServiceTitle = function () {
        return this.serviceTitle;
    };
    opportunity.setServiceTitle = function (serviceTitle) {
        this.serviceTitle = serviceTitle;
    };

    opportunity.getServiceDesc = function () {
        return this.serviceDesc;
    };
    opportunity.setServiceDesc = function (serviceDesc) {
        this.serviceDesc = serviceDesc;
    };

    opportunity.getIsActive = function () {
        return this.isActive;
    };
    opportunity.setIsActive = function (isActive) {
        this.isActive = isActive;
    };
    opportunity.getExpiresOn = function () {
        return this.expiresOn;
    };
    opportunity.setExpiresOn = function (expiresOn) {
        this.expiresOn = expiresOn;
    };
    opportunity.getWithdraw = function () {
        return this.withdraw;
    };
    opportunity.setWithdraw = function (withdraw) {
        this.withdraw = withdraw;
    };
    opportunity.getCallToAction = function () {
        return this.callToAction;
    };
    opportunity.setCallToAction = function (callToAction) {
        this.callToAction = callToAction;
    };
    opportunity.getUserList = function () {
        return this.userList;
    };
    opportunity.setUserList = function (userList) {
        this.userList = userList;
    };

    opportunity.getLikes = function () {
        return this.likes;
    };
    opportunity.setLikes = function (likes) {
        this.likes = likes;
    };

    opportunity.getComments = function () {
        return this.userList;
    };
    opportunity.setComments = function (userList) {
        this.userList = userList;
    };

    opportunity.getShareText = function () {
        return this.shareText;
    };
    opportunity.setShareText = function (shareText) {
        this.shareText = shareText;
    }

    opportunity.getShareTime = function () {
        return this.shareTime;
    };
    opportunity.setShareTime = function (shareTime) {
        if (shareTime) {
            this.shareTime = shareTime;
        } else {
            this.shareTime = 0;
        }
    }
    opportunity.getTags = function () {
        return this.tags;
    };
    opportunity.setTags = function (tags) {
        this.tags = tags;
    }

    opportunity.getLastActivityTime = function () {
        return this.lastActivityTime;
    };
    opportunity.setLastActivityTime = function (lastActivityTime) {
        if (lastActivityTime) {
            this.lastActivityTime = lastActivityTime;
        } else {
            this.lastActivityTime = 0;
        }
    }

    opportunity.getGroup = function () {
        return this.group;
    };
    opportunity.setGroup = function (group) {
        this.group = group;
    }

    opportunity.getParents = function () {
        return this.parents;
    };
    opportunity.setParents = function (parents) {
        this.parents = parents;
    }

    opportunity.getInquiry = function () {
        return this.inquiry;
    };
    opportunity.setInquiry = function (inquiry) {
        this.inquiry = inquiry;
    }

    if (opportunityRecord) {
        var errorList = [];

        try {
            opportunity.setOpportunityId(opportunityRecord.opportunityId);
        } catch (error) {
            errorList.push(error);
        }
        try {
            opportunity.setUserId(opportunityRecord.userId);
        } catch (error) {
            errorList.push(error);
        }
        try {
            opportunity.setRoleId(opportunityRecord.roleId);
        } catch (error) {
            errorList.push(error);
        }
        try {
            opportunity.setJobTitle(opportunityRecord.jobTitle);
        } catch (error) {
            errorList.push(error);
        }
        try {
            opportunity.setJobType(opportunityRecord.jobType);
        } catch (error) {
            errorList.push(error);
        }
        try {
            opportunity.setJobLocation(opportunityRecord.jobLocation);
        } catch (error) {
            errorList.push(error);
        }
        try {
            opportunity.setProject(opportunityRecord.project);
        } catch (error) {
            errorList.push(error);
        }
        try {
            opportunity.setDuration(opportunityRecord.duration);
        } catch (error) {
            errorList.push(error);
        }
        try {
            opportunity.setStatus(opportunityRecord.status);
        } catch (error) {
            errorList.push(error);
        }
        try {
            opportunity.setAsset(opportunityRecord.asset);
        } catch (error) {
            errorList.push(error);
        }
        try {
            opportunity.setFromDate(opportunityRecord.fromDate);
        } catch (error) {
            errorList.push(error);
        }
        try {
            opportunity.setToDate(opportunityRecord.toDate);
        } catch (error) {
            errorList.push(error);
        }
        try {
            opportunity.setGroupId(opportunityRecord.groupId);
        } catch (error) {
            errorList.push(error);
        }
        try {
            opportunity.setTargetAudience(opportunityRecord.targetAudience);
        } catch (error) {
            errorList.push(error);
        }
        try {
            opportunity.setTitle(opportunityRecord.title);
        } catch (error) {
            errorList.push(error);
        }
        try {
            opportunity.setLocation(opportunityRecord.location);
        } catch (error) {
            errorList.push(error);
        }
        try {
            opportunity.setGender(opportunityRecord.gender);
        } catch (error) {
            errorList.push(error);
        }
        try {
            opportunity.setAge(opportunityRecord.age);
        } catch (error) {
            errorList.push(error);
        }
        try {
            opportunity.setInterestType(opportunityRecord.interestType);
        } catch (error) {
            errorList.push(error);
        }
        try {
            opportunity.setInterests(opportunityRecord.interests);
        } catch (error) {
            errorList.push(error);
        }
        try {
            opportunity.setCompanyId(opportunityRecord.companyId);
        } catch (error) {
            errorList.push(error);
        }
        try {
            opportunity.setOfferId(opportunityRecord.offerId);
        } catch (error) {
            errorList.push(error);
        }
        try {
            opportunity.setServiceTitle(opportunityRecord.serviceTitle);
        } catch (error) {
            errorList.push(error);
        }
        try {
            opportunity.setServiceDesc(opportunityRecord.serviceDesc);
        } catch (error) {
            errorList.push(error);
        }
        try {
            opportunity.setIsActive(opportunityRecord.isActive);
        } catch (error) {
            errorList.push(error);
        }
        try {
            opportunity.setExpiresOn(opportunityRecord.expiresOn);
        } catch (error) {
            errorList.push(error);
        }
        try {
            opportunity.setWithdraw(opportunityRecord.withdraw);
        } catch (error) {
            errorList.push(error);
        }
        try {
            opportunity.setCallToAction(opportunityRecord.callToAction);
        } catch (error) {
            errorList.push(error);
        }
        try {
            opportunity.setUserList(opportunityRecord.userList);
        } catch (error) {
            errorList.push(error);
        }
        try {
            opportunity.setLikes(opportunityRecord.likes);
        } catch (error) {
            errorList.push(error);
        }
        try {
            opportunity.setComments(opportunityRecord.comments);
        } catch (error) {
            errorList.push(error);
        }
        try {
            opportunity.setShareText(opportunityRecord.shareText);
        } catch (error) {
            errorList.push(error);
        }
        try {
            opportunity.setShareTime(opportunityRecord.shareTime);
        } catch (error) {
            errorList.push(error);
        }
        try {
            opportunity.setTags(opportunityRecord.tags);
        } catch (error) {
            errorList.push(error);
        }
        try {
            opportunity.setLastActivityTime(opportunityRecord.lastActivityTime);
        } catch (error) {
            errorList.push(error);
        }
        try {
            opportunity.setGroup(opportunityRecord.group);
        } catch (error) {
            errorList.push(error);
        }
        try {
            opportunity.setParents(opportunityRecord.parents);
        } catch (error) {
            errorList.push(error);
        }
        try {
            opportunity.setInquiry(opportunityRecord.inquiry);
        } catch (error) {
            errorList.push(error);
        }

        if (errorList.length) {
            throw {
                status: REQUEST_CODES.FAIL,
                error: errorList
            };
        }

    }
    return opportunity;
}

module.exports.OpportunityAPI = OpportunityAPI;
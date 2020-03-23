var commons = require('../../commons/constants');
var utils = require('../../commons/utils').utils;
var CONSTANTS = commons.CONSTANTS;
var REQUEST_CODES = CONSTANTS.REQUEST_CODES;
var VALIDATE = commons.CONSTANTS.VALIDATE;
var validate = utils.validate;

var Feed = function () {
    return {
        feedId: 0,
        post: {},
        postedBy: 0,
        roleId: 0,
        dateTime: 0,
        isActive: true,
        visibility: null,
        scope: new Array(),
        likes: new Array(),
        comments: new Array(),
        postOwner: 0,
        postOwnerRole: 0,
        postOwnerFeedId: 0,
        postOwnerDeleted: false,
        shareText: null,
        shareTime: 0,
        groupId: 0,
        lastActivityTime: 0,
        lastActivityType: null,
        reportedBy: new Array(),
        hideBy: new Array(),
        interest: new Array(),
        numberOfClick: 0,
        metaTags: new Object(),
        opportunityId: 0
    }
};

function FeedAPI(feedRecord) {

    var feed = new Feed();
    feed.getFeedId = function () {
        return this.feedId;
    };
    feed.setFeedId = function (feedId) {

        if (feedId) {
            if (validate.isInteger(feedId)) {
                this.feedId = feedId;
            } else {
                throw {
                    status: VALIDATE.FAIL,
                    error: utils.formatText(VALIDATE.NOT_A_INTEGER, feedId, 'feedId')
                };
            }
        }
    };
    feed.getPost = function () {
        return this.post;
    };
    feed.setPost = function (post) {
        this.post = post;
    }
    feed.getPostedBy = function () {
        return this.postedBy;
    };
    feed.setPostedBy = function (postedBy) {
        this.postedBy = postedBy;
    }
    feed.getRoleId = function () {
        return this.roleId;
    };
    feed.setRoleId = function (roleId) {
        if (roleId) {
            this.roleId = roleId;
        } else {
            this.roleId = 0;
        }
    }
    feed.getDateTime = function () {
        return this.dateTime;
    };
    feed.setDateTime = function (dateTime) {
        this.dateTime = dateTime;
    }
    feed.setStatus = function (status) {
        this.status = status;
    }
    feed.getIsActive = function () {
        return this.isActive;
    };
    feed.setIsActive = function (isActive) {
        this.isActive = isActive;
    }
    feed.getVisibility = function () {
        return this.visibility;
    };
    feed.setVisibility = function (visibility) {
        this.visibility = visibility;
    }
    feed.getScope = function () {
        return this.scope;
    };
    feed.setScope = function (scope) {
        this.scope = scope;
    }
    feed.getLikes = function () {
        return this.likes;
    };
    feed.setLikes = function (likes) {
        this.likes = likes;
    }
    feed.setComments = function (comments) {
        this.comments = comments
    }
    feed.getComments = function () {
        return this.comments;
    }
    feed.getPostOwner = function () {
        return this.postOwner;
    };
    feed.setPostOwner = function (postOwner) {
        if (postOwner) {
            this.postOwner = postOwner;
        } else {
            this.postOwner = 0;
        }
    }
    feed.getPostOwnerRole = function () {
        return this.postOwnerRole;
    };
    feed.setPostOwnerRole = function (postOwnerRole) {
        if (postOwnerRole) {
            this.postOwnerRole = postOwnerRole;
        } else {
            this.postOwnerRole = 0;
        }
    }
    feed.getPostOwnerFeedId = function () {
        return this.postOwnerFeedId;
    };
    feed.setPostOwnerFeedId = function (postOwnerFeedId) {
        if (postOwnerFeedId) {
            this.postOwnerFeedId = postOwnerFeedId;
        } else {
            this.postOwnerFeedId = 0;
        }
    }
    feed.getPostOwnerDeleted = function () {
        return this.postOwnerDeleted;
    };
    feed.setPostOwnerDeleted = function (postOwnerDeleted) {
        this.postOwnerDeleted = postOwnerDeleted;
    }
    feed.getShareText = function () {
        return this.shareText;
    };
    feed.setShareText = function (shareText) {
        this.shareText = shareText;
    }
    feed.getShareTime = function () {
        return this.shareTime;
    };
    feed.setShareTime = function (shareTime) {
        if (shareTime) {
            this.shareTime = shareTime;
        } else {
            this.shareTime = 0;
        }

    }
    feed.getTags = function () {
        return this.tags;
    };
    feed.setTags = function (tags) {
        this.tags = tags;
    }

    feed.getGroupId = function () {
        return this.groupId;
    };
    feed.setGroupId = function (groupId) {
        this.groupId = groupId;
    }

    feed.getLastActivityTime = function () {
        return this.lastActivityTime;
    };
    feed.setLastActivityTime = function (lastActivityTime) {
        this.lastActivityTime = lastActivityTime;
    }

    feed.getLastActivityType = function () {
        return this.lastActivityType;
    };
    feed.setLastActivityType = function (lastActivityType) {
        this.lastActivityType = lastActivityType;
    }
    feed.getReportedBy = function () {
        return this.reportedBy;
    };
    feed.setReportedBy = function (reportedBy) {
        this.reportedBy = reportedBy;
    }
    feed.getHideBy = function () {
        return this.hideBy;
    };
    feed.setHideBy = function (hideBy) {
        this.hideBy = hideBy;
    }
    feed.getInterest = function () {
        return this.interest;
    };
    feed.setInterest = function (interest) {
        this.interest = interest;
    }
    feed.getNumberOfClick = function () {
        return this.numberOfClick;
    };
    feed.setNumberOfClick = function (numberOfClick) {
        if (numberOfClick) {
            this.numberOfClick = numberOfClick;
        } else {
            this.numberOfClick = 0;
        }
    }
    feed.getMetaTags = function () {
        return this.metaTags;
    };
    feed.setMetaTags = function (metaTags) {
        this.metaTags = metaTags;
    }
    feed.getOpportunityId = function () {
        return this.opportunityId;
    };
    feed.setOpportunityId = function (opportunityId) {
        this.opportunityId = opportunityId;
    }

    if (feedRecord) {
        var errorList = [];
        try {
            feed.setFeedId(feedRecord.feedId);
        } catch (e) {
            errorList.push(e);
        }
        try {
            feed.setPost(feedRecord.post);
        } catch (e) {
            errorList.push(e);
        }
        try {
            feed.setPostedBy(feedRecord.postedBy);
        } catch (e) {
            errorList.push(e);
        }
        try {
            feed.setRoleId(feedRecord.roleId);
        } catch (e) {
            errorList.push(e);
        }
        try {
            feed.setDateTime(feedRecord.dateTime);
        } catch (e) {
            errorList.push(e);
        }
        try {
            feed.setIsActive(feedRecord.isActive);
        } catch (e) {
            errorList.push(e);
        }
        try {
            feed.setVisibility(feedRecord.visibility);
        } catch (e) {
            errorList.push(e);
        }
        try {
            feed.setScope(feedRecord.scope);
        } catch (e) {
            errorList.push(e);
        }
        try {
            feed.setLikes(feedRecord.likes);
        } catch (e) {
            errorList.push(e);
        }
        try {
            feed.setComments(feedRecord.comments)
        } catch (error) {
            errorList.push(e);
        }
        try {
            feed.setPostOwner(feedRecord.postOwner)
        } catch (error) {
            errorList.push(e);
        }
        try {
            feed.setPostOwnerRole(feedRecord.postOwnerRole)
        } catch (error) {
            errorList.push(e);
        }
        try {
            feed.setPostOwnerFeedId(feedRecord.postOwnerFeedId)
        } catch (error) {
            errorList.push(e);
        }
        try {
            feed.setPostOwnerDeleted(feedRecord.postOwnerDeleted)
        } catch (error) {
            errorList.push(e);
        }
        try {
            feed.setShareText(feedRecord.shareText)
        } catch (error) {
            errorList.push(e);
        }
        try {
            feed.setShareTime(feedRecord.shareTime)
        } catch (error) {
            errorList.push(e);
        }
        try {
            feed.setTags(feedRecord.tags)
        } catch (error) {
            errorList.push(e);
        }
        try {
            feed.setGroupId(feedRecord.groupId)
        } catch (error) {
            errorList.push(e);
        }
        try {
            feed.setLastActivityTime(feedRecord.lastActivityTime)
        } catch (error) {
            errorList.push(e);
        }
        try {
            feed.setLastActivityType(feedRecord.lastActivityType)
        } catch (error) {
            errorList.push(e);
        }
        try {
            feed.setReportedBy(feedRecord.reportedBy)
        } catch (error) {
            errorList.push(e);
        }
        try {
            feed.setHideBy(feedRecord.hideBy)
        } catch (error) {
            errorList.push(e);
        }
        try {
            feed.setInterest(feedRecord.interest)
        } catch (error) {
            errorList.push(e);
        }
        try {
            feed.setNumberOfClick(feedRecord.numberOfClick)
        } catch (error) {
            errorList.push(e);
        }
        try {
            feed.setMetaTags(feedRecord.metaTags)
        } catch (error) {
            errorList.push(e);
        }
        try {
            feed.setOpportunityId(feedRecord.opportunityId)
        } catch (error) {
            errorList.push(e);
        }
        if (errorList.length) {
            throw {
                status: REQUEST_CODES.FAIL,
                error: errorList
            };
        }
    }
    return feed;
}

module.exports.FeedAPI = FeedAPI;
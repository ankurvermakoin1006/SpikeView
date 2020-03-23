var commons = require('../../commons/constants');
var utils = require('../../commons/utils').utils;
var CONSTANTS = commons.CONSTANTS;
var REQUEST_CODES = CONSTANTS.REQUEST_CODES;
var VALIDATE = commons.CONSTANTS.VALIDATE;
var validate = utils.validate;

var Recommendation = function() {
    return {
        recommendationId: 0,
        userId: 0,
        roleId: 0,
        recommenderId: 0,
        competencyTypeId: 0,
        level3Competency: null,
        level2Competency: null,
        title: null,
        request: null,
        recommendation: null,
        stage: null,
        interactionStartDate: null,
        interactionEndDate: null,
        badge: new Array(),
        certificate: new Array(),
        asset: new Array(),
        skills: new Array(),
        isActive: true, 
        likes: new Array(),
        requestedDate: null,
        repliedDate: null ,     
        recommenderTitle: null  
    }
};

function RecommendationAPI(recommendationRecord) {
    var recommendation = new Recommendation();

    recommendation.getRecommendationId = function () {
        return this.recommendationId;
    };
    recommendation.setRecommendationId = function (recommendationId) {
        if (recommendationId) {
            if (validate.isInteger(recommendationId)) {
                this.recommendationId = recommendationId;
            } else {
                throw {
                    status: VALIDATE.FAIL,
                    error: utils.formatText(VALIDATE.NOT_A_INTEGER, recommendationId, 'recommendationId')
                };
            }
        }
    };
    recommendation.getCompetencyTypeId = function () {
        return this.competencyTypeId;
    };
    recommendation.setCompetencyTypeId = function (competencyTypeId) {
        this.competencyTypeId = competencyTypeId;
    }
    recommendation.getLevel2Competency = function () {
        return this.level2Competency;
    };
    recommendation.setLevel2Competency = function (level2Competency) {
        this.level2Competency = level2Competency;
    }
    recommendation.getLevel3Competency = function () {
        return this.level3Competency;
    };
    recommendation.setLevel3Competency = function (level3Competency) {
        this.level3Competency = level3Competency;
    }
    recommendation.getUserId = function () {
        return this.userId;
    };
    recommendation.setUserId = function (userId) {
        this.userId = userId;
    }
    recommendation.getRoleId = function () {
        return this.roleId;
    };
    recommendation.setRoleId = function (roleId) {
        this.roleId = roleId;
    }
    recommendation.getTitle = function () {
        return this.title;
    };
    recommendation.setTitle = function (title) {
        this.title = title;
    }
    recommendation.getRequest = function () {
        return this.request;
    };
    recommendation.setRequest = function (request) {
        this.request = request;
    }
    recommendation.getRecommendation = function () {
        return this.recommendation;
    };
    recommendation.setRecommendation = function (recommendation) {
        this.recommendation = recommendation;
    }
    recommendation.getStage = function () {
        return this.stage;
    };
    recommendation.setStage = function (stage) {
        this.stage = stage;
    }
    recommendation.getInteractionStartDate = function () {
        return this.interactionStartDate;
    };
    recommendation.setInteractionStartDate = function (interactionStartDate) {
        this.interactionStartDate = interactionStartDate;
    }
    recommendation.getInteractionEndDate = function () {
        return this.interactionEndDate;
    };
    recommendation.setInteractionEndDate = function (interactionEndDate) {
        this.interactionEndDate = interactionEndDate;
    }
    recommendation.getSkills = function () {
        return this.skills;
    };
    recommendation.setSkills = function (skills) {
        this.skills = skills;
    }
    recommendation.getAsset = function () {
        return this.asset;
    };
    recommendation.setAsset = function (asset) {
        this.asset = asset;
    }
    recommendation.getBadge = function () {
        return this.badge;
    };
    recommendation.setBadge = function (badge) {
        this.badge = badge;
    }
    recommendation.getCertificate = function () {
        return this.certificate;
    };
    recommendation.setCertificate = function (certificate) {
        this.certificate = certificate;
    }
    recommendation.IsActive = function () {
        return this.isActive;
    };
    recommendation.setIsActive = function (isActive) {
        this.isActive = isActive;
    }    
    recommendation.setRecommenderId = function () {
        return this.recommenderId;
    };
    recommendation.setRecommenderId = function (recommenderId) {
        this.recommenderId = recommenderId;
    }
    recommendation.getLikes = function () {
        return this.likes;
    };
    recommendation.setLikes = function (likes) {
        this.likes = likes;
    };
    recommendation.getRequestedDate = function () {
        return this.requestedDate;
    };
    recommendation.setRequestedDate = function (requestedDate) {
        this.requestedDate = requestedDate;
    }
    recommendation.getRepliedDate = function () {
        return this.repliedDate;
    };
    recommendation.setRepliedDate = function (repliedDate) {
        this.repliedDate = repliedDate;
    }       
    recommendation.getRecommenderTitle = function () {
        return this.recommenderTitle;
    };
    recommendation.setRecommenderTitle = function (recommenderTitle) {
        this.recommenderTitle = recommenderTitle;
    }   
    
    if (recommendationRecord) {
        var errorList = [];
        try {
            recommendation.setRecommendationId(recommendationRecord.recommendationId);
        } catch (e) {
            errorList.push(e);
        }
        try {
             recommendation.setStage(recommendationRecord.stage);
        } catch (e) {
             errorList.push(e);
        }
        try {
            recommendation.setCompetencyTypeId(recommendationRecord.competencyTypeId);
        } catch (e) {
            errorList.push(e);
        }
        try {
            recommendation.setLevel2Competency(recommendationRecord.level2Competency);
        } catch (e) {
            errorList.push(e);
        }
        try {
            recommendation.setLevel3Competency(recommendationRecord.level3Competency);
        } catch (e) {
            errorList.push(e);
        }
        try {
            recommendation.setUserId(recommendationRecord.userId);
        } catch (e) {
            errorList.push(e);
        }
        try {
            recommendation.setRoleId(recommendationRecord.roleId);
        } catch (e) {
            errorList.push(e);
        }
        try {
            recommendation.setTitle(recommendationRecord.title);
        } catch (e) {
            errorList.push(e);
        }
        try {
            recommendation.setRequest(recommendationRecord.request);
        } catch (e) {
            errorList.push(e);
        }
        try {
            recommendation.setRecommendation(recommendationRecord.recommendation);
        } catch (e) {
            errorList.push(e);
        }
        try {
            recommendation.setInteractionStartDate(recommendationRecord.interactionStartDate);
        } catch (e) {
            errorList.push(e);
        }
        try {
            recommendation.setInteractionEndDate(recommendationRecord.interactionEndDate);
        } catch (e) {
            errorList.push(e);
        }
        try {
            recommendation.setSkills(recommendationRecord.skills);
        } catch (e) {
            errorList.push(e);
        }
        try {
            recommendation.setAsset(recommendationRecord.asset);
        } catch (e) {
            errorList.push(e);
        }
        try {
            recommendation.setBadge(recommendationRecord.badge);
        } catch (e) {
            errorList.push(e);
        }
        try {
            recommendation.setCertificate(recommendationRecord.certificate);
        } catch (e) {
            errorList.push(e);
        }
        try {
            recommendation.setIsActive(recommendationRecord.isActive);
        } catch (e) {
            errorList.push(e);
        }
        try {
            recommendation.setRecommenderId(recommendationRecord.recommenderId);
        } catch (e) {
            errorList.push(e);
        }
        try {
            recommendation.setLikes(recommendationRecord.likes);
        } catch (e) {
            errorList.push(e);
        }
        try {
            recommendation.setRequestedDate(recommendationRecord.requestedDate);
        } catch (e) {
            errorList.push(e);
        }
        try {
            recommendation.setRepliedDate(recommendationRecord.repliedDate);
        } catch (e) {
            errorList.push(e);
        }       
        try {
            recommendation.setRecommenderTitle(recommendationRecord.recommenderTitle);
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
    return recommendation;
}
module.exports.RecommendationAPI = RecommendationAPI;
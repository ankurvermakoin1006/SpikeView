var commons = require('../../commons/constants');
var utils = require('../../commons/utils').utils;
var CONSTANTS = commons.CONSTANTS;
var REQUEST_CODES = CONSTANTS.REQUEST_CODES;
var ACHIEVEMENT_CODES = CONSTANTS.ACHIEVEMENT;
var VALIDATE = commons.CONSTANTS.VALIDATE;
var validate = utils.validate;

var Achievement = function () {
    return {
        achievementId: 0,
        competencyTypeId: 0,
        level2Competency: null,
        level3Competency: null,
        userId: 0,       
        // badge: new Array(),
        // certificate: new Array(),
        asset: new Array(),
        skills: new Array(),
        title: null,
        description: null,
        fromDate: null,
        toDate: null,
        isActive: true,
        importance: null,
        guide: {},
        stories: new Array(),
        likes: new Array()
    }
};

function AchievementAPI(achievementRecord) {
    var achievement = new Achievement();

    achievement.getAchievementId = function () {
        return this.achievementId;
    };
    achievement.setAchievementId = function (achievementId) {
        if (achievementId) {
            if (validate.isInteger(achievementId)) {
                this.achievementId = achievementId;
            } else {
                throw {
                    status: VALIDATE.FAIL,
                    error: utils.formatText(VALIDATE.NOT_A_INTEGER, 'AchievementId', achievementId)
                };
            }
        }
    };
    achievement.getCompetencyTypeId = function () {
        return this.competencyTypeId;
    };
    achievement.setCompetencyTypeId = function (competencyTypeId) {
        this.competencyTypeId = competencyTypeId;
    }
    achievement.getUserId = function () {
        return this.userId;
    };
    achievement.setUserId = function (userId) {
        if (userId) {
            this.userId = userId;
        } else {
            throw {
                status: VALIDATE.FAIL,
                error: utils.formatText(VALIDATE.REQUIRED, 'User Id', userId)
            };
        }
    }   
    achievement.getAsset = function () {
        return this.asset;
    };
    achievement.setAsset = function (asset) {
        this.asset = asset;
    }
    // achievement.getBadge = function () {
    //     return this.badge;
    // };
    // achievement.setBadge = function (badge) {
    //     this.badge = badge;
    // }
    // achievement.getCertificate = function () {
    //     return this.certificate;
    // };
    // achievement.setCertificate = function (certificate) {
    //     this.certificate = certificate;
    // }
    achievement.getSkills = function () {
        return this.skills;
    };
    achievement.setSkills = function (skills) {
        if (skills) {
            this.skills = skills;
        } else {
            throw {
                status: VALIDATE.FAIL,
                error: utils.formatText(VALIDATE.REQUIRED, 'Skills', skills)
            };
        }
    }
    achievement.getTitle = function () {
        return this.title;
    };
    achievement.setTitle = function (title) {
        if (title) {
            this.title = title;
        } else {
            throw {
                status: VALIDATE.FAIL,
                error: utils.formatText(VALIDATE.REQUIRED, 'Title', title)
            };
        }
    }
    achievement.getDescription = function () {
        return this.description;
    };
    achievement.setDescription = function (description) {
        this.description = description;
    }
    achievement.getFromDate = function () {
        return this.fromDate;
    };
    achievement.setFromDate = function (fromDate) {
        this.fromDate = fromDate;
    }
    achievement.getToDate = function () {
        return this.toDate;
    };
    achievement.setToDate = function (toDate) {
        this.toDate = toDate;
    }
    achievement.IsActive = function () {
        return this.isActive;
    };
    achievement.setIsActive = function (isActive) {
        this.isActive = isActive;
    }
    achievement.getImportance = function () {
        return this.importance;
    };
    achievement.setImportance = function (importance) {
        this.importance = importance;
    }
    achievement.getGuide = function () {
        return this.guide;
    };
    achievement.setGuide = function (guide) {
        this.guide = guide;
    }
    achievement.getStories = function () {
        return this.stories;
    };
    achievement.setStories = function (stories) {
        this.stories = stories;
    }
    achievement.getLevel2Competency = function () {
        return this.level2Competency;
    };
    achievement.setLevel2Competency = function (level2Competency) {
        if (level2Competency) {
            this.level2Competency = level2Competency;
        } else {
            throw {
                status: VALIDATE.FAIL,
                error: utils.formatText(VALIDATE.REQUIRED, 'Level2Competency', level2Competency)
            };
        }
    }
    achievement.getLevel3Competency = function () {
        return this.level3Competency;
    };
    achievement.setLevel3Competency = function (level3Competency) {
        //if (level3Competency) {
        this.level3Competency = level3Competency;
        // } else {
        //     throw {
        //         status: VALIDATE.FAIL,
        //         error: utils.formatText(VALIDATE.REQUIRED, 'Level3Competency', level3Competency)
        //     };
        // }
    }
    achievement.getLikes = function () {
        return this.likes;
    };
    achievement.setLikes = function (likes) {
        this.likes = likes;
    };

    if (achievementRecord) {
        var errorList = [];
        try {
            achievement.setAchievementId(achievementRecord.achievementId);
        } catch (e) {
            errorList.push(e);
        }
        try {
            achievement.setCompetencyTypeId(achievementRecord.competencyTypeId);
        } catch (e) {
            errorList.push(e);
        }
        try {
            achievement.setUserId(achievementRecord.userId);
        } catch (e) {
            errorList.push(e);
        }       
        try {
            achievement.setAsset(achievementRecord.asset);
        } catch (e) {
            errorList.push(e);
        }
        // try {
        //     achievement.setBadge(achievementRecord.badge);
        // } catch (e) {
        //     errorList.push(e);
        // }
        // try {
        //     achievement.setCertificate(achievementRecord.certificate);
        // } catch (e) {
        //     errorList.push(e);
        // }
        try {
            achievement.setSkills(achievementRecord.skills);
        } catch (e) {
            errorList.push(e);
        }
        try {
            achievement.setTitle(achievementRecord.title);
        } catch (e) {
            errorList.push(e);
        }
        try {
            achievement.setDescription(achievementRecord.description);
        } catch (e) {
            errorList.push(e);
        }
        try {
            achievement.setFromDate(achievementRecord.fromDate);
        } catch (e) {
            errorList.push(e);
        }
        try {
            achievement.setToDate(achievementRecord.toDate);
        } catch (e) {
            errorList.push(e);
        }
        try {
            achievement.setIsActive(achievementRecord.isActive);
        } catch (e) {
            errorList.push(e);
        }
        try {
            achievement.setImportance(achievementRecord.importance);
        } catch (e) {
            errorList.push(e);
        }
        try {
            achievement.setGuide(achievementRecord.guide);
        } catch (e) {
            errorList.push(e);
        }
        try {
            achievement.setStories(achievementRecord.stories);
        } catch (e) {
            errorList.push(e);
        }
        try {
            achievement.setLevel2Competency(achievementRecord.level2Competency);
        } catch (e) {
            errorList.push(e);
        }
        try {
            achievement.setLevel3Competency(achievementRecord.level3Competency);
        } catch (e) {
            errorList.push(e);
        }
        try {
            achievement.setLikes(achievementRecord.likes);
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
    return achievement;
}

module.exports.AchievementAPI = AchievementAPI;
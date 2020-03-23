var utils = require('../../commons/utils').utils;
var CONSTANTS = utils.CONSTANTS;
var REQUEST_CODES = CONSTANTS.REQUEST_CODES;
var VALIDATE = utils.CONSTANTS.VALIDATE;
var validate = utils.validate;

var User = function () {
    return {
        userId: 0,
        firstName: null,
        lastName: null,
        email: null,
        password: null,
        salt: null,
        mobileNo: 0,
        profilePicture: null,
        parents: new Array(),
        role: new Array(),
        roleId: 0,
        isActive: true,
        requireParentApproval: true,
        ccToParents: true,
        lastAccess: 0,
        isPasswordChanged: false,
        organizationId: 0,
        gender: null,
        dob: 0,
        genderAtBirth: null,
        usCitizenOrPR: true,
        address: null,
        summary: null,
        coverImage: null,
        tagline: null,
        title: null,
        tempPassword: null,
        isArchived: false,
        creationTime: 0,
        isEducation: false,
        isAchievement: false,
        isWizard: false,
        isPartnerMailSent: false
    }
};

function UserAPI(userRecord) {
    var user = new User();
    user.getUserId = function () {
        return this.userId;
    };
    user.setUserId = function (userId) {
        if (userId) {
            if (validate.isInteger(userId)) {
                this.userId = userId;
            } else {
                throw {
                    status: VALIDATE.FAIL,
                    error: utils.formatText(VALIDATE.NOT_A_INTEGER, userId, 'userId')
                };
            }
        }
    };
    user.getFirstName = function () {
        return this.firstName;
    };
    user.setFirstName = function (firstName) {
        if (firstName) {
            if (firstName.length <= 50) {
                this.firstName = firstName;
            } else {
                throw {
                    status: VALIDATE.FAIL,
                    error: utils.formatText(VALIDATE.VALUE_TOO_BIG, firstName, 'First Name')
                };
            }
        }
    };
    user.getLastName = function () {
        return this.lastName;
    };
    user.setLastName = function (lastName) {
        if (lastName) {
            if (lastName.length <= 50) {
                this.lastName = lastName;
            } else {
                throw {
                    status: VALIDATE.FAIL,
                    error: utils.formatText(VALIDATE.VALUE_TOO_BIG, lastName, 'Last Name')
                };
            }
        }
    };
    user.getEmail = function () {
        return this.email;
    };
    user.setEmail = function (email) {
        if (email) {
            if (validate.isEmail(email)) {
                this.email = email;
            } else {
                throw {
                    status: VALIDATE.FAIL,
                    error: VALIDATE.NOT_AN_EMAIL
                };
            }
        }
    };
    user.getPassword = function () {
        return this.password;
    };
    user.setPassword = function (password) {
        this.password = password;
    }
    user.getSalt = function () {
        return this.salt;
    };
    user.setSalt = function (salt) {
        this.salt = salt;
    }

    user.getTagline = function () {
        return this.tagline;
    };
    user.setTagline = function (tagline) {
        this.tagline = tagline;
    }

    user.getMobileNo = function () {
        return this.mobileNo;
    };
    user.setMobileNo = function (mobileNo) {
        if (mobileNo) {
            if (validate.isInteger(mobileNo)) {
                this.mobileNo = mobileNo;
            } else {
                throw {
                    status: VALIDATE.FAIL,
                    error: utils.formatText(VALIDATE.NOT_A_INTEGER, mobileNo, 'Mobile Number')
                };
            }
        }
    };
    user.getProfilePicture = function () {
        return this.profilePicture;
    };
    user.setProfilePicture = function (profilePicture) {
        this.profilePicture = profilePicture;
    };
    user.getParents = function () {
        return this.parents;
    };
    user.setParents = function (parents) {
        this.parents = parents;
    };
    user.getRole = function () {
        return this.role;
    };
    user.setRole = function (role) {
        if(role){
            this.role = role;
        }else{
            this.role = [];
        }    
    };
    user.getRoleId = function () {
        return this.roleId;
    };
    user.setRoleId = function (roleId) {
        this.roleId = roleId;
    };
    user.getIsActive = function () {
        return this.isActive;
    };
    user.setIsActive = function (isActive) {
        if (isActive) {
            this.isActive = isActive;
        } else {
            this.isActive = isActive;
        }
    };
    user.getRequireParentApproval = function () {
        return this.requireParentApproval;
    };
    user.setRequireParentApproval = function (requireParentApproval) {
        this.requireParentApproval = requireParentApproval;
    };
    user.getCcToParents = function () {
        return this.ccToParents;
    };
    user.setCcToParents = function (ccToParents) {
        this.ccToParents = ccToParents;
    };
    user.getLastAccess = function () {
        return this.lastAccess;
    };
    user.setLastAccess = function (lastAccess) {
        this.lastAccess = lastAccess;
    };
    user.getIsPasswordChanged = function () {
        return this.isPasswordChanged;
    };
    user.setIsPasswordChanged = function (isPasswordChanged) {
        this.isPasswordChanged = isPasswordChanged;
    };
    user.getOrganizationId = function () {
        return this.organizationId;
    };
    user.setOrganizationId = function (organizationId) {
        if (organizationId) {
            this.organizationId = organizationId;
        } else {
            this.organizationId = 0;
        }
    };
    user.getGender = function () {
        return this.gender;
    };
    user.setGender = function (gender) {
        this.gender = gender;
    }
    user.getDob = function () {
        return this.dob;
    };
    user.setDob = function (dob) {
        if (dob) {
            this.dob = dob;
        } else {
            this.dob = 0;
        }
    }
    user.getGenderAtBirth = function () {
        return this.genderAtBirth;
    };
    user.setGenderAtBirth = function (genderAtBirth) {
        this.genderAtBirth = genderAtBirth;
    }
    user.getUsCitizenOrPR = function () {
        return this.usCitizenOrPR;
    };
    user.setUsCitizenOrPR = function (usCitizenOrPR) {
        this.usCitizenOrPR = usCitizenOrPR;
    }
    user.getAddress = function () {
        return this.address;
    };
    user.setAddress = function (address) {
        this.address = address;
    }
    user.getSummary = function () {
        return this.summary;
    };
    user.setSummary = function (summary) {
        this.summary = summary;
    };
    user.getCoverImage = function () {
        return this.coverImage;
    };
    user.setCoverImage = function (coverImage) {
        this.coverImage = coverImage;
    };
    user.getTitle = function () {
        return this.title;
    };
    user.setTitle = function (title) {
        this.title = title;
    };
    user.getTempPassword = function () {
        return this.tempPassword;
    };
    user.setTempPassword = function (tempPassword) {
        this.tempPassword = tempPassword;
    };
    user.getIsArchived = function () {
        return this.isArchived;
    };
    user.setIsArchived = function (isArchived) {
        this.isArchived = isArchived;
    };
    user.getCreationTime = function () {
        if (this.creationTime) return this.creationTime;
        else return 0
    };
    user.setCreationTime = function (creationTime) {
        this.creationTime = creationTime;
    };

    user.getIsEducation = function () {
        return this.isEducation;
    };
    user.setIsEducation = function (isEducation) {
        this.isEducation = isEducation;
    };

    user.getIsAchievement = function () {
        return this.isAchievement;
    };
    user.setIsAchievement = function (isAchievement) {
        this.isAchievement = isAchievement;
    };

    user.getIsWizard = function () {
        return this.isWizard;
    };
    user.setIsWizard = function (isWizard) {
        this.isWizard = isWizard;
    };

    user.getIsPartnerMailSent = function () {
        return this.isPartnerMailSent;
    };
    user.setIsPartnerMailSent = function (isPartnerMailSent) {
        this.isPartnerMailSent = isPartnerMailSent;
    };

    if (userRecord) {
        var errorList = [];
        try {
            user.setUserId(userRecord.userId);
        } catch (e) {
            errorList.push(e);
        }
        try {
            user.setFirstName(userRecord.firstName);
        } catch (e) {
            errorList.push(e);
        }
        try {
            user.setLastName(userRecord.lastName);
        } catch (e) {
            errorList.push(e);
        }
        try {
            user.setEmail(userRecord.email);
        } catch (e) {
            errorList.push(e);
        }
        try {
            user.setPassword(userRecord.password);
        } catch (e) {
            errorList.push(e);
        }
        try {
            user.setMobileNo(userRecord.mobileNo);
        } catch (e) {
            errorList.push(e);
        }
        try {
            user.setProfilePicture(userRecord.profilePicture);
        } catch (e) {
            errorList.push(e);
        }
        try {
            user.setParents(userRecord.parents);
        } catch (e) {
            errorList.push(e);
        }
        try {
            user.setRole(userRecord.role);
        } catch (e) {
            errorList.push(e);
        }
        try {
            user.setRoleId(userRecord.roleId);
        } catch (e) {
            errorList.push(e);
        }
        try {
            user.setIsActive(userRecord.isActive);
        } catch (e) {
            errorList.push(e);
        }
        try {
            user.setRequireParentApproval(userRecord.requireParentApproval);
        } catch (e) {
            errorList.push(e);
        }
        try {
            user.setCcToParents(userRecord.ccToParents);
        } catch (e) {
            errorList.push(e);
        }
        try {
            user.setLastAccess(userRecord.lastAccess);
        } catch (e) {
            errorList.push(e);
        }
        try {
            user.setOrganizationId(userRecord.organizationId);
        } catch (e) {
            errorList.push(e);
        }
        try {
            user.setIsPasswordChanged(userRecord.isPasswordChanged);
        } catch (e) {
            errorList.push(e);
        }
        try {
            user.setSalt(userRecord.salt);
        } catch (e) {
            errorList.push(e);
        }
        try {
            user.setDob(userRecord.dob);
        } catch (e) {
            errorList.push(e);
        }
        try {
            user.setGender(userRecord.gender);
        } catch (e) {
            errorList.push(e);
        }
        try {
            user.setGenderAtBirth(userRecord.genderAtBirth);
        } catch (e) {
            errorList.push(e);
        }
        try {
            user.setUsCitizenOrPR(userRecord.usCitizenOrPR);
        } catch (e) {
            errorList.push(e);
        }
        try {
            user.setAddress(userRecord.address);
        } catch (e) {
            errorList.push(e);
        }
        try {
            user.setSummary(userRecord.summary);
        } catch (e) {
            errorList.push(e);
        }
        try {
            user.setCoverImage(userRecord.coverImage);
        } catch (e) {
            errorList.push(e);
        }
        try {
            user.setTagline(userRecord.tagline);
        } catch (e) {
            errorList.push(e);
        }
        try {
            user.setTitle(userRecord.title);
        } catch (e) {
            errorList.push(e);
        }
        try {
            user.setTempPassword(userRecord.tempPassword);
        } catch (e) {
            errorList.push(e);
        }
        try {
            user.setIsArchived(userRecord.isArchived);
        } catch (e) {
            errorList.push(e);
        }
        try {
            user.setCreationTime(userRecord.creationTime ? userRecord.creationTime : 0);
        } catch (e) {
            errorList.push(e);
        }
        try {
            user.setIsAchievement(userRecord.isAchievement);
        } catch (e) {
            errorList.push(e);
        }
        try {
            user.setIsEducation(userRecord.isEducation);
        } catch (e) {
            errorList.push(e);
        }
        try {
            user.setIsWizard(userRecord.isWizard);
        } catch (e) {
            errorList.push(e);
        }
        try {
            user.setIsPartnerMailSent(userRecord.isPartnerMailSent);
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
    return user;
}

module.exports.UserAPI = UserAPI;
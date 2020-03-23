module.exports.usersSchema = {
    userId: {
        type: Number,
        unique: true,
        required: true,
        index: true
    },
    firstName: {
        type: String,
        index: true
    },
    lastName: {
        type: String,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    salt: {
        type: String
    },
    password: {
        type: String
    },
    mobileNo: {
        type: Number
    },
    profilePicture: {
        type: String
    },
    parents: {
        type: Array
    },
    role: {
        type: Array
    },
    roleId: {
        type: Number
    },
    isActive: {
        type: Boolean
    },
    requireParentApproval: {
        type: Boolean
    },
    ccToParents: {
        type: Boolean
    },
    lastAccess: {
        type: Date
    },
    isPasswordChanged: {
        type: Boolean
    },
    organizationId: {
        type: Number
    },
    address: {
        type: Object
    },
    dob: {
        type: Number
    },
    gender: {
        type: String
    },
    genderAtBirth: {
        type: String
    },
    usCitizenOrPR: {
        type: Boolean
    },
    summary: {
        type: String
    },
    coverImage: {
        type: String
    },
    tagline: {
        type: String
    },
    title: {
        type: String
    },
    tempPassword: {
        type: String
    },
    isArchived: {
        type: Boolean
    },
    creationTime: {
        type: Number
    },
    isEducation: {
        type: Boolean
    },
    isAchievement: {
        type: Boolean
    },
    isWizard: {
        type: Boolean
    },
    isPartnerMailSent: {
        type: Boolean
    }
};
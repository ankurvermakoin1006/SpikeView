module.exports.opportunitySchema = {
    opportunityId: {
        type: Number,
        unique: true,
        required: true,
        index: true
    },
    userId: {
        type: Number,
        required: true
    },
    roleId: {
        type: Number
    },
    jobTitle: {
        type: String
    },
    jobType: {
        type: String
    },
    jobLocation: {
        type: String
    },
    project: {
        type: String
    },
    duration: {
        type: String
    },
    status: {
        type: String
    },
    asset: {
        type: Array
    },
    fromDate: {
        type: Number
    },
    toDate: {
        type: Number
    },
    groupId: {
        type: Number
    },
    targetAudience: {
        type: Boolean
    },
    title: {
        type: String
    },
    location: {
        type: Array
    },
    gender: {
        type: String
    },
    age: {
        type: Array
    },
    interestType: {
        type: Array
    },
    interests: {
        type: String
    },
    companyId: {
        type: Number,
        required: true
    },
    offerId: {
        type: Number
    },
    serviceTitle: {
        type: String
    },
    serviceDesc: {
        type: String
    },
    numberOfClicks: {
        type: Number
    },
    isActive: {
        type: Boolean
    },
    expiresOn: {
        type: Number
    },
    withdraw: {
        type: Boolean
    },
    callToAction: {
        type: Array
    },
    userList: {
        type: Array
    },
    likes: {
        type: Array
    },
    comments: {
        type: Array
    },
    shareText: {
        type: String
    },
    shareTime: {
        type: Number
    },   
    tags: {
        type: Array
    },
    lastActivityTime: {
        type: Number
    },
    group:{
        type: Array
    },
    parents:{
        type: Array
    },
    inquiry: {
        type: Array
    }
};
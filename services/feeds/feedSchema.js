module.exports.feedSchema = {
    feedId: {
        type: Number,
        unique: true,
        required: true,
        index: true
    },
    post: {
        type: {},
        required: true
    },
    postedBy: {
        type: Number,
        index: true
    },
    roleId: {
        type: Number,
        index: true
    },
    dateTime: {
        type: Number,
        index: true
    },
    isActive: {
        type: Boolean
    },
    visibility: {
        type: String
    },
    scope: {
        type: Array
    },
    likes: {
        type: Array
    },
    comments: {
        type: Array
    },
    postOwner: {
        type: Number
    },
    postOwnerRole: {
        type: Number
    },
    postOwnerFeedId: {
        type: Number
    },
    postOwnerDeleted: {
        type: Boolean,
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
    groupId: {
        type: Number
    },
    lastActivityTime: {
        type: Number
    },
    lastActivityType: {
        type: String
    },
    reportedBy: {
        type: Array
    },
    hideBy: {
        type: Array
    },
    interest: {
        type: Array
    },
    numberOfClick: {
        type: Number
    },
    metaTags: {
        type: Object
    },
    opportunityId: {
        type: Number
    }

};
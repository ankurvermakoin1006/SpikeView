module.exports.achievementSchema = {
    achievementId: {
        type: Number,
        unique: true,
        required: true,
        index: true
    },
    competencyTypeId: {
        type: Number,
        index: true
    },
    level2Competency: {
        type: String,
        index: true
    },
    level3Competency: {
        type: String,
        index: true
    },
    userId: {
        type: Number,
        index: true
    },    
    // badge: {
    //     type: Array
    // },
    // certificate: {
    //     type: Array
    // },
    asset: {
        type: Array
    },
    skills: {
        type: Array
    },
    title: {
        type: String
    },
    description: {
        type: String
    },
    fromDate: {
        type: Number,
        index: true
    },
    toDate: {
        type: Number,
        index: true
    },
    isActive: {
        type: Boolean
    },
    importance: {
        type: Number
    },
    guide: {
        type: {}
    },
    likes: {
        type: Array
    },
    stories: {
        type: Array
    },
    createdTimestamp: {
        type: Number //achievement requested date
    },
    lastModifiedTimestamp: {
        type: Number //achievement requested date
    }      
};
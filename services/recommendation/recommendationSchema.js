module.exports.recommendationSchema = {
    recommendationId: {
        type: Number,
        unique: true,
        required: true,
        index: true
    },
    userId: {
        type: Number,
        index: true
    },
    roleId:{
        type: Number
    },
    recommenderId: {
        type: Number,
        index: true
    },    
    competencyTypeId: {
        type: Number,
        index: true
    },
    level2Competency: {
        type: String
    },
    level3Competency: {
        type: String
    },
    title: {
        type: String
    },
    request: {
        type: String
    },
    recommendation: {
        type: String
    },
    interactionStartDate: {
        type: Number
    },
    interactionEndDate: {
        type: Number
    },
    skills: {
        type: Array
    },
    asset: {
        type: Array
    },
    // badge: {
    //     type: Array
    // },
    // certificate: {
    //     type: Array
    // },
    isActive: {
        type: Boolean // recommendation hide and unhide after added to profile.
    },
    stage: {
        type: String
    },    
    recommenderTitle: {
        type: String
    },
    likes: {
        type: Array
    },
    requestedDate: {
        type: Number //recommendation requested date
    },
    repliedDate: {
        type: Number //recommendation replied date
    }
};
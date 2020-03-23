module.exports.sharedProfilesSchema = {
    sharedId: {
        type: Number,
        unique: true,
        required: true,
        index: true
    },
    sharedView: {
        type: String,
        required: true
    },
    sharedType: {
        type: String,
        required: true
    },
    theme: {
        type: String
    },
    soundtrack: {
        type: Array
    },
    profileOwner: {
        type: Number,
        required: true
    },
    profileOwnerRoleId: {
        type: Number     
    },
    shareTo: {
        type: Number
    }, 
    shareRoleId: {
        type: Number
    },
    shareTime: { 
        type: Number
    },  
    shareConfiguration: {
        type: Array
    },
    isActive:  {
        type : Boolean
    },
    isViewed:  {
        type : Boolean
    },
    lastViewedTime:  {
        type : Number
    },
    
};
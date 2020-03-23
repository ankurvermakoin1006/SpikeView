module.exports.headerSchema = {
    headerId: {
        type: Number,
        unique: true,
        required: true,
        index: true
    },
    userId : {
        type: Number,
        unique: true,
        required: true,
        index: true
    },
    roleId : {
        type: Number      
    },
    connectionCount : {
        type: Number,
        required: true
    },
    messagingCount : {
        type: Number,
        required: true
    },
    notificationCount : {
        type: Number,
        required: true
    },
    groupCount:{
        type: Number
    },
        
};
module.exports.connectionsSchema = {
    connectId: {
        type: Number,
        unique: true,
        required: true,
        index: true
    },
    userId: {
        type: Number,
        index: true
    },
    userRoleId:{
        type: Number
    },
    partnerId: {
        type: Number
    },
    partnerRoleId: {
        type: Number
    },
    partnerName: {
        type: String
    },
    dateTime: {
        type: Number
    },
    status: {
        type: String
    }
};
module.exports.messageSchema = {
    messageId: {
        type: Number,
        unique: true,
        required: true,
        index: true
    },
    connectorId : {
        type: Number,
        required: true
    },
    sender : {
        type: Number,
        required: true
    },
    senderRoleId: {
        type: Number       
    },
    receiver : {
        type: Number,
        required: true
    }, 
    receiverRoleId : {
        type: Number       
    }, 
    deletedBy : {
        type: Number
    },   
    text : { 
        type: String
    },
    time : {
        type: Number,
        required: true
    },  
    type : {
        type: Number,
        required: true
    },
    status: {
        type: Number
    }
};
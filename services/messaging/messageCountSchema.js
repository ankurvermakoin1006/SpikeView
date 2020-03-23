module.exports.messageCountSchema = {
        connectorId : {
            type: Number,
            unique: true,
            required: true,
            index: true
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
        text : { 
            type: String
        },  
        count : {
            type: Number,
            required: true
        },
        time : {
            type: Number,
            required: true
        }
};
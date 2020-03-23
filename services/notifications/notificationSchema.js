module.exports.notificationSchema = {
        notificationId: {
            type: Number,
            unique: true,
            required: true,
            index: true
        },
        userId : {
            type: Number,       
            required: true
        },
        roleId : {
            type: Number  
        },
        actedBy : {
            type: Number   
        },
        postId : {
            type: Number   
        },
        profilePicture: {
            type: String
        },
        text : {
            type: String,
            required: true
        },
        textName : {
            type: String           
        },
        textMessage : {
            type: String           
        },
        dateTime : {
            type: Number,
            required: true
        },
        isRead : {
            type: Boolean,
            required: true
        }    
};
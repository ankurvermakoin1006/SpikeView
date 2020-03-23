module.exports.socketUserSchema = {
    socketUserId: {
        type: Number,
        unique: true,
        required: true,
        index: true
    },
    userRecord: {
        type: Object       
    }   
};
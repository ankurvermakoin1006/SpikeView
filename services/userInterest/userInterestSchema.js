module.exports.userInterestSchema = {
    userInterestId: {
        type: Number,
        unique: true,
        required: true,
        index: true
    },
    userId : {
        type: Number,
        required: true
    },   
    level1: {
        type: String       
    },
    level2: {
        type: String       
    }
};
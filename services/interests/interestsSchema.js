module.exports.interestsSchema = {
    interestsId: {
        type: Number,
        unique: true,
        required: true,
        index: true
    },
    name: {
        type: String
    }
};
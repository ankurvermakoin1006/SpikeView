module.exports.skillsSchema = {
    skillId: {
        type: Number,
        unique: true,
        required: true,
        index: true
    },
    title: {
        type: String,
        index: true
    },
    description: {
        type: String,
        index: true
    }
};
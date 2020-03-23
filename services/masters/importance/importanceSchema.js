module.exports.importanceSchema = {
    importanceId: {
        type: Number,
        unique: true,
        required: true,
        index: true
    },
    title: {
        type: String
    },
    description: {
        type: String
    }
};
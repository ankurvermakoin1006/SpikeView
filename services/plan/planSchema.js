module.exports.planSchema = {
    planId: {
        type: Number,
        unique: true,
        required: true,
        index: true
    },
    name: {
        type: String
    },
    description: {
        type: String
    },
    amount: {
        type: Number
    },
    userLimit: {
        type: Number
    }
};
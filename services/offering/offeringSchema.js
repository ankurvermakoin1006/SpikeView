module.exports.offeringSchema = {
    offeringId: {
        type: Number,
        unique: true,
        required: true,
        index: true
    },
    name: {
        type: String
    }
};

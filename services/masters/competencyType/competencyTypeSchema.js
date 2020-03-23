module.exports.competencyTypeSchema = {
        competencyTypeId: {
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
        },
        level1: {
            type: String,
            index: true
        },
        level2: {
            type: String,
            index: true
        },
        level3: [{
            name: { type: String}
        }]
};
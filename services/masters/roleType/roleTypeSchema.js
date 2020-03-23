module.exports.roleTypeSchema = {
    roleTypeId: {
        type: Number,
        unique: true,
        required: true,
        index: true
    },
    roleName: {
        type: String,
        index: true
    },
    description: {
        type: String,
        index: true
    },
    image:{
        type: String
    }
};
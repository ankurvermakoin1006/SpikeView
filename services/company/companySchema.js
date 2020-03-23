module.exports.companySchema = {
    companyId: {
        type: Number,
        unique: true,
        required: true,
        index: true
    },
    userId: {
        type: Number
    },
    roleId: {
        type: Number
    },
    name: {
        type: String
    },
    address: {
        type: String
    },
    phone: {
        type: String
    },
    url: {
        type: String
    },
    about: {
        type: String
    },
    offer: {
        type: Array
    },
    asset: {
        type: Array
    },
    createdAt: {
        type: Number,
        index: true
    },
    isActive: {
        type: Boolean
    },
    profilePicture: {
        type: String
    },
    coverPicture: {
        type: String
    }   
};
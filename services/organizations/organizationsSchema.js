module.exports.organizationsSchema = {
    organizationId: {
        type: Number,
        unique: true,
        required: true,
        index: true
    },
    name: {
        type: String,
        required: true
    },
    logo: {
        type: String
    }, 
    description: { 
        type: String
    },  
    address: {
        type: {}
    },
    type: {
        type : String,
        required: true
    },
    isActive:  {
        type : Boolean
    }
};
module.exports.groupSchema = {
            groupId: {
                type: Number,
                unique: true,
                required: true,
                index: true
            },
            groupName: {
                type: String,
                index: true
            },
            members: {
                type: Array
            },
            type: {
                type: String
            },
            creationDate: {
                type: Number
            },
            createdBy: {
                type: Number
            },
            roleId:{
                type: Number
            },
            isActive: {
                type: Boolean
            },
            aboutGroup: {
                type: String
            },
            otherInfo: {
                type: String
            },
            groupImage: {
                type: String
            }
};
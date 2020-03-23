module.exports.subscriptionSchema = {
                        subscribeId: {
                            type: Number,
                            unique: true,
                            required: true,
                            index: true
                        },
                        userId: {
                            type: Number,
                            index: true
                        },
                        followerId: {
                            type: Number,
                            index: true
                        },
                        followerName: {
                            type: String,
                            index: true
                        },
                        dateTime: {
                            type: Number,
                            index: true
                        }, 
                        status: {
                            type: String
                        },                       
                        isActive: {
                            type: Boolean
                        }
                    
};
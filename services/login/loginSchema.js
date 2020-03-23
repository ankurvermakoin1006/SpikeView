module.exports.loginTokenSchema = {
                                userId: {
                                    type: Number,
                                    required: true,
                                    index: true
                                },
                                user: {
                                    type: {}
                                },
                                token: {
                                    type: String,
                                    required: true
                                },
                                deviceId: {
                                    type: String
                                },
                                loginTime: {
                                    type: Number,
                                    required: true
                                }
                            };
module.exports.educationSchema = {
                        educationId: {
                            type: Number,
                            unique: true,
                            required: true,
                            index: true
                        },
                        userId: {
                            type: Number,
                            index: true
                        },                      
                        organizationId: {
                            type: Number
                        },
                        institute: {
                            type: String,
                            required: true
                        },
                        logo: {
                            type: String
                        }, 
                        city: {
                            type: String
                        },                  
                        fromGrade: {
                            type: String
                        },
                        toGrade: {
                            type: String
                        },
                        fromYear: {
                            type: String                        
                        },
                        toYear: {
                            type: String                        
                        },  
                        description: {
                            type: String
                        },
                        isActive: {
                            type: Boolean
                        }
                    
};
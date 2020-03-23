module.exports.reportSchema = {
                        reportId: {
                            type: Number,
                            unique: true,
                            required: true,
                            index: true
                        },
                        reportedBy: {
                            type: Number                          
                        },         
                        roleId:  {
                            type: Number                          
                        },                      
                        reportType: {
                            type: String
                        },
                        reportTypeId:{
                            type: Object
                        },                                            
                        reasonType: {
                            type: Array                           
                        },
                        reason: {
                            type: String
                        }, 
                        reportDate: {
                            type: Number
                        }
                     
};
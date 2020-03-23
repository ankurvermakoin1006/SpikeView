module.exports = function (app) {
    app.post('/ui/education', function (req, res) { //To Create education
        try {
            addEducation(req.body, function (response) {
                res.json(response);
            });
        } catch (e) {
            res.json(e);
        }
    });
    app.get('/ui/education', function (req, res) { //To get education
        try {
            getList(req.query, function (response) {
                res.json(response);
            });
        } catch (e) {
            res.json(e);
        }
    });
    app.put('/ui/education', function (req, res) { //To update education
        try {
            update(req.body, function (response) {
                res.json(response);
            });
        } catch (e) {
            res.json(e);
        }
    });
    app.delete('/ui/education', function (req, res) { //To delete education
        try {
            remove(req.body, function (response) {
                res.json(response);
            });
        } catch (e) {
            res.json(e);
        }
    });
}

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var EducationSchema = new Schema(require('./educationSchema').educationSchema, {
    collection: 'education'
});
var EducationModel = mongoose.model('education', EducationSchema);
var EducationController = require('./educationController');
var utils = require('../../commons/utils').utils;
var CONSTANTS = utils.CONSTANTS;
var REQUEST_CODES = CONSTANTS.REQUEST_CODES;
var EDUCATION_CODES = utils.CONSTANTS.EDUCATION;
var VALIDATE = utils.CONSTANTS.VALIDATE;
var mongoUtils = utils.mongoUtils;
var organizations = require('../organizations/organizations');
var User = require('../users/users');
var _ = require('underscore');

function addEducation(data, callback) {
    // education validations
 //   let roleId= data.roleId ? parseInt(data.roleId): null;
    getList({
        userId: data.userId
    //    $or:[
    //         {roleId: roleId},
    //         {roleId : {  $exists: false }}
    //     ]
    }, function (res) {
        var educations = res.result;
        if (educations.length > 0) {
            var conflict = false;
            var inFromGrade = parseInt(data.fromGrade);
            var inToGrade = parseInt(data.toGrade);
            var inFromYear = parseInt(data.fromYear);
            var inToYear = parseInt(data.toYear);

            _.forEach(educations, function (edu) {
                if(!conflict)
                    conflict= addEducationValidation(edu,inFromGrade,inToGrade,inFromYear,inToYear);
            });
            if (conflict) {
                callback({
                    status: REQUEST_CODES.FAIL,
                    message: EDUCATION_CODES.NOT_A_VALID_EDUCATION
                });
                return;
            } else {
                if (data.organizationId) { // existing organization/school
                    create(data, callback);
                } else {
                    // check for existing organisation.
                    organizations.getList({
                        name: data.institute
                    }, function (res) {
                        if (res.result.length > 0) {
                            data.organizationId = res.result[0].organizationId;
                            create(data, callback);
                        } else {
                            var organization = {
                                logo: data.logo,
                                name: data.institute,
                                city: data.city,
                                type: data.type
                            };
                            organizations.create(organization, function (response) {
                                if (response.status == REQUEST_CODES.SUCCESS) {
                                    data.organizationId = response.result.organizationId;
                                    create(data, callback);
                                } else {
                                    callback({
                                        status: REQUEST_CODES.FAIL,
                                        message: response.message
                                    });
                                    return;
                                }
                            });
                        }
                    });
                }
            }
        } else {
            if (data.organizationId) {// existing organization/school              
                User.getList({
                    userId: data.userId
                  }, function (res) {
                    if (res.result.length > 0) {
                        var student = res.result[0];
                        student['isEducation']= true;
                        User.update(student, function (res){ 
                        create(data, callback);
                      })}
                })  

            } else {  
                User.getList({
                    userId: data.userId
                  }, function (res) {
                    if (res.result.length > 0) {
                        var student = res.result[0];
                        student['isEducation']= true;
                        User.update(student, function (userRes){
                            organizations.getList({
                                name: data.institute
                            }, function (res) {
                                if (res.result.length > 0) {
                                    data.organizationId = res.result[0].organizationId;
                                    create(data, callback);
                                } else {
                                    var organization = {
                                        logo: data.logo,
                                        name: data.institute,
                                        city: data.city,
                                        type: data.type
                                    };
                                    organizations.create(organization, function (response) {
                                        if (response.status == REQUEST_CODES.SUCCESS) {
                                            data.organizationId = response.result.organizationId;
                                            create(data, callback);
                                        } else {
                                            callback({
                                                status: REQUEST_CODES.FAIL,
                                                message: response.message
                                            });
                                            return;
                                        }
                                    });
                                }
                            });
                        })}
                    })      
                }
            }
    })
}

function addEducationValidation(edu,inFromGrade,inToGrade,inFromYear,inToYear){
    var dbFromGrade = parseInt(edu.fromGrade);
    var dbToGrade = parseInt(edu.toGrade);
    var dbFromYear = parseInt(edu.fromYear);
    var dbToYear = parseInt(edu.toYear);

    if ((inFromGrade == dbFromGrade && inToGrade == dbToGrade) || (inFromYear == dbFromYear && inToYear == dbToYear)) {
        return true;
    }
    let gradeDiff = inToGrade - inFromGrade;
    let yearDiff = inToYear - inFromYear;
    if (yearDiff < gradeDiff) {
        return true;
    }else if(inFromGrade < dbFromGrade &&
        inToGrade < dbFromGrade 
        && inFromGrade < dbToGrade &&                   
        inToGrade < dbToGrade &&                                          
        (inFromYear  < dbToYear &&  inToYear < dbToYear &&  inFromYear < dbFromYear &&  inToYear< dbFromYear
           ||
           inToYear == dbFromYear && inToYear < dbToYear && inFromYear < dbFromYear && inFromYear < dbToYear)
        ){                      
    }else  if(inFromGrade > dbFromGrade && 
                inToGrade > dbFromGrade 
                &&  inFromGrade > dbToGrade &&                    
                inToGrade > dbToGrade &&                                         
              (inFromYear  > dbToYear &&  inToYear > dbToYear &&  inFromYear > dbFromYear &&  inToYear > dbFromYear               
               ||
               inFromYear == dbToYear && inFromYear  > dbFromYear && inToYear > dbFromYear && inToYear > dbToYear)
            ){                        
              return false  
    } else{   
        return true;
    }
}

function create(education, callback) {
    var educationAPI;
    var errorList = [];
    try {
        educationAPI = EducationController.EducationAPI(education);
    } catch (e) {
        errorList.push(e.error[0]);
        callback({
            status: REQUEST_CODES.FAIL,
            message: errorList
        });
        return;
    }
    if (!educationAPI.getCity()) {
        var e = {
            status: VALIDATE.FAIL,
            message: utils.formatText(VALIDATE.REQUIRED, 'City')
        };
        errorList.push(e);
    }
    if (!educationAPI.getFromYear()) {
        var e = {
            status: VALIDATE.FAIL,
            message: utils.formatText(VALIDATE.REQUIRED, 'From Year')
        };
        errorList.push(e);
    }
    if (!educationAPI.getToYear()) {
        var e = {
            status: VALIDATE.FAIL,
            message: utils.formatText(VALIDATE.REQUIRED, 'To Year')
        };
        errorList.push(e);
    }
    if (errorList.length) {
        callback({
            status: REQUEST_CODES.FAIL,
            message: errorList
        });
        return;
    } else {
        var educationModel = new EducationModel(educationAPI);
        mongoUtils.getNextSequence('educationId', function (oSeq) {
            educationModel.educationId = oSeq;
            educationModel.save(function (error) {
                if (error) {
                    callback({
                        status: REQUEST_CODES.FAIL,
                        message: error
                    });
                    return;
                } else {
                    callback({
                        status: REQUEST_CODES.SUCCESS,
                        message: EDUCATION_CODES.CREATE_SUCCESS,
                        result: {
                            educationId: educationModel.educationId
                        }
                    });
                    return;
                }
            });
        });
    }
}

function update(education, callback) {
 //   let roleId= data.roleId ? parseInt(data.roleId): null;
    getList({
        userId: education.userId
        // $or:[
        //     {roleId: roleId},
        //     {roleId : {  $exists: false }}
        // ]
    }, function (res) {
        var educations = res.result;
        if (educations.length > 0) {
            var conflict = false;
            var inFromGrade = parseInt(education.fromGrade);
            var inToGrade = parseInt(education.toGrade);
            var inFromYear = parseInt(education.fromYear);
            var inToYear = parseInt(education.toYear);

            _.forEach(educations, function (edu) {
                if(edu.educationId != parseInt(education.educationId,10)){
                    if(!conflict)
                    conflict= addEducationValidation(edu,inFromGrade,inToGrade,inFromYear,inToYear);
                }
            });
            if (conflict) {
                callback({
                    status: REQUEST_CODES.FAIL,
                    message: EDUCATION_CODES.NOT_A_VALID_EDUCATION
                });
                return;
            }else{                
                EducationModel.update({
                    'educationId': education.educationId
                }, {
                    $set: education
                }, function (error) {
                    if (error) {
                        callback({
                            status: REQUEST_CODES.FAIL,
                            message: error
                        });
                        return;
                    } else {
                            callback({
                                    status: REQUEST_CODES.SUCCESS,
                                    message: EDUCATION_CODES.UPDATE_SUCCESS
                            });
                            return;               
                    }
                });
            }
        }
    })       
}

function remove(query, callback) {
    getList({educationId:query.educationId}, function (res) {
        let userId= res.result[0].userId;       
        EducationModel.remove(query, function (error) {
            if (error) {
                callback({
                    status: REQUEST_CODES.FAIL,
                    message: error
                });
                return;
            } else {
                User.getList({userId:userId}, function (userRes) {     
                    var student = userRes.result[0];                  
                    student['isEducation']= false;
                    User.update(student, function (res){                   
                        callback({
                                status: REQUEST_CODES.SUCCESS,
                                message: EDUCATION_CODES.DELETE_SUCCESS
                            });
                            return;
                        })                    
                })         
            }
        });
    })    
}

function getList(query, callback) {
    EducationModel.find(query, function (error, records) {
        if (error) {
            callback({
                status: REQUEST_CODES.FAIL,
                message: error
            });
            return;
        } else {
            let gradeSum= 0,flag= false;
            records = records.map(function (record) {
                return new EducationController.EducationAPI(record);
            });
            records.forEach(function(data){
                let gradeDiff = parseInt(data.toGrade,10) - parseInt(data.fromGrade,10)+1;
                gradeSum= gradeSum + gradeDiff;                  
            })              
            if(gradeSum === 12){
                flag= true;
            }
            
            callback({
                status: REQUEST_CODES.SUCCESS,
                result: records,
                isAllEducation: flag          
            });
            return;
        }
    }).sort({
        toYear: -1
    });
}

module.exports.create = create;
module.exports.getList = getList;
module.exports.remove = remove;
module.exports.update = update;
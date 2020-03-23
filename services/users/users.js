module.exports = function (app) {
  app.post('/app/signup', function (req, res) {
    try {
      signUp(req, function (response) {
        res.json(response);
      });
    } catch (e) {
      res.json(e);
    }
  });
  app.post('/ui/user', function (req, res) {
    try {
      create(req.body, function (response) {
        res.json(response);
      });
    } catch (e) {
      res.json(e);
    }
  });
  app.get('/ui/user', function (req, res) {
    try {
      getList(req.query, function (response) {
        res.json(response);
      });
    } catch (e) {
      res.json(e);
    }
  });
  app.put('/ui/user', function (req, res) {
    try {
      update(req.body, function (response) {
        res.json(response);
      });
    } catch (e) {
      res.json(e);
    }
  });
  app.put('/ui/user/archive', function (req, res) {
    try {
      archiveUser(req.body, function (response) {
        res.json(response);
      });
    } catch (e) {
      res.json(e);
    }
  });
  app.delete('/ui/user', function (req, res) {
    try {
      remove(req.body, function (response) {
        res.json(response);
      });
    } catch (e) {
      res.json(e);
    }
  });
  app.get('/app/getUserByEmail', function (req, res) {
    try {
      getList(req.query, function (response) {
        res.json(response);
      });
    } catch (e) {
      res.json(e);
    }
  });
  app.get('/app/existEmail', function (req, res) {
    try {
      userExistenceByEmail(req.query, function (response) {
        res.json(response);
      });
    } catch (e) {
      res.json(e);
    }
  });

  app.post('/app/reset/password', function (req, res) {
    try {
      resetPassword(req.query, function (response) {
        res.json(response);
      });
    } catch (e) {
      res.json(e);
    }
  });
  app.post('/ui/update/password', function (req, res) {
    try {
      updatePassword(req, function (response) {
        res.json(response);
      });
    } catch (e) {
      res.json(e);
    }
  });
  app.get('/ui/user/studentsbyparent/:userId', function (req, res) {
    try {
      getStudentsByParentWithStatus(req.params.userId, function (response) {
        res.json(response);
      });
    } catch (e) {
      logger.info(e);
      res.json(e);
    }
  });
  app.put('/ui/user/updateUserStatus', function (req, res) {
    try {
      updateStatus(req.body, function (response) {
        res.json(response);
      });
    } catch (e) {
      res.json(e);
    }
  });
  app.put('/ui/user/updateUserStatusActiveNow', function (req, res) {
    try {
      updateStatusActiceNow(req.body, function (response) {
        res.json(response);
      });
    } catch (e) {
      res.json(e);
    }
  });
  app.get('/ui/user/wizard/:userId', function (req, res) {
    //To update wizard
    try {
      updateStudentWizard(req.params.userId, function (response) {
        res.json(response);
      });
    } catch (e) {
      res.json(e);
    }
  });

  app.put('/ui/user/detach', function (req, res) {
    try {
      detachStudentFromParent(req.body, function (response) {
        res.json(response);
      });
    } catch (e) {
      res.json(e);
    }
  });

  app.put('/ui/user/assignRoleToGuest', function (req, res) {
    try {
      assignRoleToGuest(req.body, function (response) {
        res.json(response);
      });
    } catch (e) {
      res.json(e);
    }
  });
  app.post('/app/signup/partner', function (req, res) {
    try {
      createPartner(req.body, function (response) {
        res.json(response);
      });
    } catch (e) {
      console.log(e);
      res.json(e);
    }
  });
  app.put('/ui/user/updateRole', function (req, res) {
    try {
      updateRole(req.body, function (response) {
        res.json(response);
      });
    } catch (e) {
      res.json(e);
    }
  });
  app.get('/ui/user/updateRoleForEachUser', function (req, res) {
    try {
      updateRoleForEachUser(req, function (response) {
        res.json(response);
      });
    } catch (e) {
      res.json(e);
    }
  });

};

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;
var UsersSchema = new Schema(require('./usersSchema').usersSchema, {
  collection: 'users'
});
var UsersModel = mongoose.model('users', UsersSchema);
var UsersController = require('./usersController');
var utils = require('../../commons/utils').utils;
var mailer = require('../email/mailer');
var login = require('../login/login');
var SharedProfile = require('../sharedProfiles/sharedProfiles');
var Connection = require('../connection/connections');
var Company = require('../company/company');
var Education = require('../education/education');
var Feed = require('../feeds/feed');
var Achievement = require('../achievement/achievement');
var owasp = require('owasp-password-strength-test');
var mongoUtils = utils.mongoUtils;
var CONSTANTS = utils.CONSTANTS;
var REQUEST_CODES = CONSTANTS.REQUEST_CODES;
var USER_CODES = utils.CONSTANTS.USERS;
var VALIDATE = utils.CONSTANTS.VALIDATE;
var mobileNotification = require('../pushNotification/fcm');
var login = require('../login/login');
var crypto = require('crypto');
var _ = require('underscore');
var config = require('../../env/config.js').getConf();
var logger = require('../../logger.js');
function detachStudentFromParent(data, callback) {
  if (data.studentId && data.parentId) {
    getList({
      userId: data.studentId
    }, function (res) {
      if (res.result.length > 0) {
        let student = res.result[0];
        let filteredParents = _.filter(student.parents, function (parent) {
          return parent.userId != data.parentId;
        });
        student.parents = filteredParents;
        if (student.parents.length == 0 && utils.calculateAge(new Date(student.dob), new Date()) < USER_CODES.STUDENT_MININUM_REQUIRED_AGE) {
          callback({
            status: REQUEST_CODES.FAIL,
            message: USER_CODES.DELETE_PARENT_FOR_13YEAR_LESS_STUDENT
          });
          return;
        } else {
          update(student, function (res) {
            callback({
              status: REQUEST_CODES.SUCCESS,
              message: USER_CODES.DETACHED_STUDENT
            });
            return;
          });
        }
      } else {
        callback({
          status: REQUEST_CODES.FAIL,
          message: USER_CODES.STUDENT_NOT_FOUND
        });
        return;
      }
    });
  } else {
    callback({
      status: REQUEST_CODES.FAIL,
      message: REQUEST_CODES.MISSING_MANDATORY
    });
    return;
  }
}

function signUp(req, callback) {
  let data = req.body;
  if(data.recommendationWebFlag) {
    updateRecommendationPasswordWithoutPassword(req, callback);
  }else if (data.recommendationFlag) {
    updateRecommendationPassword(req, callback);
  } else {
    if (data.students && data.students.length > 0 && data.email.toLowerCase() === data.students[0].email.toLowerCase()) {
      callback({
        status: REQUEST_CODES.FAIL,
        message: USER_CODES.STUDENT_PARENT_EMAIL
      });
      return;
    } else if (data.parentEmail && data.email.toLowerCase() === data.parentEmail.toLowerCase()) {
      callback({
        status: REQUEST_CODES.FAIL,
        message: USER_CODES.STUDENT_PARENT_EMAIL
      });
      return;


    } else {
      data.isPasswordChanged = false;
      if (data.roleId == USER_CODES.STUDENT_ROLE) {
        // student signup
        getList({
          email: data.email.toLowerCase()
        }, function (res) {
          if (res.result.length > 0 && res.result[0].roleId != 3) {
            callback({
              status: REQUEST_CODES.FAIL,
              message: utils.formatText(USER_CODES.EMAIL_EXIST, data.email)
            });
            return;
          } else {
            if (utils.calculateAge(new Date(data.dob), new Date()) < USER_CODES.STUDENT_MININUM_REQUIRED_AGE) {
              data.isActive = false;
              data.isWizard = true;
            } else {
              data.isActive = true;
              data.isWizard = true;
            }
            if (data.parentEmail) {
              data.studentGuestUser = res.result[0];
              studentSignUpWithParents(data, callback);
            } else { // student signup without parents
              // check if guest role account exist ??
              if (res.result.length > 0 && res.result[0].roleId == USER_CODES.GUEST_ROLE) {
                var guestUser = res.result[0];
                guestUser.isActive = data.isActive;
                guestUser.firstName = data.firstName;
                guestUser.lastName = data.lastName;
                guestUser.roleId = data.roleId;
                let password = utils.passwordGenerator();
                let salt = crypto.randomBytes(16).toString('base64');
                guestUser.salt = salt;
                guestUser.password = USER_CODES.PASSWORD_PREFIX + utils.encryptText(password + salt);

                update(guestUser, function (res) {
                  var emailRequest = {
                    template: CONSTANTS.EMAIL.CREATE_USER,
                    to: guestUser.email,
                    email: guestUser.email,
                    password: password,
                  };
                  mailer.sendMail(emailRequest, function (res) {
                    logger.info('Mail sent status : ', res.status, 'for UserId : ', usersModel.userId);
                  });
                  sendResponse(data, res, callback);
                });
              } else {
                // Guest role not found.
                create(data, function (res) {
                  sendResponse(data, res, callback);
                });
              }
            }
          }
        });
      } else if (data.roleId == USER_CODES.PARENT_ROLE) {
        try {
          parentSignUp(data, callback);
        } catch (e) {
          res.json(e);
        }
      }
    }
  }
}

function studentSignUpWithParents(data, callback) {
  getList({
    email: data.parentEmail.toLowerCase()
  }, function (res) {
    if (res.result.length > 0) {
      var dbParent = res.result[0];
      if (dbParent.roleId == USER_CODES.STUDENT_ROLE) {
        callback({
          status: REQUEST_CODES.FAIL,
          message: utils.formatText(USER_CODES.PARENT_ALREADY_EXIST_WITH_OTHER_ROLE, data.parentEmail)
        });
        return;
      } else if (dbParent.roleId == USER_CODES.GUEST_ROLE) { //parent with guest role found.
        var parentGuestUser = dbParent;
        var parent = {
          userId: parentGuestUser.userId,
          email: parentGuestUser.email
        };
        parentGuestUser.isActive = data.isActive;
        parentGuestUser.firstName = data.parentFirstName;
        parentGuestUser.lastName = data.parentLastName;
        parentGuestUser.roleId = USER_CODES.PARENT_ROLE;
        let password = utils.passwordGenerator();
        let salt = crypto.randomBytes(16).toString('base64');
        parentGuestUser.salt = salt;
        parentGuestUser.password = USER_CODES.PASSWORD_PREFIX + utils.encryptText(password + salt);
        update(parentGuestUser, function (res) {
          var emailRequest = {
            template: CONSTANTS.EMAIL.CREATE_USER,
            to: parentGuestUser.email,
            email: parentGuestUser.email,
            password: password,
          };
          mailer.sendMail(emailRequest, function (res) {
            logger.info('Mail sent status : ', res.status, 'for UserId : ', usersModel.userId);
          });
          // checking if student also with guest role ???

          if (data.studentGuestUser) {
            var studentGuestUser = data.studentGuestUser;
            studentGuestUser.isActive = data.isActive;
            studentGuestUser.firstName = data.firstName;
            studentGuestUser.lastName = data.lastName;
            studentGuestUser.roleId = USER_CODES.STUDENT_ROLE;
            let password = utils.passwordGenerator();
            let salt = crypto.randomBytes(16).toString('base64');
            studentGuestUser.salt = salt;
            studentGuestUser.password = USER_CODES.PASSWORD_PREFIX + utils.encryptText(password + salt);
            studentGuestUser.parents = [];
            studentGuestUser.parents.push(parent);
            update(studentGuestUser, function (res) {
              let template = "";
              if (!data.isActive) {
                template = CONSTANTS.EMAIL.CREATE_USER_WITH_INFORM;
              }
              let studentUserId = res.userId;
              if (template === CONSTANTS.EMAIL.CREATE_USER_WITH_INFORM) {
                emailCreateUserWithInform(template, data.parentEmail, data.firstName, dbParent.password, studentUserId);
              } else {
                var emailRequest = {
                  template: CONSTANTS.EMAIL.CREATE_USER,
                  to: studentGuestUser.email,
                  email: studentGuestUser.email,
                  password: password,
                };
                mailer.sendMail(emailRequest, function (res) {
                  logger.info('Mail sent status : ', res.status, 'for UserId : ', usersModel.userId);
                });
              }
              // make connection b/w them
              var connectionRequest = {
                userId: studentGuestUser.userId,
                partnerId: parentGuestUser.userId,
                dateTime: utils.getSystemTime(),
                status: 'Accepted',
                isActive: true
              };
              Connection.createConnectionForParentAddStudent(connectionRequest, function (res) {
                notificationStudentAddParent(connectionRequest);
                logger.info('connection created : ', res.status);
              });
              // create bot connection
              var botRequest = {
                userId: studentGuestUser.userId,
                partnerId: USER_CODES.BOTID,
                dateTime: utils.getSystemTime(),
                status: 'Accepted',
                isActive: true
              };
              Connection.createConnectionForParentAddStudent(botRequest, function (res) {
                notificationStudentAddParent(botRequest);
                logger.info('connection created : ', res.status);
              });

              if (template === CONSTANTS.EMAIL.CREATE_USER_WITH_INFORM) {
                sendStudentActivateResponse(data, res, callback);
              } else {
                sendResponse(data, res, callback);
              }
            });
          } else {
            data.parents = [];
            data.parents.push(parent);
            create(data, function (res) { //  // create student with updated parents
              try {
                let template = "";
                if (!data.isActive) {
                  template = CONSTANTS.EMAIL.CREATE_USER_WITH_INFORM;
                }
                let studentUserId = res.userId;
                if (template === CONSTANTS.EMAIL.CREATE_USER_WITH_INFORM) {
                  emailCreateUserWithInform(template, data.parentEmail, data.firstName, dbParent.password, studentUserId);
                }

                var connectionRequest = {
                  userId: res.userId,
                  userRoleId: USER_CODES.STUDENT_ROLE,
                  partnerId: parent.userId,
                  partnerRoleId: USER_CODES.PARENT_ROLE,
                  dateTime: utils.getSystemTime(),
                  status: utils.CONSTANTS.CONNECTION.ACCEPTED,
                  isActive: true
                };
                Connection.createConnectionForParentAddStudent(connectionRequest, function (res) {
                  notificationStudentAddParent(connectionRequest);
                  logger.info('connection created : ', res.status);
                });
                if (template === CONSTANTS.EMAIL.CREATE_USER_WITH_INFORM) {
                  sendStudentActivateResponse(data, res, callback);
                } else {
                  sendResponse(data, res, callback);
                }
              } catch (e) {
                res.json(e);
              }
            });
          }
        });
      } else if (dbParent.roleId == USER_CODES.PARENT_ROLE) { // parent with parent role exist
        var parent = {
          userId: dbParent.userId,
          email: data.parentEmail
        };
        // checking if student also with guest role ???
        if (data.studentGuestUser) {
          var studentGuestUser = data.studentGuestUser;
          studentGuestUser.isActive = data.isActive;
          studentGuestUser.firstName = data.firstName;
          studentGuestUser.lastName = data.lastName;
          studentGuestUser.roleId = USER_CODES.STUDENT_ROLE;
          let password = utils.passwordGenerator();
          let salt = crypto.randomBytes(16).toString('base64');
          studentGuestUser.salt = salt;
          studentGuestUser.password = USER_CODES.PASSWORD_PREFIX + utils.encryptText(password + salt);
          studentGuestUser.parents = [];
          studentGuestUser.parents.push(parent);
          update(studentGuestUser, function (res) {

            let template = "";
            if (!data.isActive) {
              template = CONSTANTS.EMAIL.CREATE_USER_WITH_INFORM;
            }
            let studentUserId = res.userId;
            if (template === CONSTANTS.EMAIL.CREATE_USER_WITH_INFORM) {
              emailCreateUserWithInform(template, data.parentEmail, data.firstName, dbParent.password, studentUserId);
            } else {
              var emailRequest = {
                template: CONSTANTS.EMAIL.CREATE_USER,
                to: studentGuestUser.email,
                email: studentGuestUser.email,
                password: password,
              };
              mailer.sendMail(emailRequest, function (res) {
                logger.info('Mail sent status : ', res.status, 'for UserId : ', usersModel.userId);
              });
            }
            // make connection b/w them
            var connectionRequest = {
              userId: studentGuestUser.userId,
              partnerId: parentGuestUser.userId,
              dateTime: utils.getSystemTime(),
              status: utils.CONSTANTS.CONNECTION.ACCEPTED,
              isActive: true
            };
            Connection.createConnectionForParentAddStudent(connectionRequest, function (res) {
              notificationStudentAddParent(connectionRequest);
              logger.info('connection created : ', res.status);
            });
            if (template === CONSTANTS.EMAIL.CREATE_USER_WITH_INFORM) {
              sendStudentActivateResponse(data, res, callback);
            } else {
              sendResponse(data, res, callback);
            }
          })
        } else {
          data.parents = [];
          data.parents.push(parent);
          create(data, function (res) { //  // create student with updated parents
            try {
              let template = "";
              if (!data.isActive) {
                template = CONSTANTS.EMAIL.CREATE_USER_WITH_INFORM;
              }
              let studentUserId = res.userId;
              if (template === CONSTANTS.EMAIL.CREATE_USER_WITH_INFORM) {
                emailCreateUserWithInform(template, data.parentEmail, data.firstName, dbParent.password, studentUserId);
              }

              var connectionRequest = {
                userId: res.userId,
                userRoleId: USER_CODES.STUDENT_ROLE,
                partnerId: parent.userId,
                partnerRoleId: USER_CODES.PARENT_ROLE,
                dateTime: utils.getSystemTime(),
                status: utils.CONSTANTS.CONNECTION.ACCEPTED,
                isActive: true
              };
              Connection.createConnectionForParentAddStudent(connectionRequest, function (res) {
                notificationStudentAddParent(connectionRequest);
                logger.info('connection created : ', res.status);
              });
              if (template === CONSTANTS.EMAIL.CREATE_USER_WITH_INFORM) {
                sendStudentActivateResponse(data, res, callback);
              } else {
                sendResponse(data, res, callback); // make default connection
              }
            } catch (e) {
              res.json(e);
            }
          });
        }
      }
    } else {
      // new parent user 
      var template = CONSTANTS.EMAIL.CREATE_USER;
      if (!data.isActive) {
        template = CONSTANTS.EMAIL.CREATE_USER_WITH_INFORM;
      }

      var newParent = {
        firstName: data.parentFirstName,
        lastName: data.parentLastName ? data.parentLastName : '',
        email: data.parentEmail,
        roleId: USER_CODES.PARENT_ROLE,
        studentFirstName: data.firstName,
        isActive: true,
        template: template
      }

      var mailUserInfo = {
        firstName: data.parentFirstName,
        lastName: data.parentLastName ? data.parentLastName : '',
        studentFirstName: data.firstName,
      };
      create(newParent, function (res) {
        var parent = {
          userId: res.userId,
          email: data.parentEmail
        };
        var parentPwd = res.password;
        // check if student is in guest role ??
        if (data.studentGuestUser) {
          var studentGuestUser = data.studentGuestUser;
          studentGuestUser.isActive = data.isActive;
          studentGuestUser.firstName = data.firstName;
          studentGuestUser.lastName = data.lastName;
          studentGuestUser.roleId = USER_CODES.STUDENT_ROLE;
          let password = utils.passwordGenerator();
          let salt = crypto.randomBytes(16).toString('base64');
          studentGuestUser.salt = salt;
          studentGuestUser.password = USER_CODES.PASSWORD_PREFIX + utils.encryptText(password + salt);
          studentGuestUser.parents = [];
          studentGuestUser.parents.push(parent);
          update(studentGuestUser, function (res) {
            var emailRequest = {
              template: CONSTANTS.EMAIL.CREATE_USER,
              to: studentGuestUser.email,
              email: studentGuestUser.email,
              password: password,
            };
            mailer.sendMail(emailRequest, function (res) {
              logger.info('Mail sent status : ', res.status, 'for UserId : ', usersModel.userId);
            });
            // make connection b/w them
            var connectionRequest = {
              userId: studentGuestUser.userId,
              userRoleId: USER_CODES.STUDENT_ROLE,
              partnerRoleId: USER_CODES.PARENT_ROLE,
              partnerId: parent.userId,
              dateTime: utils.getSystemTime(),
              status: utils.CONSTANTS.CONNECTION.ACCEPTED,
              isActive: true
            };
            if (template === CONSTANTS.EMAIL.CREATE_USER_WITH_INFORM) {
              emailCreateUserWithInform(template, data.parentEmail, data.firstName, parentPwd, studentGuestUser.userId);
              //    emailSentToStudentForActiveInfo(studentGuestUser.email);
            }
            Connection.createConnectionForParentAddStudent(connectionRequest, function (res) {
              notificationStudentAddParent(connectionRequest);
              logger.info('connection created : ', res.status);
            });
            sendResponse(data, res, callback);
          })
        } else {
          data.parents = [];
          data.parents.push(parent);
          // if(template === CONSTANTS.EMAIL.CREATE_USER_WITH_INFORM){
          //   data.template = CONSTANTS.EMAIL.STUDENT_ACTIVE_LOGIN;
          // } 
          create(data, function (res) { //  // create student with updated parents
            try {
              var connectionRequest = {
                userId: res.userId,
                partnerId: parent.userId,
                userRoleId: USER_CODES.STUDENT_ROLE,
                partnerRoleId: USER_CODES.PARENT_ROLE,
                dateTime: utils.getSystemTime(),
                status: utils.CONSTANTS.CONNECTION.ACCEPTED,
                isActive: true
              };

              let studentUserId = res.userId;
              if (template === CONSTANTS.EMAIL.CREATE_USER_WITH_INFORM) {
                emailCreateUserWithInform(template, data.parentEmail, data.firstName, parentPwd, studentUserId);

                // emailSentToStudentForActiveInfo(data.email);
              }

              Connection.createConnectionForParentAddStudent(connectionRequest, function (res) {
                notificationStudentAddParent(connectionRequest);
                logger.info('connection created : ', res.status);
              });
              if (template === CONSTANTS.EMAIL.CREATE_USER_WITH_INFORM) {
                sendStudentActivateResponse(data, res, callback);

                // emailSentToStudentForActiveInfo(data.email);
              } else {
                sendResponse(data, res, callback); // make default connection
              }
            } catch (e) {
              res.json(e);
            }
          });
        }
      });
    }
  });
}


function updateRecommendationPassword(req, callback) {
  var token = req.headers.authorization.split(' ').map(function (val) {
    return val;
  })[1];
  login.getList({
    token: token
  },
    function (res) {
      if (res.status == REQUEST_CODES.SUCCESS) {
        if (res.result != 0) {
          getList({
            userId: res.result[0].userId
          },
            function (userRes) {
              var user = userRes.result[0];
              if (req.body.dob && utils.calculateAge(new Date(req.body.dob), new Date()) < USER_CODES.STUDENT_MININUM_REQUIRED_AGE) {
                req.body.isActive = false;
                req.body.isWizard = true;
                if (req.body.parentEmail) {
                  req.body.studentGuestUser = user;
                  studentSignUpWithParentUpdatePassword(req.body, callback);
                }
              } else if (user.roleId === 3) {
                user.isPasswordChanged = true;
                var salt = crypto.randomBytes(16).toString('base64');
                user.salt = user.password ? salt : user.salt;
                user.firstName = req.body.firstName;
                user.lastName = req.body.lastName;
                user.dob = req.body.dob ? req.body.dob : user.dob;
                user.roleId = req.body.roleId;
                user.password = req.body.password ?
                  USER_CODES.PASSWORD_PREFIX + utils.encryptText(utils.decrypt(req.body.password) + salt) : user.password;
                update(user, function (resp) {
                  if (resp.status == REQUEST_CODES.SUCCESS) {
                    getList({
                      userId: res.result[0].userId
                    }, function (updatedUserRes) {
                      let updatedUser = updatedUserRes.result[0];
                      callback({
                        status: REQUEST_CODES.SUCCESS,
                        message: USER_CODES.CHANGE_PASSWORD_SUCCESS,
                        result: updatedUser
                      });
                      return;
                    })
                  } else {
                    return resp;
                  }
                });
              }
            }
          );
        } else {
          callback({
            status: REQUEST_CODES.FAIL,
            message: CONSTANTS.LOGIN.INVALID_TOKEN
          });
          return;
        }
      } else {
        callback({
          status: REQUEST_CODES.FAIL,
          message: CONSTANTS.LOGIN.INVALID_TOKEN
        });
        return;
      }
    }
  );
}

function updateRecommendationPasswordWithoutPassword(req, callback) {
  let email = req.body.email;
   console.log('email',email);
    getList({
      email: email
    },
      function (userRes) {                  
        var user = userRes.result[0];

        let userIndex=user.role && user.role.findIndex(todo => todo.id == 3);
        if (req.body.dob && utils.calculateAge(new Date(req.body.dob), new Date()) < USER_CODES.STUDENT_MININUM_REQUIRED_AGE) {
          req.body.isActive = false;
          req.body.isWizard = true;
          if (req.body.parentEmail) {
            req.body.studentGuestUser = user;
            studentSignUpWithParentUpdatePassword(req.body, callback);
          }
        } else if (userIndex !== -1) {
          user.isPasswordChanged = true;
          var salt = crypto.randomBytes(16).toString('base64');
          user.salt = user.password ? salt : user.salt;
          user.firstName = req.body.firstName;
          user.lastName = req.body.lastName;
          user.dob = req.body.dob ? req.body.dob : user.dob;
          user.roleId = req.body.roleId;
          user.password = req.body.password ?
            USER_CODES.PASSWORD_PREFIX + utils.encryptText(utils.decrypt(req.body.password) + salt) : user.password;


          let roleArr= user.role;
          roleArr.splice(userIndex,1);         
          roleArr.push({'id':parseInt(req.body.roleId)})
          user.role= roleArr;
          update(user, function (resp) {
            if (resp.status == REQUEST_CODES.SUCCESS) {
              getList({
                userId: user.userId
              }, function (updatedUserRes) {
                let updatedUser = updatedUserRes.result[0];
                callback({
                  status: REQUEST_CODES.SUCCESS,
                  message: USER_CODES.CHANGE_PASSWORD_SUCCESS,
                  result: updatedUser
                });
                return;
              })
            } else {
              return resp;
            }
          });
        }else{
          callback({
            status: REQUEST_CODES.SUCCESS,
            message: utils.formatText(USER_CODES.EMAIL_EXIST, user.email)           
          });
          return;
        }
      }
    );  
}

function studentSignUpWithParentUpdatePassword(data, callback) {
  getList({
    email: data.parentEmail.toLowerCase()
  }, function (res) {
    if (res.result.length > 0) {
      var dbParent = res.result[0];
      if (dbParent.roleId == USER_CODES.STUDENT_ROLE) {
        callback({
          status: REQUEST_CODES.FAIL,
          message: utils.formatText(USER_CODES.PARENT_ALREADY_EXIST_WITH_OTHER_ROLE, data.parentEmail)
        });
        return;
      } else if (dbParent.roleId == USER_CODES.GUEST_ROLE) { //parent with guest role found.

        var parentGuestUser = dbParent;
        var parent = {
          userId: parentGuestUser.userId,
          email: parentGuestUser.email
        };
        parentGuestUser.isActive = data.isActive;
        parentGuestUser.firstName = data.parentFirstName;
        parentGuestUser.lastName = data.parentLastName;
        parentGuestUser.roleId = USER_CODES.PARENT_ROLE;
        let password = utils.passwordGenerator();
        let salt = crypto.randomBytes(16).toString('base64');
        parentGuestUser.salt = salt;
        parentGuestUser.password = USER_CODES.PASSWORD_PREFIX + utils.encryptText(password + salt);
        update(parentGuestUser, function (res) {
          var emailRequest = {
            template: CONSTANTS.EMAIL.CREATE_USER,
            to: parentGuestUser.email,
            email: parentGuestUser.email,
            password: password,
          };
          mailer.sendMail(emailRequest, function (res) {
            logger.info('Mail sent status : ', res.status, 'for UserId : ', usersModel.userId);
          });
          // checking if student also with guest role ???

          if (data.studentGuestUser) {
            var studentGuestUser = data.studentGuestUser;
            studentGuestUser.isActive = data.isActive;
            studentGuestUser.firstName = data.firstName;
            studentGuestUser.lastName = data.lastName;
            studentGuestUser.roleId = USER_CODES.STUDENT_ROLE;
            let salt = crypto.randomBytes(16).toString('base64');
            studentGuestUser.salt = data.password ? salt : studentGuestUser.salt;
            studentGuestUser.password = data.password ?
              USER_CODES.PASSWORD_PREFIX + utils.encryptText(utils.decrypt(data) + salt) : studentGuestUser.password;
            studentGuestUser.parents = [];
            studentGuestUser.parents.push(parent);
            update(studentGuestUser, function (res) {
              // var emailRequest = {
              //   template: CONSTANTS.EMAIL.CREATE_USER,
              //   to: studentGuestUser.email,
              //   email: studentGuestUser.email,
              //   password: password,
              // };
              // mailer.sendMail(emailRequest, function (res) {
              //   logger.info('Mail sent status : ', res.status, 'for UserId : ', usersModel.userId);
              // });
              // make connection b/w them
              let template = "";
              if (!data.isActive) {
                template = CONSTANTS.EMAIL.CREATE_USER_WITH_INFORM;
              }
              let studentUserId = res.userId;
              if (template === CONSTANTS.EMAIL.CREATE_USER_WITH_INFORM) {
                emailCreateUserWithInform(template, data.parentEmail, data.firstName, dbParent.password, studentUserId);
              }
              var connectionRequest = {
                userId: studentGuestUser.userId,
                partnerId: parentGuestUser.userId,
                dateTime: utils.getSystemTime(),
                status: 'Accepted',
                isActive: true
              };
              Connection.createConnectionForParentAddStudent(connectionRequest, function (res) {
                notificationStudentAddParent(connectionRequest);
                logger.info('connection created : ', res.status);
              });
              // create bot connection
              var botRequest = {
                userId: studentGuestUser.userId,
                partnerId: USER_CODES.BOTID,
                userRoleId: USER_CODES.STUDENT_ROLE,
                partnerRoleId: USER_CODES.STUDENT_ROLE,
                dateTime: utils.getSystemTime(),
                status: 'Accepted',
                isActive: true
              };
              Connection.createConnectionForParentAddStudent(botRequest, function (res) {
                notificationStudentAddParent(botRequest);
                logger.info('connection created : ', res.status);
              });
              if (template === CONSTANTS.EMAIL.CREATE_USER_WITH_INFORM) {
                sendStudentActivateResponse(data, res, callback);
              } else {
                sendResponse(data, res, callback);
              }
            });
          }
        });
      } else if (dbParent.roleId == USER_CODES.PARENT_ROLE) { // parent with parent role exist      

        var parent = {
          userId: dbParent.userId,
          email: data.parentEmail
        };
        // checking if student also with guest role ???
        if (data.studentGuestUser) {
          var studentGuestUser = data.studentGuestUser;
          studentGuestUser.isActive = data.isActive;
          studentGuestUser.firstName = data.firstName;
          studentGuestUser.lastName = data.lastName;
          studentGuestUser.roleId = USER_CODES.STUDENT_ROLE;
          let salt = crypto.randomBytes(16).toString('base64');
          studentGuestUser.salt = salt;
          studentGuestUser.password =
            USER_CODES.PASSWORD_PREFIX + utils.encryptText(utils.decrypt(data.password) + salt);
          studentGuestUser.parents = [];
          studentGuestUser.parents.push(parent);
          update(studentGuestUser, function (res) {
            let template = "";
            if (!data.isActive) {
              template = CONSTANTS.EMAIL.CREATE_USER_WITH_INFORM;
            }
            let studentUserId = res.userId;
            if (template === CONSTANTS.EMAIL.CREATE_USER_WITH_INFORM) {
              emailCreateUserWithInform(template, data.parentEmail, data.firstName, dbParent.password, studentUserId);
            }
            // var emailRequest = {
            //   template: CONSTANTS.EMAIL.CREATE_USER,
            //   to: studentGuestUser.email,
            //   email: studentGuestUser.email,
            //   password: password,
            // };
            // mailer.sendMail(emailRequest, function (res) {
            //   logger.info('Mail sent status : ', res.status, 'for UserId : ', usersModel.userId);
            // });
            // make connection b/w them           
            var connectionRequest = {
              userId: studentGuestUser.userId,
              partnerId: dbParent.userId,
              userRoleId: USER_CODES.STUDENT_ROLE,
              partnerRoleId: USER_CODES.PARENT_ROLE,
              dateTime: utils.getSystemTime(),
              status: utils.CONSTANTS.CONNECTION.ACCEPTED,
              isActive: true
            };
            Connection.createConnectionForParentAddStudent(connectionRequest, function (res) {
              notificationStudentAddParent(connectionRequest);
              logger.info('connection created : ', res.status);
            });
            if (template === CONSTANTS.EMAIL.CREATE_USER_WITH_INFORM) {
              sendStudentActivateResponse(data, res, callback);
            } else {
              sendResponse(data, res, callback);
            }
          })
        }
      }
    } else {
      // new parent user 
      var template = CONSTANTS.EMAIL.CREATE_USER;
      if (!data.isActive) {
        template = CONSTANTS.EMAIL.CREATE_USER_WITH_INFORM;
      }

      var newParent = {
        firstName: data.parentFirstName,
        lastName: data.parentLastName ? data.parentLastName : '',
        email: data.parentEmail,
        roleId: USER_CODES.PARENT_ROLE,
        studentFirstName: data.firstName,
        isActive: true,
        template: template
      }

      var mailUserInfo = {
        firstName: data.parentFirstName,
        lastName: data.parentLastName ? data.parentLastName : '',
        studentFirstName: data.firstName,
      };
      create(newParent, function (res) {
        var parent = {
          userId: res.userId,
          email: data.parentEmail
        };
        var parentPwd = res.password;
        // check if student is in guest role ??
        if (data.studentGuestUser) {
          var studentGuestUser = data.studentGuestUser;
          studentGuestUser.isActive = data.isActive;
          studentGuestUser.firstName = data.firstName;
          studentGuestUser.lastName = data.lastName;
          studentGuestUser.roleId = USER_CODES.STUDENT_ROLE;
          let salt = crypto.randomBytes(16).toString('base64');
          studentGuestUser.salt = salt;
          studentGuestUser.password = data.password ?
            USER_CODES.PASSWORD_PREFIX + utils.encryptText(utils.decrypt(data.password) + salt) : studentGuestUser.password;
          studentGuestUser.parents = [];
          studentGuestUser.parents.push(parent);
          update(studentGuestUser, function (res) {
            // var emailRequest = {
            //   template: CONSTANTS.EMAIL.CREATE_USER,
            //   to: studentGuestUser.email,
            //   email: studentGuestUser.email,
            //   password: password,
            // };
            // mailer.sendMail(emailRequest, function (res) {
            //   logger.info('Mail sent status : ', res.status, 'for UserId : ', usersModel.userId);
            // });
            // make connection b/w them
            var connectionRequest = {
              userId: studentGuestUser.userId,
              partnerId: parent.userId,
              userRoleId: USER_CODES.STUDENT_ROLE,
              partnerRoleId: USER_CODES.PARENT_ROLE,
              dateTime: utils.getSystemTime(),
              status: utils.CONSTANTS.CONNECTION.ACCEPTED,
              isActive: true
            };
            if (template === CONSTANTS.EMAIL.CREATE_USER_WITH_INFORM) {
              emailCreateUserWithInform(template, data.parentEmail, mailUserInfo.studentFirstName, parentPwd, studentGuestUser.userId);
            }
            Connection.createConnectionForParentAddStudent(connectionRequest, function (res) {
              notificationStudentAddParent(connectionRequest);
              logger.info('connection created : ', res.status);
            });
            sendResponse(data, res, callback);
          })
        }
      });
    }
  });
}

function sendStudentActivateResponse(data, res, callback) {
  if (res.status === REQUEST_CODES.SUCCESS) {
    callback({
      status: REQUEST_CODES.SUCCESS,
      message: utils.formatText(USER_CODES.CREATE_SUCCESS_ROLE_FOLLOW_UP, data.email),
      result: {
        email: data.email
      }
    });
    return;
  } else {
    callback(res);
    return;
  }
}

function emailCreateUserWithInform(template, email, studentFirstName, password, studentUserId) {
  email = email.toLowerCase();
  var emailRequest = {
    template: template,
    to: email,
    email: email,
    password: password,
    name: studentFirstName,
    link: config.server_url + '/autoLogin/' + email + '/' + utils.encrypt(password) + '/' + studentUserId + '/' + 'studentActivation'
  };

  mailer.sendMail(emailRequest, function (res) {
    logger.info('Mail sent status : ', res.status, 'for UserId : ', studentUserId);
  });
}


function emailSentToStudentForActiveInfo(email) {
  email = email.toLowerCase();
  var emailRequest = {
    template: CONSTANTS.EMAIL.FOLLOW_UP_PARENT,
    to: email,
    email: email
  };

  mailer.sendMail(emailRequest, function (res) {
    logger.info('Mail sent status : ', res.status, 'for UserId : ', usersModel.userId);
  });
}

function notificationStudentAddParent(connection) {
  login.getDeviceIds(parseInt(connection.partnerId), function (resp) {
    let deviceIds = resp.result;
    getList({
      userId: parseInt(connection.partnerId)
    }, function (res) {
      let partner = res.result[0];
      getList({
        userId: parseInt(connection.userId)
      }, function (res) {
        let user = res.result[0];
        var message = {
          deviceIds: deviceIds,
          userId: partner.userId,
          name: partner.firstName,
          actedBy: user.userId,
          profilePicture: user.profilePicture,
          body: user.firstName + ' has added you as parent in their spikeview profile.',
          textName: user.firstName + ' ' + (user.lastName ? user.lastName : ''),
          textMessage: ' has added you as parent in their spikeview profile.'
        };
        mobileNotification.sendNotification(message);
      });
    })
  });
}

/*function parentSignUp(data, callback) { // when student is mandatory with parent signup removed in reskin
  if (!data.students && !data.students.length > 0) {
    callback({
      status: REQUEST_CODES.FAIL,
      message: USER_CODES.STUDENT_MANDATE
    });
    return;
  }
  var student = data.students[0];
  getList({
    email: data.email.toLowerCase()
  }, function (res) {
    if (res.result.length > 0) { // parent found in spikeview
      var dbUser = res.result[0];
      if (dbUser.roleId == USER_CODES.STUDENT_ROLE) {
        callback({
          status: REQUEST_CODES.FAIL,
          message: utils.formatText(USER_CODES.PARENT_ALREADY_EXIST_WITH_OTHER_ROLE, data.email)
        });
        return;
      } else if (dbUser.roleId == USER_CODES.PARENT_ROLE) {
        callback({
          status: REQUEST_CODES.FAIL,
          message: utils.formatText(USER_CODES.EMAIL_EXIST, data.email)
        });
        return;
      } else if (dbUser.roleId == USER_CODES.GUEST_ROLE) {
        // update dbUser to parent role
        var parentGuestUser = dbUser;
        parentGuestUser.isActive = data.isActive;
        parentGuestUser.firstName = data.firstName;
        parentGuestUser.lastName = data.lastName;
        parentGuestUser.roleId = USER_CODES.PARENT_ROLE;
        let password = utils.passwordGenerator();
        let salt = crypto.randomBytes(16).toString('base64');
        parentGuestUser.salt = salt;
        parentGuestUser.password = USER_CODES.PASSWORD_PREFIX + utils.encryptText(password + salt);
        update(parentGuestUser, function (res) {
          var emailRequest = {
            template: CONSTANTS.EMAIL.CREATE_USER,
            to: parentGuestUser.email,
            email: parentGuestUser.email,
            password: password,
          };
          mailer.sendMail(emailRequest, function (res) {
            logger.info('Mail sent status : ', res.status, 'for UserId : ', usersModel.userId);
          });
          // checking if student also with guest role ???
          var parent = {
            userId: parentGuestUser.userId,
            email: parentGuestUser.email
          }
          /// check now if student user found with guest role  
          getList({
            email: student.email.toLowerCase()
          }, function (res) {
            if (res.result.length > 0) {
              // student user found in db, need to check cases here..
              var dbUser = res.result[0];
              if (dbUser.roleId == USER_CODES.STUDENT_ROLE) {
                callback({
                  status: REQUEST_CODES.FAIL,
                  message: USER_CODES.ADD_FROM_PROFILE // if parent exist - and student is new then alert messge - add student from profile.
                });
                return;
              } else if (dbUser.roleId == USER_CODES.PARENT_ROLE) {
                callback({
                  status: REQUEST_CODES.FAIL,
                  message: USER_CODES.PARENT_ALREADY_EXIST_WITH_OTHER_ROLE
                });
                return;
              } else if (dbUser.roleId == USER_CODES.GUEST_ROLE) {
                // student exist in guest role,.. update user record with student details here...
                var studentGuestUser = dbUser;
                studentGuestUser.isActive = true;
                studentGuestUser.firstName = student.firstName;
                studentGuestUser.lastName = student.lastName;
                studentGuestUser.roleId = USER_CODES.STUDENT_ROLE;
                let password = utils.passwordGenerator();
                let salt = crypto.randomBytes(16).toString('base64');
                studentGuestUser.salt = salt;
                studentGuestUser.password = USER_CODES.PASSWORD_PREFIX + utils.encryptText(password + salt);
                studentGuestUser.parents = [];
                studentGuestUser.parents.push(parent);
                update(studentGuestUser, function (res) {
                  var emailRequest = {
                    template: CONSTANTS.EMAIL.CREATE_USER,
                    to: studentGuestUser.email,
                    email: studentGuestUser.email,
                    password: password,
                  };
                  mailer.sendMail(emailRequest, function (res) {
                    logger.info('Mail sent status : ', res.status, 'for UserId : ', studentGuestUser.email);
                  });
                  var connectionRequest = {
                    userId: studentGuestUser.userId,
                    partnerId: parent.userId,
                    dateTime: utils.getSystemTime(),
                    status: utils.CONSTANTS.CONNECTION.ACCEPTED,
                    isActive: true
                  };
                  Connection.create(connectionRequest, function (res) {
                    logger.info('connection created : ', res.status);
                  });
                  sendResponse(studentGuestUser, res, callback);
                })
              }
            } else {
              // create new student here with above parent details
              student.parents = [];
              student.parents.push(parent);
              student.roleId = USER_CODES.STUDENT_ROLE;
              student.isActive = true;
              create(student, function (res) {
                var connectionRequest = {
                  userId: res.userId,
                  partnerId: parent.userId,
                  dateTime: utils.getSystemTime(),
                  status: utils.CONSTANTS.CONNECTION.ACCEPTED,
                  isActive: true
                };
                Connection.create(connectionRequest, function (res) {
                  logger.info('connection created : ', res.status);
                });
                sendResponse(student, res, callback);
              });
            }
          });
        })
      }
    } else {
      // parent user not found in spikeview, create new parent user...
      data.isActive = true;
      create(data, function (res) { // create parent user
        var parent = {
          userId: res.userId,
          email: data.email.toLowerCase()
        };
        getList({
          email: student.email.toLowerCase()
        }, function (res) {
          if (res.result.length > 0) {
            // student user found in db, need to check cases here..
            var dbUser = res.result[0];
            if (dbUser.roleId == USER_CODES.STUDENT_ROLE) {
              // new parent and student exists....
              var emailDataStudent = {
                template: CONSTANTS.EMAIL.INFORM_STUDENT,
                to: dbUser.email,
                email: parent.email,
                mailMessage: 'You have a reuqest for adding {parents.email} as parent. Please add parent from your profile.'
              };
              mailer.sendMail(emailDataStudent, function (resp) {
                logger.info('Inform student email sent to : ', dbUser.email, 'status : ', resp.status);
              });
              callback({
                status: REQUEST_CODES.SUCCESS,
                message: USER_CODES.INFORM_PARENT
              });
              return;
            } else if (dbUser.roleId == USER_CODES.PARENT_ROLE) {
              callback({
                status: REQUEST_CODES.FAIL,
                message: USER_CODES.PARENT_ALREADY_EXIST_WITH_OTHER_ROLE
              });
              return;
            } else if (dbUser.roleId === USER_CODES.GUEST_ROLE) {
              // student exist in guest role,.. update user record with student details here...
              var studentGuestUser = dbUser;
              studentGuestUser.isActive = true;
              studentGuestUser.firstName = student.firstName;
              studentGuestUser.lastName = student.lastName;
              studentGuestUser.roleId = USER_CODES.STUDENT_ROLE;
              let password = utils.passwordGenerator();
              let salt = crypto.randomBytes(16).toString('base64');
              studentGuestUser.salt = salt;
              studentGuestUser.password = USER_CODES.PASSWORD_PREFIX + utils.encryptText(password + salt);
              studentGuestUser.parents = [];
              studentGuestUser.parents.push(parent);
              update(studentGuestUser, function (res) {
                var emailRequest = {
                  template: CONSTANTS.EMAIL.CREATE_USER,
                  to: studentGuestUser.email,
                  email: studentGuestUser.email,
                  password: password,
                };
                mailer.sendMail(emailRequest, function (res) {
                  logger.info('Mail sent status : ', res.status, 'for UserId : ', studentGuestUser.email);
                });
                var connectionRequest = {
                  userId: studentGuestUser.userId,
                  partnerId: parent.userId,
                  dateTime: utils.getSystemTime(),
                  status: utils.CONSTANTS.CONNECTION.ACCEPTED,
                  isActive: true
                };
                Connection.create(connectionRequest, function (res) {
                  logger.info('connection created : ', res.status);
                });
                sendResponse(studentGuestUser, res, callback);
              })
            }
          } else {
            // create new student here with above parent details
            student.isActive = true;
            student.roleId = USER_CODES.STUDENT_ROLE;
            student.parents = [];
            student.parents.push(parent);
            create(student, function (res) {
              var connectionRequest = {
                userId: res.userId,
                partnerId: parent.userId,
                dateTime: utils.getSystemTime(),
                status: utils.CONSTANTS.CONNECTION.ACCEPTED,
                isActive: true
              };
              Connection.create(connectionRequest, function (res) {
                logger.info('connection created : ', res.status);
              });
              sendResponse(student, res, callback);
            });
          }
        });
      });
    }
  });
}*/

function parentSignUp(data, callback) { // add student not there at the time of parent signup for reskin
  if (!data.email && !data.email.length > 0) {
    callback({
      status: REQUEST_CODES.FAIL,
      message: USER_CODES.PARENT_EMAIL_MANDATE
    });
    return;
  }
  getList({
    email: data.email.toLowerCase()
  }, function (res) {
    if (res.result.length > 0) { // parent found in spikeview
      var dbUser = res.result[0];
      if (dbUser.roleId == USER_CODES.STUDENT_ROLE) {
        callback({
          status: REQUEST_CODES.FAIL,
          message: utils.formatText(USER_CODES.PARENT_ALREADY_EXIST_WITH_OTHER_ROLE, data.email)
        });
        return;
      } else if (dbUser.roleId == USER_CODES.PARENT_ROLE) {
        callback({
          status: REQUEST_CODES.FAIL,
          message: utils.formatText(USER_CODES.EMAIL_EXIST, data.email)
        });
        return;
      } else if (dbUser.roleId == USER_CODES.GUEST_ROLE) {
        // update dbUser to parent role
        var parentGuestUser = dbUser;
        parentGuestUser.isActive = data.isActive;
        parentGuestUser.firstName = data.firstName;
        parentGuestUser.lastName = data.lastName;
        parentGuestUser.roleId = USER_CODES.PARENT_ROLE;
        let password = utils.passwordGenerator();
        let salt = crypto.randomBytes(16).toString('base64');
        parentGuestUser.salt = salt;
        parentGuestUser.password = USER_CODES.PASSWORD_PREFIX + utils.encryptText(password + salt);
        update(parentGuestUser, function (res) {
          var emailRequest = {
            template: CONSTANTS.EMAIL.CREATE_PARENT_USER,
            to: parentGuestUser.email,
            email: parentGuestUser.email,
            password: password,
          };
          mailer.sendMail(emailRequest, function (res) {
            logger.info('Mail sent status : ', res.status, 'for UserId : ', usersModel.userId);
          });
          sendResponse(parentGuestUser, res, callback);
        })
      }
    } else {
      // parent user not found in spikeview, create new parent user...
      data.isActive = true;
      create(data, function (res) { // create parent user
        var parent = {
          userId: res.userId,
          email: data.email.toLowerCase()
        };
      });
      sendResponse(data, res, callback);
    }
  });
}

function sendResponse(data, res, callback) {
  if (res.status === REQUEST_CODES.SUCCESS) {
    callback({
      status: REQUEST_CODES.SUCCESS,
      message: utils.formatText(USER_CODES.CREATE_SUCCESS_ROLE, data.email),
      result: {
        email: data.email
      }
    });
    return;
  } else {
    callback(res);
    return;
  }
}

function getList(query, callback) {
  UsersModel.find(query, function (error, records) {
    if (error) {
      callback({
        status: REQUEST_CODES.FAIL,
        message: utils.formatText(REQUEST_CODES.FAIL_MSG, USER_CODES.GET_API)
      });
      return;
    } else {
      records = records.map(function (record) {
        return new UsersController.UserAPI(record);
      });
      callback({
        status: REQUEST_CODES.SUCCESS,
        result: records
      });
      return;
    }
  });
}
// function getFilteredUsers(query, callback) {
//   console.log(query);
//   UsersModel.find(query,{ userId: 1, _id: 0 }, function (error, records) {
//     if (error) {
//       console.log(error);
//       callback({
//         status: REQUEST_CODES.FAIL,
//         message: utils.formatText(REQUEST_CODES.FAIL_MSG, USER_CODES.GET_API)
//       });
//       return;
//     } else {
//       console.log('------', records);
//       // records = records.map(function (record) {
//       //   return new UsersController.UserAPI(record);
//       // });
//       callback({
//         status: REQUEST_CODES.SUCCESS,
//         result: records
//       });
//       return;
//     }
//   });
// }


function getFilteredUsers(dobRange, locations, callback) {

  if (locations.length > 0) {
    UsersModel.aggregate([
      { "$match": dobRange },
      {
        "$lookup": {
          "from": "education",
          "localField": "userId",
          "foreignField": "userId",
          "as": "education"
        }
      },
      {
        $unwind: { "path": "$education", "preserveNullAndEmptyArrays": true }
      },
      {
        "$group": {
          "_id": {
            _id: "$_id",
            "userId": "$userId",
            "toYear": { $max: "$education.toYear" },
            "city": "$education.city"
          }
        }
      },
      { '$match': { '_id.city': { '$in': locations } } },
      {
        "$project": {
          "_id": 0,
          "userId": "$_id.userId"
        }
      }


    ]).exec(function (error, data) {
      if (error) {
        callback({
          status: REQUEST_CODES.FAIL,
          message: error
        });
      } else {
        callback({
          status: REQUEST_CODES.SUCCESS,
          result: data
        });
        return;
      }
    })

    // UsersModel.find(query,{ userId: 1, _id: 0 }, function (error, records) {
    //   if (error) {
    //     callback({
    //       status: REQUEST_CODES.FAIL,
    //       message: utils.formatText(REQUEST_CODES.FAIL_MSG, USER_CODES.GET_API)
    //     });
    //     return;
    //   } else {
    //     // records = records.map(function (record) {
    //     //   return new UsersController.UserAPI(record);
    //     // });
    //     callback({
    //       status: REQUEST_CODES.SUCCESS,
    //       result: records
    //     });
    //     return;
    //   }
    // });
  } else {

    UsersModel.find(dobRange, { userId: 1, _id: 0 }, function (error, records) {
      if (error) {
        callback({
          status: REQUEST_CODES.FAIL,
          message: utils.formatText(REQUEST_CODES.FAIL_MSG, USER_CODES.GET_API)
        });
        return;
      } else {
        // records = records.map(function (record) {
        //   return new UsersController.UserAPI(record);
        // });
        callback({
          status: REQUEST_CODES.SUCCESS,
          result: records
        });
        return;
      }
    });
  }
}

function getListForReskinByStatus(query, callback) {
  let userSearchQuery = query.userQuery;
  UsersModel.find(userSearchQuery, function (error, records) {
    if (error) {
      callback({
        status: REQUEST_CODES.FAIL,
        message: utils.formatText(REQUEST_CODES.FAIL_MSG, USER_CODES.GET_API)
      });
      return;
    } else {
      records = records.map(function (record) {
        return new UsersController.UserAPI(record);
      });
      callback({
        status: REQUEST_CODES.SUCCESS,
        result: records
      });
      return;
    }
  }).skip(query.skip).limit(query.limit);
}

function userExistenceByEmail(query, callback) {
  UsersModel.find(query, function (error, records) {
    if (error) {
      callback({
        status: REQUEST_CODES.FAIL,
        message: utils.formatText(REQUEST_CODES.FAIL_MSG, USER_CODES.GET_API)
      });
      return;
    } else {
      if (records.length > 0) {
        callback({
          status: REQUEST_CODES.SUCCESS,
          message: utils.CONSTANTS.EMAIL.EMAIL_ALREADY_EXIST,
          result: true
        });
        return;
      } else {
        callback({
          status: REQUEST_CODES.SUCCESS,
          result: false
        });
        return;
      }
    }
  });
}

function create(user, callback) {
  var password;
  var salt;
  var userAPI;
  var errorList = [];
  try {
    userAPI = UsersController.UserAPI(user);
    password = utils.passwordGenerator();
    salt = crypto.randomBytes(16).toString('base64');
  } catch (e) {
    errorList.push(e.error[0]);
    callback({
      status: REQUEST_CODES.FAIL,
      message: errorList
    });
    return;
  }
  if (!userAPI.getEmail()) {
    var e = {
      status: VALIDATE.FAIL,
      message: utils.formatText(VALIDATE.REQUIRED, 'Email')
    };
    errorList.push(e);
  }

  if (errorList.length) {
    callback({
      status: REQUEST_CODES.WARNING,
      message: errorList
    });
    return;
  } else {
    var usersModel = new UsersModel(userAPI);
    usersModel.email = usersModel.email.toLowerCase();
    usersModel.isArchived = false;
    if (user.isPasswordChanged) {
      usersModel.isPasswordChanged = user.isPasswordChanged;
    } else {
      usersModel.isPasswordChanged = false;
    }
    mongoUtils.getNextSequence('userId', function (oSeq) {
      usersModel.userId = oSeq;
      usersModel.salt = salt;
      if (usersModel.roleId == USER_CODES.GUEST_ROLE) {
        usersModel.tempPassword = password;
      }
      let role = [];
      role.push({ id: usersModel.roleId });
      usersModel.role = role;

      usersModel.creationTime = utils.getSystemTime();
      usersModel.password = USER_CODES.PASSWORD_PREFIX + utils.encryptText(password + salt);
      usersModel.save(function (error) {
        if (error) {
          callback({
            status: REQUEST_CODES.FAIL,
            message: REQUEST_CODES.FAIL_MSG
          });
          return;
        } else if (usersModel.roleId != USER_CODES.GUEST_ROLE) {
          var template = CONSTANTS.EMAIL.CREATE_USER;
          var sendingEmail = true;
          if (user.template) {
            template = user.template;
          }
          if (user.sendingEmail != undefined) {
            sendingEmail = user.sendingEmail;
          }

          if (usersModel.roleId == USER_CODES.PARENT_ROLE) {
            template = CONSTANTS.EMAIL.CREATE_PARENT_USER;
          }

          if (user.template !== CONSTANTS.EMAIL.CREATE_USER_WITH_INFORM) {
            var emailRequest = {
              template: template,
              to: usersModel.email,
              email: usersModel.email,
              parent: user.parentName,
              student: user.studentName,
              password: password,
              name: user.studentFirstName,
              link: config.server_url + '/autoLogin/' + usersModel.email + '/' + utils.encrypt(password)
            };
            if (sendingEmail) {
              mailer.sendMail(emailRequest, function (res) {
                logger.info('Mail sent status : ', res.status, 'for UserId : ', usersModel.userId);
              });
            }
          }
          var connectionRequest = {
            userId: usersModel.userId,
            partnerId: USER_CODES.BOTID,
            dateTime: utils.getSystemTime(),
            status: utils.CONSTANTS.CONNECTION.ACCEPTED,
            isActive: true
          };
          Connection.create(connectionRequest, function (res) {
            logger.info('Bot connection created : ', res.status);
          });
          callback({
            status: REQUEST_CODES.SUCCESS,
            message: utils.formatText(USER_CODES.CREATE_SUCCESS, usersModel.userId),
            userId: usersModel.userId,
            password: password
          });
          return;
        } else {
          callback({
            status: REQUEST_CODES.SUCCESS,
            message: utils.formatText(USER_CODES.CREATE_SUCCESS, usersModel.userId),
            userId: usersModel.userId,
            password: password
          });
          return;
        }
      });
    });
  }
}

function createPartner(user, callback) {
  var password;
  var salt;
  var userAPI;
  var errorList = [];
  try {
    userAPI = UsersController.UserAPI(user);
    password = utils.passwordGenerator();

    salt = crypto.randomBytes(16).toString('base64');
  } catch (e) {
    errorList.push(e.error[0]);
    callback({
      status: REQUEST_CODES.FAIL,
      message: errorList
    });
    return;
  }
  if (!userAPI.getEmail()) {
    var e = {
      status: VALIDATE.FAIL,
      message: utils.formatText(VALIDATE.REQUIRED, 'Email')
    };
    errorList.push(e);
  }

  if (errorList.length) {
    callback({
      status: REQUEST_CODES.WARNING,
      message: errorList
    });
    return;
  } else {
    getList({
      email: user.email.toLowerCase()
    }, function (res) {
      if (res.result.length > 0 && res.result[0].roleId != 3) {
        callback({
          status: REQUEST_CODES.FAIL,
          message: utils.formatText(USER_CODES.EMAIL_EXIST, user.email)
        });
        return;
      } else {
        var usersModel = new UsersModel(userAPI);

        if (res.result.length > 0 && res.result[0].roleId == 3) {
          usersModel.userId = res.result[0].userId;
          let guestUser = res.result[0];
          guestUser.tempPassword = password;
          guestUser.isArchived = false;
          guestUser.isPasswordChanged = false;
          guestUser.isActive = true;
          guestUser.salt = salt;
          guestUser.creationTime = utils.getSystemTime();
          guestUser.isPartnerMailSent = true;
          guestUser.password = USER_CODES.PASSWORD_PREFIX + utils.encryptText(password + salt);

          UsersModel.update({
            userId: parseInt(guestUser.userId)
          }, {
            $set: guestUser
          }, function (error) {
            if (error) {
              callback({
                status: REQUEST_CODES.FAIL,
                message: REQUEST_CODES.FAIL_MSG
              });
              return;
            } else {
              callback({
                status: REQUEST_CODES.SUCCESS,
                message: utils.formatText(USER_CODES.CREATE_SUCCESS, usersModel.userId),
                userId: usersModel.userId,
                password: password
              });
              return;
            }
          })
        } else {
          mongoUtils.getNextSequence('userId', function (oSeq) {
            usersModel.userId = oSeq;
            usersModel.email = usersModel.email.toLowerCase();
            usersModel.isArchived = false;
            usersModel.isPasswordChanged = false;
            usersModel.salt = salt;
            usersModel.tempPassword = password;
            let role = [];
            role.push({ 'id': USER_CODES.GUEST_ROLE })
            usersModel['role'] = role;
            usersModel.roleId = USER_CODES.GUEST_ROLE;
            usersModel.isPartnerMailSent = true;
            usersModel.creationTime = utils.getSystemTime();
            usersModel.password = USER_CODES.PASSWORD_PREFIX + utils.encryptText(password + salt);

            usersModel.save(function (error) {
              if (error) {
                callback({
                  status: REQUEST_CODES.FAIL,
                  message: REQUEST_CODES.FAIL_MSG
                });
                return;
              } else {
                var connectionRequest = {
                  userId: usersModel.userId,
                  partnerId: USER_CODES.BOTID,
                  userRoleId: USER_CODES.STUDENT_ROLE,
                  partnerRoleId: USER_CODES.STUDENT_ROLE,
                  dateTime: utils.getSystemTime(),
                  status: utils.CONSTANTS.CONNECTION.ACCEPTED,
                  isActive: true
                };
                Connection.create(connectionRequest, function (res) {
                  logger.info('Bot connection created : ', res.status);
                });

                callback({
                  status: REQUEST_CODES.SUCCESS,
                  message: utils.formatText(USER_CODES.CREATE_SUCCESS, usersModel.userId),
                  userId: usersModel.userId,
                  token: usersModel.token,
                  password: password
                });
                return;
              }
            });
          })
        }
      }
    });
  }
}

function createStudentByParent(user, callback) {
  var password;
  var salt;
  var userAPI;
  var errorList = [];
  try {
    userAPI = UsersController.UserAPI(user);
    password = utils.passwordGenerator();

    salt = crypto.randomBytes(16).toString('base64');
  } catch (e) {
    errorList.push(e.error[0]);
    callback({
      status: REQUEST_CODES.FAIL,
      message: errorList
    });
    return;
  }
  if (!userAPI.getEmail()) {
    var e = {
      status: VALIDATE.FAIL,
      message: utils.formatText(VALIDATE.REQUIRED, 'Email')
    };
    errorList.push(e);
  }

  if (errorList.length) {
    callback({
      status: REQUEST_CODES.WARNING,
      message: errorList
    });
    return;
  } else {
    var usersModel = new UsersModel(userAPI);
    usersModel.email = usersModel.email.toLowerCase();
    usersModel.isArchived = false;
    if (user.isPasswordChanged) {
      usersModel.isPasswordChanged = user.isPasswordChanged;
    } else {
      usersModel.isPasswordChanged = false;
    }
    mongoUtils.getNextSequence('userId', function (oSeq) {
      usersModel.userId = oSeq;
      usersModel.salt = salt;
      if (usersModel.roleId == USER_CODES.GUEST_ROLE) {
        usersModel.tempPassword = password;
      }

      usersModel.tempPassword = password;
      usersModel.creationTime = utils.getSystemTime();
      usersModel.password = USER_CODES.PASSWORD_PREFIX + utils.encryptText(password + salt);
      usersModel.save(function (error) {
        if (error) {
          callback({
            status: REQUEST_CODES.FAIL,
            message: REQUEST_CODES.FAIL_MSG
          });
          return;
        } else if (usersModel.roleId != USER_CODES.GUEST_ROLE) {

          var connectionRequest = {
            userId: usersModel.userId,
            partnerId: USER_CODES.BOTID,
            userRoleId: USER_CODES.STUDENT_ROLE,
            partnerRoleId: USER_CODES.STUDENT_ROLE,
            dateTime: utils.getSystemTime(),
            status: utils.CONSTANTS.CONNECTION.ACCEPTED,
            isActive: true
          };
          Connection.create(connectionRequest, function (res) {
            logger.info('Bot connection created : ', res.status);
          });
          callback({
            status: REQUEST_CODES.SUCCESS,
            message: utils.formatText(USER_CODES.CREATE_SUCCESS, usersModel.userId),
            userId: usersModel.userId,
            password: password
          });
          return;
        } else {
          callback({
            status: REQUEST_CODES.SUCCESS,
            message: utils.formatText(USER_CODES.CREATE_SUCCESS, usersModel.userId),
            userId: usersModel.userId,
            password: password
          });
          return;
        }
      });
    });
  }
}

function updateStudentWizard(userId, callback) {
  getList({ userId: userId }, function (res) {
    let userRes = res.result[0];
    if (userRes) {
      userRes['isWizard'] = true;
      updateWizard(userRes, callback);
    } else {
      callback({
        status: REQUEST_CODES.SUCCESS,
        message: USER_CODES.STUDENT_NOT_FOUND
      });
      return;
    }
  }
  )
}

function updateWizard(user, callback) {
  UsersModel.update({
    userId: user.userId
  }, {
    $set: user
  },
    function (error) {
      if (error) {
        callback({
          status: REQUEST_CODES.FAIL,
          message: REQUEST_CODES.FAIL_MSG
        });
        return;
      } else {
        var template = CONSTANTS.EMAIL.ADD_STUDENT;
        var sendingEmail = true;
        if (user.template) {
          template = user.template;
        }
        if (user.sendingEmail != undefined) {
          sendingEmail = user.sendingEmail;
        }
        getList({ userId: parseInt(user.parents[0].userId) }, function (paretRes) {
          let parentRes = paretRes.result[0];
          var emailRequest = {
            template: template,
            to: user.email,
            email: user.email,
            parent: parentRes.firstName + ' ' + (parentRes.lastName ? parentRes.lastName : ''),
            student: user.firstName,
            password: user.tempPassword,
            name: user.firstName,
            link: config.server_url + '/autoLogin/' + user.email + '/' + utils.encrypt(user.tempPassword)
          };
          if (sendingEmail) {
            mailer.sendMail(emailRequest, function (res) {
              logger.info('Mail sent status : ', res.status, 'for UserId : ', user.userId);
            });
          }
        })
        callback({
          status: REQUEST_CODES.SUCCESS,
          message: utils.formatText(USER_CODES.UPDATE_SUCCESS, user.userId)
        });
        return;
      }
    }
  );
}

function remove(query, callback) {
  UsersModel.remove(query, function (error) {
    if (error) {
      callback({
        status: REQUEST_CODES.FAIL,
        message: REQUEST_CODES.FAIL_MSG
      });
      return;
    } else {
      callback({
        status: REQUEST_CODES.SUCCESS,
        message: utils.formatText(USER_CODES.DELETE_SUCCESS, query.userId)
      });
      return;
    }
  });
}

function archiveUser(user, callback) {
  UsersModel.update({
    userId: user.userId
  }, {
    $set: user
  },
    function (error) {
      if (error) {
        callback({
          status: REQUEST_CODES.FAIL,
          message: REQUEST_CODES.FAIL_MSG
        });
        return;
      } else {
        callback({
          status: REQUEST_CODES.SUCCESS,
          message: utils.formatText(USER_CODES.ARCHIVE_SUCCESS, user.userId)
        });
        return;
      }
    }
  );
}

function update(user, callback) {
  UsersModel.update({
    userId: user.userId
  }, {
    $set: user
  },
    function (error) {
      if (error) {
        console.log(error);
        callback({
          status: REQUEST_CODES.FAIL,
          //   message: REQUEST_CODES.FAIL_MSG
          message: error //for testing purpose
        });
        return;
      } else {
        callback({
          status: REQUEST_CODES.SUCCESS,
          message: utils.formatText(USER_CODES.UPDATE_SUCCESS, user.userId)
        });
        return;
      }
    }
  );
}

function updateStatus(user, callback) {
  UsersModel.update({
    userId: user.userId
  }, {
    $set: user
  },
    function (error) {
      if (error) {
        logger.error(error);
        callback({
          status: REQUEST_CODES.FAIL,
          message: REQUEST_CODES.FAIL_MSG
        });
        return;
      } else {
        if (user.isActive) {
          if (user.parentApprovalFlag) {
            // login.getDeviceIds(user.parentId, function (resp) {
            //   var message = {
            //       deviceIds: resp.result,
            //       userId: user.parentId,
            //       name: '',
            //       body: "Your child's spikeview profile is now active. You can use this parent portal to add other children or help manage your child's profile",
            //       textName: '',
            //       textMessage : "Your child's spikeview profile is now active. You can use this parent portal to add other children or help manage your child's profile"
            //   };
            // mobileNotification.sendNotification(message);
            getList({ userId: parseInt(user.userId) }, function (res) {
              if (res.result.length > 0) {
                let user = res.result[0];
                var emailRequest = {
                  template: CONSTANTS.EMAIL.STUDENT_ACTIVATED_BY_PARENT,
                  to: user.email,
                  email: user.email,
                  name: user.firstName,
                };
                mailer.sendMail(emailRequest, function (res) {
                  logger.info('Mail sent status : ', res.status, 'for UserId : ');
                });
              }
            })
            callback({
              status: REQUEST_CODES.SUCCESS,
              message: USER_CODES.CHILD_ACTIVATION_MESSAGE
            });
            return;
          }
          callback({
            status: REQUEST_CODES.SUCCESS,
            message: utils.formatText(USER_CODES.ACTIVATE_USER, user.userId)
          });
          return;
        } else {
          callback({
            status: REQUEST_CODES.SUCCESS,
            message: utils.formatText(USER_CODES.DEACTIVATE_USER, user.userId)
          });
          return;
        }
      }
    }
  );
}

function revokeSharedProfiles(user, callback) {
  SharedProfile.getList({
    profileOwner: user.userId
  }, function (res) {
    _.forEach(res.result, function (share) {
      var newSharedProfile = {
        'sharedId': share.sharedId,
        'isActive': false
      }
      SharedProfile.update(newSharedProfile, function (res) {
        logger.info('Share Profile access revoked for ', share.sharedId);
      })
    });
    callback({
      status: REQUEST_CODES.SUCCESS
    });
    return;
  });
}

function updatePassword(req, callback) {
  var token = req.headers.authorization.split(' ').map(function (val) {
    return val;
  })[1];
  login.getList({
    token: token
  },
    function (res) {
      if (res.status == REQUEST_CODES.SUCCESS) {
        if (res.result != 0) {
          getList({
            userId: res.result[0].userId
          },
            function (res) {
              var user = res.result[0];
              var authObject = {
                user: user,
                password: req.body.oldPassword
              };
              login.validateCredentials(authObject, function (resp) {
                if (resp.status == REQUEST_CODES.SUCCESS) {
                  if (utils.decrypt(req.body.oldPassword) != utils.decrypt(req.body.newPassword)) {
                    user.isPasswordChanged = true;
                    var salt = crypto.randomBytes(16).toString('base64');
                    user.salt = salt;
                    user.password = USER_CODES.PASSWORD_PREFIX + utils.encryptText(utils.decrypt(req.body.newPassword) + salt);
                    update(user, function (resp) {
                      if (resp.status == REQUEST_CODES.SUCCESS) {
                        callback({
                          status: REQUEST_CODES.SUCCESS,
                          message: USER_CODES.CHANGE_PASSWORD_SUCCESS
                        });
                        return;
                      } else {
                        return resp;
                      }
                    });
                  } else {
                    callback({
                      status: REQUEST_CODES.FAIL,
                      message: USER_CODES.OLD_AND_NEW_PASSWORD_SAME
                    });
                    return;
                  }
                } else {
                  callback({
                    status: REQUEST_CODES.FAIL,
                    message: USER_CODES.OLD_PASSWORD_NOT_MATCHED
                  });
                  return;
                }
              });
            }
          );
        }
      } else {
        callback({
          status: REQUEST_CODES.FAIL,
          message: USER_CODES.OLD_PASSWORD_NOT_MATCHED
        });
        return;
      }
    }
  );
}

function resetPassword(user, callback) {
  if (user.email) {
    let email = user.email.toLowerCase();
    getList({
      email: email
    },
      function (res) {
        if (res.result.length > 0) {
          user = res.result[0];
          if (user.roleId != USER_CODES.GUEST_ROLE) {
            var passwordCopy = utils.passwordGenerator();
            var salt = crypto.randomBytes(16).toString('base64');
            var newPassword = USER_CODES.PASSWORD_PREFIX + utils.encryptText(passwordCopy + salt);
            var emailRequest = {
              password: passwordCopy,
              template: CONSTANTS.EMAIL.RESET_PASSWORD,
              to: user.email,
              email: user.email,
              link: config.server_url + '/autoLogin/' + user.email + '/' + utils.encrypt(passwordCopy)
            };
            user.password = newPassword;
            user.salt = salt;
            user.isPasswordChanged = false;
            update(user, function (resp) {
              if (resp.status == REQUEST_CODES.SUCCESS) {
                mailer.sendMail(emailRequest, function (res) {
                  logger.info('Reset Password mail sent : ', res.status, 'to : ', user.email);
                });
                callback({
                  status: REQUEST_CODES.SUCCESS,
                  message: USER_CODES.PASSWORD_RESET_SUCCESS
                });
                return;
              } else {
                callback({
                  status: REQUEST_CODES.FAIL,
                  message: REQUEST_CODES.FAIL_MSG
                });
                return;
              }
            });
          } else {
            callback({
              status: REQUEST_CODES.FAIL,
              message: USER_CODES.RESET_PASSWD_GUEST
            });
            return;
          }
        } else {
          callback({
            status: REQUEST_CODES.FAIL,
            message: USER_CODES.EMAIL_NOT_EXIST
          });
          return;
        }
      }
    );
  } else {
    callback({
      status: REQUEST_CODES.FAIL,
      message: REQUEST_CODES.MISSING_MANDATORY
    });
    return;
  }
}

function testPasswordStrength(password) {
  owasp.config({
    // this should be same as config of 'owasp' if implemented at client side.
    allowPassphrases: true,
    maxLength: 128,
    minLength: 8,
    minPhraseLength: 20,
    minOptionalTestsToPass: 4
  });
  return owasp.test(password);
}

function getStudentsByParent(userId, callback) {
  getList({
    'parents.userId': parseInt(userId),
    isArchived: false
  },
    function (res) {
      if (res.result.length > 0) {
        var students = res.result;
        var parents = [];
        _.forEach(students, function (student) {
          parents = parents.concat(student.parents);
        });
        var parentUserIds = _.uniq(_.pluck(parents, 'userId'));
        var query = {
          userId: {
            $in: parentUserIds
          }
        };
        getList(query, function (res) {
          var parentUsers = res.result;
          _.map(students, function (student) {
            _.map(student.parents, function (usr) {
              _.map(parentUsers, function (dbUser) {
                if (dbUser.userId == usr.userId) {
                  usr.profilePicture = dbUser.profilePicture;
                  usr.firstName = dbUser.firstName;
                  usr.lastName = dbUser.lastName;
                }
              });
            });
          });
          callback({
            status: REQUEST_CODES.SUCCESS,
            message: USER_CODES.STUDENT_FETCHED_SUCCESS,
            result: students
          });
          return;
        });
      } else {
        callback({
          status: REQUEST_CODES.SUCCESS,
          message: USER_CODES.STUDENT_NOT_FOUND
        });
        return;
      }
    }
  );
}


function getStudentsByParentWithStatus(userId, callback) {
  getList({
    'parents.userId': parseInt(userId),
    isArchived: false
  },
    function (res) {
      if (res.result.length > 0) {
        var students = res.result;
        var studentList = [];
        var parents = [];
        _.forEach(students, function (student) {
          parents = parents.concat(student.parents);
          studentList.push(student.userId);
        });
        var parentUserIds = _.uniq(_.pluck(parents, 'userId'));
        var query = {
          userId: {
            $in: parentUserIds
          }
        };
        getList(query, function (res) {
          var parentUsers = res.result;
          Education.getList({ userId: { $in: studentList } }, function (res1) {
            let educationList = [];
            educationList = res1.result;

            Achievement.getList({ userId: { $in: studentList } }, function (res2) {

              //   let achievementList=[];           
              achievementList = res2.result;
              _.map(students, function (student) {
                let activity = [];
                let educationIndex = educationList.findIndex(todo => todo.userId == student.userId);
                if (educationIndex !== -1) {
                  student['isEducation'] = true;
                } else {
                  student['isEducation'] = false;
                }
                let achievementIndex = achievementList.findIndex(todo => todo.userId == student.userId);
                if (achievementIndex != -1) {
                  student['isAchievement'] = true;
                } else {
                  student['isAchievement'] = false;
                }
                if (!student['isWizard']) {
                  student['isWizard'] = false;
                }

                // activity.push({'categoryId': 'likes','title': 'likes','count' : 5,'image':'https://spikeviewmediastorage.blob.core.windows.net/spikeview-media-production/sv_1/logo_new.png'});

                // activity.push({'categoryId': 'comments','title': 'comments','count' : 5,'image':'https://spikeviewmediastorage.blob.core.windows.net/spikeview-media-production/sv_1/logo_new.png'});

                // activity.push({'categoryId': 'posts','title': 'posts','count' : 5,'image':'https://spikeviewmediastorage.blob.core.windows.net/spikeview-media-production/sv_1/logo_new.png'});

                // activity.push({'categoryId': 'connections','title': 'connections','count' : 5,'image':'https://spikeviewmediastorage.blob.core.windows.net/spikeview-media-production/sv_1/logo_new.png'});

                // activity.push({'categoryId': 'groups','title': 'groups','count' : 5,'image':'https://spikeviewmediastorage.blob.core.windows.net/spikeview-media-production/sv_1/logo_new.png'});

                // activity.push({'categoryId': 'chats','title': 'chats','count' : 5,'image':'https://spikeviewmediastorage.blob.core.windows.net/spikeview-media-production/sv_1/logo_new.png'});

                // activity.push({'categoryId': 'partners','title': 'partners','count' : 5,'image':'https://spikeviewmediastorage.blob.core.windows.net/spikeview-media-production/sv_1/logo_new.png'});                     

                // student['activity']= activity;

                _.map(student.parents, function (usr) {
                  _.map(parentUsers, function (dbUser) {
                    if (dbUser.userId == usr.userId) {
                      usr.profilePicture = dbUser.profilePicture;
                      usr.firstName = dbUser.firstName;
                      usr.lastName = dbUser.lastName;
                    }
                  });
                });
              });

              Feed.adminDashboard(studentList, function (resStatus) {
                var feedLike = resStatus.result.feedLike;
                let feedComment = resStatus.result.feedComment;
                let feedPost = resStatus.result.feedPost;
                let newConnenction = resStatus.result.newConnenction;
                let chatMessageCount = resStatus.result.chatMessageCount;
                let groupCount = resStatus.result.groupCount;
                let chatPartners = resStatus.result.chatPartners;

                students = students.map(function (data) {
                  let activity = [];
                  // likes count      
                  let index = feedLike.findIndex(todo => todo.likes.userId == data.userId);
                  if (index !== -1) {
                    activity.push({ 'categoryId': 'Likes', 'title': 'Likes', 'count': feedLike[index].count, 'image': config.spikeview.likeImage });
                  } else {
                    activity.push({ 'categoryId': 'Likes', 'title': 'Likes', 'count': 0, 'image': config.spikeview.likeImage });
                  }

                  // comment count  
                  let commentIndex = feedComment.findIndex(todo => todo.comments.userId == data.userId);
                  if (commentIndex !== -1) {
                    activity.push({ 'categoryId': 'Comments', 'title': 'Comments', 'count': feedComment[commentIndex].count, 'image': config.spikeview.commentImage });
                  } else {
                    activity.push({ 'categoryId': 'Comments', 'title': 'Comments', 'count': 0, 'image': config.spikeview.commentImage });
                  }

                  // post count  
                  let postIndex = feedPost.findIndex(todo => todo.postedBy == data.userId);
                  if (postIndex !== -1) {
                    activity.push({ 'categoryId': 'Posts', 'title': 'Posts', 'count': feedPost[postIndex].count, 'image': config.spikeview.postImage });
                  } else {
                    activity.push({ 'categoryId': 'Posts', 'title': 'Posts', 'count': 0, 'image': config.spikeview.postImage });
                  }

                  // new connection count  
                  let conIndex = newConnenction.findIndex(todo => todo.userId == data.userId);
                  if (conIndex !== -1) {
                    activity.push({ 'categoryId': 'New Connections', 'title': 'New Connections', 'count': newConnenction[conIndex].count, 'image': config.spikeview.connectionImage });
                  } else {
                    activity.push({ 'categoryId': 'New Connections', 'title': 'New Connections', 'count': 0, 'image': config.spikeview.connectionImage });
                  }

                  // chatMessageCount count  
                  let chatMsgIndex = chatMessageCount.findIndex(todo => todo.userId == data.userId && todo.count);
                  if (chatMsgIndex !== -1) {
                    activity.push({ 'categoryId': 'Chats', 'title': 'Chats', 'count': chatMessageCount[chatMsgIndex].count, 'image': config.spikeview.chatImage });
                  } else {
                    activity.push({ 'categoryId': 'Chats', 'title': 'Chats', 'count': 0, 'image': config.spikeview.chatImage });
                  }

                  // chatMessageCount count  
                  let groupIndex = groupCount.findIndex(todo => todo.members.userId == data.userId && todo.count);
                  if (groupIndex !== -1) {
                    activity.push({ 'categoryId': 'Groups', 'title': 'Groups', 'count': groupCount[groupIndex].count, 'image': config.spikeview.groupImage });
                  } else {
                    activity.push({ 'categoryId': 'Groups', 'title': 'Groups', 'count': 0, 'image': config.spikeview.groupImage });
                  }

                  // chatMessageCount count  
                  let chatPartnerIndex = chatPartners.findIndex(todo => todo.userId == data.userId && todo.count);
                  if (chatPartnerIndex !== -1) {
                    activity.push({ 'categoryId': 'Top Chat Partners', 'title': 'Top Chat Partners', 'count': chatPartners[chatPartnerIndex].count, 'image': config.spikeview.chatPartnerImage });
                  } else {
                    activity.push({ 'categoryId': 'Top Chat Partners', 'title': 'Top Chat Partners', 'count': 0, 'image': config.spikeview.chatPartnerImage });
                  }
                  data['activity'] = activity;
                  return data
                })

                //   students['check']= res.result;                 
                //    students.push(res.result);
                callback({
                  status: REQUEST_CODES.SUCCESS,
                  message: USER_CODES.STUDENT_FETCHED_SUCCESS,
                  result: students
                });
                return;
              });
            })
          })
        })
      } else {
        callback({
          status: REQUEST_CODES.SUCCESS,
          message: USER_CODES.STUDENT_NOT_FOUND
        });
        return;
      }
    }
  );
}

function getUserListByEmails(query, callback) {
  getList({
    email: { $in: query }
  }, function (userEmail) {
    callback({
      result: userEmail.result
    });
    return;
  })
}

function assignRoleToGuest(query, callback) {
  let guestUserId = query.userId;
  let roleId = query.roleId;
  if (guestUserId) {
    getList({
      userId: parseInt(guestUserId)
    }, function (res) {
      let guestUser = res.result[0];
      if (guestUser.roleId == USER_CODES.GUEST_ROLE) {
        guestUser.roleId = parseInt(roleId);
        guestUser.isPasswordChanged = false;
        guestUser.isActive = true;
        guestUser.isArchived = false;
        update(guestUser, function (res) {

          // create bot connection
          var botRequest = {
            userId: guestUser.userId,
            partnerId: USER_CODES.BOTID,
            dateTime: utils.getSystemTime(),
            status: 'Accepted',
            isActive: true
          };
          Connection.create(botRequest, function (res) {
            logger.info('bot connection created : ', res.status);
          });
          callback({
            status: REQUEST_CODES.SUCCESS,
            message: utils.formatText(USER_CODES.UPDATE_SUCCESS, guestUser.userId)
          });
          return;
        });
      }
    });
  }
}

function updateRole(query, callback) {
  let userId = parseInt(query.userId);
  let roleId = parseInt(query.roleId);

  getList({ $and: [{ userId: userId }, { "role.id": { $nin: [roleId] } }] }, function (res) {
    if (res.result.length > 0) {
      let user = res.result[0];
      let role = user.role;
      role.push({ id: roleId });
      user.role = role;
      update(user, callback);
    } else {
      callback({
        status: REQUEST_CODES.SUCCESS,
        message: USER_CODES.ALREADY_SELECTED_ROLE
      });
      return;
    }
  })
}

function updateRoleForEachUser(query, callback) {
  getList({}, function (res) {
    if (res.result.length > 0) {
      let user = res.result;
      user.forEach(function (data) {
        let role = [];
        role.push({ id: parseInt(data.roleId) });
        data['role'] = role;
        update(data, callback);
      })
    } else {
      callback({
        status: REQUEST_CODES.SUCCESS,
        message: USER_CODES.ALREADY_SELECTED_ROLE
      });
      return;
    }
  })
}


module.exports.getList = getList;
module.exports.create = create;
module.exports.update = update;
module.exports.remove = remove;
module.exports.getStudentsByParent = getStudentsByParent;
module.exports.getUserListByEmails = getUserListByEmails;
module.exports.getListForReskinByStatus = getListForReskinByStatus;
module.exports.createStudentByParent = createStudentByParent;
module.exports.getFilteredUsers = getFilteredUsers;
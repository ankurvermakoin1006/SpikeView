var nodemailer = require('nodemailer');
var utils = require('../../commons/utils').utils;
var config = require('../../env/config.js').getConf();
var fs = require('fs');
var CONSTANTS = utils.CONSTANTS;
var REQUEST_CODES = CONSTANTS.REQUEST_CODES;
var logger = require('../../logger.js');
var transporter = nodemailer.createTransport({
    host: config.apps.email.smtp_host,
    secureConnection: config.apps.email.smtp_secureConnection,
    port: config.apps.email.smtp_port,
    auth: {
        user: config.apps.email.smtp_user,
        pass: config.apps.email.smtp_pass
    },
    logger: config.apps.email.smtp_logger,
    debug: config.apps.email.smtp_debug,
});

transporter.verify(function (error, success) {
    if (error) {
        logger.info(error);
    } else {
        logger.info('Email server config verified!!.');
    }
});

function sendMails(data, callback) {
    transporter.sendMail(data, function (err, info) {
        if (err) {
            return callback({
                status: REQUEST_CODES.FAIL,
                error: CONSTANTS.EMAIL.EMAIL_FAILED
            });
        } else {
            return callback({
                status: REQUEST_CODES.SUCCESS,
                message: CONSTANTS.EMAIL.EMAIL_SUCCESS
            });
        }
    });
}

function sendMail(emailRequest, callback) {
    var mailMessage;
    var emailTemplate;
    var subject = 'spikeview Alert!!';

    if (emailRequest.template == CONSTANTS.EMAIL.CREATE_USER) {
        subject = 'spikeview Account Credentials';
        emailTemplate = './services/email/loginDetails.html';
    }else if (emailRequest.template == CONSTANTS.EMAIL.CREATE_PARENT_USER) {
        subject = 'spikeview Account Credentials';
        emailTemplate = './services/email/parentLoginDetails.html';
    } else if (emailRequest.template == CONSTANTS.EMAIL.CREATE_USER_WITH_INFORM) {
        subject = 'spikeview Student Profile Approval';
        emailTemplate = './services/email/parentApproval.html';
    } else if (emailRequest.template == CONSTANTS.EMAIL.RESET_PASSWORD) {
        subject = 'spikeview Reset Password';
        emailTemplate = './services/email/resetPassword.html';
    } else if (emailRequest.template == CONSTANTS.EMAIL.INFORM_STUDENT) {
        subject = 'spikeview Parent Request';
        emailTemplate = './services/email/informStudent.html';
    } else if (emailRequest.template == CONSTANTS.EMAIL.INFORM_PARENT) {
        subject = 'spikeview Student Request';
        emailTemplate = './services/email/informParent.html';
    } else if (emailRequest.template == CONSTANTS.EMAIL.RECOMMENDATION_REQUEST) {
        subject = 'spikeview Recommendation Request';
        emailTemplate = './services/email/recommendationRequest.html';
    } else if (emailRequest.template == CONSTANTS.EMAIL.SHARE_PROFILE) {
        subject = 'spikeview Profile Shared With You';
        emailTemplate = './services/email/sharedProfile.html';
    } else if (emailRequest.template == CONSTANTS.EMAIL.GROUP_JOINING_REQUEST) {
        subject = 'spikeview Join Group Request';
        emailTemplate = './services/email/joinGroup.html';
    } else if (emailRequest.template == CONSTANTS.EMAIL.ADD_STUDENT) {
        subject = 'Welcome to spikeview, your parent added you in spikeview.';
        emailTemplate = './services/email/addStudent.html';
    } else if (emailRequest.template == CONSTANTS.EMAIL.ADD_PARENT_BY_STUDENT) {
        subject = 'Welcome to spikeview, your child added you as parent in spikeview.';
        emailTemplate = './services/email/addParentByStudent.html';
    } else if (emailRequest.template == CONSTANTS.EMAIL.ADD_PARENT_BY_PARENT) {
        subject = 'Welcome to spikeview, you have been added as parent.';
        emailTemplate = './services/email/addParentByParent.html';
    } else if (emailRequest.template == CONSTANTS.EMAIL.REMINDER_EMAIL_ALERTS) {
        subject = 'spikeview Reminder Alerts';
        emailTemplate = './services/email/reminderEmailAlerts.html';
    } else if (emailRequest.template == CONSTANTS.EMAIL.GUEST_TO_STUDENT_ACCOUNT_CONVERSION) {
        subject = 'spikeview Account Credentials';
        emailTemplate = './services/email/guestUserCredentials.html';
    } else if (emailRequest.template == CONSTANTS.EMAIL.THANK_YOU_EMAIL) {
        subject = 'Thank you from spikeview';
        emailTemplate = './services/email/thankyou.html';
    }else if (emailRequest.template == CONSTANTS.EMAIL.ADMIN_REPORT_MAIL) {
        subject = 'Report Detail';
        emailTemplate = './services/email/reportDetail.html';
    }else if (emailRequest.template == CONSTANTS.EMAIL.STUDENT_ACTIVATED_BY_PARENT) {
        subject = 'Student Activate';
        emailTemplate = './services/email/studentActivatedByParent.html';
    }else if (emailRequest.template == CONSTANTS.EMAIL.FOLLOW_UP_PARENT) {
        subject = 'Follow Up Parent';
        emailTemplate = './services/email/followUpParent.html';
    }else if (emailRequest.template == CONSTANTS.EMAIL.STUDENT_ACTIVE_LOGIN) {
        subject = 'spikeview Account Credentials';
        emailTemplate = './services/email/studentActiveLogin.html';
    }

    if (emailTemplate) {
        readFile(emailTemplate, function (resp) {
            if (resp.status == REQUEST_CODES.SUCCESS) {
                mailMessage = resp.result.replace(/{Email}/g, emailRequest.email);
                mailMessage = mailMessage.replace(/{Password}/g, emailRequest.password ? emailRequest.password : 'NA');
                mailMessage = mailMessage.replace(/{Logo}/g, config.spikeview.logo_url);
                mailMessage = mailMessage.replace(/{Banner}/g, config.spikeview.banner);
                mailMessage = mailMessage.replace(/{Facebook}/g, config.spikeview.facebook);
                mailMessage = mailMessage.replace(/{Gmail}/g, config.spikeview.gmail);
                mailMessage = mailMessage.replace(/{Twitter}/g, config.spikeview.twitter);
                mailMessage = mailMessage.replace(/{ViewRequest}/g, config.spikeview.view_request);
                mailMessage = mailMessage.replace(/{ActivateNow}/g, config.spikeview.activate_now);
                mailMessage = mailMessage.replace(/{GoToSpikeview}/g, config.spikeview.goto_spikeview);
                mailMessage = mailMessage.replace(/{ViewProfile}/g, config.spikeview.view_profile);
                mailMessage = mailMessage.replace(/{JoinGroup}/g, config.spikeview.join_group);
                mailMessage = mailMessage.replace(/{JoinMessage}/g, emailRequest.joinMsg);
                
                mailMessage = mailMessage.replace(/{Name}/g, emailRequest.name);
                mailMessage = mailMessage.replace(/{GroupName}/g, emailRequest.groupName);

                mailMessage = mailMessage.replace(/{student}/g, emailRequest.student);
                mailMessage = mailMessage.replace(/{parent}/g, emailRequest.parent);
                mailMessage = mailMessage.replace(/{Link}/g, emailRequest.link);
                mailMessage = mailMessage.replace(/{ReasonType}/g, emailRequest.reasonType);                
                
                if (emailRequest.profilePicture) {
                    emailRequest.profilePicture = config.apps.azure.base_url + config.apps.azure.container + '/' + emailRequest.profilePicture;
                } else {
                    emailRequest.profilePicture = config.spikeview.child_profile;
                }
                mailMessage = mailMessage.replace(/{ProfilePicture}/g, emailRequest.profilePicture);
                mailMessage = mailMessage.replace(/{mailMessage}/g, emailRequest.mailMessage);
                var data = {
                    from: config.apps.email.from_whom,
                    to: emailRequest.to,
                    subject: subject,
                    html: mailMessage
                }
                sendMails(data, callback);
            } else {
                logger.info(resp);
            }
        });
    } else {
        var data = {
            from: config.apps.email.from_whom,
            to: emailRequest.to,
            subject: subject,
            text: mailMessage
        }
        sendMails(data, callback);
    }
}

function readFile(file, callback) {
    fs.readFile(file, 'utf8', function (err, data) {
        if (err) {
            return callback({
                status: REQUEST_CODES.FAIL,
                err: err
            })
        } else {
            return callback({
                status: REQUEST_CODES.SUCCESS,
                result: data
            })
        }
    });
}

module.exports.sendMails = sendMails;
module.exports.sendMail = sendMail;
module.exports = function (app) {
    app.post('/app/company', function (req, res) {
        try {
            create(req.body, function (response) {
                res.json(response);
            });
        } catch (error) {
            res.json(error)
        }
    });
    app.get('/ui/company', function (req, res) {
        try {
            getList(req.query, function (response) {
                res.json(response);
            });
        }
        catch (e) {
            res.json(e);
        }
    });

    app.put('/ui/company', function (req, res) {
        try {
            update(req.body, function (response) {
                res.json(response);
            });
        } catch (e) {
            res.json(e);
        }
    });

    app.put('/ui/company/compuserAndcompanyProfile', function (req, res) {
        try {
            userAndcompanyProfile(req.body, function (response) {
                res.json(response);
            });
        } catch (e) {
            res.json(e);
        }
    });

    app.delete('/ui/company', function (req, res) {
        try {
            remove(req.body, function (response) {
                res.json(response);
            });
        } catch (e) {
            res.json(e);
        }
    });

}

var mongoose = require('mongoose'), Schema = mongoose.Schema;
var CompanySchema = new Schema(require('./companySchema').companySchema, { collection: 'company' });
var CompanyModel = mongoose.model('company', CompanySchema);
var CompanyController = require('./companyController');
var User = require('../users/users');
var utils = require('../../commons/utils').utils;
var mongoUtils = utils.mongoUtils;
var CONSTANTS = utils.CONSTANTS;
var mailer = require('../email/mailer');
var REQUEST_CODES = CONSTANTS.REQUEST_CODES;
var _ = require('underscore');
var COMPANY_CODES = utils.CONSTANTS.COMPANY;
var config = require('../../env/config.js').getConf();

function create(company, callback) {
    var companyAPI;
    var errorList = [];
    try {
        companyAPI = CompanyController.CompanyAPI(company);
    }
    catch (e) {
        errorList.push(e.error[0]);
        callback({
            status: REQUEST_CODES.FAIL,
            error: errorList
        });
        return;
    }
    var companyModel = new CompanyModel(companyAPI);
    mongoUtils.getNextSequence('companyId', function (oSeq) {
        companyModel.companyId = oSeq;
        companyModel.save(function (error) {
            if (error) {
                callback({
                    status: REQUEST_CODES.FAIL,
                    error: error
                });
                return;
            }
            else {
                let query = {
                    $and: [{ userId: parseInt(company.userId) },
                    { isPartnerMailSent: true }
                    ]
                }
                User.getList(query, function (res) {
                    if (res.result.length > 0) {
                        let user = res.result[0];
                        user['isPartnerMailSent'] = false;
                        let role = [];
                        role.push({ 'id': parseInt(company.roleId) });
                        user['roleId'] = parseInt(company.roleId);
                        user['role'] = role;
                        User.update(user, callback);

                        var emailRequest = {
                            template: CONSTANTS.EMAIL.CREATE_USER,
                            to: user.email,
                            email: user.email,
                            password: user.tempPassword,
                            name: user.firstName,
                            link: config.server_url + '/autoLogin/' + user.email + '/' + utils.encrypt(user.tempPassword)
                        };
                        mailer.sendMail(emailRequest, function (res) {
                            logger.info('Mail sent status : ', res.status, 'for UserId : ', user.userId);
                        });
                    }
                })


                callback({
                    status: REQUEST_CODES.SUCCESS,
                    message: utils.formatText(COMPANY_CODES.CREATE_SUCCESS, companyModel.companyId),
                    result: companyModel.companyId
                });
                return;
            }
        });
    });
}

function getList(query, callback) {
    // CompanyModel.find(query, function (error, records) {
    //     if (error) {
    //         callback({
    //             status: DB_CODES.FAIL,
    //             error: error
    //         });
    //         return;
    //     }
    //     else {
    //         records = records.map(function (records) {
    //             return new CompanyController.CompanyAPI(records);
    //         });
    //         callback({
    //             status: REQUEST_CODES.SUCCESS,
    //             result: records
    //         });
    //         return;
    //     }
    // });

    CompanyModel.aggregate([
        { "$match": { "userId": parseInt(query.userId) } },
        {
            "$lookup": {
                "from": "users",
                "localField": "userId",
                "foreignField": "userId",
                "as": "user"
            }
        },
        {
            $unwind: { "path": "$user" }
        }
    ]).exec(function (error, data) {
        if (error) {
            callback({
                status: REQUEST_CODES.FAIL,
                message: error
            });
        } else {
            data[0]['firstName'] = data[0].user.firstName
            data[0]['lastName'] = data[0].user.lastName
            data[0]['email'] = data[0].user.email
            data[0]['mobileNo'] = data[0].user.mobileNo
            data[0]['dob'] = data[0].user.dob

            delete data[0].user;
            callback({
                status: REQUEST_CODES.SUCCESS,
                result: data
            });
            return;
        }
    })
}

function update(company, callback) {
    CompanyModel.update({ 'companyId': company.companyId }, { $set: company }, function (error) {
        if (error) {
            callback({
                status: DB_CODES.FAIL,
                message: error
            });
            return;
        } else {
            callback({
                status: REQUEST_CODES.SUCCESS,
                message: utils.formatText(COMPANY_CODES.UPDATE_SUCCESS, company.companyId)
            });
        }
        return;
    });
}

function userAndcompanyProfile(company, callback) {
    User.getList({ userId: parseInt(company.userId) }, function (res) {
        let userData = res.result[0];
        userData['firstName'] = company.firstName;
        userData['lastName'] = company.lastName;
        userData['mobileNo'] = company.mobileNo;
        User.update(userData, function (updateRes) {


            CompanyModel.update({ 'companyId': company.companyId }, { $set: company }, function (error) {
                if (error) {
                    callback({
                        status: DB_CODES.FAIL,
                        message: error
                    });
                    return;
                } else {
                    let data = {};

                    data['firstName'] = userData['firstName'];
                    data['lastName'] = userData['lastName'];
                    data['email'] = userData['email'];
                    data['dob'] = userData['dob'];
                    data['mobileNo'] = userData['mobileNo'];
                    callback({
                        status: REQUEST_CODES.SUCCESS,
                        message: COMPANY_CODES.DATA_RETRIEVE,
                        result: data
                    });
                    return;
                }

            });
        });
    })
}

function remove(query, callback) {
    CompanyModel.remove(query, function (error) {
        if (error) {
            callback({
                status: REQUEST_CODES.FAIL,
                error: error
            });
            return;
        } else {
            callback({
                status: REQUEST_CODES.SUCCESS,
                message: COMPANY_CODES.DELETE_SUCCESS
            });
            return;
        }
    });
}

module.exports.create = create;
module.exports.getList = getList;
module.exports.update = update;
module.exports.remove = remove;
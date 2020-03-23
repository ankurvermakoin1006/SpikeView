module.exports = function (app) {    
	app.post('/ui/interest', function (req, res) { //To create Organization
        try {
            create(req.body, function (response) {
               res.json(response);
            });
        } catch (e) {
            res.json(e);
        }
    });
    app.get('/ui/interest', function (req, res) {//To get Organization
		try {
			getList(req.query, function (response) {
				res.json(response);
			});
		} catch (e) {
			res.json(e);
		}
	});
 	app.put('/ui/interest', function (req, res) {//To Update Organization
		try {
			update(req.body, function (response) {
				res.json(response);
			});
		} catch (e) {
			res.json(e);
		}
	});
	app.delete('/ui/interest', function (req, res) {//To remove Organization
		try {
			remove(req.body, function (response) {
				res.json(response);
			});
		} catch (e) {
			res.json(e);
		}
    });
}

var mongoose = require('mongoose'),	Schema = mongoose.Schema;
var UserInterestSchema = new Schema(require('./userInterestSchema').userInterestSchema, { collection: 'userInterest' });
var UserInterestModel = mongoose.model('userInterest', UserInterestSchema);
var UserInterestController = require('./userInterestController');
var utils = require('../../commons/utils').utils;
var mongoUtils = utils.mongoUtils;
var CONSTANTS = utils.CONSTANTS;
var DB_CODES = CONSTANTS.DATABASE_CODES;
var REQUEST_CODES = CONSTANTS.REQUEST_CODES;
var ORGANIZATION_CODES = utils.CONSTANTS.ORGANIZATIONS;

function getList(query, callback) {
    UserInterestModel.find(query, function (error, records) {
        if (error) {
            callback({
                status: DB_CODES.FAIL,
                message: error
            });
            return;
        } else {
            records = records.map(function (record) {
                return new UserInterestController.UserInterestAPI(record);
            });
            callback({
                status: REQUEST_CODES.SUCCESS,
                result: records
            });
            return;
        }
    });
}

function create(userInterest, callback) {   
    var userInterestAPI;
    var errorList = [];
    try{
        userInterestAPI = UserInterestController.UserInterestAPI(userInterest);    
    }catch(e) {
        errorList.push(e.error[0]);
        callback({
            status: REQUEST_CODES.FAIL,
            message: errorList
        });
        return;
    }   
    if (errorList.length) {
        callback({
            status: REQUEST_CODES.FAIL,
            message: errorList
        });
        return;
    } else {      
        var userInterestModel = new UserInterestModel(userInterestAPI);
        mongoUtils.getNextSequence('userInterestId', function (oSeq) {
            userInterestModel.userInterestId = oSeq;      
            userInterestModel.save(function (error) {
                if (error) {
                    callback({
                        status: REQUEST_CODES.FAIL,
                        message: error
                    });
                    return;
                } else {              
                    callback({
                        status: REQUEST_CODES.SUCCESS,
                        message: utils.formatText(ORGANIZATION_CODES.CREATE_SUCCESS, userInterestModel.userInterestId),
                        result: {userInterestId:userInterestModel.userInterestId}
                    });
                    return;
                }
            });
        });
    }
}

function remove(query, callback) {
    UserInterestModel.remove(query, function (error) {
        if (error) {
            callback({
                status: DB_CODES.FAIL,
                error: error
            });
            return;
        } else {
            callback({
                status: REQUEST_CODES.SUCCESS,
                message: utils.formatText(ORGANIZATION_CODES.DELETE_SUCCESS, query.userId)               
            });
            return;
        }
    });
}

function update(userInterest, callback) {
    UserInterestModel.update({ 'organizationTypeId': userInterest.userInterestId }, { $set: userInterest }, function (error) {
        if (error) {
            callback({
                status: DB_CODES.FAIL,
                message: error
            });
            return;
        } else {
            callback({
                status: REQUEST_CODES.SUCCESS,
                message: utils.formatText(ORGANIZATION_CODES.UPDATE_SUCCESS, userInterest.userInterestId),
                result: {userInterestId:userInterestModel.userInterestId}
            });
            return;
        }
    });
}

module.exports.getList = getList;
module.exports.create = create;
module.exports.update = update;
module.exports.remove = remove;
module.exports = function (app) {    
	app.post('/ui/organization', function (req, res) { //To create Organization
        try {
            create(req.body, function (response) {
               res.json(response);
            });
        } catch (e) {
            res.json(e);
        }
    });
    app.get('/ui/organization', function (req, res) {//To get Organization
		try {
			getList(req.query, function (response) {
				res.json(response);
			});
		} catch (e) {
			res.json(e);
		}
	});
 	app.put('/ui/organization', function (req, res) {//To Update Organization
		try {
			update(req.body, function (response) {
				res.json(response);
			});
		} catch (e) {
			res.json(e);
		}
	});
	app.delete('/ui/organization', function (req, res) {//To remove Organization
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
var OrganizationsSchema = new Schema(require('./organizationsSchema').organizationsSchema, { collection: 'organizations' });
var OrganizationsModel = mongoose.model('organizations', OrganizationsSchema);
var OrganizationsController = require('./organizationsController');
var utils = require('../../commons/utils').utils;
var mongoUtils = utils.mongoUtils;
var CONSTANTS = utils.CONSTANTS;
var DB_CODES = CONSTANTS.DATABASE_CODES;
var REQUEST_CODES = CONSTANTS.REQUEST_CODES;
var ORGANIZATION_CODES = utils.CONSTANTS.ORGANIZATIONS;

function getList(query, callback) {
    OrganizationsModel.find(query, function (error, records) {
        if (error) {
            callback({
                status: DB_CODES.FAIL,
                message: error
            });
            return;
        } else {
            records = records.map(function (record) {
                return new OrganizationsController.OrganizationsAPI(record);
            });
            callback({
                status: REQUEST_CODES.SUCCESS,
                result: records
            });
            return;
        }
    });
}

function create(organization, callback) {   
    var organizationAPI;
    var errorList = [];
    try{
        organizationAPI = OrganizationsController.OrganizationsAPI(organization);    
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
       var organizationsModel = new OrganizationsModel(organizationAPI);
        mongoUtils.getNextSequence('organizationId', function (oSeq) {
            organizationsModel.organizationId = oSeq;      
            organizationsModel.save(function (error) {
                if (error) {
                    callback({
                        status: REQUEST_CODES.FAIL,
                        message: error
                    });
                    return;
                } else {              
                    callback({
                        status: REQUEST_CODES.SUCCESS,
                        message: utils.formatText(ORGANIZATION_CODES.CREATE_SUCCESS, organizationsModel.organizationId),
                        result: {organizationId:organizationsModel.organizationId}
                    });
                    return;
                }
            });
        });
    }
}

function remove(query, callback) {
    OrganizationsModel.remove(query, function (error) {
        if (error) {
            callback({
                status: DB_CODES.FAIL,
                error: error
            });
            return;
        } else {
            callback({
                status: REQUEST_CODES.SUCCESS,
                message: utils.formatText(ORGANIZATION_CODES.DELETE_SUCCESS, query.organizationId),
                result: {organizationId:organizationsModel.organizationId}
            });
            return;
        }
    });
}

function update(organization, callback) {
    OrganizationsModel.update({ 'organizationTypeId': organization.organizationTypeId }, { $set: organization }, function (error) {
        if (error) {
            callback({
                status: DB_CODES.FAIL,
                message: error
            });
            return;
        } else {
            callback({
                status: REQUEST_CODES.SUCCESS,
                message: utils.formatText(ORGANIZATION_CODES.UPDATE_SUCCESS, organization.organizationId),
                result: {organizationId:organizationsModel.organizationId}
            });
            return;
        }
    });
}

module.exports.getList = getList;
module.exports.create = create;
module.exports.update = update;
module.exports.remove = remove;
module.exports = function (app) {    
    app.get('/ui/header', function (req, res) {    //To get Headers
		try {
			getHeader(req.query, function (response) {
				res.json(response);
			});
		} catch (e) {
			res.json(e);
		}
	});
	app.post('/ui/header', function (req, res) {   //To create Header
        try {
            create(req.body, function (response) {
               res.json(response);
            });
        } catch (e) {
            res.json(e);
        }
    });    
 	app.put('/ui/header', function (req, res) {    //To Update Header
		try {
			update(req.body, function (response) {
				res.json(response);
			});
		} catch (e) {
        	res.json(e);
		}
	});	
}

var mongoose = require('mongoose'),	Schema = mongoose.Schema;
var HeaderSchema = new Schema(require('./headerSchema').headerSchema, { collection: 'header' });
var HeaderModel = mongoose.model('header', HeaderSchema);
var HeaderController = require('./headerController');
var utils = require('../../commons/utils').utils;
var mongoUtils = utils.mongoUtils;
var CONSTANTS = utils.CONSTANTS;
var DB_CODES = CONSTANTS.DATABASE_CODES;
var REQUEST_CODES = CONSTANTS.REQUEST_CODES;
var HEADER_CODES = utils.CONSTANTS.HEADER;

function getHeader(query, callback) { 
   let userId= parseInt(query.userId);
   let roleId= query.roleId ?  parseInt(query.roleId) :  null;   
  
    HeaderModel.find({$and:[{userId:userId}, 
                 {$or:[
                    {roleId: roleId},
                    {roleId : { $exists: false }}
            ]}]}, function (error, records) {
        if (error) {            
            callback({
                status: DB_CODES.FAIL,
                message: error
            });
            return;
        } else {
            if (records.length === 0) {
                create(query,function(res){
                    getHeader(query, callback);                 
                });
            } else {
                records = records.map(function (record) {
                    return new HeaderController.HeaderAPI(record);
                });
                callback({
                    status: REQUEST_CODES.SUCCESS,
                    result: records
                });
                return;
            }
        }
    });
}
function create(header, callback) {    
    header['connectionCount'] = header.connectionCount ? 1 : 0;                                     
    header['messagingCount'] = header.messagingCount ? 1 : 0;       
    header['notificationCount'] = header.notificationCount ? 1 : 0;    
    header['groupCount'] = header.groupCount ? 1 : 0;         
    var headerAPI;
    var errorList = [];
    try {
        headerAPI = HeaderController.HeaderAPI(header);
    }
    catch (e) {
        errorList.push(e.error[0]);
        callback({
            status: REQUEST_CODES.FAIL,
            error: errorList
        });
        return;
    }    
    var headerModel = new HeaderModel(headerAPI);
    mongoUtils.getNextSequence('headerId', function (oSeq) {
        headerModel.headerId = oSeq;        
        headerModel.save(function (error) {
            if (error) {
                callback({
                    status: REQUEST_CODES.FAIL,
                    error: error
                });
                return;
            }
            else {
                callback({
                    status: REQUEST_CODES.SUCCESS,
                    message: utils.formatText(HEADER_CODES.CREATE_SUCCESS, headerModel.headerId),
                    result: headerModel.headerId
                });
                return;
            }
        });
    });
}
function update(headerToUpdate, callback) {   
    getHeader({$and:[{userId:parseInt(headerToUpdate.userId)}, {$or:[
                        {roleId: parseInt(headerToUpdate.roleId)},
                        {roleId : {  $exists: false }}
                ]}]}, function(res) {
        if(res.result.length > 0){
            header = res.result[0];            
            header.connectionCount = headerToUpdate.connectionCount===1 ?
                                     res.result[0].connectionCount+1:                                      
                                     headerToUpdate.connectionCount==="0"?
                                      0 : res.result[0].connectionCount;

            header.messagingCount = headerToUpdate.messagingCount===1?
                                    res.result[0].messagingCount+1:                                      
                                    headerToUpdate.messagingCount==="0"?
                                    0 : res.result[0].messagingCount;

            header.notificationCount = headerToUpdate.notificationCount===1?
                                    res.result[0].notificationCount+1:                                      
                                    headerToUpdate.notificationCount==="0"?
                                    0 : res.result[0].notificationCount;        

            header.groupCount = headerToUpdate.groupCount===1?
                                    res.result[0].groupCount+1:                                      
                                    headerToUpdate.groupCount==="0"?
                                    0 : res.result[0].groupCount;                          
            HeaderModel.update({'headerId': header.headerId}, {$set: header}, function(error){
                if (error) {
                    callback({
                        status: REQUEST_CODES.FAIL,
                        error: error
                    });
                    return;
                } else {
                    callback({
                        status: REQUEST_CODES.SUCCESS,
                        result: utils.formatText(HEADER_CODES.UPDATE_SUCCESS, header.headerId)
                    });
                    return;
                }
            });
        }else{           
            create(headerToUpdate,callback);
        }
    });
}

module.exports.getHeader = getHeader;
module.exports.create = create;
module.exports.update = update;

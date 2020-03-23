module.exports = function (app) {
    app.post('/ui/competencyType', function (req, res) {
        try {
            create(req.body, function (response) {
                res.json(response);
            });
        }
        catch (e) {
            res.json(e);
        }
    });
    app.get('/ui/competencyType', function (req, res) {
        try {
            getList(req.query, function (response) {
                res.json(response);
            });
        }
        catch (e) {
            res.json(e);
        }
    });
    app.put('/ui/competencyType', function (req, res) {
        try {
            update(req.body, function (response) {
                res.json(response);
            });
        }
        catch (e) {
            res.json(e);
        }
    });
    app.delete('/ui/competencyType', function (req, res) {
        try {
            remove(req.body, function (response) {
                res.json(response);
            });
        } catch (e) {
            res.json(e);
        }
    });
    app.get('/ui/competencyAllLevel', function (req, res) {
        try {
            getCompetencyAllLevel(req, function (response) {
                res.json(response);
            });
        }
        catch (e) {
            res.json(e);
        }
    });
}
var mongoose = require('mongoose'), Schema = mongoose.Schema;
var CompetencyTypeSchema = new Schema(require('./competencyTypeSchema').competencyTypeSchema, { collection: 'competencyType' });
var CompetencyTypeModel = mongoose.model('competencyType', CompetencyTypeSchema);
var CompetencyTypeController = require('./competencyTypeController');
var utils = require('../../../commons/utils').utils;
var mongoUtils = utils.mongoUtils;
var CONSTANTS = utils.CONSTANTS;
var DB_CODES = CONSTANTS.DATABASE_CODES;
var REQUEST_CODES = CONSTANTS.REQUEST_CODES;
var COMPETENCY_CODES = utils.CONSTANTS.COMPETENCY;
var CompetencyLeve1Array=[{level1:'Academic'},
                        {level1:'Vocational'},
                        {level1:'Arts'},
                        {level1:'Sports'},                 
                        {level1:'Life Experiences'}];   
function create(competencyType, callback) {
    var competencyTypeAPI;
    var errorList = [];
    try {
        competencyTypeAPI = CompetencyTypeController.CompetencyTypeAPI(competencyType);
    }
    catch (e) {
        errorList.push(e.error[0]);
        callback({
            status: REQUEST_CODES.FAIL,
            error: errorList
        });
        return;
    }
    var competencyTypeModel = new CompetencyTypeModel(competencyTypeAPI);
    mongoUtils.getNextSequence('competencyTypeId', function (oSeq) {
        competencyTypeModel.competencyTypeId = oSeq;
        competencyTypeModel.save(function (error) {
            if (error) {
                callback({
                    status: DB_CODES.FAIL,
                    error: error
                });
                return;
            }
            else {
                callback({
                    status: REQUEST_CODES.SUCCESS,
                    result: utils.formatText(COMPETENCY_CODES.CREATE_SUCCESS, competencyTypeModel.competencyTypeId),
                    competencyTypeId: competencyTypeModel.competencyTypeId
                });
                return;
            }
        });
    });
}

function getList(query, callback) {    
    CompetencyTypeModel.find(query, function (error, records) {
        if (error) {
            callback({
                status: DB_CODES.FAIL,
                error: error
            });
            return;
        }
        else {
            records = records.map(function (records) {
                return new CompetencyTypeController.CompetencyTypeAPI(records);
            });
            callback({
                status: REQUEST_CODES.SUCCESS,
                result: records
            });
            return;
        }
    });
}

function update(competencyType, callback) {
    CompetencyTypeModel.update({ 'competencyTypeId': competencyType.competencyTypeId }, { $set: competencyType }, function (error) {
        if (error) {
            callback({
                status: DB_CODES.FAIL,
                error: error
            });
            return;
        } else {
            callback({
                status: REQUEST_CODES.SUCCESS,
                result: utils.formatText(COMPETENCY_CODES.UPDATE_SUCCESS, competencyType.competencyTypeId)
            });
            return;
        }
    });
}

function remove(competencyType, callback) {
    CompetencyTypeModel.remove(competencyType, function (error) {        
        if (error) {            
            callback({
                status: DB_CODES.FAIL,
                error: error
            });
            return;
        }
        else {
            callback({
                status: REQUEST_CODES.SUCCESS,
                result: utils.formatText(COMPETENCY_CODES.DELETE_SUCCESS, competencyType.competencyTypeId)
            });
        }
    });
}

function getCompetencyAllLevel(query, callback) {    
    CompetencyTypeModel.aggregate([       
        {
            $group: { 
                _id: { 
                    competencyTypeId: "$competencyTypeId",
                    level1: "$level1",
                    level2: "$level2", 
                    level3: "$level3" 
                }
            }
        },  
        {   
            $sort:  { "_id.level2": 1  }
        },        
        {
            $group: { 
                _id: "$_id.level1",
                level2: {$push: { name: "$_id.level2", competencyTypeId: "$_id.competencyTypeId", level3: "$_id.level3" }} 
            }
        },       
        {
            $project: {_id: 0, level1: "$_id", level2: "$level2" }
        }, 
          
   ]).exec(function (error, data) {
        if (error) {
            callback({
                status: DB_CODES.FAIL,
                error: error
            });
        } else {         
            let competencyTypeData= [];
            CompetencyLeve1Array.forEach(function(competencyTypeLevel){
             let index=   data.findIndex(todo => todo.level1 == competencyTypeLevel.level1);             
               
                let level2Index=data[index] && data[index].level2 && data[index].level2.findIndex(level2Data => level2Data.name === "Other");
                if(level2Index!==-1){
                    data[index].level2.push(data[index].level2[level2Index]);
                    data[index].level2.splice(level2Index,1);
                }                     

                if(index !==-1){
                    competencyTypeData.push(data[index]);
                }
            });     
            callback({
                status: REQUEST_CODES.SUCCESS,
                result: competencyTypeData
            });
        }
    });
}
module.exports.getList = getList;
module.exports.create = create;
module.exports.update = update;
module.exports.remove = remove;
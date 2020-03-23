module.exports = function (app) {
    app.post('/ui/opportunity', function (req, res) {
        try {
            create(req.body, function (response) {
                res.json(response);
            });
        } catch (error) {
            res.json(error);
        }
    });

    app.get('/ui/opportunity', function (req, res) {
        try {
            getListByStatusOpportunity(req.query, function (response) {
                res.json(response);
            });
        }
        catch (e) {
            res.json(e);
        }
    });

    app.put('/ui/opportunity', function (req, res) {
        try {
            update(req.body, function (response) {
                res.json(response);
            });
        } catch (e) {
            res.json(e);
        }
    });

    app.get('/ui/opportunity/feed', function (req, res) {
        try {
            opportunityFeed(req.query, function (response) {
                res.json(response);
            });
        }
        catch (e) {
            res.json(e);
        }
    });

    app.delete('/ui/opportunity', function (req, res) {
        try {
            remove(req.body, function (response) {
                res.json(response);
            });
        } catch (e) {
            res.json(e);
        }
    });

    app.get('/ui/opportunity/previousOpportunity', function (req, res) {
        try {
            previousOpportunity(req.query, function (response) {
                res.json(response);
            });
        }
        catch (e) {
            res.json(e);
        }
    });

    app.get('/ui/opportunity/numberOfClick', function (req, res) {
        try {
            numberOfClickUpdate(req.query, function (response) {
                res.json(response);
            });
        }
        catch (e) {
            res.json(e);
        }
    });

    app.get('/ui/opportunity/numberOfClick', function (req, res) {
        try {
            numberOfClickUpdate(req.query, function (response) {
                res.json(response);
            });
        }
        catch (e) {
            res.json(e);
        }
    });

    app.put('/ui/opportunity/addGroup', function (req, res) {
        try {
            addGroup(req.body, function (response) {
                res.json(response);
            });
        }
        catch (e) {
            res.json(e);
        }
    });

    app.put('/ui/opportunity/forWardToParent', function (req, res) {
        try {
            forWardToParent(req.body, function (response) {
                res.json(response);
            });
        }
        catch (e) {
            res.json(e);
        }
    });

    app.put('/ui/opportunity/shareOpportunity', function (req, res) {
        try {
            shareOpportunity(req.body, function (response) {
                res.json(response);
            });
        }
        catch (e) {
            res.json(e);
        }
    });

    app.put('/ui/opportunity/inquireForm', function (req, res) {
        try {
            inquireForm(req.body, function (response) {
                res.json(response);
            });
        }
        catch (e) {
            res.json(e);
        }
    });

}

var mongoose = require('mongoose'), Schema = mongoose.Schema;
var OpportunitySchema = new Schema(require('./opportunitySchema').opportunitySchema, { collection: 'opportunity' });
var OpportunityModel = mongoose.model('opportunity', OpportunitySchema);
var OpportunityController = require('./opportunityController');
var utils = require('../../commons/utils').utils;
var mongoUtils = utils.mongoUtils;
var CONSTANTS = utils.CONSTANTS;
var REQUEST_CODES = CONSTANTS.REQUEST_CODES;
var _ = require('underscore');
var OPPORTUNITY_CODES = utils.CONSTANTS.OPPORTUNITY;
var Users = require('../users/users');
var Connections = require('../connection/connections');
var Message = require('../messaging/message');
var Feed = require('../feeds/feed');
var mailer = require('../email/mailer');
var UserInterest = require('../userInterest/userInterest');
var Group = require('../group/group');
var moment = require('moment');
var userModel = require('../users/users');
var educationModel = require('../education/education')

function create(opportunity, callback) {
    var opportunityAPI;
    var errorList = [];
    try {
        opportunityAPI = OpportunityController.OpportunityAPI(opportunity);
    }
    catch (e) {
        errorList.push(e.error[0]);
        callback({
            status: REQUEST_CODES.FAIL,
            error: errorList
        });
        return;
    }

    var opportunityModel = new OpportunityModel(opportunityAPI);
    mongoUtils.getNextSequence('opportunityId', function (oSeq) {
        opportunityModel.opportunityId = oSeq;
        //

        // var lastYear = moment().subtract(5, 'years').valueOf();
        // console.log('lastYear       ', lastYear);

        var dobRange = [];
        opportunity.age.forEach(function (data) {
            // console.log(data)
            dobRange.push({
                dob: { $gte: moment().subtract(data.to, 'years').valueOf(), $lte: moment().subtract(data.from, 'years').valueOf() }
            })
        })

        console.log("dobRange==========");
        console.log(dobRange);

        userModel.getFilteredUsers({ $or: dobRange }, opportunity.location, function (records) {
            // if (error) {
            //     console.log(error);
            // }
            // else {
            console.log('crate op', records.result);
            // records.result.forEach()

            opportunityModel.userList = records.result;
            if (records.length > 0) {
                educationModel.getList()
            }
            callback({
                status: REQUEST_CODES.SUCCESS,
                result: records
            });
            return;
            // }
        })

        //
        opportunityModel.save(function (error) {
            if (error) {
                callback({
                    status: REQUEST_CODES.FAIL,
                    error: error
                });
                return;
            }
            else {
                let feed = {};
                feed['postedBy'] = opportunity.userId;
                feed['post'] = { "text": "" };
                feed['dateTime'] = new Date().getTime();
                feed['isActive'] = true;
                feed['postOwner'] = 0;
                feed['postOwnerRole'] = opportunity.roleId;
                feed['opportunityId'] = opportunity.opportunityId;
                feed['visibility'] = opportunity.visibility;
                feed['lastActivityTime'] = new Date().getTime();
                feed['lastActivityType'] = opportunity.lastActivityType;
                feed['opportunityId'] = opportunityModel.opportunityId;
                feed['groupId'] = opportunityModel.groupId;
                postFeedForOpportunity(feed, function (response) {
                });
                //     userListForOpportunity(opportunityModel.opportunityId);
                //

                //

                // callback({
                //     status: REQUEST_CODES.SUCCESS,
                //     message: utils.formatText(OPPORTUNITY_CODES.CREATE_SUCCESS, opportunityModel.opportunityId),
                //     result: opportunityModel.opportunityId
                // });
                // return;
            }

        });
    });
}

function userListForOpportunity(opportunityId, callback) {
    let userList = [];
    Users.getList({}, function (res) {
        if (res.result.length > 0) {
            let userData = res.result;
            userData.forEach(function (data) {
                userList.push({ 'userId': data.userId });
            })
            getList({ opportunityId: opportunityId }, function (res) {
                if (res.result.length > 0) {
                    let opportunityData = res.result[0];
                    opportunityData.userList = userList;
                    update(opportunityData, callback);
                }
            })
        }
    })
}

function postFeedForOpportunity(feed, callback) {
    Feed.create(feed, function (response) {
    });
    callback({
        status: REQUEST_CODES.SUCCESS
    });
}

function getListByStatusOpportunity(query, callback) {
    console.log(query);
    OpportunityModel.find(query, function (error, records) {
        if (error) {
            callback({
                status: DB_CODES.FAIL,
                error: error
            });
            return;
        }
        else {
            var activeOpportunities = [];
            var expiredOpportunities = [];
            var todayDateTime = new Date();

            var url = "google.com";
            if (records.length > 0) {
                for (var i = 0; i < records.length; i++) {
                    if (new Date(records[i].toDate) > todayDateTime) {
                        records[i].url = url;

                        activeOpportunities.push(records[i]);
                    }
                    else {
                        expiredOpportunities.push(records[i]);
                    }
                }
                callback({
                    status: REQUEST_CODES.SUCCESS,
                    result: {
                        'activeOpportunities': activeOpportunities,
                        'expiredOpportunities': expiredOpportunities
                    }
                });
                return;
            }
            callback({
                status: REQUEST_CODES.SUCCESS,
                result: {
                    'activeOpportunities': activeOpportunities,
                    'expiredOpportunities': expiredOpportunities
                }
            });
            return;
        }
    });
}

function getList(query, callback) {
    console.log(query);
    OpportunityModel.find(query, function (error, records) {
        if (error) {
            callback({
                status: DB_CODES.FAIL,
                error: error
            });
            return;
        }
        else {
            records = records.map(function (record) {
                return new OpportunityController.OpportunityAPI(record);
            });
            callback({
                status: REQUEST_CODES.SUCCESS,
                result: records
            });
            return;
        }
    });
}

function getOpportunity(query, callback) {
    console.log(query);
    OpportunityModel.aggregate([
        {
            $match: {
                userId: parseInt(query.userId)
            },
        },
        {
            $lookup: {
                from: "company",
                localField: "companyId",
                foreignField: "companyId",
                as: "companyData"
            }
        },
        {
            $unwind: "$companyData"
        }
    ]).exec(function (error, data) {
        if (error) {
            callback({
                status: REQUEST_CODES.FAIL,
                message: error
            });
        } else {
            var activeOpportunities = [];
            var expiredOpportunities = [];
            var todayDateTime = new Date();

            var url = "google.com";
            if (data.length > 0) {
                console.log('data       ', data);
                for (var i = 0; i < data.length; i++) {
                    if (new Date(data[i].toDate) > todayDateTime) {
                        data[i].url = url;
                        activeOpportunities.push(data[i]);
                    }
                    else {
                        expiredOpportunities.push(data[i]);
                    }
                }
                callback({
                    status: REQUEST_CODES.SUCCESS,
                    result: {
                        'activeOpportunities': activeOpportunities,
                        'expiredOpportunities': expiredOpportunities
                    }
                });
                return;
            } else {
                callback({
                    status: REQUEST_CODES.SUCCESS,
                    result: data
                });
                return;
            }
        }
    })

}

function update(opportunity, callback) {
    CompanyModel.opportunity({ 'opportunityId': opportunity.opportunityId }, { $set: opportunity }, function (error) {
        if (error) {
            callback({
                status: DB_CODES.FAIL,
                message: error
            });
            return;
        } else {
            callback({
                status: REQUEST_CODES.SUCCESS,
                message: utils.formatText(OPPORTUNITY_CODES.UPDATE_SUCCESS, opportunity.opportunityId)
            });
        }
        return;
    });
}

function remove(query, callback) {
    OpportunityModel.remove(query, function (error) {
        if (error) {
            callback({
                status: REQUEST_CODES.FAIL,
                error: error
            });
            return;
        } else {
            callback({
                status: REQUEST_CODES.SUCCESS,
                message: OPPORTUNITY_CODES.DELETE_SUCCESS
            });
            return;
        }
    });
}

function previousOpportunity(query, callback) {
    OpportunityModel.find(query, function (error, records) {
        if (error) {
            callback({
                status: DB_CODES.FAIL,
                error: error
            });
            return;
        }
        else {
            if (records.length > 0) {
                var filterData = {
                    title: null,
                    gender: null,
                    age: 0,
                    locaton: null
                };
                var filterDataArray = [];

                for (var i = 0; i < records.length; i++) {
                    filterData.title = records[i].jobTitle;
                    filterData.age = records[i].age;
                    filterData.locaton = records[i].locaton;
                    filterData.gender = records[i].gender;

                    filterDataArray.push(filterData);
                }

                callback({
                    status: REQUEST_CODES.SUCCESS,
                    result: {
                        'previousOpprtunity': filterDataArray
                    }
                });
                return;
            }
            callback({
                status: REQUEST_CODES.SUCCESS,
                result: {}
            });
            return;
        }
    });
}

function addGroup(query, callback) {
    console.log(query);
    let groupList = query.group;
    if (query.opportunityId) {
        getList({ opportunityId: query.opportunityId }, function (resp) {

            var opportunity = resp.result[0];
            let groupOpportunity = opportunity.group ? opportunity.group : [];

            console.log("query", groupOpportunity);
            groupList.forEach(function (data) {
                let index = groupOpportunity.findIndex(todo => todo == parseInt(data.id))
                if (index === -1) {
                    opportunity.group.push(parseInt(data.id));
                }
            })
            OpportunityModel.update({ 'opportunityId': opportunity.opportunityId }, { $set: opportunity }, function (error) {
                if (error) {
                    callback({
                        status: REQUEST_CODES.FAIL,
                        message: error
                    });
                    return;
                } else {
                    callback({
                        status: REQUEST_CODES.SUCCESS,
                        message: utils.formatText(OPPORTUNITY_CODES.GROUP_ADDED),
                    });
                    return;
                }
            });
        })
    }
}

function shareOpportunity(query, callback) {
    console.log(query);
    let connections= query.connections;
    let userId= parseInt(query.userId);
    let roleId= parseInt(query.roleId);
    let connectionArr= [];
    connections.forEach(function(data){
     // let connectionId= parseInt(data); 
      connectionArr.push(parseInt(data));
    });

    Connections.getList({connectId: {$in :connectionArr}},function(res){
        console.log('chai ko');
       let connectionRes= res.result;      
       connectionRes.forEach(function(data){
         let connectionData= data;
         let message ={};
         message['connectorId']= connectionData.connectId;
         message['sender']= userId;
         message['senderRoleId']= roleId;
         message['receiver']= connectionData.userId == userId ? connectionData.partnerId : userId;
         message['receiverRoleId']= connectionData.userId == userId ? connectionData.partnerRoleId : roleId;
         message['deletedBy']= false;
         message['text']= "http:localhost:3000?feedId="+parseInt(query.feedId);
         message['type']= 1;
         message['status']= 1;
         Message.create(message,callback);
       })        
    })
    
    callback({
        status: REQUEST_CODES.SUCCESS,
        message: utils.formatText(OPPORTUNITY_CODES.OPPORTUNITY_SHARED),
    });
    return;
  
}

function inquireForm(query, callback) {
    console.log(query);
    let name= query.name;
    let email= query.email;
    let number= query.number;
 
    getList({opportunityId: query.opportunityId},function(res){
        if(res.result.length > 0){
          let oppportunity= res.result[0];

          let inquireForm= oppportunity.inquiry;
          let index= oppportunity.inquiry.findIndex(todo => todo.email == email);

          if(index === -1){
                inquireForm.push({name: name,email: email,number:number});
            
            oppportunity.inquiry= inquireForm;
            OpportunityModel.update({ 'opportunityId': opportunity.opportunityId }, { $set: opportunity }, function (error) {
                if (error) {
                    callback({
                        status: REQUEST_CODES.FAIL,
                        message: error
                    });
                    return;
                } else {
                    callback({
                        status: REQUEST_CODES.SUCCESS,
                        message: utils.formatText(OPPORTUNITY_CODES.INQUIRE_SUCCESSFUL),
                    });
                    return;
                }
            });
          }else{
            callback({
                status: REQUEST_CODES.SUCCESS,
                message: utils.formatText(OPPORTUNITY_CODES.ALREADY_INQUIRED),
            });
            return;
          }
        } 
    })   
}

function forWardToParent(query, callback) {
    console.log(query);
    if (query.opportunityId) {
        Users.getList({ userId: parseInt(query.userId) }, function (res) {
            if (res.result.length > 0) {
                let userData = res.result[0];
                let parents = userData.parents;

                getList({ opportunityId: query.opportunityId }, function (resp) {
                    var opportunity = resp.result[0];
                    let parentList = opportunity.parents ? opportunity.parents : [];

                    parents.forEach(function (data) {
                        let index = parentList.findIndex(todo => todo == parseInt(data.userId))
                        if (index === -1) {
                            opportunity.parents.push(parseInt(data.userId));
                        }
                    })

                    OpportunityModel.update({ 'opportunityId': opportunity.opportunityId }, { $set: opportunity }, function (error) {
                        if (error) {
                            callback({
                                status: REQUEST_CODES.FAIL,
                                message: error
                            });
                            return;
                        } else {
                            callback({
                                status: REQUEST_CODES.SUCCESS,
                                message: utils.formatText(OPPORTUNITY_CODES.FORWARD_TO_PARENT),
                            });
                            return;
                        }
                    });
                })
            }
        })
    }
}

function numberOfClickUpdate(query, callback) {
    if (query.opportunityId) {
        getList({ opportunityId: query.opportunityId }, function (resp) {
            var opportunity = resp.result[0];
            opportunity.numberOfClick = parseInt(opportunity.numberOfClick) + 1;
            OpportunityModel.update({ 'opportunityId': opportunity.opportunityId }, { $set: opportunity }, function (error) {
                if (error) {
                    callback({
                        status: REQUEST_CODES.FAIL,
                        message: error
                    });
                    return;
                } else {
                    callback({
                        status: REQUEST_CODES.SUCCESS,
                        message: utils.formatText(OPPORTUNITY_CODES.UPDATE_SUCCESS),
                    });
                    return;
                }
            });
        })
    }
}

module.exports.create = create;
module.exports.getList = getList;
module.exports.update = update;
module.exports.remove = remove;
module.exports.previousOpportunity = previousOpportunity;
module.exports.numberOfClickUpdate = numberOfClickUpdate;

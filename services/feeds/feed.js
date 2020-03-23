module.exports = function (app) {
    app.post('/ui/feed', function (req, res) {
        try {
            create(req.body, function (response) {
                res.json(response);
            });
        }
        catch (e) {
            res.json(e);
        }
    });
    app.post('/ui/share/feed', function (req, res) {
        try {
            sharePost(req.body, function (response) {
                res.json(response);
            });
        }
        catch (e) {
            res.json(e);
        }
    });
    app.post('/ui/remove/comment', function (req, res) {
        try {
            removeComment(req.body, function (response) {
                res.json(response);
            });
        }
        catch (e) {
            res.json(e);
        }
    });
    app.get('/ui/feed', function (req, res) {
        try {
            getList(req.query, function (response) {
                res.json(response);
            });
        }
        catch (e) {
            res.json(e);
        }
    });
    app.get('/ui/feed/postList', function (req, res) {
        try {
            postList(req.query, function (response) {
                res.json(response);
            });
        }
        catch (e) {
            res.json(e);
        }
    });

    app.get('/ui/feed/postListByAdmin', function (req, res) {
        try {
            postListByAdmin(req.query, function (response) {
                res.json(response);
            });
        }
        catch (e) {
            res.json(e);
        }
    });

    app.get('/ui/feed/postListByGroupId', function (req, res) {
        try {
            postListByGroupId(req.query, function (response) {
                res.json(response);
            });
        }
        catch (e) {
            res.json(e);
        }
    });

    app.put('/ui/feed/addComment', function (req, res) {
        try {
            addComment(req.body, function (response) {
                res.json(response);
            });
        }
        catch (e) {
            res.json(e);
        }
    });
    app.put('/ui/feed/addLike', function (req, res) {
        try {
            addLike(req.body, function (response) {
                res.json(response);
            });
        }
        catch (e) {
            res.json(e);
        }
    });
    app.get('/ui/feed/numberOfClick', function (req, res) {
        try {
            numberOfClickUpdate(req.query, function (response) {
                res.json(response);
            });
        }
        catch (e) {
            res.json(e);
        }
    });
    app.get('/ui/mutual/friendlist', function (req, res) {
        try {
            getMutualFriends(req.query, function (response) {
                res.json(response);
            });
        }
        catch (e) {
            res.json(e);
        }
    });
    app.delete('/ui/feed', function (req, res) {
        try {
            removeFeedAndSharedFeed(req.body, function (response) {
                res.json(response);
            });
        } catch (e) {
            res.json(e);
        }
    });
    app.put('/ui/feed/update', function (req, res) {
        try {
            updatePost(req.body, function (response) {
                res.json(response);
            });
        }
        catch (e) {
            res.json(e);
        }
    });

    app.get('/ui/adminDashboard', function (req, res) {
        //To search on spikeview
        try {
            adminDashboard(req, function (response) {
                res.json(response);
            });
        } catch (e) {
            res.json(e);
        }
    });

    app.put('/ui/adminDashboardCategory', function (req, res) {
        //To search on spikeview
        try {
            adminDashboardStatus(req.body, function (response) {
                res.json(response);
            });
        } catch (e) {
            res.json(e);
        }
    });
    app.put('/ui/feed/urlMetaData', function (req, res) {
        //To search on spikeview
        try {
            getMetaData(req.body, function (response) {
                res.json(response);
            });
        } catch (e) {
            res.json(e);
        }
    });
    app.delete('/ui/deleteFeed', function (req, res) {
        try {
            removeFeedWithOpportunity(req.body, function (response) {
                res.json(response);
            });
        } catch (e) {
            res.json(e);
        }
    });
}

var mongoose = require('mongoose'), Schema = mongoose.Schema;
var FeedSchema = new Schema(require('./feedSchema').feedSchema, { collection: 'feeds' });
var FeedModel = mongoose.model('feed', FeedSchema);
var FeedController = require('./feedController');
var utils = require('../../commons/utils').utils;
var subscription = require('../subscription/subscription');
var connection = require('../connection/connections');
var Group = require('../group/group');
var users = require('../users/users');
var UserInterest = require('../userInterest/userInterest');
var mongoUtils = utils.mongoUtils;
var CONSTANTS = utils.CONSTANTS;
var DB_CODES = CONSTANTS.DATABASE_CODES;
var USER_CODES = utils.CONSTANTS.USERS;
var REQUEST_CODES = CONSTANTS.REQUEST_CODES;
var urlMetadata = require("url-metadata")
var FEED_CODES = utils.CONSTANTS.FEED;
var _ = require('underscore');
const uuid = require('uuid/v4');
var OpportunityModel = require("../opportunity/opportunity");

function adminDashboard(studentList, callback) {
    let studentListAll = [], studentListWithDate = [], studentListWithComment = [];
    studentList.forEach(function (item) {
        studentListAll.push({ userId: parseInt(item) });
        studentListWithDate.push({ userId: parseInt(item) });
        studentListWithComment.push({ commentedBy: parseInt(item) });
    })
    var d = new Date();
    d.setDate(d.getDate() - 7);
    Promise.all([
        FeedModel.aggregate([
            {
                $match: {
                    $and: [{ 'likes.userId': { $in: studentList } },
                    { $or: [{ 'likes.roleId': USER_CODES.STUDENT_ROLE }, { 'likes.roleId': { $exists: false } }] },
                    { 'likes.dateTime': { $gte: d.getTime() } }]
                }
            },
            // Unwind the array
            { "$unwind": "$likes" },

            // Actually match the tags within the now unwound array
            {
                "$match": {
                    '$and': [{ 'likes.userId': { $in: studentList } },
                    { $or: [{ 'likes.roleId': USER_CODES.STUDENT_ROLE }, { 'likes.roleId': { $exists: false } }] },
                    { 'likes.dateTime': { $gte: d.getTime() } }]
                }
            },

            // Group by each tag
            {
                "$group": {
                    _id: "$likes.userId",
                    "count": { "$sum": 1 }
                }
            },

            // Rename the _id for your output
            {
                "$project": {
                    "_id": 0,
                    "likes.userId": "$_id",
                    "count": 1
                }
            }
        ]).exec(),
        FeedModel.aggregate([
            {
                $match: {
                    '$and': [{ 'comments.commentedBy': { $in: studentList } },
                    { $or: [{ 'comments.roleId': USER_CODES.STUDENT_ROLE }, { 'comments.roleId': { $exists: false } }] },
                    { 'comments.dateTime': { $gte: d.getTime() } }]
                }
            },
            { "$unwind": "$comments" },
            {
                "$match": {
                    '$and': [{ 'comments.commentedBy': { $in: studentList } },
                    { $or: [{ 'comments.roleId': USER_CODES.STUDENT_ROLE }, { 'comments.roleId': { $exists: false } }] },
                    { 'comments.dateTime': { $gte: d.getTime() } }]
                }
            },

            { "$group": { _id: "$comments.commentedBy", "count": { "$sum": 1 } } },
            // Rename the _id for your output
            { "$project": { "_id": 0, "comments.userId": "$_id", "count": 1 } }
        ]).exec(),
        FeedModel.aggregate([
            {
                $match: {
                    $and: [{ postedBy: { $in: studentList } },
                    { dateTime: { $gt: d.getTime() } }]
                }
            },
            { "$unwind": "$postedBy" },
            {
                "$match": {
                    $and: [{ postedBy: { $in: studentList } },
                    { dateTime: { $gt: d.getTime() } }]
                }
            },
            { "$group": { _id: "$postedBy", "count": { "$sum": 1 } } },
            // Rename the _id for your output
            { "$project": { "_id": 0, "postedBy": "$_id", "count": 1 } }
        ]).exec(),
        connection.getConnectionCount(studentList),
        Group.getGroupCount(studentList),
        connection.getChatMessageCount(studentList),
        connection.getMessagesOfPartner(studentList)
    ])
        .then(results => {
            var [feedLike, feedComment, feedPost, newConnenction, GroupCount, ChatMessageCount, partnerMessage] = results;
            let dashBoardJson = {};

            let ChatMessageCountArr = [];
            studentListAll.forEach(function (data, index) {
                ChatMessageCountArr.push({ userId: parseInt(data.userId) })

                ChatMessageCount.forEach(function (item) {
                    if (item.userId == data.userId || item.partnerId == data.userId) {
                        if (ChatMessageCountArr[index]['count']) {
                            ChatMessageCountArr[index]['count'] = ChatMessageCountArr[index]['count'] + 1;
                        } else {
                            ChatMessageCountArr[index]['count'] = 1;
                        }
                    }
                })
            })


            //console.log('partnerMessage ',partnerMessage);


            let partnerMessageArr = [], partnerMessageArrUser = [];
            // studentListAll.forEach(function(data,index){
            //     partnerMessageArr.push({userId: parseInt(data.userId)})

            //     partnerMessage.forEach(function(item){
            //         if(item.userId == data.userId || item.partnerId == data.userId){                 
            //             if(partnerMessageArr[index]['count']){
            //          //    if(parseInt(partnerMessageArr[index]['count']) < 3){
            //                     partnerMessageArr[index]['count']= partnerMessageArr[index]['count'] + 1;
            //                     partnerMessageArrUser.push({userId:data.userId ,partnerId:data.userId == item.userId ? item.partnerId : item.userId});
            //      //           }
            //             }else{
            //                 partnerMessageArr[index]['count'] = 1;
            //                 partnerMessageArrUser.push({userId:data.userId ,partnerId:data.userId == item.userId ? item.partnerId : item.userId});
            //             }                 
            //         }                
            //     })
            // })

            let checkNewArr = []

            studentListAll.forEach(function (data, index) {
                checkNewArr.push({ userId: parseInt(data.userId), connectArr: [] })

                partnerMessage.forEach(function (item) {
                    if (item.userId == data.userId || item.partnerId == data.userId) {
                        if (checkNewArr[index].connectArr.length === 0) {
                            checkNewArr[index].connectArr.push({ connectId: item.connectId, count: 1 });
                        } else {
                            let indexCheck = checkNewArr[index].connectArr.findIndex(todo => todo.connectId == item.connectId);
                            if (indexCheck !== -1) {
                                checkNewArr[index].connectArr[indexCheck].count =
                                    checkNewArr[index].connectArr[indexCheck].count + 1;

                            } else {
                                checkNewArr[index].connectArr.push({ connectId: item.connectId, count: 1 });
                            }
                        }
                    }
                })
            })

            let checkNewPushArr = [];
            studentListAll.forEach(function (data, index) {
                let countDataPerUser = 0;
                checkNewArr[index].connectArr = checkNewArr[index].connectArr.sort(function (a, b) { return b.count - a.count });
                checkNewArr[index].connectArr.forEach(function (item, index) {
                    if (index < 3) {
                        countDataPerUser = countDataPerUser + parseInt(item.count);
                    }
                })
                checkNewPushArr.push({ userId: parseInt(data.userId), count: countDataPerUser });
            })

            let partnerMessageArrR = [];
            let newListPartnerMessager = [];
            studentListAll.forEach(function (data, newIndex) {

                newListPartnerMessager.push({ userId: parseInt(data.userId) });
                partnerMessageArrUser.forEach(function (arrR, index) {
                    partnerMessageArrR.push({ userId: parseInt(arrR.userId) });
                    // if(newListPartnerMessager.indexOf(todo => todo.userId == arrR.userId) === -1){
                    //     newListPartnerMessager.push({userId: parseInt(arrR.userId)});
                    // }
                    ChatMessageCount.forEach(function (item) {
                        if (item.userId == arrR.userId && item.partnerId == arrR.partnerId ||
                            item.userId == arrR.partnerId && item.partnerId == arrR.userId) {
                            if (partnerMessageArrR[index]['count']) {
                                partnerMessageArrR[index]['count'] = partnerMessageArrR[index]['count'] + 1;
                            } else {
                                partnerMessageArrR[index]['count'] = 1;
                            }

                            if (newListPartnerMessager[newIndex]['userId'] == partnerMessageArrR[index]['userId'] && newListPartnerMessager[newIndex]['count']) {
                                newListPartnerMessager[newIndex]['count'] = newListPartnerMessager[newIndex]['count'] + 1;
                            } else {
                                if (newListPartnerMessager[newIndex]['userId'] == partnerMessageArrR[index]['userId'])
                                    newListPartnerMessager[newIndex]['count'] = 1;
                            }
                        }
                    })
                })
            })



            let connectionList = [];
            studentListAll.forEach(function (data, index) {
                connectionList.push({ userId: parseInt(data.userId) });
                newConnenction.forEach(function (item) {
                    if (item.userId == data.userId || item.partnerId == data.userId) {
                        if (connectionList[index]['count']) {
                            connectionList[index]['count'] = connectionList[index]['count'] + 1;
                        } else {
                            connectionList[index]['count'] = 1;
                        }
                    }
                })
            })

            dashBoardJson['feedLike'] = feedLike;
            dashBoardJson['feedPost'] = feedPost;
            dashBoardJson['feedComment'] = feedComment;
            dashBoardJson['newConnenction'] = connectionList;
            dashBoardJson['groupCount'] = GroupCount;
            dashBoardJson['chatMessageCount'] = ChatMessageCountArr;
            dashBoardJson['chatPartners'] = checkNewPushArr;

            callback({
                status: REQUEST_CODES.SUCCESS,
                result: dashBoardJson
            });
            return;
        })
        .catch(err => {
            console.error("Something went wrong", err);
        })
}


function adminDashboardStatus(data, callback) {
    if (data.category == 'Likes')
        likeAdminDashboard(data, callback);
    if (data.category == 'Comments')
        commentAdminDashboard(data, callback);
    if (data.category == 'Posts')
        postAdminDashboard(data, callback);
    if (data.category == 'New Connections')
        connection.getRequestedConnections(data, callback);
    if (data.category == 'Groups')
        Group.getGroupInfo(data, callback);
    if (data.category == 'Chats')
        connection.getChatMessageInfo(data, callback);
    if (data.category == 'Top Chat Partners')
        connection.getMessagesOfPartnerInfo(data, callback)
}

function likeAdminDashboard(data, callback) {
    let userId = parseInt(data.userId);
    let roleId = data.roleId ? parseInt(data.roleId) : null;
    var d = new Date();
    d.setDate(d.getDate() - 7);

    let resQuery = [];
    //   if(data.roleId){
    resQuery = [
        {
            $and: [{ 'likes.userId': userId },
            { $or: [{ 'likes.roleId': USER_CODES.STUDENT_ROLE }, { 'likes.roleId': { $exists: false } }] },
            { 'likes.dateTime': { $gte: d.getTime() } }]
        }
    ];
    // }else{
    //     resQuery= [
    //         {$and:[{'likes.userId': userId},{'likes.dateTime':{$gte: d.getTime()}}]} 
    //     ]
    // }  

    FeedModel.aggregate([
        {
            $match:
                resQuery[0]
        },
        { "$sort": { "likes.dateTime": -1 } },
        // Latest first       

        {
            $lookup: {
                from: "users",
                localField: "postedBy",
                foreignField: "userId",
                as: "postedByUser"
            }
        },
        {
            $unwind: "$postedByUser"
        }
    ]).exec(function (error, data) {
        if (error) {
            callback({
                status: REQUEST_CODES.FAIL,
                message: error
            });
        } else {
            let resResult = [];

            users.getList({ userId: userId }, function (userRes) {
                let user = userRes.result[0];
                data.forEach(function (dataRes) {
                    let resResultJson = {};
                    resResultJson['actedBy'] = user.firstName + ' ' + (user.lastName ? user.lastName : "");
                    resResultJson['profileImage'] = user.profilePicture;
                    resResultJson['message1'] = " likes "
                    if (dataRes.postedByUser) {
                        let postedByUserRes = dataRes.postedByUser;
                        resResultJson['actedOn'] = postedByUserRes.firstName + ' ' + (postedByUserRes.lastName ? postedByUserRes.lastName : "");
                    }
                    resResultJson['feedId'] = dataRes.feedId;
                    resResultJson['actedUserId'] = user.userId;
                    resResultJson['actedRoleId'] = user.roleId;
                    resResultJson['message2'] = "'s post."

                    resResult.push(resResultJson);
                })
                callback({
                    status: REQUEST_CODES.SUCCESS,
                    result: resResult
                });
            })

        }
    })
}


function commentAdminDashboard(data, callback) {
    let userId = parseInt(data.userId);
    let roleId = data.roleId ? parseInt(data.roleId) : null;
    var d = new Date();
    d.setDate(d.getDate() - 7);
    let resQuery = [];
    //  if(data.roleId){
    resQuery = [
        {
            $and: [{ 'comments.commentedBy': userId },
            { $or: [{ 'comments.roleId': USER_CODES.STUDENT_ROLE }, { 'comments.roleId': { $exists: false } }] },
                , { 'comments.dateTime': { $gte: d.getTime() } }]
        }
    ];
    // }else{
    //     resQuery= [
    //         { $and:[{'comments.commentedBy': userId},{'comments.dateTime':{$gte: d.getTime()}}] } 
    //     ]
    // } 


    FeedModel.aggregate([
        {
            $match:
                resQuery[0]
        },

        { "$sort": { "comments.dateTime": -1 } }, // Latest first       

        {
            $lookup: {
                from: "users",
                localField: "postedBy",
                foreignField: "userId",
                as: "postedByUser"
            }
        },
        {
            $unwind: "$postedByUser"
        }
    ]).exec(function (error, data) {
        if (error) {
            callback({
                status: REQUEST_CODES.FAIL,
                message: error
            });
        } else {
            let resResult = [];

            users.getList({ userId: userId }, function (userRes) {
                let user = userRes.result[0];
                //   console.log(user);
                data.forEach(function (dataRes) {
                    let resResultJson = {};
                    resResultJson['actedBy'] = user.firstName + ' ' + (user.lastName ? user.lastName : "");
                    resResultJson['profileImage'] = user.profilePicture;
                    resResultJson['message1'] = " commented on "
                    resResultJson['feedId'] = dataRes.feedId;
                    if (dataRes.postedByUser) {
                        let postedByUserRes = dataRes.postedByUser;
                        resResultJson['actedOn'] = postedByUserRes.firstName + ' ' + (postedByUserRes.lastName ? postedByUserRes.lastName : "");
                    }
                    resResultJson['actedUserId'] = user.userId;
                    resResultJson['actedRoleId'] = USER_CODES.STUDENT_ROLE;
                    resResultJson['message2'] = "'s post."

                    resResult.push(resResultJson);
                })
                callback({
                    status: REQUEST_CODES.SUCCESS,
                    result: resResult
                });
            })

        }
    })
}

function postAdminDashboard(data, callback) {
    let userId = parseInt(data.userId);
    let roleId = data.roleId ? parseInt(data.roleId) : null;
    var d = new Date();
    d.setDate(d.getDate() - 7);

    let resQuery = [];
    //     if(data.roleId){
    resQuery = [
        {
            $and: [{ postedBy: userId },
            {
                $or: [{ roleId: USER_CODES.STUDENT_ROLE },
                { roleId: { $exists: false } }]
            },
            { dateTime: { $gte: d.getTime() } }]
        }
    ];
    // }else{
    //     resQuery= [
    //         { $and : [{postedBy: userId},                  
    //             {dateTime:{$gte: d.getTime()}}]} 
    //     ]
    // } 


    FeedModel.aggregate([
        {
            $match:
                resQuery[0]
        },

        { "$sort": { "lastActivityTime": -1 } }, // Latest first       
        {
            $lookup: {
                from: "users",
                localField: "postOwner",
                foreignField: "userId",
                as: "postOwnerData"
            }
        }


    ]).exec(function (error, data) {
        if (error) {
            callback({
                status: REQUEST_CODES.FAIL,
                message: error
            });
        } else {
            let resResult = [];

            users.getList({ userId: userId }, function (userRes) {
                let user = userRes.result[0];
                data.forEach(function (dataRes) {
                    let resResultJson = {};
                    resResultJson['actedBy'] = user.firstName + ' ' + (user.lastName ? user.lastName : "");
                    resResultJson['profileImage'] = user.profilePicture;

                    if (dataRes.postOwnerData.length > 0) {
                        resResultJson['message1'] = " shared "
                        let postedByUserRes = dataRes.postOwnerData[0];
                        resResultJson['actedOn'] = postedByUserRes.firstName + ' ' + (postedByUserRes.lastName ? postedByUserRes.lastName : "");
                        resResultJson['message2'] = "'s post."
                    } else {
                        resResultJson['message1'] = " created a "
                        resResultJson['message2'] = "post."
                    }
                    resResultJson['actedUserId'] = USER_CODES.STUDENT_ROLE;
                    resResultJson['actedRoleId'] = user.roleId;

                    resResult.push(resResultJson);
                })
                callback({
                    status: REQUEST_CODES.SUCCESS,
                    result: resResult
                });
            })

        }
    })
}


function create(feed, callback) {
    var feedAPI;
    var errorList = [];
    try {
        feedAPI = FeedController.FeedAPI(feed);
    }
    catch (e) {
        errorList.push(e.error[0]);
        callback({
            status: REQUEST_CODES.FAIL,
            error: errorList
        });
        return;
    }
    var feedModel = new FeedModel(feedAPI);
    mongoUtils.getNextSequence('feedId', function (oSeq) {
        feedModel.feedId = oSeq;
        // console.log('feedModel      ', feedModel);
        feedModel.save(function (error) {
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
                    message: utils.formatText(FEED_CODES.CREATE_SUCCESS, feedModel.feedId),
                    result: feedModel.feedId
                });
                return;
            }
        });
    });
}

function getList(query, callback) {
    FeedModel.find(query, function (error, records) {
        if (error) {
            callback({
                status: DB_CODES.FAIL,
                error: error
            });
            return;
        }
        else {
            records = records.map(function (records) {
                return new FeedController.FeedAPI(records);
            });
            callback({
                status: REQUEST_CODES.SUCCESS,
                result: records
            });
            return;
        }
    });
}

function postList(query, callback) {
    users.getList({ userId: parseInt(query.userId) }, function (res) {
        if (!res.result[0].isActive) {
            callback({
                status: REQUEST_CODES.SUCCESS,
                message: 'Your profile is inactive.',
                result: []
            });
        }
    })

    let roleId = query.roleId ? parseInt(query.roleId) : null;
    let skip = parseInt(query.skip, 10) || 0;
    subscription.getList({ userId: parseInt(query.userId), status: 'Subscribe' }, function (subscriptionRec) {
        connection.getList({
            $or: [{
                $and: [{ userId: parseInt(query.userId) },
                {
                    $or: [{ userRoleId: roleId },
                    { userRoleId: { $exists: false } }]
                }
                ]
            },
            {
                $and: [{ partnerId: parseInt(query.userId) },
                {
                    $or: [{ partnerRoleId: roleId },
                    { partnerRoleId: { $exists: false } }]
                }
                ]
            }], status: {
                $in: [utils.CONSTANTS.CONNECTION.ACCEPTED, utils.CONSTANTS.CONNECTION.REQUESTED]
            }
        }, function (conRec) {
            let followerId = [], connectionId = [];
            followerId = subscriptionRec && subscriptionRec.result && subscriptionRec.result.map(function (data) {
                return data['followerId'];
            });
            conRec.result && conRec.result.forEach(function (data) {
                if (data.status === utils.CONSTANTS.CONNECTION.ACCEPTED) {
                    followerId.push(parseInt(data['userId'], 10) === parseInt(query.userId) ? data['partnerId'] : data['userId']);
                    connectionId.push(parseInt(data['userId'], 10) === parseInt(query.userId) ? data['partnerId'] : data['userId']);
                }
            });



            followerId.push(parseInt(query.userId));
            connectionId.push(parseInt(query.userId));

            Group.getList({ $and: [{ 'members.userId': parseInt(query.userId) }, { 'members.status': 'Accepted' }] }, function (groupRes) {

                let groupData = groupRes.result;
                let groupIdArr = [];

                groupData && groupData.forEach(function (item) {
                    groupIdArr.push(parseInt(item.groupId));
                })
                UserInterest.getList({ userId: parseInt(query.userId) }, function (userIntRes) {
                    let competencyArr = [];
                    userIntRes && userIntRes.result.forEach(function (item) {
                        competencyArr.push(item.level2);
                    })

                    FeedModel.aggregate([
                        {
                            $match: {
                                $or: [{
                                    $and: [
                                        {
                                            $or: [
                                                //    { visibility: 'Public' },
                                                { $and: [{ postedBy: { $in: followerId }, visibility: 'Public' }, { roleId: roleId }] },
                                                { postedBy: { $in: connectionId }, visibility: { $in: ['AllConnections', 'Public'] } },
                                                { postedBy: parseInt(query.userId), visibility: { $in: ['Private', 'Public'] }, roleId: roleId },
                                                { $or: [{ scope: { $all: [parseInt(query.userId)] } }, { postedBy: parseInt(query.userId) }], visibility: 'SelectedConnections', roleId: roleId },
                                                // { tags : { $all:[{userId:parseInt(query.userId)}] }}                               
                                                {"opportunityId":{$exists:true}},
                                                {
                                                    $and: [{ "tags.userId": parseInt(query.userId) },
                                                    {
                                                        $or: [{ "tags.roleId": roleId },
                                                        { "tags.roleId": { $exists: false } }]
                                                    }
                                                    ]
                                                },
                                                {
                                                    groupId: { $in: groupIdArr }
                                                }
                                            ]
                                        },
                                        { hideBy: { $ne: query.userId } },
                                        { postedBy: { $ne: 1 } },

                                        // {
                                        //     groupId:null
                                        // }                    
                                    ]
                                },
                                {
                                    'interest.level2.name': { $in: competencyArr }
                                }]
                            }
                        },
                        {
                            $lookup: {
                                from: "users",
                                localField: "postedBy",
                                foreignField: "userId",
                                as: "user"
                            }
                        },
                        {
                            $unwind: "$user"
                        },
                        {
                            $lookup: {
                                from: "users",
                                localField: "likes.userId",
                                foreignField: "userId",
                                as: "like"
                            }
                        },
                        {
                            $unwind: { "path": "$like", "preserveNullAndEmptyArrays": true }
                        },
                        {
                            $lookup: {
                                from: "users",
                                localField: "comments.commentedBy",
                                foreignField: "userId",
                                as: "commentUserList"
                            }
                        },
                        {
                            $unwind: { "path": "$commentUserList", "preserveNullAndEmptyArrays": true }
                        },
                        {
                            $lookup: {
                                from: "users",
                                localField: "comments.likes.userId",
                                foreignField: "userId",
                                as: "commentLikeUserList"
                            }
                        },
                        {
                            $unwind: { "path": "$commentLikeUserList", "preserveNullAndEmptyArrays": true }
                        },

                        {
                            $lookup: {
                                from: "users",
                                localField: "postOwner",
                                foreignField: "userId",
                                as: "postOwn"
                            }
                        },
                        {
                            $unwind: { "path": "$postOwn", "preserveNullAndEmptyArrays": true }
                        },
                        {
                            $lookup: {
                                from: "users",
                                localField: "tags.userId",
                                foreignField: "userId",
                                as: "taggedUsers"
                            }
                        },
                        {
                            $unwind: { "path": "$taggedUsers", "preserveNullAndEmptyArrays": true }
                        },
                        {
                            $lookup: {
                                from: "users",
                                localField: "post.tags.userId",
                                foreignField: "userId",
                                as: "postTaggedUsers"
                            }
                        },
                        {
                            $unwind: { "path": "$postTaggedUsers", "preserveNullAndEmptyArrays": true }
                        },
                        {
                            $lookup: {
                                from: 'opportunity',
                                as: 'opportunity',
                                let: { opportunityId: '$opportunityId' },
                                pipeline: [
                                    {
                                        $match: {
                                           $expr: {
                                                // $or:[{                                                     
                                                //       $and: [
                                                //         {parents :{'$in' : [parseInt(query.userId)]}},
                                                //         { opportunityId: {'$eq': '$$opportunityId'} },
                                                //     ]},
                                                    
                                                    $and: [
                                                        { opportunityId: {'$eq': '$$opportunityId'} },
                                                        { userId: {'$eq': parseInt(query.userId)} },
                                                    ]                                                
                                            }
                                       }
                                    }
                                ],
                            }
                        },
                        {
                            $unwind: { "path": "$opportunity", "preserveNullAndEmptyArrays": true }
                        },
                        {
                            $lookup: {
                                from: 'company',
                                as: 'company',
                                let: { companyId: '$opportunity.companyId' },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: {

                                                $eq: ['$companyId', '$$companyId']


                                            }
                                        }
                                    }
                                ],
                            }
                        },
                        {
                            $unwind: { "path": "$company", "preserveNullAndEmptyArrays": true }
                        },

                        { "$sort": { "lastActivityTime": -1 } }, // Latest first
                        { "$skip": skip * 10 },
                        { "$limit": 10 },
                        // {
                        //     $match: {
                        //         "$opportunity.userId": {"exists": false}
                        //     }
                        // },              
                        {
                            "$group": {
                                "_id": {
                                    _id: "$_id",
                                    feedId: "$feedId",
                                    groupId: "$groupId",
                                    post: "$post",
                                    postedBy: "$postedBy",
                                    dateTime: "$dateTime",
                                    visibility: "$visibility",
                                    comments: "$comments",
                                    likes: "$likes",
                                    tags: "$tags",
                                    scope: "$scope",
                                    postOwnerDeleted: "$postOwnerDeleted",
                                    firstName: "$user.firstName",
                                    lastName: "$user.lastName",
                                    roleId: "$user.roleId",
                                    email: "$user.email",
                                    profilePicture: "$user.profilePicture",
                                    title: "$user.title",
                                    postOwner: "$postOwn.userId",
                                    postOwnerFirstName: "$postOwn.firstName",
                                    postOwnerLastName: "$postOwn.lastName",
                                    postOwnerTitle: "$postOwn.title",
                                    postOwnerProfilePicture: "$postOwn.profilePicture",
                                    postOwnerRoleId: "$postOwn.roleId",
                                    reportedBy: "$reportedBy",
                                    hideBy: "$hideBy",
                                    metaTags: "$metaTags",
                                    shareText: "$shareText",
                                    shareTime: "$shareTime",
                                    tagline: "$user.tagline",
                                    lastActivityTime: "$lastActivityTime",
                                    lastActivityType: "$lastActivityType"

                                },
                                "Onlylikes": {
                                    "$push": {
                                        "userId": "$like.userId",
                                        "firstName": "$like.firstName",
                                        "lastName": "$like.lastName",
                                        "profilePicture": "$like.profilePicture",
                                        "title": "$like.title",
                                        "roleId": "$like.roleId"
                                    }
                                },
                                "commentLikeUserList": {
                                    "$push": {
                                        "userId": "$commentLikeUserList.userId",
                                        "firstName": "$commentLikeUserList.firstName",
                                        "lastName": "$commentLikeUserList.lastName",
                                        "profilePicture": "$commentLikeUserList.profilePicture",
                                        "title": "$commentLikeUserList.title",
                                        "roleId": "$commentLikeUserList.roleId"
                                    }
                                },
                                "tagsUserList": {
                                    "$push": {
                                        "userId": "$taggedUsers.userId",
                                        "firstName": "$taggedUsers.firstName",
                                        "lastName": "$taggedUsers.lastName",
                                        "profilePicture": "$taggedUsers.profilePicture",
                                        "title": "$taggedUsers.title",
                                        "roleId": "$taggedUsers.roleId"
                                    }
                                },
                                "postTaggedUsers": {
                                    "$push": {
                                        "userId": "$postTaggedUsers.userId",
                                        "firstName": "$postTaggedUsers.firstName",
                                        "lastName": "$postTaggedUsers.lastName",
                                        "profilePicture": "$postTaggedUsers.profilePicture",
                                        "title": "$postTaggedUsers.title",
                                        "roleId": "$postTaggedUsers.roleId"
                                    }
                                },
                                commentUserList: {
                                    "$push": {
                                        "userId": "$commentUserList.userId",
                                        "firstName": "$commentUserList.firstName",
                                        "lastName": "$commentUserList.lastName",
                                        "profilePicture": "$commentUserList.profilePicture",
                                        "title": "$commentUserList.title",
                                        "roleId": "$commentUserList.roleId"
                                    }
                                },
                                "postOpportunity": {
                                    "$push": {
                                        "opportunityId": "$opportunity.opportunityId",
                                        "userId": "$opportunity.userId",
                                        "callToAction": "$opportunity.callToAction",
                                        "roleId": "$opportunity.roleId",
                                        "jobTitle": "$opportunity.jobTitle",
                                        "jobType": "$opportunity.jobType",
                                        "jobLocation": "$opportunity.jobLocation",
                                        "project": "$opportunity.project",
                                        "duration": "$opportunity.duration",
                                        "status": "$opportunity.status",
                                        "asset": "$opportunity.asset",
                                        "fromDate": "$opportunity.fromDate",
                                        "toDate": "$opportunity.toDate",
                                        "groupId": "$opportunity.groupId",
                                        "targetAudience": "$opportunity.targetAudience",
                                        "title": "$opportunity.title",
                                        "location": "$opportunity.location",
                                        "gender": "$opportunity.gender",
                                        "age": "$opportunity.age",
                                        "interestType": "$opportunity.interestType",
                                        "interests": "$opportunity.interests",
                                        "companyId": "$opportunity.companyId",
                                        "offerId": "$opportunity.offerId",
                                        "serviceTitle": "$opportunity.serviceTitle",
                                        "serviceDesc": "$opportunity.serviceDesc",
                                        "expiresOn": "$opportunity.expiresOn",
                                        "withdraw": "$opportunity.withdraw",
                                        "companyName": "$company.name",
                                        "profilePicture": "$company.profilePicture",
                                        "coverPicture": "$company.coverPicture"
                                    }
                                },
                            },
                        },
                        {
                            $sort: { "_id.dateTime": -1 }
                        },
                        {
                            $project: {
                                _id: "$_id._id",
                                feedId: "$_id.feedId",
                                groupId: "$_id.groupId",
                                post: "$_id.post",
                                postedBy: "$_id.postedBy",
                                dateTime: "$_id.dateTime",
                                visibility: "$_id.visibility",
                                comments: "$_id.comments",
                                likes: "$_id.likes",
                                tags: "$_id.tags",
                                scope: "$_id.scope",
                                firstName: "$_id.firstName",
                                lastName: "$_id.lastName",
                                roleId: "$_id.roleId",
                                email: "$_id.email",
                                profilePicture: "$_id.profilePicture",
                                title: "$_id.title",
                                tagline: "$_id.tagline",
                                postOwner: "$_id.postOwner",
                                postOwnerDeleted: "$_id.postOwnerDeleted",
                                postOwnerFirstName: "$_id.postOwnerFirstName",
                                postOwnerLastName: "$_id.postOwnerLastName",
                                postOwnerTitle: "$_id.postOwnerTitle",
                                postOwnerProfilePicture: "$_id.postOwnerProfilePicture",
                                postOwnerRoleId: "$_id.postOwnerRoleId",
                                reportedBy: "$_id.reportedBy",
                                hideBy: "$_id.hideBy",
                                metaTags: "$_id.metaTags",
                                shareText: "$_id.shareText",
                                shareTime: "$_id.shareTime",
                                lastActivityTime: "$_id.lastActivityTime",
                                lastActivityType: "$_id.lastActivityType",
                                commentUserList: 1,
                                commentLikeUserList: 1,
                                Onlylikes: 1,
                                tagsUserList: 1,
                                postTaggedUsers: 1,
                                "postOpportunity": 1

                            }
                        }
                    ]).exec(function (error, data) {
                        if (error) {
                            callback({
                                status: REQUEST_CODES.FAIL,
                                message: error
                            });
                        } else {
                            data.forEach(function (data1) {
                                if (data1.reportedBy) {
                                    let reportIndex = data1.reportedBy && data1.reportedBy.findIndex(todo => todo == parseInt(query.userId));
                                    if (reportIndex !== -1) {
                                        data1['isReported'] = true;
                                    } else {
                                        data1['isReported'] = false;
                                    }
                                } else {
                                    data1['isReported'] = false;
                                }

                                if (data1.hideBy) {
                                    let hideIndex = data1.hideBy && data1.hideBy.findIndex(todo => todo == parseInt(query.userId));
                                    if (hideIndex !== -1) {
                                        data1['isHide'] = true;
                                    } else {
                                        data1['isHide'] = false;
                                    }
                                } else {
                                    data1['isHide'] = false;
                                }

                                data1.comments = data1.comments && data1.comments.map(function (comment) {
                                    let index = data1.commentUserList.findIndex(todo => todo.userId == comment.commentedBy);
                                    if (index !== -1) {
                                        comment["userId"] = data1.commentUserList[index].userId;
                                        let commentLastName = data1.commentUserList[index].lastName ? data1.commentUserList[index].lastName : '';
                                        comment["name"] = data1.commentUserList[index].firstName + " " + commentLastName;
                                        comment["profilePicture"] = data1.commentUserList[index].profilePicture;
                                        comment["title"] = data1.commentUserList[index].title;
                                        comment["roleId"] = data1.commentUserList[index].roleId;
                                    }
                                    comment.likes = comment.likes.map(function (likes) {

                                        let index = data1.commentLikeUserList.findIndex(todo => todo.userId == likes.userId);
                                        if (index !== -1) {
                                            likes["userId"] = data1.commentLikeUserList[index].userId;
                                            let commentLikeLastName = data1.commentLikeUserList[index].lastName ? data1.commentLikeUserList[index].lastName : '';
                                            likes["name"] = data1.commentLikeUserList[index].firstName + " " + commentLikeLastName;
                                            likes["profilePicture"] = data1.commentLikeUserList[index].profilePicture;
                                            likes["title"] = data1.commentLikeUserList[index].title;
                                            likes["roleId"] = data1.commentLikeUserList[index].roleId;
                                        }
                                        return likes;
                                    });
                                    return comment;
                                });

                                data1.likes = data1.likes && data1.likes.map(function (likes) {

                                    if (likes.userId !== parseInt(query.userId)) {
                                        let indexId = conRec.result && conRec.result.findIndex(conResult => likes.userId == conResult.userId || likes.userId == conResult.partnerId);

                                        if (indexId !== -1) {
                                            likes['status'] = conRec.result[indexId].status == CONSTANTS.CONNECTION.REQUESTED ? CONSTANTS.CONNECTION_STATUS.REQUESTED :
                                                CONSTANTS.CONNECTION_STATUS.ACCEPTED;
                                            likes['statusValue'] = conRec.result[indexId].status == CONSTANTS.CONNECTION.REQUESTED ? CONSTANTS.CONNECTION.REQUESTED :
                                                CONSTANTS.CONNECTION.ACCEPTED;
                                        } else {
                                            likes['status'] = CONSTANTS.CONNECTION_STATUS.NO_CONNECTION;
                                            likes['statusValue'] = CONSTANTS.CONNECTION.NO_CONNECTION;
                                        }
                                    } else {
                                        likes['status'] = '';
                                        likes['statusValue'] = '';
                                    }


                                    let index = data1.Onlylikes.findIndex(todo => todo.userId == likes.userId);
                                    if (index !== -1) {
                                        likes["userId"] = data1.Onlylikes[index].userId;
                                        let likeLastName = data1.Onlylikes[index].lastName ? data1.Onlylikes[index].lastName : '';
                                        likes["name"] = data1.Onlylikes[index].firstName + " " + likeLastName;
                                        likes["profilePicture"] = data1.Onlylikes[index].profilePicture;
                                        likes["title"] = data1.Onlylikes[index].title;
                                        likes["roleId"] = data1.Onlylikes[index].roleId;
                                    }
                                    return likes;
                                });
                                data1.tags = data1.tags && data1.tags.map(function (tag) {
                                    let index = data1.tagsUserList.findIndex(todo => todo.userId == tag.userId);
                                    if (index !== -1) {
                                        tag["userId"] = data1.tagsUserList[index].userId;
                                        let tagLastName = data1.tagsUserList[index].lastName ? data1.tagsUserList[index].lastName : '';
                                        tag["name"] = data1.tagsUserList[index].firstName + " " + tagLastName;
                                        tag["profilePicture"] = data1.tagsUserList[index].profilePicture;
                                        tag["title"] = data1.tagsUserList[index].title;
                                        tag["roleId"] = data1.tagsUserList[index].roleId;
                                    }
                                    return tag;
                                });

                                data1.post.tags = data1.post && data1.post.tags && data1.post.tags.map(function (tag) {
                                    let index = data1.postTaggedUsers.findIndex(todo => todo.userId == tag.userId);
                                    if (index !== -1) {
                                        tag["userId"] = data1.postTaggedUsers[index].userId;
                                        let tagLastName = data1.postTaggedUsers[index].lastName ? data1.postTaggedUsers[index].lastName : '';
                                        tag["name"] = data1.postTaggedUsers[index].firstName + " " + tagLastName;
                                        tag["profilePicture"] = data1.postTaggedUsers[index].profilePicture;
                                        tag["title"] = data1.postTaggedUsers[index].title;
                                        tag["roleId"] = data1.postTaggedUsers[index].roleId;
                                    }
                                    return tag;
                                });
                               
                                if (data1.postOpportunity && data1.postOpportunity[0] && data1.postOpportunity[0].opportunityId) {
                                    data1['isOpportunity'] = true;
                                } else {
                                    data1['isOpportunity'] = false;
                                }

                                data1.commentUserList = undefined;
                                data1.commentLikeUserList = undefined;
                                data1.Onlylikes = undefined;
                                data1.tagsUserList = undefined;
                                data1.postTaggedUsers = undefined;
                                data1.reportedBy = undefined;
                                data1.hideBy = undefined;
                            });
                            callback({
                                status: REQUEST_CODES.SUCCESS,
                                result: data
                            });
                        }
                    })
                })
            })
        })
    })
}



function postListByAdmin(query, callback) {
    users.getList({ userId: parseInt(query.userId) }, function (res) {
        if (!res.result[0].isActive) {
            callback({
                status: REQUEST_CODES.SUCCESS,
                message: 'Your profile is inactive.',
                result: []
            });
        }
    })

    let skip = parseInt(query.skip, 10) || 0;

    FeedModel.aggregate([
        {
            $match: {
                postedBy: parseInt(query.userId)
            }
        },

        { "$sort": { "lastActivityTime": -1 } }, // Latest first
        { "$skip": skip * 10 },
        { "$limit": 10 },
        {
            $lookup: {
                from: "users",
                localField: "postedBy",
                foreignField: "userId",
                as: "user"
            }
        },
        {
            $unwind: "$user"
        },
        {
            $lookup: {
                from: "users",
                localField: "likes.userId",
                foreignField: "userId",
                as: "like"
            }
        },
        {
            $unwind: { "path": "$like", "preserveNullAndEmptyArrays": true }
        },
        {
            $lookup: {
                from: "users",
                localField: "comments.commentedBy",
                foreignField: "userId",
                as: "commentUserList"
            }
        },
        {
            $unwind: { "path": "$commentUserList", "preserveNullAndEmptyArrays": true }
        },
        {
            $lookup: {
                from: "users",
                localField: "comments.likes.userId",
                foreignField: "userId",
                as: "commentLikeUserList"
            }
        },
        {
            $unwind: { "path": "$commentLikeUserList", "preserveNullAndEmptyArrays": true }
        },

        {
            $lookup: {
                from: "users",
                localField: "postOwner",
                foreignField: "userId",
                as: "postOwn"
            }
        },
        {
            $unwind: { "path": "$postOwn", "preserveNullAndEmptyArrays": true }
        },
        {
            $lookup: {
                from: "users",
                localField: "tags.userId",
                foreignField: "userId",
                as: "taggedUsers"
            }
        },
        {
            $unwind: { "path": "$taggedUsers", "preserveNullAndEmptyArrays": true }
        },
        {
            $lookup: {
                from: "users",
                localField: "post.tags.userId",
                foreignField: "userId",
                as: "postTaggedUsers"
            }
        },
        {
            $unwind: { "path": "$postTaggedUsers", "preserveNullAndEmptyArrays": true }
        },
        {
            "$group": {
                "_id": {
                    _id: "$_id",
                    feedId: "$feedId",
                    post: "$post",
                    postedBy: "$postedBy",
                    dateTime: "$dateTime",
                    visibility: "$visibility",
                    comments: "$comments",
                    likes: "$likes",
                    tags: "$tags",
                    scope: "$scope",
                    postOwnerDeleted: "$postOwnerDeleted",
                    firstName: "$user.firstName",
                    lastName: "$user.lastName",
                    roleId: "$user.roleId",
                    email: "$user.email",
                    profilePicture: "$user.profilePicture",
                    title: "$user.title",
                    postOwner: "$postOwn.userId",
                    postOwnerFirstName: "$postOwn.firstName",
                    postOwnerLastName: "$postOwn.lastName",
                    postOwnerTitle: "$postOwn.title",
                    postOwnerProfilePicture: "$postOwn.profilePicture",
                    postOwnerRoleId: "$postOwn.roleId",
                    reportedBy: "$reportedBy",
                    hideBy: "$hideBy",
                    metaTags: "$metaTags",
                    shareText: "$shareText",
                    shareTime: "$shareTime",
                    tagline: "$user.tagline",
                    lastActivityTime: "$lastActivityTime",
                    lastActivityType: "$lastActivityType",
                    interest: "$interest",
                    numberOfClick: "$numberOfClick"
                },
                "Onlylikes": {
                    "$push": {
                        "userId": "$like.userId",
                        "firstName": "$like.firstName",
                        "lastName": "$like.lastName",
                        "profilePicture": "$like.profilePicture",
                        "title": "$like.title",
                        "roleId": "$like.roleId"
                    }
                },
                "commentLikeUserList": {
                    "$push": {
                        "userId": "$commentLikeUserList.userId",
                        "firstName": "$commentLikeUserList.firstName",
                        "lastName": "$commentLikeUserList.lastName",
                        "profilePicture": "$commentLikeUserList.profilePicture",
                        "title": "$commentLikeUserList.title",
                        "roleId": "$commentLikeUserList.roleId"
                    }
                },
                "tagsUserList": {
                    "$push": {
                        "userId": "$taggedUsers.userId",
                        "firstName": "$taggedUsers.firstName",
                        "lastName": "$taggedUsers.lastName",
                        "profilePicture": "$taggedUsers.profilePicture",
                        "title": "$taggedUsers.title",
                        "roleId": "$taggedUsers.roleId"
                    }
                },
                "postTaggedUsers": {
                    "$push": {
                        "userId": "$postTaggedUsers.userId",
                        "firstName": "$postTaggedUsers.firstName",
                        "lastName": "$postTaggedUsers.lastName",
                        "profilePicture": "$postTaggedUsers.profilePicture",
                        "title": "$postTaggedUsers.title",
                        "roleId": "$postTaggedUsers.roleId"
                    }
                },
                commentUserList: {
                    "$push": {
                        "userId": "$commentUserList.userId",
                        "firstName": "$commentUserList.firstName",
                        "lastName": "$commentUserList.lastName",
                        "profilePicture": "$commentUserList.profilePicture",
                        "title": "$commentUserList.title",
                        "roleId": "$commentUserList.roleId"
                    }
                },
            },
        },
        {
            $sort: { "_id.dateTime": -1 }
        },
        {
            $project: {
                _id: "$_id._id",
                feedId: "$_id.feedId",
                post: "$_id.post",
                postedBy: "$_id.postedBy",
                dateTime: "$_id.dateTime",
                visibility: "$_id.visibility",
                comments: "$_id.comments",
                likes: "$_id.likes",
                tags: "$_id.tags",
                scope: "$_id.scope",
                firstName: "$_id.firstName",
                lastName: "$_id.lastName",
                roleId: "$_id.roleId",
                email: "$_id.email",
                profilePicture: "$_id.profilePicture",
                title: "$_id.title",
                tagline: "$_id.tagline",
                postOwner: "$_id.postOwner",
                postOwnerDeleted: "$_id.postOwnerDeleted",
                postOwnerFirstName: "$_id.postOwnerFirstName",
                postOwnerLastName: "$_id.postOwnerLastName",
                postOwnerTitle: "$_id.postOwnerTitle",
                postOwnerProfilePicture: "$_id.postOwnerProfilePicture",
                postOwnerRoleId: "$_id.postOwnerRoleId",
                reportedBy: "$_id.reportedBy",
                hideBy: "$_id.hideBy",
                metaTags: "$_id.metaTags",
                shareText: "$_id.shareText",
                shareTime: "$_id.shareTime",
                lastActivityTime: "$_id.lastActivityTime",
                lastActivityType: "$_id.lastActivityType",
                interest: "$_id.interest",
                numberOfClick: "$_id.numberOfClick",
                commentUserList: 1,
                commentLikeUserList: 1,
                Onlylikes: 1,
                tagsUserList: 1,
                postTaggedUsers: 1
            }
        }
    ]).exec(function (error, data) {
        if (error) {
            callback({
                status: REQUEST_CODES.FAIL,
                message: error
            });
        } else {
            data.forEach(function (data1) {
                if (data1.reportedBy) {
                    let reportIndex = data1.reportedBy && data1.reportedBy.findIndex(todo => todo == parseInt(query.userId));
                    if (reportIndex !== -1) {
                        data1['isReported'] = true;
                    } else {
                        data1['isReported'] = false;
                    }
                } else {
                    data1['isReported'] = false;
                }

                if (data1.hideBy) {
                    let hideIndex = data1.hideBy && data1.hideBy.findIndex(todo => todo == parseInt(query.userId));
                    if (hideIndex !== -1) {
                        data1['isHide'] = true;
                    } else {
                        data1['isHide'] = false;
                    }
                } else {
                    data1['isHide'] = false;
                }

                data1.comments = data1.comments && data1.comments.map(function (comment) {
                    let index = data1.commentUserList.findIndex(todo => todo.userId == comment.commentedBy);
                    if (index !== -1) {
                        comment["userId"] = data1.commentUserList[index].userId;
                        let commentLastName = data1.commentUserList[index].lastName ? data1.commentUserList[index].lastName : '';
                        comment["name"] = data1.commentUserList[index].firstName + " " + commentLastName;
                        comment["profilePicture"] = data1.commentUserList[index].profilePicture;
                        comment["title"] = data1.commentUserList[index].title;
                        comment["roleId"] = data1.commentUserList[index].roleId;
                    }
                    comment.likes = comment.likes.map(function (likes) {

                        let index = data1.commentLikeUserList.findIndex(todo => todo.userId == likes.userId);
                        if (index !== -1) {
                            likes["userId"] = data1.commentLikeUserList[index].userId;
                            let commentLikeLastName = data1.commentLikeUserList[index].lastName ? data1.commentLikeUserList[index].lastName : '';
                            likes["name"] = data1.commentLikeUserList[index].firstName + " " + commentLikeLastName;
                            likes["profilePicture"] = data1.commentLikeUserList[index].profilePicture;
                            likes["title"] = data1.commentLikeUserList[index].title;
                            likes["roleId"] = data1.commentLikeUserList[index].roleId;
                        }
                        return likes;
                    });
                    return comment;
                });

                data1.likes = data1.likes && data1.likes.map(function (likes) {

                    if (likes.userId !== parseInt(query.userId)) {
                        likes['status'] = CONSTANTS.CONNECTION_STATUS.ACCEPTED;
                        likes['statusValue'] = CONSTANTS.CONNECTION.ACCEPTED;
                    } else {
                        likes['status'] = '';
                        likes['statusValue'] = '';
                    }


                    let index = data1.Onlylikes.findIndex(todo => todo.userId == likes.userId);
                    if (index !== -1) {
                        likes["userId"] = data1.Onlylikes[index].userId;
                        let likeLastName = data1.Onlylikes[index].lastName ? data1.Onlylikes[index].lastName : '';
                        likes["name"] = data1.Onlylikes[index].firstName + " " + likeLastName;
                        likes["profilePicture"] = data1.Onlylikes[index].profilePicture;
                        likes["title"] = data1.Onlylikes[index].title;
                        likes["roleId"] = data1.Onlylikes[index].roleId;
                    }

                    return likes;
                });
                data1.tags = data1.tags && data1.tags.map(function (tag) {
                    let index = data1.tagsUserList.findIndex(todo => todo.userId == tag.userId);
                    if (index !== -1) {
                        tag["userId"] = data1.tagsUserList[index].userId;
                        let tagLastName = data1.tagsUserList[index].lastName ? data1.tagsUserList[index].lastName : '';
                        tag["name"] = data1.tagsUserList[index].firstName + " " + tagLastName;
                        tag["profilePicture"] = data1.tagsUserList[index].profilePicture;
                        tag["title"] = data1.tagsUserList[index].title;
                        tag["roleId"] = data1.tagsUserList[index].roleId;
                    }
                    return tag;
                });

                data1.post.tags = data1.post && data1.post.tags && data1.post.tags.map(function (tag) {
                    let index = data1.postTaggedUsers.findIndex(todo => todo.userId == tag.userId);
                    if (index !== -1) {
                        tag["userId"] = data1.postTaggedUsers[index].userId;
                        let tagLastName = data1.postTaggedUsers[index].lastName ? data1.postTaggedUsers[index].lastName : '';
                        tag["name"] = data1.postTaggedUsers[index].firstName + " " + tagLastName;
                        tag["profilePicture"] = data1.postTaggedUsers[index].profilePicture;
                        tag["title"] = data1.postTaggedUsers[index].title;
                        tag["roleId"] = data1.postTaggedUsers[index].roleId;
                    }
                    return tag;
                });

                data1.commentUserList = undefined;
                data1.commentLikeUserList = undefined;
                data1.Onlylikes = undefined;
                data1.tagsUserList = undefined;
                data1.postTaggedUsers = undefined;
                data1.reportedBy = undefined;
                data1.hideBy = undefined;
            });
            callback({
                status: REQUEST_CODES.SUCCESS,
                result: data
            });
        }
    })
}

function postListByGroupId(query, callback) {
    let skip = parseInt(query.skip, 10) || 0;
    FeedModel.aggregate([
        {
            $match: {
                $and: [{ groupId: parseInt(query.groupId, 10) },
                { hideBy: { $nin: [parseInt(query.userId)] } }]
            }
        },       
        {
            $lookup: {
                from: "users",
                localField: "postedBy",
                foreignField: "userId",
                as: "user"
            }
        },
        {
            $unwind: "$user"
        },
        {
            $lookup: {
                from: "users",
                localField: "likes.userId",
                foreignField: "userId",
                as: "like"
            }
        },
        {
            $unwind: { "path": "$like", "preserveNullAndEmptyArrays": true }
        },
        {
            $lookup: {
                from: "users",
                localField: "comments.commentedBy",
                foreignField: "userId",
                as: "commentUserList"
            }
        },
        {
            $unwind: { "path": "$commentUserList", "preserveNullAndEmptyArrays": true }
        },
        {
            $lookup: {
                from: "users",
                localField: "comments.likes.userId",
                foreignField: "userId",
                as: "commentLikeUserList"
            }
        },
        {
            $unwind: { "path": "$commentLikeUserList", "preserveNullAndEmptyArrays": true }
        },

        {
            $lookup: {
                from: "users",
                localField: "postOwner",
                foreignField: "userId",
                as: "postOwn"
            }
        },
        {
            $unwind: { "path": "$postOwn", "preserveNullAndEmptyArrays": true }
        },
        {
            $lookup: {
                from: "users",
                localField: "tags.userId",
                foreignField: "userId",
                as: "taggedUsers"
            }
        },
        {
            $unwind: { "path": "$taggedUsers", "preserveNullAndEmptyArrays": true }
        },
        {
            $lookup: {
                from: 'opportunity',
                as: 'opportunity',
                let: { opportunityId: '$opportunityId' },
                pipeline: [
                    {
                        $match: {                      
                         "group":{$in : [parseInt(query.groupId)]}
                        }
                    }
                ],
            }
        },
        {
            $unwind: { "path": "$opportunity", "preserveNullAndEmptyArrays": true }
        },
        {
            $lookup: {
                from: 'company',
                as: 'company',
                let: { companyId: '$opportunity.companyId' },
                pipeline: [
                    {
                        $match: {
                            $expr: {

                                $eq: ['$companyId', '$$companyId']


                            }
                        }
                    }
                ],
            }
        },
        {
            $unwind: { "path": "$company", "preserveNullAndEmptyArrays": true }
        },
        { "$sort": { "lastActivityTime": -1 } }, // Latest first
        { "$skip": skip * 10 },
        { "$limit": 10 },
        {
            "$group": {
                "_id": {
                    _id: "$_id",
                    feedId: "$feedId",
                    post: "$post",
                    postedBy: "$postedBy",
                    dateTime: "$dateTime",
                    visibility: "$visibility",
                    comments: "$comments",
                    likes: "$likes",
                    tags: "$tags",
                    scope: "$scope",
                    firstName: "$user.firstName",
                    lastName: "$user.lastName",
                    roleId: "$user.roleId",
                    email: "$user.email",
                    profilePicture: "$user.profilePicture",
                    title: "$user.title",
                    postOwner: "$postOwn.userId",
                    postOwnerFirstName: "$postOwn.firstName",
                    postOwnerLastName: "$postOwn.lastName",
                    postOwnerTitle: "$postOwn.title",
                    postOwnerProfilePicture: "$postOwn.profilePicture",
                    postOwnerRoleId: "$postOwn.roleId",
                    postOwnerDeleted: "$postOwnerDeleted",
                    reportedBy: "$reportedBy",
                    hideBy: "$hideBy",
                    shareText: "$shareText",
                    shareTime: "$shareTime",
                    tagline: "$user.tagline"
                },
                "Onlylikes": {
                    "$push": {
                        "userId": "$like.userId",
                        "firstName": "$like.firstName",
                        "lastName": "$like.lastName",
                        "profilePicture": "$like.profilePicture",
                        "title": "$like.title",
                        "roleId": "$like.roleId"
                    }
                },
                "commentLikeUserList": {
                    "$push": {
                        "userId": "$commentLikeUserList.userId",
                        "firstName": "$commentLikeUserList.firstName",
                        "lastName": "$commentLikeUserList.lastName",
                        "profilePicture": "$commentLikeUserList.profilePicture",
                        "title": "$commentLikeUserList.title",
                        "roleId": "$commentLikeUserList.roleId"
                    }
                },
                "tagsUserList": {
                    "$push": {
                        "userId": "$taggedUsers.userId",
                        "firstName": "$taggedUsers.firstName",
                        "lastName": "$taggedUsers.lastName",
                        "profilePicture": "$taggedUsers.profilePicture",
                        "title": "$taggedUsers.title",
                        "roleId": "$taggedUsers.roleId"
                    }
                },
                commentUserList: {
                    "$push": {
                        "userId": "$commentUserList.userId",
                        "firstName": "$commentUserList.firstName",
                        "lastName": "$commentUserList.lastName",
                        "profilePicture": "$commentUserList.profilePicture",
                        "title": "$commentUserList.title",
                        "roleId": "$commentUserList.roleId"
                    }
                },
                "postOpportunity": {
                    "$push": {
                        "opportunityId": "$opportunity.opportunityId",
                        "userId": "$opportunity.userId",
                        "callToAction": "$opportunity.callToAction",
                        "roleId": "$opportunity.roleId",
                        "jobTitle": "$opportunity.jobTitle",
                        "jobType": "$opportunity.jobType",
                        "jobLocation": "$opportunity.jobLocation",
                        "project": "$opportunity.project",
                        "duration": "$opportunity.duration",
                        "status": "$opportunity.status",
                        "asset": "$opportunity.asset",
                        "fromDate": "$opportunity.fromDate",
                        "toDate": "$opportunity.toDate",
                        "groupId": "$opportunity.groupId",
                        "targetAudience": "$opportunity.targetAudience",
                        "title": "$opportunity.title",
                        "location": "$opportunity.location",
                        "gender": "$opportunity.gender",
                        "age": "$opportunity.age",
                        "interestType": "$opportunity.interestType",
                        "interests": "$opportunity.interests",
                        "companyId": "$opportunity.companyId",
                        "offerId": "$opportunity.offerId",
                        "serviceTitle": "$opportunity.serviceTitle",
                        "serviceDesc": "$opportunity.serviceDesc",
                        "expiresOn": "$opportunity.expiresOn",
                        "withdraw": "$opportunity.withdraw",
                        "companyName": "$company.name",
                        "profilePicture": "$company.profilePicture",
                        "coverPicture": "$company.coverPicture"
                    }
                },
            },
        },
        {
            $sort: { "_id.dateTime": -1 }
        },
        {
            $project: {
                _id: "$_id._id",
                feedId: "$_id.feedId",
                post: "$_id.post",
                postedBy: "$_id.postedBy",
                dateTime: "$_id.dateTime",
                visibility: "$_id.visibility",
                comments: "$_id.comments",
                likes: "$_id.likes",
                tags: "$_id.tags",
                scope: "$_id.scope",
                firstName: "$_id.firstName",
                lastName: "$_id.lastName",
                roleId: "$_id.roleId",
                email: "$_id.email",
                profilePicture: "$_id.profilePicture",
                title: "$_id.title",
                tagline: "$_id.tagline",
                postOwner: "$_id.postOwner",
                postOwnerFirstName: "$_id.postOwnerFirstName",
                postOwnerLastName: "$_id.postOwnerLastName",
                postOwnerTitle: "$_id.postOwnerTitle",
                postOwnerProfilePicture: "$_id.postOwnerProfilePicture",
                postOwnerRoleId: "$_id.postOwnerRoleId",
                postOwnerDeleted: "$_id.postOwnerDeleted",
                reportedBy: "$_id.reportedBy",
                hideBy: "$_id.hideBy",
                shareText: "$_id.shareText",
                shareTime: "$_id.shareTime",
                commentUserList: 1,
                commentLikeUserList: 1,
                Onlylikes: 1,
                tagsUserList: 1,
                "postOpportunity":1
            }
        }
    ]).exec(function (error, data) {
        if (error) {
            callback({
                status: REQUEST_CODES.FAIL,
                message: error
            });
        } else {
            data.forEach(function (data1) {
                if (data1.reportedBy) {
                    let reportIndex = data1.reportedBy && data1.reportedBy.findIndex(todo => todo == parseInt(query.userId));
                    if (reportIndex !== -1) {
                        data1['isReported'] = true;
                    } else {
                        data1['isReported'] = false;
                    }
                } else {
                    data1['isReported'] = false;
                }

                if (data1.hideBy) {
                    let hideIndex = data1.hideBy && data1.hideBy.findIndex(todo => todo == parseInt(query.userId));
                    if (hideIndex !== -1) {
                        data1['isHide'] = true;
                    } else {
                        data1['isHide'] = false;
                    }
                } else {
                    data1['isHide'] = false;
                }

                data1.comments = data1.comments && data1.comments.map(function (comment) {
                    let index = data1.commentUserList.findIndex(todo => todo.userId == comment.commentedBy);
                    comment["userId"] = data1.commentUserList[index].userId;
                    let commentLastName = data1.commentUserList[index].lastName ? data1.commentUserList[index].lastName : '';
                    comment["name"] = data1.commentUserList[index].firstName + " " + commentLastName;
                    comment["profilePicture"] = data1.commentUserList[index].profilePicture;
                    comment["title"] = data1.commentUserList[index].title;
                    comment["roleId"] = data1.commentUserList[index].roleId;

                    comment.likes = comment.likes.map(function (likes) {
                        let index = data1.commentLikeUserList.findIndex(todo => todo.userId == likes.userId);
                        likes["userId"] = data1.commentLikeUserList[index].userId;
                        let commentLikeLastName = data1.commentLikeUserList[index].lastName ? data1.commentLikeUserList[index].lastName : '';
                        likes["name"] = data1.commentLikeUserList[index].firstName + " " + commentLikeLastName;
                        likes["profilePicture"] = data1.commentLikeUserList[index].profilePicture;
                        likes["title"] = data1.commentLikeUserList[index].title;
                        likes["roleId"] = data1.commentLikeUserList[index].roleId;
                        return likes;
                    });
                    return comment;
                });

                data1.likes = data1.likes && data1.likes.map(function (likes) {
                    let index = data1.Onlylikes.findIndex(todo => todo.userId == likes.userId);
                    likes["userId"] = data1.Onlylikes[index].userId;
                    let likeLastName = data1.Onlylikes[index].lastName ? data1.Onlylikes[index].lastName : '';
                    likes["name"] = data1.Onlylikes[index].firstName + " " + likeLastName;
                    likes["profilePicture"] = data1.Onlylikes[index].profilePicture;
                    likes["title"] = data1.Onlylikes[index].title;
                    likes["roleId"] = data1.Onlylikes[index].roleId;
                    return likes;
                });
                data1.tags = data1.tags && data1.tags.map(function (tag) {
                    let index = data1.tagsUserList.findIndex(todo => todo.userId == tag.userId);
                    tag["userId"] = data1.tagsUserList[index].userId;
                    let tagLastName = data1.tagsUserList[index].lastName ? data1.tagsUserList[index].lastName : '';
                    tag["name"] = data1.tagsUserList[index].firstName + " " + tagLastName;
                    tag["profilePicture"] = data1.tagsUserList[index].profilePicture;
                    tag["title"] = data1.tagsUserList[index].title;
                    tag["roleId"] = data1.tagsUserList[index].roleId;
                    return tag;
                });

                 
                if (data1.postOpportunity && data1.postOpportunity[0] && data1.postOpportunity[0].opportunityId) {
                    data1['isOpportunity'] = true;
                } else {
                    data1['isOpportunity'] = false;
                }

                data1.commentUserList = undefined;
                data1.commentLikeUserList = undefined;
                data1.Onlylikes = undefined;
                data1.tagsUserList = undefined;
                data1.reportedBy = undefined;
                data1.hideBy = undefined;
            });
            callback({
                status: REQUEST_CODES.SUCCESS,
                result: data
            });
        }
    })
}


function addComment(data, callback) {
    var comment = {
        commentId: uuid(),
        comment: data.comment,
        commentedBy: data.userId,
        commentRoleId: data.roleId,
        dateTime: data.dateTime,
        likes: new Array(),
        profilePicture: data.profilePicture,
        name: data.name,
        title: data.title
    };
    getList({ feedId: data.feedId }, function (res) {
        if (res.result.length > 0) {
            var feed = res.result[0]
            feed.comments.push(comment)
            if (data.lastActivityTime) {
                feed.lastActivityTime = data.lastActivityTime;
            }
            if (data.lastActivityType) {
                feed.lastActivityType = data.lastActivityType;
            }
            update(feed, function (resp) {
                if (resp.status == REQUEST_CODES.SUCCESS) {
                    callback({
                        status: REQUEST_CODES.SUCCESS,
                        result: { commentId: comment.commentId }
                    });
                    return;
                } else {
                    return resp;
                }
            });
        } else {
            callback({
                status: REQUEST_CODES.FAIL,
                message: REQUEST_CODES.FAIL_MSG
            });
            return;
        }
    });
}

function removeComment(data, callback) {
    getList({ feedId: data.feedId }, function (res) {
        if (res.result.length > 0) {
            var feed = res.result[0];
            feed.comments = _.filter(feed.comments, function (obj) { return obj.commentId != data.commentId });
            update(feed, function (resp) {
                if (resp.status == REQUEST_CODES.SUCCESS) {
                    callback({
                        status: REQUEST_CODES.SUCCESS
                    });
                    return;
                } else {
                    return resp;
                }
            });
        } else {
            callback({
                status: REQUEST_CODES.FAIL,
                message: REQUEST_CODES.FAIL_MSG
            });
            return;
        }
    });
}

function addLike(data, callback) {
    var like = {
        userId: data.userId,
        roleId: data.roleId ? data.roleId : null,
        dateTime: utils.getSystemTime()
    };

    getList({ feedId: data.feedId }, function (res) {

        if (res.result.length > 0) {
            var feed = res.result[0]
            if (data.commentId) {
                _.map(feed.comments, function (comment) {
                    if (comment.commentId == data.commentId) {
                        if (data.isLike) {
                            comment.likes.push(like);
                            comment.likes = _.uniq(comment.likes, JSON.stringify)
                            return comment.likes;
                        } else {
                            return comment.likes = _.filter(comment.likes, function (obj) { return obj.userId != data.userId });
                        }
                    }
                })
            } else {
                if (data.isLike) {
                    feed.likes.push(like)
                    feed.likes = _.uniq(feed.likes, JSON.stringify);
                } else {
                    feed.likes = _.filter(feed.likes, function (obj) { return obj.userId != data.userId });
                }

            }
            if (data.lastActivityTime) {
                feed.lastActivityTime = data.lastActivityTime;
            }
            if (data.lastActivityType) {
                feed.lastActivityType = data.lastActivityType;
            }
            update(feed, function (resp) {
                if (resp.status == REQUEST_CODES.SUCCESS) {
                    callback({
                        status: REQUEST_CODES.SUCCESS
                    });
                    return;
                } else {
                    return resp;
                }
            });
        } else {
            callback({
                status: REQUEST_CODES.FAIL,
                message: REQUEST_CODES.FAIL_MSG
            });
            return;
        }
    });
}

function updatePost(data, callback) {
    getList({ feedId: data.feedId }, function (res) {
        if (res.result.length > 0) {
            var feed = res.result[0];
            if (data.visibility) {
                feed.visibility = data.visibility;
            }
            if (data.scope) {
                feed.scope = data.scope;
            }
            if (data.lastActivityTime) {
                feed.lastActivityTime = data.lastActivityTime;
            }
            if (data.lastActivityType) {
                feed.lastActivityType = data.lastActivityType;
            }
            update(feed, callback);
        } else {
            callback({
                status: REQUEST_CODES.FAIL,
                message: 'Feed not found'
            });
            return;
        }
    });
}

function update(feed, callback) {
    FeedModel.update({ 'feedId': feed.feedId }, { $set: feed }, function (error) {
        if (error) {
            callback({
                status: REQUEST_CODES.FAIL,
                message: error
            });
            return;
        } else {
            callback({
                status: REQUEST_CODES.SUCCESS,
                message: utils.formatText(FEED_CODES.UPDATE_SUCCESS),
            });
            return;
        }
    });
}

function numberOfClickUpdate(query, callback) {
    if (query.feedId) {
        getList({ feedId: query.feedId }, function (resp) {
            var feed = resp.result[0];
            feed.numberOfClick = parseInt(feed.numberOfClick) + 1;
            FeedModel.update({ 'feedId': feed.feedId }, { $set: feed }, function (error) {
                if (error) {
                    callback({
                        status: REQUEST_CODES.FAIL,
                        message: error
                    });
                    return;
                } else {
                    callback({
                        status: REQUEST_CODES.SUCCESS,
                        message: utils.formatText(FEED_CODES.UPDATE_SUCCESS),
                    });
                    return;
                }
            });
        })
    }
}

function getMutualFriends(query, callback) {
    let resQuery = [];
    console.log(query);
    console.log(query.roleId);
    let roleId = query.roleId ? parseInt(query.roleId) : null;
    console.log(roleId);
    if (roleId) {
        resQuery =
            [{
                $or: [{
                    $and: [{ userId: parseInt(query.userId) }, {
                        $or: [{ userRoleId: roleId },
                        { userRoleId: { $exists: false } }]
                    }
                    ]
                },
                {
                    $and: [{ partnerId: parseInt(query.userId) }, {
                        $or: [{ partnerRoleId: roleId },
                        { partnerRoleId: { $exists: false } }]
                    }
                    ]
                }]
            }];
    } else {
        resQuery =
            [{
                $or: [{ userId: parseInt(query.userId) },
                { partnerId: parseInt(query.userId) }]
            }];
    }

    connection.getList(resQuery[0], function (conRec) {
        let connectedUserId = [];

        conRec.result && conRec.result.forEach(function (data) {
            connectedUserId.push(parseInt(data['userId'], 10) === parseInt(query.userId) ?
                data['partnerId']
                :
                data['userId']
            );
        });
        console.log(query);
        connection.getList({ $and: [{ $or: [{ userId: { $in: connectedUserId } }, { partnerId: { $in: connectedUserId } }] }, { status: { $eq: 'Accepted' } }] }, function (result1) {
            console.log(query);
            let mutualUserId = [];
            result1.result && result1.result.forEach(function (data) {

                if (mutualUserId.indexOf(data['partnerId']) <= -1 && mutualUserId.indexOf(data['userId']) <= -1
                    && parseInt(data['partnerId'], 10) !== parseInt(query.userId) &&
                    parseInt(data['userId'], 10) !== parseInt(query.userId)
                ) {
                    let adduser = connectedUserId.indexOf(parseInt(data['userId'])) <= -1 ?
                        data['userId'] : connectedUserId.indexOf(parseInt(data['partnerId'])) <= -1 ?
                            data['partnerId'] : "addUser";
                    if (adduser !== "addUser")
                        mutualUserId.push(connectedUserId.indexOf(parseInt(data['userId'])) <= -1 ?
                            data['userId'] : data['partnerId']);
                }
            });

            connection.getMutualFriendList(mutualUserId, function (res) {
                console.log(res);
                callback({
                    status: REQUEST_CODES.SUCCESS,
                    result: res
                });
            });
        })
    })
}

function sharePost(data, callback) {
    if (data.feedId) {
        getList({ feedId: data.feedId }, function (resp) {
            if (resp.result.length > 0) {
                var feed = resp.result[0];
                feed.postOwner = feed.postOwner ? feed.postOwner : feed.postedBy;
                feed.postOwnerRoleId = feed.postOwnerRoleId ? feed.postOwnerRoleId : feed.postOwnerRoleId;
                feed.postOwnerFeedId = feed.postOwnerFeedId ? feed.postOwnerFeedId : data.feedId;
                feed.postedBy = data.postedBy;
                feed.roleId = data.roleId;
                feed.visibility = data.visibility;
                feed.scope = data.scope;
                feed.opportunity = feed.opportunityId ? feed.opportunityId : 0;
                feed.shareText = data.shareText;
                feed.shareTime = feed.dateTime;
                feed.dateTime = data.shareTime;
                feed.isActive = true;
                feed.postOwnerDeleted = false;
                feed.lastActivityTime = data.lastActivityTime;
                feed.lastActivityType = data.lastActivityType;
                if (feed.tags.length > 0)
                    feed.post['tags'] = feed.tags;
                if (feed.tags.length > 0)
                    feed.tags = feed.tags;
                feed = _.omit(feed, 'comments', 'likes', 'feedId');
                create(feed, callback);
            } else {
                callback({
                    status: REQUEST_CODES.FAIL,
                    message: 'Post/Feed not found',
                });
                return;
            }
        });
    } else {
        callback({
            status: REQUEST_CODES.FAIL,
            message: 'FeedId cannnot be blank',
        });
        return;
    }
}

function remove(query, callback) {
    FeedModel.remove(query, function (error) {
        if (error) {
            callback({
                status: REQUEST_CODES.FAIL,
                error: error
            });
            return;
        } else {
            callback({
                status: REQUEST_CODES.SUCCESS,
                message: FEED_CODES.DELETE_SUCCESS
            });
            return;
        }
    });
}

function removeFeedAndSharedFeed(query, callback) {
    FeedModel.remove(query, function (error) {
        if (error) {
            callback({
                status: REQUEST_CODES.FAIL,
                error: error
            });
            return;
        } else {
            let removeQuery = {
                postOwnerFeedId: parseInt(query.feedId),
                postOwnerDeleted: false
            };
            FeedModel.update(removeQuery, { $set: { postOwnerDeleted: true } }, function (error) {
                if (error) {
                    callback({
                        status: REQUEST_CODES.FAIL,
                        message: error
                    });
                    return;
                } else {
                    callback({
                        status: REQUEST_CODES.SUCCESS,
                        message: FEED_CODES.DELETE_SUCCESS
                    });
                    return;
                }
            });
        }
    });
}

function removeFeedWithOpportunity(query, callback) {
    getList(query, function (feed) {

        FeedModel.remove(query, function (error) {
            if (error) {
                callback({
                    status: REQUEST_CODES.FAIL,
                    error: error
                });
                return;
            } else {
                OpportunityModel.remove({ 'opportunityId': feed.result[0].opportunityId }, function (error) {
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
        });
        callback({
            status: REQUEST_CODES.SUCCESS,
            message: FEED_CODES.DELETE_SUCCESS
        });
        return;
    });
}


function getMetaData(data, callback) {
    urlMetadata(data.url).then(
        function (metadata) { // success handler
            callback({
                status: REQUEST_CODES.SUCCESS,
                message: FEED_CODES.DELETE_SUCCESS,
                result: metadata
            });
            return;
        },
        function (error) { // failure handler
            callback({
                status: REQUEST_CODES.FAIL,
                message: error
            });
            return;
        })
}

module.exports.getList = getList;
module.exports.create = create;
module.exports.remove = remove;
module.exports.update = update;
module.exports.adminDashboard = adminDashboard;

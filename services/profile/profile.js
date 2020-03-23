module.exports = function (app) {
  app.post('/ui/add/parent', function (req, res) {
    //parent adding parent
    try {
      addParent(req.body, function (response) {
        res.json(response);
      });
    } catch (e) {
      res.json(e);
    }
  });
  app.put('/ui/personalInfo', function (req, res) {
    //To update personal Info
    try {
      updatePersonalInfo(req.body, function (response) {
        res.json(response);
      });
    } catch (e) {
      res.json(e);
    }
  });
  app.put('/ui/personalInfoByParent', function (req, res) {
    //To update personal Info
    try {
      updatePersonalInfoByParent(req.body, function (response) {
        res.json(response);
      });
    } catch (e) {
      res.json(e);
    }
  });
  app.get('/ui/personalInfo/:userId/:sendNotification', function (req, res) {
    //To get personal Info
    try {
      getPersonalInfo(req, function (response) {
        res.json(response);
      });
    } catch (e) {
      res.json(e);
    }
  });
  app.get('/ui/counts/:userId/:sharedId', function (req, res) {
    //To get personal Info
    try {
      getAllCounts(req.params, function (response) {
        res.json(response);
      });
    } catch (e) {
      res.json(e);
    }
  });
  app.get('/ui/skills/counts/:userId/:sharedId', function (req, res) {
    //To get personal Info
    try {
      getAllSkillCounts(req.params, function (response) {
        res.json(response);
      });
    } catch (e) {
      res.json(e);
    }
  });
  app.get('/ui/narratives/:userId', function (req, res) {
    //To get by level2
    try {
      getMyNarratives(req.params.userId, function (response) {
        res.json(response);
      });
    } catch (e) {
      res.json(e);
    }
  });
  app.get('/ui/search', function (req, res) {
    //To search on spikeview
    try {
      search(req, function (response) {
        res.json(response);
      });
    } catch (e) {
      res.json(e);
    }
  });
  app.get('/ui/search/reskin', function (req, res) {
    //To search on spikeview
    try {
      searchReskin(req, function (response) {
        res.json(response);
      });
    } catch (e) {
      res.json(e);
    }
  });
  app.get('/ui/search/reskinByStatus', function (req, res) {
    //To search on spikeview
    try {
      searchReskinByStatus(req, function (response) {
        res.json(response);
      });
    } catch (e) {
      res.json(e);
    }
  });  
  app.get('/ui/search/reskinAllUser', function (req, res) {
    //To search on spikeview
    try {
      searchReskinAllUser(req, function (response) {
        res.json(response);
      });
    } catch (e) {
      res.json(e);
    }
  });  
  app.get('/ui/search/notConnectedUser', function (req, res) {
    //To search on spikeview
    try {
      searchNotConnectedUser(req, function (response) {
        res.json(response);
      });
    } catch (e) {
      res.json(e);
    }
  });
  app.get('/ui/search/searchUsersForGroup', function (req, res) {
    //To search on spikeview
    try {
      searchUsersForGroup(req, function (response) {
        res.json(response);
      });
    } catch (e) {
      res.json(e);
    }
  });
  // Fetch RSS Feed
  app.get('/api/getFeeds/:interest/:count', function (req, res) {
    try {
      getRSSFeed(req, function (response) {
        res.json(response);
      });
    } catch (e) {
      res.json(e);
    }
  });
};

var User = require('../users/users');
var Group = require('../group/group');
var Skills = require('../masters/skills/skills');
var Recommendation = require('../recommendation/recommendation');
var Achievement = require('../achievement/achievement');
//var Feed = require('../feeds/feeds');
var SharedProfiles = require('../sharedProfiles/sharedProfiles');
var Competencies = require('../masters/competencyType/competencyType');
var Importance = require('../masters/importance/importance');
var Connection = require('../connection/connections');
var utils = require('../../commons/utils').utils;
var logger = require('../../logger.js');
const GoogleNewsRss = require('google-news-rss');
const googleNews = new GoogleNewsRss();
var CONSTANTS = utils.CONSTANTS;
var REQUEST_CODES = CONSTANTS.REQUEST_CODES;
var PROFILE_CODES = CONSTANTS.PROFILE;
var USER_CODES = CONSTANTS.USERS;
var login = require('../login/login');
var _ = require('underscore');
var mobileNotification = require('../pushNotification/fcm');
async = require('async');


// function adminDashboard(req,callback){
//   var adminRes = {likeCategory:''};
// User.getList({userId: parseInt(query.userId)},function(userRes){
//   if(userRes.result.length > 0){
//     let userData= userRes.result;
//     FeedModel.getList({ likes: { $all:[{userId:parseInt(query.userId)}] }},function(feedRes){
//       if(feedRes.result.length > 0){   
//         let arrayUser= [];          
//         let feedData= feedRes.result;
//         feedData.forEach(function(item){
//           arrayUser.push(item.postOwner ? item.postOwner : item.postedBy);
//         })
//         User.getList({userId: {$in : arrayUser}},function(userLikeRes){
//             let userLikeData= userLikeRes.result;
//             let likeCategoryArr= [];
//             feedData.forEach(function(item){
//               let likeJson={};
//               likeJson['actedBy']= userData.firstName + (userData.lastName ? userData.lastName:"");
//               let userLikeIndex = userLikeData.findIndex(todo => todo.userId == item.postOwner ? item.postOwner : item.postedBy);
//               if(userLikeIndex != -1){
//                   likeJson['actedOn']= userLikeData[userLikeIndex].firstName + (userLikeData[userLikeIndex].lastName ? userLikeData[userLikeIndex].lastName:"");
//               }
//               likeJson['profilePicture']= userData.profilePicture;
//               likeCategoryArr.push(likeJson);
//           })
//         })
//       }
//     }).skip(0).limit( 10 );
//   }  
// })  


//   FeedModel.aggregate([     
//     { 
//         $match:{ 
//             $and :[
//                 {
//                     $or : [ 
//                //    { visibility: 'Public' },
//                     { postedBy : { $in:followerId }, visibility:'Public' },                                
//                     { postedBy : { $in:connectionId}, visibility:{ $in:['AllConnections','Public']} },
//                     { postedBy : parseInt(query.userId), visibility:{ $in:['Private','Public']} },                                
//                     { $or:[{scope : { $all:[parseInt(query.userId)] }}, { postedBy : parseInt(query.userId)}], visibility: 'SelectedConnections'},
//                     { tags : { $all:[{userId:parseInt(query.userId)}] }}                                                                              
//                     ]
//                 },  
//                 { hideBy : { $nin:[parseInt(query.userId)]}},                   
//                 {
//                     groupId:null
//                 }                    
//             ]  
//         }    
//     },      

//         {"$sort": {"lastActivityTime": -1 } }, // Latest first
//         {"$skip": skip*10 },
//         {"$limit": 10 },

//         { 
//           $lookup: {
//               from: "feeds",
//               localField: "userId",
//               foreignField: "likes.userId",
//               as: "like"
//           }
//       },               
//       {
//           $unwind:{"path": "$likeFeed", "preserveNullAndEmptyArrays": true }
//       }, 

//          { 
//             $lookup: {
//                 from: "feeds",
//                 localField: "userId",
//                 foreignField: "postedBy",
//                 as: "like"
//             }
//         },               
//         {
//             $unwind:{"path": "$postedFeed", "preserveNullAndEmptyArrays": true }
//         },

//         { 
//           $lookup: {
//               from: "feeds",
//               localField: "userId",
//               foreignField: "comments.userId",
//               as: "like"
//           }
//       },               
//       {
//           $unwind:{"path": "$commentFeed", "preserveNullAndEmptyArrays": true }
//       }, 

//       {
//         $lookup: {
//             from: "connections",
//             localField: "userId",
//             foreignField: "userId",
//             as: "user"
//         }
//     },


// }

function search(req, callback) {
  var query = req.query;
  var groupQuery = {
    groupName: query.name
  };
  var userQuery = {
    firstName: query.name
  };
  var result = [];

  if (query.like) {
    var input = query.name.split(' ');
    if (input.length == 1) {
      userQuery = {
        $or: [{
          firstName: {
            $regex: input[0],
            $options: 'i'
          }
        },
        {
          lastName: {
            $regex: input[0],
            $options: 'i'
          }
        }
        ],
        isActive: true,
        isArchived: false,
        roleId: {
          $ne: 3
        }
      };
      groupQuery = {
        groupName: {
          $regex: input[0],
          $options: 'i'
        },
        isActive: true
      };
    } else {
      userQuery = {
        $or: [{
          firstName: {
            $regex: input[0],
            $options: 'i'
          }
        },
        {
          lastName: {
            $regex: input[0],
            $options: 'i'
          }
        },
        {
          firstName: {
            $regex: input[1],
            $options: 'i'
          }
        },
        {
          lastName: {
            $regex: input[1],
            $options: 'i'
          }
        }
        ],
        isActive: true,
        isArchived: false,
        roleId: {
          $ne: 3
        }
      };
      groupQuery = {
        $or: [{
          groupName: {
            $regex: input[0],
            $options: 'i'
          }
        },
        {
          groupName: {
            $regex: input[1],
            $options: 'i'
          }
        }
        ],
        isActive: true
      };
    }
  }
  User.getList(userQuery, function (response1) {
    result = result.concat(response1.result);
    Group.getList(groupQuery, function (response2) {
      result = result.concat(response2.result);
      login.findLoggedInUser(req, function (res) {
        let loggedInUser = res.result;
        callback({
          status: REQUEST_CODES.SUCCESS,
          result: _.filter(result, function (user) {
            return user.userId != loggedInUser.userId;
          })
        });
        return;
      });
    });
  });
}


function searchReskin(req, callback) {
  var query = req.query;
  var groupQuery = {
    groupName: query.name
  };
  var userQuery = {
    firstName: query.name
  };
  var result = {};
  if (query.like) {
    var input = query.name.split(' ');
    if (input.length == 1) {
      userQuery = {
        $or: [{
          firstName: {
            $regex: input[0],
            $options: 'i'
          }
        },
        {
          lastName: {
            $regex: input[0],
            $options: 'i'
          }
        }
        ],
        isActive: true,
        isArchived: false,
        'role.id': {
          $ne: 3
        }
      };
      groupQuery = {
        groupName: {
          $regex: input[0],
          $options: 'i'
        },
        isActive: true
      };
    } else {
      userQuery = {
        $and: [{
          firstName: {
            $regex: input[0],
            $options: 'i'
          }
        },
        {
          lastName: {
            $regex: input[1],
            $options: 'i'
          }
        }

        ],
        isActive: true,
        isArchived: false,
        'role.id': {
          $ne: 3
        }
      };
      groupQuery = {
        $or: [{
          groupName: {
            $regex: input[0],
            $options: 'i'
          }
        },
        {
          groupName: {
            $regex: input[1],
            $options: 'i'
          }
        }
        ],
        isActive: true
      };
    }
  }

  User.getList(userQuery, function (response1) {
    var userList = [];
    var groupList = [];
    let userListCon = [];
    let studentList= [] ;
    let partnerList= [] ;
    let parentList= [] ;
    response1.result && response1.result.forEach(function (item) {
      userListCon.push(item.userId);
    });
    Connection.getSearchConnectionList(query.userId, userListCon, function (responseCon) {
      response1.result = response1.result.map(function (data) {
        let indexId = responseCon.result.findIndex(conResult => data.userId == conResult.userId || 
          data.userId == conResult.partnerId);
        if (indexId !== -1) {
          data['status'] = responseCon.result[indexId].status == CONSTANTS.CONNECTION.REQUESTED ? CONSTANTS.CONNECTION_STATUS.REQUESTED :
            CONSTANTS.CONNECTION_STATUS.ACCEPTED;
          data['statusValue'] = responseCon.result[indexId].status == CONSTANTS.CONNECTION.REQUESTED ? CONSTANTS.CONNECTION.REQUESTED :
            CONSTANTS.CONNECTION.ACCEPTED;
        } else {
          data['status'] = CONSTANTS.CONNECTION_STATUS.NO_CONNECTION;
          data['statusValue'] = CONSTANTS.CONNECTION.NO_CONNECTION;
        }
        return data;
      })
      userList = response1.result;
      Group.getList(groupQuery, function (response2) {
        groupList = response2.result;
        result['groupList'] = groupList;
        login.findLoggedInUser(req, function (res) {
          let loggedInUser = res.result;
          userList: _.filter(userList, function (user) {
            return user.userId != loggedInUser.userId;
          })
          
          userList.forEach(function(data){
            if(data.role.indexOf(todo => todo.id == USER_CODES.STUDENT_ROLE)){
              if(studentList.length < 3)
                  studentList.push(data);
            }
            if(data.role.indexOf(todo => todo.id == USER_CODES.PARTNER_ROLE)){
              if(partnerList.length < 3)
                 partnerList.push(data);
            }
            if(data.role.indexOf(todo => todo.id == USER_CODES.PARENT_ROLE)){
              if(parentList.length < 3)
                  parentList.push(data);
            }
          })

          
          result['userList'] = userList;
          result['partnerList'] = partnerList;
          result['parentList'] = parentList;
          result['studentList'] = studentList;
          callback({
            status: REQUEST_CODES.SUCCESS,
            result: result
          });
          return;
        });
      });
    });
  });
}


function searchReskinByStatus(req, callback) {
  var query = req.query;
  var groupQuery = {
    groupName: query.name
  };
  var userQuery = {
    firstName: query.name
  };


  let status = parseInt(query.status) == USER_CODES.STUDENT_ROLE ? USER_CODES.STUDENT_ROLE : 
                        parseInt(query.status) == USER_CODES.PARENT_ROLE ? USER_CODES.PARENT_ROLE
                                   :  parseInt(query.status) == USER_CODES.PARTNER_ROLE ? USER_CODES.PARTNER_ROLE: null 
  var result = {};
  if (query.like) {
    var input = query.name.split(' ');
    if (input.length == 1) {
      if(status !== null){
        userQuery = {
          $or: [{
            firstName: {
              $regex: input[0],
              $options: 'i'
            }
          },
          {
            lastName: {
              $regex: input[0],
              $options: 'i'
            }
          }
          ],
          isActive: true,
          isArchived: false,
          'role.id': {
            $eq: status
          }
        };
      } 
      if(status == null){
        groupQuery = {
          groupName: {
            $regex: input[0],
            $options: 'i'
          },
          isActive: true
        };
      }  
    } else {
      if(status !== null){
        userQuery = {
          $and: [{
            firstName: {
              $regex: input[0],
              $options: 'i'
            }
          },
          {
            lastName: {
              $regex: input[1],
              $options: 'i'
            }
          }

          ],
          isActive: true,
          isArchived: false,
          'role.id': {
            $eq: status
          }
        };
      }  
      if(status == null){
          groupQuery = {
            $or: [{
              groupName: {
                $regex: input[0],
                $options: 'i'
              }
            },
            {
              groupName: {
                $regex: input[1],
                $options: 'i'
              }
            }
            ],
            isActive: true
          };
        }   
    }
  }

  let limit = 15;
  let skip = limit*parseInt(query.skip) || 0;  

  let userSearchQuery= {}; 
  userSearchQuery['userQuery']= userQuery;
  userSearchQuery.skip = skip;
  userSearchQuery.limit = limit; 

  User.getListForReskinByStatus(userSearchQuery, function (response1) {
    var userList = [];
    var groupList = [];
    let userListCon = [];
    let studentList= [] ;
    let partnerList= [] ;
    let parentList= [] ;
    response1.result && response1.result.forEach(function (item) {
      userListCon.push(item.userId);
    });
    Connection.getSearchConnectionList(query.userId, userListCon, function (responseCon) {
      response1.result = response1.result.map(function (data) {
        let indexId = responseCon.result.findIndex(conResult => data.userId == conResult.userId || 
          data.userId == conResult.partnerId);
        if (indexId !== -1) {
          data['status'] = responseCon.result[indexId].status == CONSTANTS.CONNECTION.REQUESTED ? CONSTANTS.CONNECTION_STATUS.REQUESTED :
            CONSTANTS.CONNECTION_STATUS.ACCEPTED;
          data['statusValue'] = responseCon.result[indexId].status == CONSTANTS.CONNECTION.REQUESTED ? CONSTANTS.CONNECTION.REQUESTED :
            CONSTANTS.CONNECTION.ACCEPTED;
        } else {
          data['status'] = CONSTANTS.CONNECTION_STATUS.NO_CONNECTION;
          data['statusValue'] = CONSTANTS.CONNECTION.NO_CONNECTION;
        }
        return data;
      })     

      userList = response1.result;
      Group.getList(groupQuery, function (response2) {
        groupList = response2.result;
        if(status == null){
          result['dataList'] = groupList;
        }  
        login.findLoggedInUser(req, function (res) {
          let loggedInUser = res.result;
          userList: _.filter(userList, function (user) {
            return user.userId != loggedInUser.userId;
          })
          
          userList.forEach(function(data){
            if(data.role.indexOf(todo => todo.id == USER_CODES.STUDENT_ROLE)){
              studentList.push(data);
            }
            if(data.role.indexOf(todo => todo.id == USER_CODES.PARENT_ROLE)){
              partnerList.push(data);
            }
            if(data.role.indexOf(todo => todo.id == USER_CODES.PARENT_ROLE)){
              parentList.push(data);
            }
          })
          // result['userList'] = userList;
          // result['partnerList'] = partnerList;
          // result['parentList'] = parentList;
          if(query.status == USER_CODES.STUDENT_ROLE){
            result['dataList'] = studentList;
          }
          if(query.status == USER_CODES.PARENT_ROLE){
            result['dataList'] = parentList;
          }
          if(query.status == USER_CODES.PARTNER_ROLE){
            result['dataList'] = partnerList;
          }
          callback({
            status: REQUEST_CODES.SUCCESS,
            result: result
          });
          return;
        });
      });
    });
  });
}


function searchReskinAllUser(req, callback) {
  var query = req.query;
  var groupQuery = {
    groupName: query.name
  };
  var userQuery = {
    firstName: query.name
  };
  var result = [];
  if (query.like) {
    var input = query.name.split(' ');
    if (input.length == 1) {
      userQuery = {
        $or: [{
          firstName: {
            $regex: input[0],
            $options: 'i'
          }
        },
        {
          lastName: {
            $regex: input[0],
            $options: 'i'
          }
        }
        ],
        isActive: true,
        isArchived: false,
        'role.id': {
          $ne: 3
        }
      };    
    } else {
      userQuery = {
        $and: [{
          firstName: {
            $regex: input[0],
            $options: 'i'
          }
        },
        {
          lastName: {
            $regex: input[1],
            $options: 'i'
          }
        }

        ],
        isActive: true,
        isArchived: false,
        'role.id': {
          $ne: 3
        }
      };     
    }
  }

  User.getList(userQuery, function (response1) {
    var userList = [];
    var groupList = [];
    let userListCon = [];
    response1.result && response1.result.forEach(function (item) {
      userListCon.push(item.userId);
    });
    Connection.getSearchConnectionList(query.userId, userListCon, function (responseCon) {
      response1.result = response1.result.map(function (data) {
        let indexId = responseCon.result.findIndex(conResult => data.userId == conResult.userId || 
          data.userId == conResult.partnerId);
        if (indexId !== -1) {
          data['status'] = responseCon.result[indexId].status == CONSTANTS.CONNECTION.REQUESTED ? CONSTANTS.CONNECTION_STATUS.REQUESTED :
            CONSTANTS.CONNECTION_STATUS.ACCEPTED;
          data['statusValue'] = responseCon.result[indexId].status == CONSTANTS.CONNECTION.REQUESTED ? CONSTANTS.CONNECTION.REQUESTED :
            CONSTANTS.CONNECTION.ACCEPTED;
        } else {
          data['status'] = CONSTANTS.CONNECTION_STATUS.NO_CONNECTION;
          data['statusValue'] = CONSTANTS.CONNECTION.NO_CONNECTION;
        }
        return data;
      })
      userList = response1.result;   
        login.findLoggedInUser(req, function (res) {
          let loggedInUser = res.result;
          userList: _.filter(userList, function (user) {
            return user.userId != loggedInUser.userId;
          })
          result = result.concat(userList);         
          callback({
            status: REQUEST_CODES.SUCCESS,
            result: result
          });
          return;
        });
     
    });
  });
}
//RSS Feed
function getRSSFeed(req, callback) {
  var resData = [];
  var resMessage = '';
  let count = req.query.count;
  let interest = req.query.interest;

  googleNews.search(interest).then(resp => {
    feedItem = resp;
    feedItem.forEach((data, index) => {
      if (index < count) {
        resData.push(data);
      }
    })
    if (count >= feedItem.length) {
      resData = feedItem;
      resMessage = 'Greater number of records expectd than the present once.';
    } else if (count < feedItem.length) {
      resMessage = 'Recods fetched successfully!!';
    }
    callback({
      status: REQUEST_CODES.SUCCESS,
      message: resMessage,
      result: resData
    })
    //  res.status(200).json({statusCode:200,message:resMessage,data:resData});
  });
}

function searchNotConnectedUser(req, callback) {
  var query = req.query;
  var groupQuery = {
    groupName: query.name
  };
  var userQuery = {
    firstName: query.name
  };
  var result = {};

  if (query.like) {
    var input = query.name.split(' ');
    if (input.length == 1) {
      userQuery = {
        $or: [{
          firstName: {
            $regex: input[0],
            $options: 'i'
          }
        },
        {
          lastName: {
            $regex: input[0],
            $options: 'i'
          }
        }
        ],
        isActive: true,
        isArchived: false,
        'role.id': {
          $eq: 1
        }
      };
      groupQuery = {
        groupName: {
          $regex: input[0],
          $options: 'i'
        },
        isActive: true
      };
    } else {
      userQuery = {
        $or: [{
          firstName: {
            $regex: input[0],
            $options: 'i'
          }
        },
        {
          lastName: {
            $regex: input[0],
            $options: 'i'
          }
        },
        {
          firstName: {
            $regex: input[1],
            $options: 'i'
          }
        },
        {
          lastName: {
            $regex: input[1],
            $options: 'i'
          }
        }
        ],
        isActive: true,
        isArchived: false,
        'role.id': {
          $ne: 3
        }
      };
      groupQuery = {
        $or: [{
          groupName: {
            $regex: input[0],
            $options: 'i'
          }
        },
        {
          groupName: {
            $regex: input[1],
            $options: 'i'
          }
        }
        ],
        isActive: true
      };
    }
  }

  User.getList(userQuery, function (response1) {
    var userList = [];
    var groupList = [];
    let userListCon = [];
    response1.result.forEach(function (item) {
      userListCon.push(item.userId);
    });
    let noConnectionUser = [];
    Connection.getSearchConnectionList(query.userId, userListCon, function (responseCon) {
      response1.result.forEach(function (data) {
        let indexId = responseCon.result && responseCon.result.findIndex(conResult => data.userId == conResult.userId || data.userId == conResult.partnerId);
        if (indexId === -1) {
          noConnectionUser.push(data);
        }
      })
      userList = noConnectionUser;
      login.findLoggedInUser(req, function (res) {
        let loggedInUser = res.result;
        userList: _.filter(userList, function (user) {
          return user.userId != loggedInUser.userId;
        })
        result['userList'] = userList;
        callback({
          status: REQUEST_CODES.SUCCESS,
          result: result
        });
        return;
      });
    });
  });
}


function searchUsersForGroup(req, callback) {
  var query = req.query;
  var groupQuery = {
    groupName: query.name
  };
  var userQuery = {
    firstName: query.name
  };
  var result = {};

  if (query.like) {
    var input = query.name.split(' ');
    if (input.length == 1) {
      userQuery = {
        $or: [{
          firstName: {
            $regex: input[0],
            $options: 'i'
          }
        },
        {
          lastName: {
            $regex: input[0],
            $options: 'i'
          }
        }
        ],
        isActive: true,
        isArchived: false,
        'role.id': {
          $ne: 3
        }
      };
      groupQuery = {
        groupName: {
          $regex: input[0],
          $options: 'i'
        },
        isActive: true
      };
    } else {
      userQuery = {
        $or: [{
          firstName: {
            $regex: input[0],
            $options: 'i'
          }
        },
        {
          lastName: {
            $regex: input[0],
            $options: 'i'
          }
        },
        {
          firstName: {
            $regex: input[1],
            $options: 'i'
          }
        },
        {
          lastName: {
            $regex: input[1],
            $options: 'i'
          }
        }
        ],
        isActive: true,
        isArchived: false,
        'role.id': {
          $ne: 3
        }
      };
      groupQuery = {
        $or: [{
          groupName: {
            $regex: input[0],
            $options: 'i'
          }
        },
        {
          groupName: {
            $regex: input[1],
            $options: 'i'
          }
        }
        ],
        isActive: true
      };
    }
  }

  User.getList(userQuery, function (response1) {
    var userList = [];
    var groupList = [];
    let userListCon = [];
    response1.result.forEach(function (item) {
      userListCon.push(item.userId);
    });
    let noConnectionUser = [];
    Group.getList({
      'groupId': query.groupId
    }, function (response) {
      if (response.result.length > 0) {
        var group = response.result[0];
        var memberList = group.members;
        response1.result.forEach(function (data) {
          let index = memberList.findIndex(todo => (todo.userId == data.userId));
          if (index !== -1) {
            data['status'] = memberList[index].status == CONSTANTS.GROUP.STATUS.REQUESTED ? CONSTANTS.CONNECTION_STATUS.REQUESTED :
              memberList[index].status == CONSTANTS.GROUP.STATUS.ACCEPTED ?
                CONSTANTS.CONNECTION_STATUS.ACCEPTED :
                memberList[index].status == CONSTANTS.GROUP.STATUS.INVITED
                  ? CONSTANTS.CONNECTION_STATUS.INVITED : "";

            data['statusValue'] = memberList[index].status == CONSTANTS.GROUP.STATUS.REQUESTED ? CONSTANTS.GROUP.STATUS.REQUESTED :
              memberList[index].status == CONSTANTS.GROUP.STATUS.INVITED ?
                CONSTANTS.GROUP.STATUS.INVITED :
                memberList[index].status == CONSTANTS.GROUP.STATUS.REJECTED ?
                  CONSTANTS.GROUP.STATUS.REJECTED :
                  memberList[index].status == CONSTANTS.GROUP.STATUS.REMOVED ?
                    CONSTANTS.GROUP.STATUS.REMOVED : CONSTANTS.GROUP.STATUS.ACCEPTED;
          } else {
            data['status'] = CONSTANTS.CONNECTION_STATUS.NO_CONNECTION;
            data['statusValue'] = CONSTANTS.GROUP.MEMBER_NOT_IN_GROUP;
          }
          if (data.userId !== USER_CODES.BOTID)
            noConnectionUser.push(data);
        })
        userList = noConnectionUser;
        login.findLoggedInUser(req, function (res) {
          let loggedInUser = res.result;
          userList = _.filter(userList, function (user) {
            return user.userId != loggedInUser.userId;
          })
          result['userList'] = userList;
          callback({
            status: REQUEST_CODES.SUCCESS,
            result: result
          });
          return;
        });
      }
    });
  });
}

function getMyNarratives(userId, callback) {
  var achievements = [];
  var recommendations = [];
  var narratives = [];
  var importances = '';
  var hasIncompleteAchievement = false;
  if (userId) {
    Importance.getList({}, function (res) {
      importances = res.result;
    })
    let params = {
      userId: userId
    }
    Achievement.getAchievementByLevel2(params, function (res) {
      achievements = res.result;
      Recommendation.getRecommendationByCompetency(userId, function (res) {
        recommendations = res.result;
        Competencies.getList({}, function (res) {
          _.forEach(res.result, function (competency) {
            var response = {
              _id: 0,
              name: null,
              level1: null,
              recommendation: [],
              achievement: [],
              orderBy: 0
            };
            response._id = competency.competencyTypeId;
            response.name = competency.level2;
            response.level1 = competency.level1;
            let recc = _.find(recommendations, function (recomm) {
              return recomm._id == competency.competencyTypeId;
            });
            if (recc) {
              response.recommendation = recc.recommendation;
            }
            let achii = _.find(achievements, function (achive) {
              return achive._id == competency.competencyTypeId;
            });
            if (achii) {
              response.achievement = achii.achievement;
              _.map(response.achievement, function (achievement) {
                if (!hasIncompleteAchievement) {
                  if (!achievement.isActive) {
                    hasIncompleteAchievement = true;
                  }
                }
                _.forEach(importances, function (masterImportance) {
                  if (achievement.importance == masterImportance.importanceId) {
                    achievement.importanceName = masterImportance.title;
                  }
                });
              })
            }
            if (
              response.achievement.length > 0 ||
              response.recommendation.length > 0
            ) {
              narratives.push(response);
            }
          });
          callback({
            status: REQUEST_CODES.SUCCESS,
            hasIncompleteAchievement: hasIncompleteAchievement,
            result: narratives.sort(function (a, b) {
              var nameA = a.level1.toLowerCase(),
                nameB = b.level1.toLowerCase();
              if (nameA < nameB)
                //sort ascending
                return -1;
              if (nameA > nameB) return 1;
              return 0; //default return value (no sorting)
            })
          });
        });
      });
    });
  } else {
    callback({
      status: REQUEST_CODES.FAIL,
      message: 'UserId is missing in parameter.'
    });
  }
}


function findMaxDate(achievements) {
  var maxDate = 0;
  var loop = 0;
  _.forEach(achievements, function (achievement) {
    loop++;
    if (achievement.toDate == null) {
      maxDate = new Date().getTime();
    }
  });
  if (maxDate > 0 && loop == achievements.length) {
    return maxDate;
  } else {
    return _.max(achievements, function (achievement) {
      return achievement.toDate;
    }).toDate;
  }
}

function updatePersonalInfo(req, callback) {
  var user = req;
  var success_message;
  if (user.parents && user.parents.length == 0 && utils.calculateAge(new Date(user.dob), new Date()) < USER_CODES.STUDENT_MININUM_REQUIRED_AGE) {
    return callback({
      status: REQUEST_CODES.FAIL,
      message: USER_CODES.DELETE_PARENT_FOR_13YEAR_LESS_STUDENT
    });
  }
  const tasks = [
    function checkIfParentEmailAlreadyLinked(callback) {
      var itemsProcessed = 0;
      var errorList = [];
      if (user.roleId == USER_CODES.STUDENT_ROLE && user.parents && user.parents.length > 0) {
        user.parents.forEach(element => {
          if (!element.userId) {
            User.getList({
              userId: user.userId
            }, function (res) {
              itemsProcessed++;
              if (res.result.length > 0) {
                var parentInDB = res.result[0].parents;
                if (parentInDB.indexOf(element) > -1) {
                  errorList.push(element.email);
                  if (itemsProcessed === user.parents.length && errorList.length > 0) {
                    callback(utils.formatText(USER_CODES.PARENT_ALREADY_LINKED, errorList.toString()));
                  } else if (itemsProcessed === user.parents.length && errorList.length == 0) {
                    callback();
                  }
                } else if (itemsProcessed === user.parents.length && errorList.length == 0) {
                  callback();
                }
              }
            });
          } else {
            itemsProcessed++;
            if (itemsProcessed === user.parents.length && errorList.length == 0) {
              callback();
            }
          }
        });
      } else {
        callback();
      }
    },
    function addParent(callback) {
      if (user.roleId == USER_CODES.STUDENT_ROLE && user.parents && user.parents.length > 0) {
        var itemsProcessed = 0;
        var errorList = [];
        user.parents.forEach(element => {
          if (!element.userId) {
            User.getList({
              email: element.email.toLowerCase()
            }, function (res) {
              itemsProcessed++;
              if (res.result.length > 0) {
                // if parent exist and parent role then link with student
                if (res.result[0].roleId === USER_CODES.PARENT_ROLE) {
                  element.userId = res.result[0].userId;
                  if (itemsProcessed === user.parents.length && errorList && errorList.length == 0) {
                    addConnection(user.userId, res.result[0].userId);
                    callback();
                  } else if (itemsProcessed === user.parents.length && errorList.length > 0) {
                    callback(utils.formatText(USER_CODES.PARENT_ALREADY_EXIST, errorList.toString()));
                  }
                } else {
                  errorList.push(element.email);
                  if (itemsProcessed === user.parents.length && errorList.length > 0) {
                    callback(utils.formatText(USER_CODES.PARENT_ALREADY_EXIST, errorList.toString()));
                  } else if (itemsProcessed === user.parents.length && errorList.length == 0) {
                    addConnection(user.userId, res.result[0].userId);
                    callback();
                  }
                }
              } else if (errorList.length == 0) {
                // create parent user
                var parent = {
                  firstName: element.firstName,
                  lastName: element.lastName,
                  email: element.email,
                  roleId: USER_CODES.PARENT_ROLE,
                  isActive: true,
                  template: utils.CONSTANTS.EMAIL.ADD_PARENT_BY_STUDENT,
                  studentName: user.firstName + " " + user.lastName ? user.lastName : ""
                };
                User.create(parent, function (res) {
                  logger.info('addParent method --> parent created successfully');
                  element.userId = res.userId;
                  var connectionRequest = {
                    userId: user.userId,
                    partnerId: res.userId,
                    dateTime: utils.getSystemTime(),
                    status: utils.CONSTANTS.CONNECTION.ACCEPTED,
                    isActive: true
                  };

                  Connection.createConnectionForParentAddStudent(connectionRequest, function (res) {
                    logger.info('connection created : ', res.status);
                  });
                  if (itemsProcessed === user.parents.length) {
                    callback();
                  }
                });
              }
            });
          } else {
            itemsProcessed++;
            if (itemsProcessed === user.parents.length && errorList && errorList.length == 0) {
              callback();
            }
          }
        });
      } else {
        callback();
      }
    },
    function addStudent(callback) {
      var errorList = [];
      if (user.roleId == USER_CODES.PARENT_ROLE && user.students && user.students.length > 0) {
        var itemsProcessed = 0;
        user.students.forEach(element => {
          var student = element;
          User.getList({
            email: student.email.toLowerCase()
          }, function (res) {
            itemsProcessed++;
            if (res.result.length > 0) {
              // if student exist in DB
              studentDB = res.result[0];
              if (_.find(studentDB.parents, function (parent) {
                return parent.userId === user.userId;
              })) {
                // if already linked
                errorList.push(studentDB.email);
                if (itemsProcessed === user.students.length && errorList.length > 0) {
                  callback(utils.formatText(USER_CODES.STUDENT_ALREADY_LINKED, errorList.toString()));
                } else if (
                  itemsProcessed === user.students.length &&
                  errorList.length == 0
                ) {
                  callback();
                }
              } else {
                User.getList({
                  userId: user.userId
                }, function (res) {
                  let linkParent = {
                    userId: user.userId,
                    firstName: user.firstName,
                    email: res.result[0].email.toLowerCase()
                  }
                  studentDB.parents.push(linkParent);
                  User.update(studentDB, function (res) {
                    success_message = USER_CODES.STUDENT_ADDED;
                    callback()
                  });
                });
              }
            } else {
              // if new student
              if (errorList.length == 0) {
                User.getList({
                  userId: user.userId
                }, function (res) {
                  var parents = {
                    userId: user.userId,
                    email: res.result[0].email.toLowerCase()
                  };
                  student.roleId = USER_CODES.STUDENT_ROLE;
                  student.parents = parents;
                  student.parentName = user.firstName + " " + user.lastName ? user.lastName : "";
                  student.isActive = true;
                  student.template = utils.CONSTANTS.EMAIL.ADD_STUDENT
                  User.create(student, function (res) {
                    element.userId = res.userId;
                    var connectionRequest = {
                      userId: res.userId,
                      partnerId: parents.userId,
                      dateTime: utils.getSystemTime(),
                      status: utils.CONSTANTS.CONNECTION.ACCEPTED,
                      isActive: true
                    };
                    Connection.create(connectionRequest, function (res) {
                      logger.info('connection created : ', res.status);
                    });
                    if (itemsProcessed === user.students.length) {
                      success_message = USER_CODES.STUDENT_ADDED;
                      callback();
                    }
                  });
                });
              } else if (
                itemsProcessed === user.students.length &&
                errorList.length > 0
              ) {
                logger.error('addStudent method --> error');
                callback(errorList);
              }
            }
          });
        });
      } else {
        callback();
      }
    },
    function updateUser(callback) {
      User.update(user, function (res) {
        callback();
      });
    }
  ];
  async.series(tasks, function (error) {
    if (error) {
      callback({
        status: REQUEST_CODES.FAIL,
        message: error
      });
    }
    if (success_message) {
      callback({
        status: REQUEST_CODES.SUCCESS,
        message: success_message
      });
    } else {
      callback({
        status: REQUEST_CODES.SUCCESS,
        message: utils.formatText(PROFILE_CODES.UPDATE_SUCCESS, user.userId)
      });
    }
  });
}

function addConnection(userId, partnerId) {
  let query = {
    $and: [{
      $or: [{ userId: parseInt(userId), partnerId: parseInt(partnerId, 10) },
      {
        userId: parseInt(partnerId, 10),
        partnerId: parseInt(userId)
      }]
    }, { status: { $in: [CONSTANTS.CONNECTION.ACCEPTED, CONSTANTS.CONNECTION.REQUESTED] } }]
  };

  Connection.getList(query, function (connectionRes) {
    if (connectionRes.result.length === 0) {
      var connectionRequest = {
        userId: userId,
        partnerId: partnerId,
        dateTime: utils.getSystemTime(),
        status: utils.CONSTANTS.CONNECTION.ACCEPTED,
        isActive: true
      };
      Connection.createConnectionForParentAddStudent(connectionRequest, function (res) {
        logger.info('connection created : ', res.status);
        login.getDeviceIds(partnerId, function (resp) {
          let deviceIds = resp.result;
          User.getList({
            userId: partnerId
          }, function (resP) {
            let partner = resP.result[0];
            User.getList({
              userId: parseInt(userId, 10)
            }, function (resU) {
              let user = resU.result[0];
              var message = {
                deviceIds: deviceIds,
                userId: partner.userId,
                name: partner.firstName,
                actedBy: user.userId,
                profilePicture: user.profilePicture,
                body: user.firstName + ' has added you as spikeview connection',
                textName: user.firstName + ' ' + (user.lastName ? user.lastName : ''),
                textMessage: 'has added you as spikeview connection'
              };
              mobileNotification.sendNotification(message);
            });
          })
        });
      });
    }
  })
}

function updatePersonalInfoByParent(req, callback) {
  var user = req;
  var createdUserId = {};
  var success_message;
  // if (user.parents && user.parents.length == 0 && utils.calculateAge(new Date(user.dob), new Date()) < USER_CODES.STUDENT_MININUM_REQUIRED_AGE) {
  //   return callback({
  //     status: REQUEST_CODES.FAIL,
  //     message: USER_CODES.DELETE_PARENT_FOR_13YEAR_LESS_STUDENT
  //   });
  // }
  const tasks = [
    function addStudent(callback) {
      var errorList = [];
      if (user.roleId == USER_CODES.PARENT_ROLE && user.students && user.students.length > 0) {
        var itemsProcessed = 0;
        user.students.forEach(element => {
          var student = element;
          User.getList({
            email: student.email.toLowerCase()
          }, function (res) {
            itemsProcessed++;
            if (res.result.length > 0) {
              // if student exist in DB
              studentDB = res.result[0];
              if (studentDB.roleId == USER_CODES.STUDENT_ROLE) {
                // new parent and student exists....
                // var emailDataStudent = {
                //   template: CONSTANTS.EMAIL.INFORM_STUDENT,
                //   to: studentDB.email,
                //   email: user.email,
                //   mailMessage: 'You have a reuqest for adding {user.email} as parent. Please add parent from your profile.'
                // };
                // mailer.sendMail(emailDataStudent, function (resp) {
                //   logger.info('Inform student email sent to : ', studentDB.email, 'status : ', resp.status);
                // });
                callback(USER_CODES.INFORM_PARENT);
              } else if (_.find(studentDB.parents, function (parent) {
                return parent.userId === user.userId;
              })) {
                // if already linked
                errorList.push(studentDB.email);
                if (itemsProcessed === user.students.length && errorList.length > 0) {
                  callback(utils.formatText(USER_CODES.STUDENT_ALREADY_LINKED, errorList.toString()));
                } else if (
                  itemsProcessed === user.students.length &&
                  errorList.length == 0
                ) {
                  callback();
                }
              } else {
                User.getList({
                  userId: user.userId
                }, function (res) {
                  let linkParent = {
                    userId: user.userId,
                    firstName: user.firstName,
                    email: res.result[0].email.toLowerCase()
                  }
                  studentDB.parents.push(linkParent);
                  User.update(studentDB, function (res) {
                    success_message = USER_CODES.STUDENT_ADDED;
                    callback()
                  });
                });
              }
            } else {
              // if new student
              if (errorList.length == 0) {
                User.getList({
                  userId: user.userId
                }, function (res) {
                  var parents = {
                    userId: user.userId,
                    email: res.result[0].email.toLowerCase()
                  };
                  student.roleId = USER_CODES.STUDENT_ROLE;
                  student.parents = parents;
                  student.parentName = user.firstName + ' ' + (user.lastName ? user.lastName : '');
                  student.isActive = true;
                  student.template = utils.CONSTANTS.EMAIL.ADD_STUDENT
                  User.createStudentByParent(student, function (res) {
                    element.userId = res.userId;
                    createdUserId['studentId'] = res.userId;
                    var connectionRequest = {
                      userId: parents.userId,
                      partnerId: res.userId,
                      dateTime: utils.getSystemTime(),
                      status: utils.CONSTANTS.CONNECTION.ACCEPTED,
                      isActive: true
                    };
                    Connection.createConnectionForParentAddStudent(connectionRequest, function (res) {
                      logger.info('connection created : ', res.status);
                    });
                    if (itemsProcessed === user.students.length) {
                      success_message = USER_CODES.STUDENT_ADDED;
                      callback();
                    }
                  });
                });
              } else if (
                itemsProcessed === user.students.length &&
                errorList.length > 0
              ) {
                logger.error('addStudent method --> error');
                callback(errorList);
              }
            }
          });
        });
      } else {
        callback();
      }
    },
    function updateUser(callback) {
      console.log('updateUser --=');
      User.update(user, function (res) {
        callback();
      });
    }
  ];
  async.series(tasks, function (error) {
    if (error) {
      console.log('error --=');
      callback({
        status: REQUEST_CODES.FAIL,
        message: error
      });
    }
    if (success_message) {
      callback({
        status: REQUEST_CODES.SUCCESS,
        message: success_message,
        result: createdUserId
      });
    } else {
      callback({
        status: REQUEST_CODES.SUCCESS,
        message: utils.formatText(PROFILE_CODES.UPDATE_SUCCESS, user.userId)
      });
    }
  });
}


function addParent(data, callback) {
  User.getList({
    email: data.email.toLowerCase()
  }, function (res) {
    if (res.result.length > 0) {
      // parent found in DB
      var existingParent = res.result[0];
      if (existingParent.roleId === USER_CODES.PARENT_ROLE) {
        User.getList({
          userId: data.studentId
        }, function (resp) {
          var studentData = resp.result;
          var parentData = studentData[0].parents;
          if (_.where(parentData, {
            email: data.email.toLowerCase()
          }).length) {
            return callback({
              status: REQUEST_CODES.FAIL,
              message: USER_CODES.ALREADY_PARENT_OF_THIS_STUDENT
            });
          } else {
            var newParent = {
              email: data.email.toLowerCase(),
              firstName: existingParent.firstName,
              lastName: existingParent.lastName,
              userId: existingParent.userId
            };
            studentData[0].parents.push(newParent);
            User.update(studentData[0], function (respp) {
              if (respp.status === REQUEST_CODES.SUCCESS) {
                addConnection(data.studentId, existingParent.userId);
                sendNotificationMessage(data, studentData[0], existingParent);
                return callback({
                  status: REQUEST_CODES.SUCCESS,
                  message: PROFILE_CODES.ADD_PARENT_SUCCESS
                });
              } else {
                return respp;
              }
            });
          }
        });
      } else {
        logger.error('addParent -->  ', USER_CODES.USER_FOUND_WITH_OTHER_ROLE);
        return callback({
          status: REQUEST_CODES.FAIL,
          message: USER_CODES.USER_FOUND_WITH_OTHER_ROLE
        });
      }
    } else {
      logger.info('addParent -->  new parent user to be added');
      User.getList({
        userId: data.studentId
      }, function (res) {
        if (res.result.length > 0) {
          var student = res.result[0];
          var parent = {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email.toLowerCase(),
            roleId: USER_CODES.PARENT_ROLE,
            isActive: true,
            isPasswordChanged: false,
            isArchived: false,
            parentName: data.parentName,
            studentName: student.firstName + " " + student.lastName ? student.lastName : "",
            template: CONSTANTS.EMAIL.ADD_PARENT_BY_PARENT
          };
          User.create(parent, function (res) {
            if (res.status == REQUEST_CODES.SUCCESS) {
              logger.info('addParent method --> Parent created successfully');
              var newParent = {
                email: data.email.toLowerCase(),
                firstName: data.firstName,
                lastName: data.lastName,
                userId: res.userId
              };
              var connectionRequest = {
                userId: data.studentId,
                partnerId: res.userId,
                dateTime: utils.getSystemTime(),
                status: utils.CONSTANTS.CONNECTION.ACCEPTED,
                isActive: true
              };

              res.firstName = data.firstName;
              sendNotificationMessage(data, student, res);

              Connection.create(connectionRequest, function (res) {
                logger.info('connection created : ', res.status);
              });
              student.parents.push(newParent);
              User.update(student, function (res) {
                if (res.status === REQUEST_CODES.SUCCESS) {
                  return callback({
                    status: REQUEST_CODES.SUCCESS,
                    message: PROFILE_CODES.ADD_PARENT_SUCCESS
                  });
                } else {
                  return res;
                }
              });
            } else {
              return callback({
                status: REQUEST_CODES.FAIL,
                message: res.message
              });
            }
          });
        } else {
          logger.error('addParent method -->  ', USER_CODES.USER_NOT_FOUND);
          return callback({
            status: REQUEST_CODES.FAIL,
            message: USER_CODES.USER_NOT_FOUND
          });
        }
      });
    }
  });
}

function sendNotificationMessage(data, student, res) {
  login.getDeviceIds(student.userId, function (resp) {
    let deviceIds = resp.result;
    User.getList({
      userId: data.parentId
    }, function (parent) {
      if (parent.result.length > 0) {
        let parentData = parent.result[0];
        var message = {
          deviceIds: deviceIds,
          userId: student.userId,
          name: student.firstName,
          actedBy: data.parentId,
          profilePicture: parentData.profilePicture,
          body: res.firstName + " added as Parent in " + student.firstName + "'s profile by " + parentData.firstName,
          textName: parentData.firstName + ' ' + (parentData.lastName ? parentData.lastName : ''),
          textMessage: res.firstName + " added as Parent in " + student.firstName + "'s profile by " + parentData.firstName,
        };
        mobileNotification.sendNotification(message);
      }
    })
  })
}

function getPersonalInfo(req, callback) {
  var params = req.params;
  var userId = parseInt(params.userId);
  var sendNotification = params.sendNotification == 'false' ? false : true;
  User.getList({
    userId: userId
  }, function (res) {
    if (res.result && res.result.length > 0) {
      var user = res.result[0];
      if (sendNotification) {
        login.getDeviceIds(userId, function (resp) {
          login.findLoggedInUser(req, function (res) {
            let actor = res.result;
            var message = {
              deviceIds: resp.result,
              userId: user.userId,
              name: user.firstName,
              actedBy: actor.userId,
              profilePicture: actor.profilePicture,
              body: actor.firstName + ' viewed your profile',
              textName: actor.firstName + ' ' + (actor.lastName ? actor.lastName : ''),
              textMessage: 'viewed your profile'
            };
            mobileNotification.sendNotification(message);
          });
        });
      }
      user = _.omit(JSON.parse(JSON.stringify(user)), '_id', 'password', 'salt');
      if (user.roleId == USER_CODES.PARENT_ROLE) {
        User.getStudentsByParent(user.userId, function (resp) {
          user.students = resp.result;
          return callback({
            status: REQUEST_CODES.SUCCESS,
            message: utils.formatText(REQUEST_CODES.SUCCESS, user.userId),
            result: user
          });
        });
      } else {
        let parentUserIds = _.pluck(user.parents, 'userId');
        var query = {
          userId: {
            $in: parentUserIds
          }
        };
        User.getList(query, function (res) {
          var parentUsers = res.result;
          _.map(user.parents, function (user) {
            _.map(parentUsers, function (parentUser) {
              if (user.userId == parentUser.userId) {
                user.firstName = parentUser.firstName;
                user.lastName = parentUser.lastName;
              }
            })
          })
          return callback({
            status: REQUEST_CODES.SUCCESS,
            message: utils.formatText(REQUEST_CODES.SUCCESS, user.userId),
            result: user
          });
        });
      }
    } else {
      logger.error('getPersonalInfo method -->  ', utils.formatText(USER_CODES.USER_NOT_FOUND, userId));
      callback({
        status: REQUEST_CODES.FAIL,
        message: utils.formatText(USER_CODES.USER_NOT_FOUND, userId)
      });
      return;
    }
  });
}

function getAllCounts(params, callback) {
  var userId = parseInt(params.userId);
  var sharedId = parseInt(params.sharedId);
  var shareConfig = null;
  var temp = [];
  var recommendationCount = 0;
  var statics = {
    recommendation: 0,
    achievement: 0,
    endorsement: 0,
    userId: userId
  };
  if (sharedId) {
    SharedProfiles.getList({
      sharedId: sharedId
    }, function (res) {
      shareConfig = res.result[0].shareConfiguration;
      Achievement.getList({
        userId: userId
      }, function (resp) {
        if (resp.status == REQUEST_CODES.SUCCESS) {
          logger.info('getAllCounts method --> Achievement List retrieved successfully');
          if (sharedId) {
            shareConfig.forEach(config => {
              resp.result.forEach(achievement => {
                if (
                  config.competencyTypeId == achievement.competencyTypeId &&
                  achievement.importance >= config.importance
                ) {
                  temp.push(achievement.competencyTypeId);
                }
              });
            });
            statics.achievement = temp.length;
          } else {
            statics.achievement = resp.result.length;
          }
        } else {
          statics.achievement = 0;
        }
        Recommendation.getList({
          userId: userId,
          stage: CONSTANTS.RECOMMENDATION.ADDED,
          isActive: true
        },
          function (resp) {
            if (resp.status == REQUEST_CODES.SUCCESS) {
              logger.info('getAllCounts method --> Recommendation List retrieved successfully');
              if (sharedId) {
                _.uniq(temp).forEach(competencyTypeId => {
                  resp.result.forEach(recomm => {
                    if (competencyTypeId == recomm.competencyTypeId) {
                      recommendationCount = recommendationCount + 1;
                    }
                  });
                });
                statics.recommendation = recommendationCount;
              } else {
                statics.recommendation = resp.result.length;
              }
            } else {
              statics.recommendation = 0;
            }
            callback({
              status: REQUEST_CODES.SUCCESS,
              result: statics
            });
          }
        );
      });
    });
  } else {
    Achievement.getList({
      userId: userId
    }, function (resp) {
      if (resp.status == REQUEST_CODES.SUCCESS) {
        logger.info('getAllCounts method --> Achievement List retrieved successfully');
        statics.achievement = resp.result.length;
      } else {
        statics.achievement = 0;
      }
      Recommendation.getList({
        userId: userId,
        stage: CONSTANTS.RECOMMENDATION.ADDED
      },
        function (resp) {
          if (resp.status == REQUEST_CODES.SUCCESS) {
            statics.recommendation = resp.result.length;
            logger.info('getAllCounts method --> Recommendation List retrieved successfully');
          } else {
            statics.recommendation = 0;
          }
          logger.info('getAllCounts method success');
          callback({
            status: REQUEST_CODES.SUCCESS,
            result: statics
          });
        }
      );
    });
  }
}




function getAllSkillCounts(params, callback) {
  var userId = parseInt(params.userId);
  var sharedId = parseInt(params.sharedId);
  var skill1 = [];
  var skill2 = [];
  var skill3 = [];
  var skill4 = [];
  var skill5 = [];
  var skill6 = [];
  var skill7 = [];
  var skill8 = [];
  var masterSkills = [];
  var shareConfig = null;

  if (sharedId) {
    SharedProfiles.getList({
      sharedId: sharedId
    }, function (res) {
      shareConfig = res.result[0].shareConfiguration;
    });
  }
  Skills.getList({}, function (res) {
    if (res.result.length > 0) {
      masterSkills = res.result;
      Achievement.getList({
        userId: userId
      }, function (resp) {
        resp.result.forEach(achievement => {
          logger.info('getAllSkillCounts method --> Achievement List retrieved successfully');
          if (shareConfig) {
            shareConfig.forEach(config => {
              if (achievement.competencyTypeId == config.competencyTypeId) {
                if (achievement.importance >= config.importance) {
                  achievement.skills.forEach(skill => {
                    if (skill.skillId == 1) {
                      skill1.push(1);
                    } else if (skill.skillId == 2) {
                      skill2.push(2);
                    } else if (skill.skillId == 3) {
                      skill3.push(3);
                    } else if (skill.skillId == 4) {
                      skill4.push(4);
                    } else if (skill.skillId == 5) {
                      skill5.push(5);
                    } else if (skill.skillId == 6) {
                      skill6.push(6);
                    } else if (skill.skillId == 7) {
                      skill7.push(7);
                    } else {
                      skill8.push(8);
                    }
                  });
                }
              }
            });
          } else {
            achievement.skills.forEach(skill => {
              if (skill.skillId == 1) {
                skill1.push(1);
              } else if (skill.skillId == 2) {
                skill2.push(2);
              } else if (skill.skillId == 3) {
                skill3.push(3);
              } else if (skill.skillId == 4) {
                skill4.push(4);
              } else if (skill.skillId == 5) {
                skill5.push(5);
              } else if (skill.skillId == 6) {
                skill6.push(6);
              } else if (skill.skillId == 7) {
                skill7.push(7);
              } else {
                skill8.push(8);
              }
            });
          }
        });
        _.map(masterSkills, function (skill) {
          if (skill.skillId == 1) {
            return (skill.count = skill1.length);
          } else if (skill.skillId == 2) {
            return (skill.count = skill2.length);
          } else if (skill.skillId == 3) {
            return (skill.count = skill3.length);
          } else if (skill.skillId == 4) {
            return (skill.count = skill4.length);
          } else if (skill.skillId == 5) {
            return (skill.count = skill5.length);
          } else if (skill.skillId == 6) {
            return (skill.count = skill6.length);
          } else if (skill.skillId == 7) {
            return (skill.count = skill7.length);
          } else if (skill.skillId == 8) {
            return (skill.count = skill8.length);
          }
        });
        var isEmpty = true;
        masterSkills.forEach(skill => {
          if (isEmpty) {
            if (skill.count > 0) {
              isEmpty = false;
            }
          }
        });
        if (isEmpty) {
          callback({
            status: REQUEST_CODES.SUCCESS,
            result: []
          });
          return;
        } else {
          callback({
            status: REQUEST_CODES.SUCCESS,
            result: _.sortBy(masterSkills, function (obj) {
              return obj.count * -1;
            })
          });
          return;
        }
      });
    } else {
      logger.error('getAllSkillCounts method error --> ', utils.CONSTANTS.SKILLS.NOT_FOUND);
      callback({
        status: REQUEST_CODES.FAIL,
        message: utils.CONSTANTS.SKILLS.NOT_FOUND
      });
      return;
    }
  });
}
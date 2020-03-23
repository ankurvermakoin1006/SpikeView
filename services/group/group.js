module.exports = function (app) {
    app.post('/ui/group', function (req, res) {
        try {
            create(req.body, function (response) {
                res.json(response);
            });
        } catch (e) {
            res.json(e);
        }
    });
    app.get('/ui/group', function (req, res) {
        try {
            getList(req.query, function (response) {
                res.json(response);
            });
        } catch (e) {
            res.json(e);
        }
    });
    app.put('/ui/group', function (req, res) {
        try {
            update(req.body, function (response) {
                res.json(response);
            });
        } catch (e) {
            res.json(e);
        }
    });
    app.delete('/ui/group', function (req, res) {
        try {
            remove(req.body, function (response) {
                res.json(response);
            });
        } catch (e) {
            res.json(e);
        }
    });
    app.get('/ui/group/mygroups/:userId/:roleId', function (req, res) {
        try {
            findMyGroups(req.params, function (response) {
                res.json(response);
            });
        } catch (e) {
            res.json(e);
        }
    });
    app.get('/ui/group/mygroups/:userId', function (req, res) {
        try {
            findMyGroups(req.params, function (response) {
                res.json(response);
            });
        } catch (e) {
            res.json(e);
        }
    });
    app.get('/ui/group/mygroupdata/:userId/:roleId', function (req, res) {
        try {
            findMyGroupData(req.params, function (response) {
                res.json(response);
            });
        } catch (e) {
            res.json(e);
        }
    });
    app.get('/ui/group/mygroupdata/:userId', function (req, res) {
        try {
            findMyGroupData(req.params, function (response) {
                res.json(response);
            });
        } catch (e) {
            res.json(e);
        }
    });
    app.get('/ui/group/members/:groupId', function (req, res) {
        try {
            getGroupMembers(parseInt(req.params.groupId), function (response) {
                res.json(response);
            });
        } catch (e) {
            res.json(e);
        }
    });
    app.get('/ui/group/members/:groupId/:userId/:roleId', function (req, res) {
        try {
            getGroupAndConnectionMember(parseInt(req.params.groupId), parseInt(req.params.userId), function (response) {
                res.json(response);
            });
        } catch (e) {
            res.json(e);
        }
    });
    app.get('/ui/group/members/:groupId/:userId', function (req, res) {
        try {
            getGroupAndConnectionMember(parseInt(req.params.groupId), parseInt(req.params.userId), function (response) {
                res.json(response);
            });
        } catch (e) {
            res.json(e);
        }
    });
    app.post('/ui/group/leave', function (req, res) {
        try {
            leaveGroup(req.body, function (response) {
                res.json(response);
            });
        } catch (e) {
            res.json(e);
        }
    });
    app.post('/ui/group/inviteMembers', function (req, res) {
        try {
            addGroupMembers(req.body, function (response) {
                res.json(response);
            });
        } catch (e) {
            res.json(e);
        }
    });
    app.post('/ui/group/inviteMultipleMember', function (req, res) {
        try {
            addMultipleGroupMembers(req.body, function (response) {
                res.json(response);
            });
        } catch (e) {
            res.json(e);
        }
    });
    app.post('/ui/group/inviteMultipleMemberForGroup', function (req, res) {
        try {
            addMultipleGroupMembersForGroup(req.body, function (response) {
                res.json(response);
            });
        } catch (e) {
            res.json(e);
        }
    });
    app.put('/ui/group/updateMemberStatus', function (req, res) {
        try {
            updateMemberStatus(req.body, function (response) {
                res.json(response);
            });
        } catch (e) {
            res.json(e);
        }
    });

    app.put('/ui/group/updateGroupInfo', function (req, res) {
        try {
            updateGroupInfo(req.body, function (response) {
                res.json(response);
            });
        } catch (e) {
            res.json(e);
        }
    });
    app.post('/ui/group/join', function (req, res) {
        try {
            joinGroup(req.body, function (response) {
                res.json(response);
            });
        } catch (e) {
            res.json(e);
        }
    });
    app.get('/ui/group/trendingGroups', function (req, res) {
        try {
            trendingGroups(req.params, function (response) {
                res.json(response);
            });
        } catch (e) {
            res.json(e);
        }
    });

}

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var GroupSchema = new Schema(require('./groupSchema').groupSchema, {
    collection: 'group'
});
var GroupModel = mongoose.model('group', GroupSchema);
var GroupController = require('./groupController');
var utils = require('../../commons/utils').utils;
var mongoUtils = utils.mongoUtils;
var CONSTANTS = utils.CONSTANTS;
var REQUEST_CODES = CONSTANTS.REQUEST_CODES;
var GROUP_CODES = utils.CONSTANTS.GROUP;
var _ = require('underscore');
var Users = require('../users/users');
var USER_CODES = utils.CONSTANTS.USERS;
var mailer = require('../email/mailer');
var config = require('../../env/config.js').getConf();
var mobileNotification = require('../pushNotification/fcm');
var login = require('../login/login');
var Connection = require('../connection/connections');
var logger = require('../../logger.js');

function trendingGroups(query, callback) {
    GroupModel.find(query, function (res) {
        console.log('res --  ', res);
        GroupModel.aggregate(
            [
                { $sort: { "members": -1, } },
                { "$limit": 3 }
            ]
        ).exec(function (error, data) {
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
            }
        });
    });
}

function create(group, callback) {
    group.members = group.members.map(function (item) {
        item['dateTime'] = utils.getSystemTime();
        return item;
    })
    var groupAPI;
    var errorList = [];
    try {
        groupAPI = GroupController.GroupAPI(group);
    } catch (e) {
        errorList.push(e.error[0]);
        callback({
            status: REQUEST_CODES.FAIL,
            error: errorList
        });
        return;
    }
    var groupModel = new GroupModel(groupAPI);
    mongoUtils.getNextSequence('groupId', function (oSeq) {
        groupModel.groupId = oSeq;


        groupModel.save(function (error) {
            if (error) {
                logger.info('Group is not created', error);
                callback({
                    status: REQUEST_CODES.FAIL,
                    error: error
                });
                return;
            } else {
                logger.info('Group is created');
                callback({
                    status: REQUEST_CODES.SUCCESS,
                    message: GROUP_CODES.CREATE_SUCCESS,
                    groupId: groupModel.groupId
                });
                return;
            }
        });
    });

    let index = group.members.findIndex(todo => todo.userId !== parseInt(group.createdBy));
    if (index !== -1) {
        if (group.members.length === 2) {
            let memberUsers = group.members;
            let studentId = memberUsers[index].userId;
            let roleId = memberUsers[index].roleId ? memberUsers[index].roleId : USER_CODES.STUDENT_ROLE
            Users.getList({ userId: parseInt(studentId) }, function (res) {
                if (res.result.length > 0) {
                    let user = res.result[0];
                    login.getDeviceIds(parseInt(user.userId), function (resp) {
                        var message = {
                            deviceIds: resp.result,
                            userId: user.userId,
                            roleId: roleId,
                            name: user.firstName,
                            body: CONSTANTS.GROUP.GROUP_CREATED_BY_PARENT,
                            textName: "",
                            textMessage: CONSTANTS.GROUP.GROUP_CREATED_BY_PARENT
                        };
                        mobileNotification.sendNotification(message);
                        groupHeaderCount(user.userId, roleId);
                    })
                }
            })
        }
    }
}

function getList(query, callback) {
    GroupModel.find(query, function (error, records) {
        if (error) {
            callback({
                status: REQUEST_CODES.FAIL,
                error: error
            });
            return;
        } else {
            records = records.map(function (records) {
                return new GroupController.GroupAPI(records);
            });
            callback({
                status: REQUEST_CODES.SUCCESS,
                result: records
            });
            return;
        }
    }).sort({
        creationDate: -1
    });
}

function update(group, callback) {
    GroupModel.update({
        'groupId': group.groupId
    }, {
        $set: group
    }, function (error) {
        if (error) {
            logger.error('Group updated error ', error);
            callback({
                status: REQUEST_CODES.FAIL,
                error: error
            });
            return;
        } else {
            logger.info('Group is updated');
            callback({
                status: REQUEST_CODES.SUCCESS,
                message: GROUP_CODES.UPDATE_SUCCESS
            });
            return;
        }
    });
}

function remove(query, callback) {
    GroupModel.remove(query, function (error) {
        if (error) {
            logger.error('Group removed error ', error);
            callback({
                status: REQUEST_CODES.FAIL,
                error: error
            });
            return;
        } else {
            logger.info('Group is removed');
            callback({
                status: REQUEST_CODES.SUCCESS,
                message: GROUP_CODES.DELETE_SUCCESS
            });
        }
    });
}

function
    findMyGroups(param, callback) {
    let userId = param.userId;
    let roleId = param.roleId ? parseInt(param.roleId) : null;
    let query = {
        'members.userId': parseInt(userId),
        $or: [
            { 'members.roleId': roleId },
            { 'members.roleId': { $exists: false } }
        ],
    }
    getList(query, callback);
}

//group Member divided on the basis of requsted,invitation and accepted
function findMyGroupData(param, callback) {
    let userId = param.userId;
    let roleId = param.roleId ? parseInt(param.roleId) : null;
    let query = {
        $and: [{ 'members.userId': parseInt(userId) },
        {
            $or: [
                { 'members.roleId': roleId },
                { 'members.roleId': { $exists: false } }
            ]
        }]
    }
    getList(query, function (data) {
        let result = {};
        let accepted = [];
        let requested = [];
        let invited = [];
        logger.info(data);
        data.result.forEach(function (item) {
            let index = item.members.findIndex(todo => (todo.userId === parseInt(userId, 10)
                &&
                todo.roleId ? todo.roleId == data.roleId : null)
                || todo.userId === parseInt(userId, 10)
            );
            if (item.members[index].status === CONSTANTS.GROUP.STATUS.ACCEPTED)
                accepted.push(item);
            if (item.members[index].status === CONSTANTS.GROUP.STATUS.REQUESTED)
                requested.push(item);
            if (item.members[index].status === CONSTANTS.GROUP.STATUS.INVITED)
                invited.push(item);
        })
        accepted = accepted.sort(function (a, b) {
            if (a.dateTime < b.dateTime) return 1;
            if (a.dateTime > b.dateTime) return -1;
            return 0; //default return value (no sorting)
        })
        requested = requested.sort(function (a, b) {
            if (a.dateTime < b.dateTime) return 1;
            if (a.dateTime > b.dateTime) return -1;
            return 0; //default return value (no sorting)
        })
        invited = invited.sort(function (a, b) {
            if (a.dateTime < b.dateTime) return 1;
            if (a.dateTime > b.dateTime) return -1;
            return 0; //default return value (no sorting)
        })
        result['Accepted'] = accepted;
        result['Reuested'] = requested;
        result['Invited'] = invited;

        callback({
            status: REQUEST_CODES.SUCCESS,
            result: result
        });
    })
}


function joinGroup(data, callback) {
    if (data.groupId) {
        getList({
            'groupId': data.groupId
        }, function (response) {
            if (response.result.length > 0) {
                var group = response.result[0];
                var memberList = group.members;
                var newMember = {
                    userId: data.userId,
                    roleId: data.roleId,
                    isAdmin: false
                }

                if (group.type == GROUP_CODES.TYPE.PUBLIC) {
                    newMember.status = GROUP_CODES.STATUS.ACCEPTED;
                } else {
                    newMember.status = GROUP_CODES.STATUS.REQUESTED;
                }
                newMember.dateTime = utils.getSystemTime();
                let index = memberList.findIndex(todo => (todo.userId == data.userId &&
                    todo.roleId ? todo.roleId == data.roleId : null)
                    || todo.userId == data.userId
                );
                if (index === -1) {
                    memberList.push(newMember);
                } else {
                    callback({
                        status: REQUEST_CODES.FAIL,
                        message: GROUP_CODES.MEMBER_ALREADY_IN_GROUP
                    });
                }
                group.members = memberList;
                update(group, function (response) {
                    if (group.type == GROUP_CODES.TYPE.PUBLIC) {
                        callback({
                            status: REQUEST_CODES.SUCCESS,
                            message: GROUP_CODES.GROUP_JOINNED,
                            result: memberList
                        });
                    } else {
                        callback({
                            status: REQUEST_CODES.SUCCESS,
                            message: GROUP_CODES.REQUEST_JOIN_GROUP,
                            result: memberList
                        });
                    }
                });
            }
        });

    } else {
        callback({
            status: REQUEST_CODES.FAIL,
            message: REQUEST_CODES.MISSING_MANDATORY
        });
    }

}

function leaveGroup(body, callback) {
    var userId = body.userId;
    var groupId = body.groupId
    if (groupId) {
        getList({
            'groupId': groupId
        }, function (response) {
            if (response.result.length > 0) {
                var group = response.result[0];
                var memberList = group.members;
                let index = memberList.findIndex(todo => (todo.userId == userId
                    &&
                    todo.roleId ? todo.roleId == data.roleId : null)
                    || todo.userId == userId
                );
                if (index !== -1)
                    memberList.splice(index, 1);
                group.members = memberList;
                update(group, function (error) {
                    callback({
                        status: REQUEST_CODES.SUCCESS,
                        message: GROUP_CODES.LEAVE_SUCCESS
                    });
                });
            } else {
                callback({
                    status: REQUEST_CODES.FAIL,
                    message: GROUP_CODES.GROUP_NOT_FOUND
                });
            }
        })
    } else {
        callback({
            status: REQUEST_CODES.FAIL,
            message: REQUEST_CODES.MISSING_MANDATORY
        });
    }
}

function getGroupMembers(groupId, callback) {
    GroupModel.aggregate(
        [{
            $match: {
                groupId: groupId
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'members.userId',
                foreignField: 'userId',
                as: 'myGroup'
            }
        }
        ]).exec(function (error, res) {
            if (error) {
                callback({
                    status: REQUEST_CODES.FAIL,
                    message: error
                });
            } else {
                _.map(res[0].members, function (member) {
                    _.forEach(res[0].myGroup, function (grp) {
                        if (grp.userId == member.userId) {
                            member.roleId = grp.roleId;
                            member.firstName = grp.firstName;
                            member.lastName = grp.lastName;
                            member.profilePicture = grp.profilePicture;
                            member.email = grp.email;
                            member.tagline = grp.tagline;
                        }
                    })
                    return member;
                });
                callback({
                    status: REQUEST_CODES.SUCCESS,
                    result: _.omit(res[0], 'myGroup')
                });
            }
        });
}


function getGroupAndConnectionMember(groupId, userId, callback) {
    logger.info('groupId -- ', groupId);

    logger.info('userId -- ', userId);
    GroupModel.aggregate(
        [{
            $match: {
                groupId: groupId
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'members.userId',
                foreignField: 'userId',
                as: 'myGroup'
            }
        }
        ]).exec(function (error, res) {
            if (error) {
                callback({
                    status: REQUEST_CODES.FAIL,
                    message: error
                });
            } else {
                let memberList = [];
                _.map(res[0] && res[0].members, function (member) {
                    if (userId !== member.userId)
                        memberList.push(
                            member.userId
                        );
                    _.forEach(res[0].myGroup, function (grp) {

                        if (grp.userId == member.userId) {
                            member.roleId = grp.roleId;
                            member.firstName = grp.firstName;
                            member.lastName = grp.lastName;
                            member.profilePicture = grp.profilePicture;
                            member.email = grp.email;
                            member.tagline = grp.tagline;
                            member.title = grp.tagline;
                        }
                    })
                    return member;
                });
                let query = {
                    $or: [{ userId: parseInt(userId), partnerId: { $in: memberList } }, {
                        userId: { $in: memberList },
                        partnerId: parseInt(userId)
                    }]
                };

                Connection.getList(query, function (conRec) {


                    _.map(res[0] && res[0].members, function (member) {
                        if (userId !== member.userId) {
                            let indexId = conRec.result.findIndex(conResult => member.userId == conResult.userId || member.userId == conResult.partnerId);
                            if (indexId !== -1) {
                                member['connectionStatus'] = conRec.result[indexId].status == CONSTANTS.CONNECTION.REQUESTED ?
                                    CONSTANTS.CONNECTION.REQUESTED :
                                    conRec.result[indexId].status == CONSTANTS.CONNECTION.ACCEPTED ?
                                        CONSTANTS.CONNECTION.ACCEPTED : CONSTANTS.CONNECTION.INVITED;

                            } else {
                                member['connectionStatus'] = CONSTANTS.CONNECTION.NO_CONNECTED;
                            }
                        } else {
                            member['connectionStatus'] = '';
                        }

                        return member;
                    });

                    callback({
                        status: REQUEST_CODES.SUCCESS,
                        result: _.omit(res[0], 'myGroup')
                    });
                })
            }
        });
}


//Multiple Invitation in Group
function addMultipleGroupMembers(body, callback) {
    let members = body.members;
    let emails = body.emails;
    let invitedBy = body.invitedBy;
    let groupId = parseInt(body.groupId, 10);
    if (body.groupId) {
        getList({
            'groupId': groupId
        }, function (response) {
            if (response.result.length > 0) {
                var group = response.result[0];
                var memberList = group.members;
                if (members.length > 0) {
                    members.forEach(function (data) {
                        let index = memberList.findIndex(todo => (todo.userId == data.userId
                            && todo.roleId ? todo.roleId == data.roleId : null) ||
                            todo.userId == data.userId
                        );
                        if (index === -1) {
                            memberList.push({
                                userId: data.userId,
                                roleId: USER_CODES.STUDENT_ROLE,
                                isAdmin: false,
                                status: GROUP_CODES.STATUS.INVITED,
                                dateTime: utils.getSystemTime()
                            });
                        }
                        login.getDeviceIds(data.userId, function (resp) {
                            var message = {
                                deviceIds: resp.result,
                                userId: data.userId,
                                roleId: data.roleId ? data.roleId : null,
                                name: '',
                                body: CONSTANTS.NOTIFICATION.GROUP_INVITATION + ' ' + group.groupName + ' group.',
                                textName: '',
                                textMessage: CONSTANTS.NOTIFICATION.GROUP_INVITATION + ' ' + group.groupName + ' group.'
                            };
                            mobileNotification.sendNotification(message);
                            groupHeaderCount(data.userId, USER_CODES.STUDENT_ROLE);
                        });

                    });
                    group.members = memberList;
                    update(group, function (response) {
                        callback({
                            status: REQUEST_CODES.SUCCESS,
                            message: GROUP_CODES.MEMBER_ADDED,
                            result: memberList
                        });
                    });
                } else if (emails.length > 0) {
                    let emailArr = [];
                    emails.forEach(function (data) {
                        emailArr.push(data.email);
                    });

                    Users.getUserListByEmails(emailArr, function (res) {
                        if (emails.length > 0) {
                            emails.forEach(function (data) {
                                let emailIndexPresent = res.result.findIndex(todo => todo.email == data.email);
                                if (emailIndexPresent !== -1) {
                                    let invitedUserId = res.result[emailIndexPresent].userId;
                                    // need to check if this userId already in group memeberlist.  
                                    let index = memberList.findIndex(todo => todo.userId == invitedUserId);
                                    if (index === -1) {
                                        group.members.push({
                                            userId: invitedUserId,
                                            roleId: USER_CODES.STUDENT_ROLE,
                                            isAdmin: false,
                                            status: GROUP_CODES.STATUS.INVITED,
                                            dateTime: utils.getSystemTime()
                                        });
                                        let pwd = null
                                        var request = {
                                            template: CONSTANTS.EMAIL.GROUP_JOINING_REQUEST,
                                            to: data.email,
                                            email: data.email,
                                            name: invitedBy,
                                            groupName: group.groupName ? group.groupName : '',
                                            password: null,
                                            joinMsg: '<div><strong>Username:</strong> {' + data.email + '}</div><div style="margin-bottom:10px"></div>',
                                            link: config.server_url + '/joingroup?groupId=' + groupId + '&email=' + data.email + '&pass=' + null
                                        }
                                        mailer.sendMail(request, function (res) {
                                            logger.info('Group Invitation sent to : ', email, 'status : ', res.status);
                                        });
                                        login.getDeviceIds(res.result[emailIndexPresent].userId, function (resp) {
                                            var message = {
                                                deviceIds: resp.result,
                                                userId: res.result[emailIndexPresent].userId,
                                                roleId: USER_CODES.STUDENT_ROLE,
                                                name: res.result[emailIndexPresent].firstName,
                                                body: CONSTANTS.NOTIFICATION.GROUP_INVITATION + ' ' + group.groupName + ' group.',
                                                textName: '',
                                                textMessage: CONSTANTS.NOTIFICATION.GROUP_INVITATION + ' ' + group.groupName + ' group.'
                                            };
                                            mobileNotification.sendNotification(message);
                                            groupHeaderCount(invitedUserId, USER_CODES.STUDENT_ROLE);
                                        });
                                        update(group, function (response) {
                                            callback({
                                                status: REQUEST_CODES.SUCCESS,
                                                message: GROUP_CODES.MEMBER_ADDED,
                                                result: memberList
                                            });
                                        });
                                    }
                                    // else {
                                    //     callback({
                                    //         status: REQUEST_CODES.FAIL,
                                    //         message: GROUP_CODES.MEMBER_ALREADY_IN_GROUP
                                    //     });
                                    //     return;
                                    // }
                                }
                                else {
                                    let newMember = {
                                        firstName: data.firstName,
                                        lastName: data.lastName,
                                        roleId: USER_CODES.STUDENT_ROLE,
                                        email: data.email,
                                        title: '',
                                        isActive: true,
                                        sendingEmail: false,
                                        isPasswordChanged: true
                                    };
                                    Users.create(newMember, function (resp) {
                                        if (resp.status == REQUEST_CODES.SUCCESS) {
                                            group.members.push({
                                                userId: resp.userId,
                                                roleId: USER_CODES.STUDENT_ROLE,
                                                isAdmin: false,
                                                status: GROUP_CODES.STATUS.INVITED,
                                                dateTime: utils.getSystemTime()
                                            })
                                            var password = utils.encrypt(resp.password);
                                            var request = {
                                                template: CONSTANTS.EMAIL.GROUP_JOINING_REQUEST,
                                                to: data.email,
                                                email: data.email,
                                                name: invitedBy,
                                                groupName: group.groupName ? group.groupName : '',
                                                password: resp.password,
                                                joinMsg: '<div><strong>Username:</strong> {' + data.email + '}</div><div style="margin-bottom:10px"><strong>Password:</strong> {' + resp.password + '}</div>',
                                                link: config.server_url + '/joingroup?groupId=' + groupId + '&email=' + data.email + '&pass=' + password
                                            }
                                            mailer.sendMail(request, function (res) {
                                                logger.info('Group Invitation sent to : ', data.email, 'status : ', res.status);
                                            });
                                            update(group, function (response) {
                                                callback({
                                                    status: REQUEST_CODES.SUCCESS,
                                                    message: GROUP_CODES.MEMBER_ADDED,
                                                    result: memberList
                                                });
                                            });
                                        } else {
                                            callback({
                                                status: REQUEST_CODES.FAIL,
                                                message: resp.message
                                            });
                                            return;
                                        }
                                    });
                                }
                            })
                        }
                    });
                } else {
                    callback({
                        status: REQUEST_CODES.FAIL,
                        message: REQUEST_CODES.MISSING_MANDATORY
                    });
                }
            }
        })
    } else {
        callback({
            status: REQUEST_CODES.FAIL,
            message: REQUEST_CODES.MISSING_MANDATORY
        });
    }
}

//groupHeaderCount
function groupHeaderCount(userId, roleId) {
    let Header = require('../header/header');
    let data = {
        userId: userId,
        roleId: roleId,
        connectionCount: '',
        messagingCount: '',
        notificationCount: '',
        groupCount: 1
    };
    Header.update(data, function (res) {
        logger.info('header updated', res.status);
    });
}


//Multiple Invitation in Group for both user and email
function addMultipleGroupMembersForGroup(body, callback) {
    let members = body.members;
    let emails = body.emails;
    let invitedBy = body.invitedBy;
    let groupId = parseInt(body.groupId, 10);
    if (body.groupId) {
        getList({
            'groupId': groupId
        }, function (response) {
            if (response.result.length > 0) {
                var group = response.result[0];
                var memberList = group.members;
                if (members && members.length > 0) {
                    members.forEach(function (data) {
                        let index = memberList.findIndex(todo => todo.userId == data.userId
                            (todo.userId == data.userId
                                && todo.roleId ? todo.roleId == data.roleId : null) ||
                            todo.userId == data.userId
                        );
                        if (index === -1) {
                            memberList.push({
                                userId: data.userId,
                                roleId: USER_CODES.STUDENT_ROLE,
                                isAdmin: false,
                                status: GROUP_CODES.STATUS.INVITED,
                                dateTime: utils.getSystemTime()
                            });
                        }
                        login.getDeviceIds(data.userId, function (resp) {
                            var message = {
                                deviceIds: resp.result,
                                userId: data.userId,
                                roleId: USER_CODES.STUDENT_ROLE,
                                name: '',
                                body: CONSTANTS.NOTIFICATION.GROUP_INVITATION + ' ' + group.groupName + ' group.',
                                textName: '',
                                textMessage: CONSTANTS.NOTIFICATION.GROUP_INVITATION + ' ' + group.groupName + ' group.'
                            };
                            mobileNotification.sendNotification(message);
                            groupHeaderCount(data.userId, USER_CODES.STUDENT_ROLE);
                        });

                    });
                    group.members = memberList;
                    update(group, function (response) {
                        callback({
                            status: REQUEST_CODES.SUCCESS,
                            message: GROUP_CODES.MEMBER_ADDED,
                            result: memberList
                        });
                    });
                }
                if (emails && emails.length > 0) {
                    let emailArr = [];
                    emails.forEach(function (data) {
                        emailArr.push(data.email);
                    });

                    Users.getUserListByEmails(emailArr, function (res) {
                        if (emails.length > 0) {
                            emails.forEach(function (data) {
                                let emailIndexPresent = res.result.findIndex(todo => todo.email == data.email);
                                if (emailIndexPresent !== -1) {
                                    let invitedUserId = res.result[emailIndexPresent].userId;
                                    // need to check if this userId already in group memeberlist.  
                                    let index = memberList.findIndex(todo => todo.userId == invitedUserId);
                                    if (index === -1) {
                                        group.members.push({
                                            userId: invitedUserId,
                                            roleId: USER_CODES.STUDENT_ROLE,
                                            isAdmin: false,
                                            status: GROUP_CODES.STATUS.INVITED,
                                            dateTime: utils.getSystemTime()
                                        });
                                        var request = {
                                            template: CONSTANTS.EMAIL.GROUP_JOINING_REQUEST,
                                            to: data.email,
                                            email: data.email,
                                            name: invitedBy,
                                            groupName: group.groupName ? group.groupName : '',
                                            password: null,
                                            joinMsg: '<div><strong>Username:</strong> {' + data.email + '}</div><div style="margin-bottom:10px"><strong></strong></div>',
                                            link: config.server_url + '/joingroup?groupId=' + groupId + '&email=' + data.email + '&pass=' + null
                                        }
                                        mailer.sendMail(request, function (res) {
                                            logger.info('Group Invitation sent to : ', email, 'status : ', res.status);
                                        });
                                        login.getDeviceIds(res.result[emailIndexPresent].userId, function (resp) {
                                            var message = {
                                                deviceIds: resp.result,
                                                userId: res.result[emailIndexPresent].userId,
                                                roleId: USER_CODES.STUDENT_ROLE,
                                                name: res.result[emailIndexPresent].firstName,
                                                body: CONSTANTS.NOTIFICATION.GROUP_INVITATION + ' ' + group.groupName + ' group.',
                                                textName: '',
                                                textMessage: CONSTANTS.NOTIFICATION.GROUP_INVITATION + ' ' + group.groupName + ' group.'
                                            };
                                            mobileNotification.sendNotification(message);
                                            groupHeaderCount(invitedUserId, USER_CODES.STUDENT_ROLE);
                                        });
                                        update(group, function (response) {
                                            callback({
                                                status: REQUEST_CODES.SUCCESS,
                                                message: GROUP_CODES.MEMBER_ADDED,
                                                result: memberList
                                            });
                                        });
                                    }
                                    // else {
                                    //     callback({
                                    //         status: REQUEST_CODES.FAIL,
                                    //         message: GROUP_CODES.MEMBER_ALREADY_IN_GROUP
                                    //     });
                                    //     return;
                                    // }
                                }
                                else {
                                    let newMember = {
                                        firstName: data.firstName,
                                        lastName: data.lastName,
                                        roleId: USER_CODES.STUDENT_ROLE,
                                        email: data.email,
                                        title: '',
                                        isActive: true,
                                        sendingEmail: false,
                                        isPasswordChanged: true
                                    };
                                    Users.create(newMember, function (resp) {
                                        if (resp.status == REQUEST_CODES.SUCCESS) {
                                            group.members.push({
                                                userId: resp.userId,
                                                isAdmin: false,
                                                status: GROUP_CODES.STATUS.INVITED,
                                                dateTime: utils.getSystemTime()
                                            })
                                            var password = utils.encrypt(resp.password);
                                            var request = {
                                                template: CONSTANTS.EMAIL.GROUP_JOINING_REQUEST,
                                                to: data.email,
                                                email: data.email,
                                                groupName: group.groupName ? group.groupName : '',
                                                name: invitedBy,
                                                password: resp.password,
                                                joinMsg: '<div><strong>Username:</strong> {' + data.email + '}</div><div style="margin-bottom:10px"><strong>Password:</strong> {' + resp.password + '}</div>',

                                                link: config.server_url + '/joingroup?groupId=' + groupId + '&email=' + data.email + '&pass=' + password
                                            }
                                            mailer.sendMail(request, function (res) {
                                                logger.info('Group Invitation sent to : ', data.email, 'status : ', res.status);
                                            });
                                            update(group, function (response) {
                                                callback({
                                                    status: REQUEST_CODES.SUCCESS,
                                                    message: GROUP_CODES.MEMBER_ADDED,
                                                    result: memberList
                                                });
                                            });
                                        } else {
                                            callback({
                                                status: REQUEST_CODES.FAIL,
                                                message: resp.message
                                            });
                                            return;
                                        }
                                    });
                                }
                            })
                        }
                    });
                }
                // else {
                //     callback({
                //         status: REQUEST_CODES.FAIL,
                //         message: REQUEST_CODES.MISSING_MANDATORY
                //     });
                // }
            }
        })
    } else {
        callback({
            status: REQUEST_CODES.FAIL,
            message: REQUEST_CODES.MISSING_MANDATORY
        });
    }
}


function addGroupMembers(body, callback) {
    var deviceIds;
    let members = body.members;
    let email = body.email;
    let invitedBy = body.invitedBy;
    let groupId = parseInt(body.groupId, 10);
    if (body.groupId) {
        getList({
            'groupId': groupId
        }, function (response) {
            if (response.result.length > 0) {
                var group = response.result[0];
                var memberList = group.members;
                if (members.length > 0) {
                    members.forEach(function (data) {
                        let index = memberList.findIndex(todo => (todo.userId == data.userId
                            && todo.roleId ? todo.roleId == data.roleId : null) ||
                            (todo.userId == data.userId));
                        if (index === -1) {
                            memberList.push({
                                userId: data.userId,
                                roleId: USER_CODES.STUDENT_ROLE,
                                isAdmin: false,
                                status: GROUP_CODES.STATUS.INVITED,
                                dateTime: utils.getSystemTime()
                            });
                        }
                        login.getDeviceIds(data.userId, function (resp) {
                            var message = {
                                deviceIds: resp.result,
                                userId: data.userId,
                                roleId: USER_CODES.STUDENT_ROLE,
                                name: '',
                                body: CONSTANTS.NOTIFICATION.GROUP_INVITATION + ' ' + group.groupName + ' group.',
                                textName: '',
                                textMessage: CONSTANTS.NOTIFICATION.GROUP_INVITATION + ' ' + group.groupName + ' group.'
                            };
                            mobileNotification.sendNotification(message);
                            groupHeaderCount(data.userId, USER_CODES.STUDENT_ROLE);
                        });

                    });
                    group.members = memberList;
                    update(group, function (response) {
                        callback({
                            status: REQUEST_CODES.SUCCESS,
                            message: GROUP_CODES.MEMBER_ADDED,
                            result: memberList
                        });
                    });
                } else if (email) {
                    Users.getList({
                        email: email.toLowerCase()
                    }, function (res) {
                        if (res.result.length > 0) {
                            let invitedUserId = res.result[0].userId;
                            // need to check if this userId already in group memeberlist.  
                            let index = memberList.findIndex(todo => todo.userId == invitedUserId);
                            if (index === -1) {
                                group.members.push({
                                    userId: invitedUserId,
                                    roleId: USER_CODES.STUDENT_ROLE,
                                    isAdmin: false,
                                    status: GROUP_CODES.STATUS.INVITED,
                                    dateTime: utils.getSystemTime()
                                });
                                var request = {
                                    template: CONSTANTS.EMAIL.GROUP_JOINING_REQUEST,
                                    to: email,
                                    email: email,
                                    name: invitedBy,
                                    groupName: group.groupName ? group.groupName : '',
                                    password: null,
                                    joinMsg: '<div><strong>Username:</strong> {' + email + '}</div><div style="margin-bottom:10px"></div>',
                                    link: config.server_url + '/joingroup?groupId=' + groupId + '&email=' + email + '&pass=' + null
                                }
                                mailer.sendMail(request, function (res) {
                                    logger.info('Group Invitation sent to : ', email, 'status : ', res.status);
                                });
                                login.getDeviceIds(res.result[0].userId, function (resp) {
                                    var message = {
                                        deviceIds: resp.result,
                                        userId: res.result[0].userId,
                                        roleId: USER_CODES.STUDENT_ROLE,
                                        name: res.result[0].firstName,
                                        body: CONSTANTS.NOTIFICATION.GROUP_INVITATION + ' ' + group.groupName + ' group.',
                                        textName: '',
                                        textMessage: CONSTANTS.NOTIFICATION.GROUP_INVITATION + ' ' + group.groupName + ' group.'
                                    };
                                    mobileNotification.sendNotification(message);
                                    groupHeaderCount(invitedUserId, USER_CODES.STUDENT_ROLE);
                                });
                                update(group, function (response) {
                                    callback({
                                        status: REQUEST_CODES.SUCCESS,
                                        message: GROUP_CODES.MEMBER_ADDED,
                                        result: memberList
                                    });
                                });
                            } else {
                                callback({
                                    status: REQUEST_CODES.FAIL,
                                    message: GROUP_CODES.MEMBER_ALREADY_IN_GROUP
                                });
                                return;
                            }
                        } else {
                            let newMember = {
                                firstName: body.firstName,
                                lastName: body.lastName,
                                roleId: USER_CODES.STUDENT_ROLE,
                                email: email,
                                title: '',
                                isActive: true,
                                sendingEmail: false,
                                isPasswordChanged: true
                            };
                            Users.create(newMember, function (resp) {
                                if (resp.status == REQUEST_CODES.SUCCESS) {
                                    group.members.push({
                                        userId: resp.userId,
                                        isAdmin: false,
                                        status: GROUP_CODES.STATUS.INVITED,
                                        dateTime: utils.getSystemTime()
                                    })
                                    var password = utils.encrypt(resp.password);
                                    let pwd = resp.password;
                                    var request = {
                                        template: CONSTANTS.EMAIL.GROUP_JOINING_REQUEST,
                                        to: email,
                                        email: email,
                                        name: invitedBy,
                                        groupName: group.groupName ? group.groupName : '',
                                        password: resp.password,
                                        joinMsg: '<div><strong>Username:</strong> {' + email + '}</div><div style="margin-bottom:10px"><strong>Password:</strong> {' + pwd + '}</div>',
                                        link: config.server_url + '/joingroup?groupId=' + groupId + '&email=' + email + '&pass=' + password
                                    }
                                    mailer.sendMail(request, function (res) {
                                        logger.info('Group Invitation sent to : ', email, 'status : ', res.status);
                                    });
                                    update(group, function (response) {
                                        callback({
                                            status: REQUEST_CODES.SUCCESS,
                                            message: GROUP_CODES.MEMBER_ADDED,
                                            result: memberList
                                        });
                                    });
                                } else {
                                    callback({
                                        status: REQUEST_CODES.FAIL,
                                        message: resp.message
                                    });
                                    return;
                                }
                            });
                        }
                    });
                } else {
                    callback({
                        status: REQUEST_CODES.FAIL,
                        message: REQUEST_CODES.MISSING_MANDATORY
                    });
                }
            }
        })
    } else {
        callback({
            status: REQUEST_CODES.FAIL,
            message: REQUEST_CODES.MISSING_MANDATORY
        });
    }
}

function updateMemberStatus(body, callback) {
    var message = GROUP_CODES.MEMBER_ADDED;
    if (body.groupId) {
        getList({
            'groupId': parseInt(body.groupId, 10)
        }, function (response) {
            if (response.result.length > 0) {
                var group = response.result[0];
                var memberList = group.members;
                Users.getList({ userId: parseInt(body.userId, 10) }, function (userRes) {
                    if (userRes.result.length > 0) {
                        var user = userRes.result[0];
                        //    if (user.roleId !== USER_CODES.PARENT_ROLE)
                        {
                            let index = memberList.findIndex(todo => (todo.userId == body.userId
                                && todo.roleId ? todo.roleId == body.roleId : null) ||
                                (todo.userId == body.userId));

                            if (body.status === GROUP_CODES.STATUS.REJECTED && index !== -1) {
                                if (memberList[index].status === GROUP_CODES.STATUS.ACCEPTED) {
                                    message = GROUP_CODES.MEMBER_REMOVED;
                                } else {
                                    message = GROUP_CODES.REQUEST_REJECT;
                                }
                                memberList.splice(index, 1);
                            } else if (index !== -1) {
                                memberList[index].status = body.status;
                                memberList[index].dateTime = utils.getSystemTime();
                                message = GROUP_CODES.REQUEST_ACCEPT;
                            }
                            group.members = memberList;
                            update(group, function (response) {
                                callback({
                                    status: REQUEST_CODES.SUCCESS,
                                    message: message,
                                    result: memberList
                                });
                            });
                        }
                        // else {
                        //     callback({
                        //         status: REQUEST_CODES.SUCCESS,
                        //         message: GROUP_CODES.STATUS.PARENT_JOIN_ERROR
                        //     });
                        // }          
                    }
                })
            } else {
                callback({
                    status: REQUEST_CODES.FAIL,
                    message: GROUP_CODES.GROUP_NOT_FOUND
                });
            }
        })
    } else {
        callback({
            status: REQUEST_CODES.FAIL,
            message: REQUEST_CODES.MISSING_MANDATORY
        });
    }
}

function updateGroupInfo(body, callback) {
    if (body.groupId) {
        getList({
            'groupId': parseInt(body.groupId, 10)
        }, function (response) {
            if (response.result.length > 0) {
                var group = response.result[0];
                if (body.aboutGroup) {
                    group.aboutGroup = body.aboutGroup;
                }
                //    if (body.otherInfo) {
                group.otherInfo = body.otherInfo;
                //   }
                if (body.groupName) {
                    group.groupName = body.groupName;
                }
                if (body.type) {
                    group.type = body.type;
                }
                if (body.groupImage) {
                    group.groupImage = body.groupImage;
                }
                update(group, function (response) {
                    callback({
                        status: REQUEST_CODES.SUCCESS,
                        message: GROUP_CODES.UPDATE_SUCCESS,
                        result: group
                    });
                });
            } else {
                callback({
                    status: REQUEST_CODES.FAIL,
                    message: GROUP_CODES.GROUP_NOT_FOUND
                });
            }
        });
    } else {
        callback({
            status: REQUEST_CODES.FAIL,
            message: REQUEST_CODES.MISSING_MANDATORY
        });
    }
}

function getGroupCount(studentList, callback) {
    var d = new Date();
    d.setDate(d.getDate() - 7);
    return GroupModel.aggregate([
        {
            $match: {
                '$and': [{ 'members.userId': { $in: studentList } },
                {
                    $or: [{ 'members.userId': USER_CODES.STUDENT_ROLE },
                    { 'members.userId': { $exists: false } }]
                },
                { 'members.dateTime': { $gte: d.getTime() } }, { 'members.status': 'Accepted' }]
            }
        },

        // Unwind the array
        { "$unwind": "$members" },

        // Actually match the tags within the now unwound array
        {
            $match: {
                '$and': [{ 'members.userId': { $in: studentList } },
                {
                    $or: [{ 'members.userId': USER_CODES.STUDENT_ROLE },
                    { 'members.userId': { $exists: false } }]
                },
                { 'members.dateTime': { $gte: d.getTime() } }, { 'members.status': 'Accepted' }]
            }
        },

        // Group by each tag
        {
            "$group": {
                _id: "$members.userId",
                "count": { "$sum": 1 }
            }
        },

        // Rename the _id for your output
        {
            "$project": {
                "_id": 0,
                "members.userId": "$_id",
                "count": 1
            }
        }
    ]).exec()
}

function getGroupInfo(data, callback) {
    let userId = parseInt(data.userId);
    let roleId = data.roleId ? parseInt(data.roleId) : null;
    var d = new Date();
    d.setDate(d.getDate() - 7);
    GroupModel.aggregate([
        {
            $match: {
                '$and': [{ 'members.userId': userId },
                {
                    $or: [{ 'members.userId': USER_CODES.STUDENT_ROLE },
                    { 'members.userId': { $exists: false } }]
                },
                { 'members.dateTime': { $gte: d.getTime() } }, { 'members.status': 'Accepted' }]
            }
        },
        { "$unwind": "$members" },

        // Actually match the tags within the now unwound array
        {
            $match: {
                '$and': [{ 'members.userId': userId },
                {
                    $or: [{ 'members.userId': USER_CODES.STUDENT_ROLE },
                    { 'members.userId': { $exists: false } }]
                },
                { 'members.dateTime': { $gte: d.getTime() } }, { 'members.status': 'Accepted' }]
            }
        },

        {
            $sort: {
                'members.dateTime': -1
            }
        },

    ]).exec(function (error, data) {
        if (error) {
            callback({
                status: REQUEST_CODES.FAIL,
                message: error
            });
        } else {

            let resResult = [];

            Users.getList({ userId: userId }, function (userRes) {
                let user = userRes.result[0];

                data.forEach(function (dataRes) {
                    let resResultJson = {};
                    resResultJson['actedBy'] = user.firstName + " " + (user.lastName ? user.lastName : "");
                    resResultJson['profileImage'] = user.profilePicture;
                    if (dataRes.createdBy == user.userId)
                        resResultJson['message1'] = ' created group ';
                    else
                        resResultJson['message1'] = ' became a member of ';

                    resResultJson['actedOn'] = dataRes.groupName;
                    resResultJson['actedUserId'] = user.userId;
                    resResultJson['actedRoleId'] = USER_CODES.STUDENT_ROLE;
                    resResultJson['message2'] = ".";

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

module.exports.getList = getList;
module.exports.create = create;
module.exports.update = update;
module.exports.remove = remove;
module.exports.getGroupCount = getGroupCount;
module.exports.getGroupInfo = getGroupInfo;
module.exports.trendingGroups = trendingGroups;
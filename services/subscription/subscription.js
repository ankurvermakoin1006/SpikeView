module.exports = function (app) {
    app.post('/ui/subscription', function (req, res) { //To Create subscription
        try {
            subscribeOrUnSubscribe(req.body, function (response) {
                res.json(response);
            });
        } catch (e) {
            res.json(e);
        }
    });
    app.get('/ui/subscription', function (req, res) { //To get subscription
        try {
            getList(req.query, function (response) {
                res.json(response);
            });
        } catch (e) {
            res.json(e);
        }
    });
    app.delete('/ui/subscription', function (req, res) { //To delete subscription
        try {
            remove(req.body, function (response) {
                res.json(response);
            });
        } catch (e) {
            res.json(e);
        }
    });
    app.put('/ui/subscription', function (req, res) { //To update subscription
        try {
            update(req.body, function (response) {
                res.json(response);
            });
        } catch (e) {
            res.json(e);
        }
    });
}

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var SubscriptionSchema = new Schema(require('./subscriptionSchema').subscriptionSchema, {
    collection: 'subscription'
});
var SubscriptionModel = mongoose.model('subscription', SubscriptionSchema);
var SubscriptionController = require('./subscriptionController');
var utils = require('../../commons/utils').utils;
var CONSTANTS = utils.CONSTANTS;
var REQUEST_CODES = CONSTANTS.REQUEST_CODES;
var SUBSCRIPTION_CODES = utils.CONSTANTS.SUBSCRIPTION;
var mongoUtils = utils.mongoUtils;

function subscribeOrUnSubscribe(data, callback) {
    var userQuery = {
        userId: data.userId,
        followerId: data.followerId
    };
    getList(userQuery, function (response) {
        if (response.result.length === 0) {
            create(data, callback);
        } else {
            data.subscribeId = response.result[0].subscribeId;
            update(data, callback);
        }
    });
}

function create(subscription, callback) {
    var subscriptionAPI;
    var errorList = [];
    try {
        subscriptionAPI = SubscriptionController.SubscriptionAPI(subscription);
    } catch (e) {
        errorList.push(e.error[0]);
        callback({
            status: REQUEST_CODES.FAIL,
            error: errorList
        });
        return;
    }
    var subscriptionModel = new SubscriptionModel(subscriptionAPI);
    mongoUtils.getNextSequence('subscribeId', function (oSeq) {
        subscriptionModel.subscribeId = oSeq;
        subscriptionModel.save(function (error) {
            if (error) {
                callback({
                    status: REQUEST_CODES.FAIL,
                    error: error
                });
                return;
            } else {
                callback({
                    status: REQUEST_CODES.SUCCESS,
                    message: SUBSCRIPTION_CODES.CREATE_SUCCESS,
                    result: {
                        subscribeId: subscriptionModel.subscribeId
                    }
                });
                return;
            }
        });
    });
}

function getList(query, callback) {
    SubscriptionModel.find(query, function (error, records) {
        if (error) {
            callback({
                status: REQUEST_CODES.FAIL,
                message: error
            });
            return;
        } else {
            records = records.map(function (record) {
                return new SubscriptionController.SubscriptionAPI(record);
            });
            callback({
                status: REQUEST_CODES.SUCCESS,
                result: records
            });
            return;
        }
    });
}

function update(subscription, callback) {
    SubscriptionModel.update({
        'subscribeId': subscription.subscribeId
    }, {
        $set: subscription
    }, function (error) {
        if (error) {
            callback({
                status: REQUEST_CODES.FAIL,
                message: error
            });
            return;
        } else {
            callback({
                status: REQUEST_CODES.SUCCESS,
                message: utils.formatText(SUBSCRIPTION_CODES.UPDATE_SUCCESS, subscription.status),
            });
            return;
        }
    });
}

function remove(query, callback) {
    SubscriptionModel.remove(query, function (error) {
        if (error) {
            callback({
                status: REQUEST_CODES.FAIL,
                message: error
            });
            return;
        } else {
            callback({
                status: REQUEST_CODES.SUCCESS,
                message: SUBSCRIPTION_CODES.DELETE_SUCCESS
            });
            return;
        }
    });
}

module.exports.create = create;
module.exports.getList = getList;
module.exports.remove = remove;
module.exports.update = update;
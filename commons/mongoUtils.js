var mongoose = require('mongoose');
var mongoosedata = require('../db/mongoose-data')
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;
var mongoUtils = {};
var Counter = new Schema({
    _id: {
        type: String,
        unique: true,
        required: true
    },
    seq: {
        type: Number,
        required: true,
        default: 1
    }
},
{
    collection: 'counters'
});

Counter.plugin(uniqueValidator);

var CounterModel = mongoose.model('Counter', Counter);

mongoUtils.getNextSequence = function(oSeq, callback){
    CounterModel.findByIdAndUpdate(oSeq, {$inc: {seq: 1}}, {upsert: true}, function (error, seqRec) {
        if (!error) {
            callback((seqRec || {}).seq || 1);
        } else {
            return callback(error);
        }
    });    
}

mongoUtils.getNextSequenceforBulkInsert = function(oSeq, length, callback){
    CounterModel.findByIdAndUpdate(oSeq, {$inc: {seq: length}}, {upsert: true}, function (error, seqRec) {
        if (!error) {
            callback((seqRec || {}).seq || 1);
        } else {
            return callback(error);
        }
    });
}

mongoUtils.resetCounter = function(oSeq, callback){
    var seqVal;
    if (oSeq == 'userId') {
        seqVal = 1001;
    } else {
        seqVal = 1;
    }
    CounterModel.findByIdAndUpdate(oSeq, {$set: {seq: seqVal}},  function (error, seqRec) {
        if (!error) {
            callback((seqRec || {}).seq);
        } else {
            return callback(error);
        }
    });    
}
module.exports.mongoUtils = mongoUtils;
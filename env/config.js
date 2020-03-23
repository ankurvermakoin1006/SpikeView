var app = require('express')();
var conf = {};
var logger = require('../logger.js');
module.exports.getConf = function() {
    if (conf.env != app.get('env')) {
        logger.info("current configuration :", app.get('env'));
        conf = require(__dirname + '/' + app.get('env'))
    }
    return conf;
}
var mongoose = require('mongoose'),
config = require('../env/config.js').getConf(),

mongoUrl = 'mongodb://' + config.mongoose.user +
		':' +  config.mongoose.password +
		'@' +  config.mongoose.host + ':' +  config.mongoose.port +
		'/' +  config.mongoose.dbName;
		//'?authSource=' +  config.mongoose.authSource;
console.log('mongoose url : ', mongoUrl);
var db = mongoose.connect(mongoUrl, { useMongoClient: true }, function(err) {
		if (err) 
			throw err;
	}
);

var onerror = function(error,callback){
 	mongoose.connection.close();
 	callback(error);
};

module.exports.db = db;

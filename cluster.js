var cluster = require('cluster');
var logger = require('./logger.js');
if (cluster.isMaster) {
    var numWorkers = require('os').cpus().length;
    logger.info('Master cluster setting up ' + numWorkers + ' workers...');
    for (var i = 0; i < numWorkers; i++) {
        cluster.fork();
    }

    cluster.on('online', function (worker) {
        logger.info('Worker ' + worker.process.pid + ' is online');
    });

    cluster.on('exit', function (worker, code, signal) {
        logger.info('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
        logger.info('Starting a new worker');
        cluster.fork();
    });
} else {
    require('./server.js');
}
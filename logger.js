var { createLogger, format }  = require('winston');

  const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.colorize(),
        format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.printf(info => `${info.timestamp} : ${info.message}`)
      ),
    exitOnError: false,
    transports: [
        new (require('winston-daily-rotate-file'))({
            filename: `./logs/spikeview-%DATE%.log'`,
            datePattern: 'YYYY-MM-DD',
            prepend:true,
            timestamp: true,
         //   zippedArchive: true         
        })
        // new (require('winston-daily-rotate-file'))({
        //     filename: `./logs/errors.log`,
        //     datePattern: 'YYYY-MM-DD-HH',
        //     zippedArchive: true,
        //     level: 'error'
        // })
    ],
});

function info(message) { 
   logger.info(message); 
}

function debug(message) {
    logger.info(message);   
}

function error(message) {
    logger.info(message);    
}

module.exports.info = info;
module.exports.debug = debug;
module.exports.error = error;
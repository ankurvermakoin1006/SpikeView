const express = require('express'),
    https = require('https'),
    http = require('http'),
    fs = require('fs'),
    app = express(),
    path = require('path'),
    bodyParser = require('body-parser'),
    errorhandler = require('errorhandler'),
    routes = require('./services/routes'),
    login = require('./services/login/login'),
    jobs = require('./services/jobs/jobs'),
    fileUpload = require('express-fileupload'),
    CONSTANTS = require('./commons/utils').utils.CONSTANTS,
    swaggerUi = require('swagger-ui-express'),
    swaggerDocument = require('./swagger.json'),
    helmet = require('helmet'),
    mongoSanitize = require('express-mongo-sanitize'),
    xss = require('xss-clean'),
    rateLimit = require('express-rate-limit');
    var logger = require('./logger.js');
const options = {
    key: fs.readFileSync('./spikeview.key'),
    cert: fs.readFileSync('./spikeview.crt')
};

app.set('view', __dirname + '/views');
app.set('view engine', 'jade');
app.use(bodyParser.urlencoded({
    extended: true
}));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter); // handle DOS attack, brute-force attack,
app.use(mongoSanitize()); //Preventing SQL/NoSQL Injection Attacks
app.use(xss()); // Preventing XSS Attacks
app.use(helmet());
app.use(bodyParser.json({
    limit: '100kb'
}));

app.use(errorhandler());
app.use('/', express.static(path.join(__dirname, '/')));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(fileUpload({
    limits: {
        fileSize: 50 * 1024 * 1024
    },
    useTempFiles: true,
    tempFileDir: '/temp/'
}));

app.get('/socket', function (req, res) {
    res.sendFile(__dirname + '/services/socket/index.html');
});

app.all('/*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Authorization, Origin,Accept,  Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Accept-Version, Content-Length");
    if (req.method != 'OPTIONS') {
        if (req.url.indexOf('/ui/') > -1 && req.headers.authorization != undefined) {
            login.verifyToken(req.headers.authorization, function (response) {
                if (response.status == CONSTANTS.REQUEST_CODES.FAIL) {
                    res.status(401).end();
                } else {
                    res.send = function (response) {
                        res.end(response);
                    };
                    next();
                }
            });
        } else if (['/ui/login', '/app'].some(function (url) {
                return req.url.indexOf(url) > -1;
            })) {
            res.send = function (response) {
                res.end(response);
            };
            next();
        } else {
            console.log(' ****** Request denied for URL ::: ' + req.url);
            res.status(401).end();
        }
    } else {
        res.send = function (response) {
            res.end(response);
        };
        next();
    }
});

routes(app);
process.on('uncaughtException', function (err) {
 //   logger.error(err);
});

//var server = https.createServer(options, app).listen(3002);
const server = http.createServer(app).listen(3002);
const socket = require('./services/socket/messaging');
socket(server);
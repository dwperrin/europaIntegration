/// <reference path="../../typings/tsd.d.ts"/>
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var logger = require('morgan');
//var passport = require('passport');
var cors = require('cors');
var soap = require('soap');
var mongoose = require('mongoose');
var port = process.env.PORT || 8001;
var sanitizer = require('./utils/sanitizer')();
var four0four = require('./utils/404.js')();
var serverConfig = require('./config/config.js');
var latin1SoapHttpClientRequest = require('./utils/latin1SoapHttpClientRequest');

var environment = process.env.NODE_ENV;

app.use(cors());
app.use(favicon(__dirname + '/favicon.ico'));
app.use(sanitizer);
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({limit: '5mb'}));
app.use(logger('dev'));

var apiRouter = require('./config/routes/api/api.js')();

var latin1SoapHttpClient = new soap.HttpClient();
latin1SoapHttpClient.request = latin1SoapHttpClientRequest;

soap.createClient(serverConfig.europaSoapConnectionSettings.url,
                               {httpClient: latin1SoapHttpClient},
                               function(err, client) {
                                    global.europaSoapClient = client;
                               });

console.log('About to crank up node');
console.log('PORT=' + port);
console.log('NODE_ENV=' + environment);

var connect = function (dbUri) {
    var options = {server: {socketOptions: {keepAlive: 1}}};
    mongoose.connect(dbUri, options);
};

switch (environment){
    case 'productionLive':
        console.log('** PRODUCTION LIVE **');
        connect(serverConfig.productionLive.dbUri);
        mongoose.connection.on('error', console.log);
        mongoose.connection.on('disconnected', connect);
        app.use('/api', apiRouter);
        app.use(express.static('./app/'));
        app.use('/*', express.static('./app/index.html'));
        break;
    case 'productionStaging':
        console.log('** PRODUCTION STAGING **');
        connect(serverConfig.productionStaging.dbUri);
        mongoose.connection.on('error', console.log);
        mongoose.connection.on('disconnected', connect);
        app.use('/api', apiRouter);
        app.use(express.static('./app/'));
        app.use('/*', express.static('./app/index.html'));
        break;
    case 'productionTest':
        console.log('** PRODUCTION TEST **');
        connect(serverConfig.productionTest.dbUri);
        mongoose.connection.on('error', console.log);
        mongoose.connection.on('disconnected', connect);
        app.use('/api', apiRouter);
        app.use(express.static('./app/'));
        app.use('/*', express.static('./app/index.html'));
        break;
    case 'build':
        console.log('** BUILD **');
        connect(serverConfig.build.dbUri);
        mongoose.connection.on('error', console.log);
        mongoose.connection.on('disconnected', connect);
        app.use('/api', apiRouter);
        app.use(express.static('./build/'));
        // Any invalid calls for templateUrls are under app/* and should return 404
        app.use('/app/*', function(req, res, next) {
            four0four.send404(req, res);
        });
        // Any deep link calls should return index.html
        app.use('/*', express.static('./build/index.html'));
        break;
    default:
        console.log('** DEV **');
        connect(serverConfig.test.dbUri);
        mongoose.connection.on('error', console.log);
        mongoose.connection.on('disconnected', connect);
        app.use('/api', apiRouter);
        app.use(express.static('./src/client/'));
        app.use(express.static('./'));
        app.use(express.static('./tmp'));
        // Any invalid calls for templateUrls are under app/* and should return 404
        app.use('/app/*', function(req, res, next) {
            four0four.send404(req, res);
        });
        // Any deep link calls should return index.html
        app.use('/*', express.static('./src/client/index.html'));
        break;
}

app.listen(port, function() {
    console.log('Express server listening on port ' + port);
    console.log('env = ' + app.get('env') +
        '\n__dirname = ' + __dirname  +
        '\nprocess.cwd = ' + process.cwd());
});

"use strict";

/* App server of Course Connect */

/*
 * ==== Set up ========
 */
var http = require('http'),                 // Http interface
    express = require('express'),           // Express web framework
    compression = require('compression'),   // Compression middleware
    morgan = require('morgan'),             // HTTP request logger middleware
    errorhandler = require('errorhandler'), // Dev-only error handler middleware
    bodyParser = require('body-parser'),    // Parse data body in post request
    fs = require('fs'),                     // File system
    config = require('./config.js'),        // App's local config - port#, etc
    portal = require('./routes/routes.js'), // Routes handlers
    session = require('express-session'); // Session

/*
 * ==== Create Express app server ========
 */
 var app = express();

// Configurations

// use port value in local config file
app.set('port', config.port);

// change param value to control level of logging
app.use(morgan('dev'));   // 'default', 'short', 'tiny', 'dev'

// use compression (gzip) to reduce size of HTTP responses
app.use(compression());

// return error details to client - use only during development
app.use(errorhandler({ dumpExceptions:true, showStack:true })); 

// parse application/json 
app.use(bodyParser.json());

// Set up to use a session
app.use(session({
    secret: 'super_secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

/*
 * App routes (API) - route-handlers implemented in routes/*
 */
app.get('/api', portal.api);
app.get('/name', portal.chatServices.getName);
app.post('/name', portal.chatServices.setName);
app.get('/logout', portal.chatServices.logout);
app.post('/addmsg', portal.chatServices.addMessage);
app.get('/messages', portal.chatServices.getMessages);

// location of app's static content
app.use(express.static(__dirname + "/app"));

// ==== Start HTTP server ========
http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port %d in %s mode", 
      app.get('port'), config.env 
    );
});
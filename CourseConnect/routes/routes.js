// Route handler of App server.
"use strict;"


/*
 * ================ Set up ================
 */
var express = require('express'),
    router = express.Router();  // route resolution


/*
 *  ================ App routes (API) ================
 */

var accountService = require('./api-account');
var classService = require('./api-class');
var chatService = require('./api-chat');

// User login authentication - authentication implemented in routes
router.post('/authenticate', accountService.authenticate);
// User sign up and authenticate account info, signUp implemented in routes
router.post('/signupCheck', accountService.signupCheck);
// Get current user info
router.get('/getUser', accountService.getUser);

router.post('/userinfo', accountService.getUserInfo);

router.post('/profpic-upload', accountService.uploadProfPic);

router.post('/refreshProfile', accountService.refreshProfPic);

router.post('/updatedispname', accountService.updateDispName);

router.post('/updateddesc', accountService.updateDescription);

router.get('/logout', accountService.logout);

// Get class room by courseid, semester and year
router.get('/getclass/:year/:semester/:coursecode', classService.getClass);
// Get a class room by id
router.get('/getclass/:classid', classService.getClassWithUserPermission);
// Create a class room
router.post('/createclass', classService.createClass);


module.exports = router; // exports router as a module
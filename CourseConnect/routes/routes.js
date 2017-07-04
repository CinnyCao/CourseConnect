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
var fileService = require('./api-fileuploads');

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
router.get('/getcrsenrolled', accountService.getCoursesEnrolled);
router.get('/logout', accountService.logout);

// Get class room by courseid, semester and year
router.get('/getclass/:year/:semester/:coursecode', classService.getClass);
// Create a class room
router.post('/createclass', classService.createClass);

router.post('/setChatRoom', fileService.setRoom);
router.post('/findFile', fileService.findFile);
router.post('/file-upload', fileService.uploadFile);
router.post('/deleteFile', fileService.deleteFile);
router.post('/file-store', fileService.storeFile);


module.exports = router; // exports router as a module
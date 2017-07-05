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
var postService = require('./api-post');

router.post('/isloggedin', accountService.isLoggedIn);

// User login authentication - authentication implemented in routes
router.post('/authenticate', accountService.authenticate);
// User sign up and authenticate account info, signUp implemented in routes
router.post('/signupCheck', accountService.signupCheck);
// Get user info by token
router.post('/getUser', accountService.getUserByToken);

router.post('/userinfo', accountService.getUserInfo);

router.post('/profpic-upload', accountService.uploadProfPic);

router.post('/refreshProfile', accountService.refreshProfPic);

router.post('/updatedispname', accountService.updateDispName);

router.post('/updateddesc', accountService.updateDescription);

router.post('/logout', accountService.logout);

// Get class room by courseid, semester and year
router.get('/getclass/:year/:semester/:coursecode', classService.getClass);
// Create a class room
router.post('/createclass', classService.createClass);

// --------------- Post Foum API----------------------------
router.post('/sendPost', postService.sendPost);
router.post('/getPosts', postService.getPosts);
router.post('/getFollowups', postService.getFollowups);


module.exports = router; // exports router as a module
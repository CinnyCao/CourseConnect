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
var chatService = require('./api-chat');
var fileService = require('./api-fileuploads');

// User login authentication - authentication implemented in routes
router.post('/authenticate', accountService.authenticate);
// User sign up and authenticate account info, signUp implemented in routes
router.post('/signupCheck', accountService.signupCheck);
// Get current user info
router.get('/getUser', accountService.getUser);
router.get('/userinfo', accountService.getUserInfo);
router.post('/profpic-upload', accountService.uploadProfPic);
router.post('/refreshProfile', accountService.refreshProfPic);
router.post('/updatedispname', accountService.updateDispName);
router.post('/updateddesc', accountService.updateDescription);
router.post('/getFriends', accountService.getFriends);

router.post('/allClassmatesInClass', classService.getStudents);

router.get('/getcrsenrolled', accountService.getCoursesEnrolled);
router.get('/logout', accountService.logout);

// Get class room by courseid, semester and year
router.get('/getclass/:year/:semester/:coursecode', classService.getClass);
// Get a class room by id
router.get('/getclass/:classid', classService.getClassWithUserPermission);
// Create a class room
router.post('/createclass', classService.createClass);
// Check if current user is in a class or not
router.get('/inclass/:classid', classService.checkIsInClass);
// join a class as student
router.get('/joinclass/:classid', classService.joinClass);

router.post('/setChatRoom', fileService.setRoom);
router.get('/files/:classid', fileService.findFile);
router.post('/file-upload', fileService.uploadFile);
router.post('/deleteFile', fileService.deleteFile);
router.post('/file-store', fileService.storeFile);


// --------------- Post Foum API----------------------------
router.post('/sendPost', postService.sendPost);
router.post('/getPosts', postService.getPosts);
router.post('/getFollowups', postService.getFollowups);
router.get('/getPostTags', postService.getPostTags);
router.post('/reportComplaint', postService.submitComplaint);


router.get('/messages/:classid', chatService.getMessages);
router.post('/sendMsg', chatService.sendMessage);


module.exports = router; // exports router as a module

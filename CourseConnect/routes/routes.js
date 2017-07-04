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

router.post('/isloggedin', accountService.isLoggedIn);

// User login authentication - authentication implemented in routes
router.post('/authenticate', accountService.authenticate);
// User sign up and authenticate account info, signUp implemented in routes
router.post('/signupCheck', accountService.signupCheck);

router.post('/userinfo', accountService.getUserInfo);

router.post('/profpic-upload', accountService.uploadProfPic);


router.post('/file-upload', accountService.uploadFile);

router.post('/file-store', accountService.storeFile);

router.post('/refreshProfile', accountService.refreshProfPic);


router.post('/updatedispname', accountService.updateDispName);

router.post('/updateddesc', accountService.updateDescription);

router.post('/get-users-class', accountService.getUsersInClass);


module.exports = router; // exports router as a module
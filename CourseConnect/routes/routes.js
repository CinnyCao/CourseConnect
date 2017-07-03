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

// User login authentication - authentication implemented in routes
router.post('/authenticate', accountService.authenticate);
// User sign up and authenticate account info, signUp implemented in routes
router.post('/signupCheck', accountService.signupCheck);
// Get user info by token
router.post('/getUser', accountService.getUserByToken);

// Get class room by courseid, semester and year
router.get('/getclass/:year/:semester/:courseid', classService.getClass);

module.exports = router; // exports router as a module

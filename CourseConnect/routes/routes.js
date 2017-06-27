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

// User login authentication - authentication implemented in routes
router.post('/authenticate', accountService.authenticate);
// User sign up and authenticate account info, signUp implemented in routes
router.post('/signupCheck', accountService.signupCheck);


module.exports = router; // exports router as a module

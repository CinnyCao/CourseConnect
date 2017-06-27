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

exports.getUserInfo = function (req, res) {
	exports.requestDbConnection(function (connection) {
		var query = "SELECT * FROM Users WHERE `Email`='guanyukevin.chen@gmail.com'";
		var result = connection.query(query, function (err, result) {
			if (err) {
				console.log("ERROR: Failed to execute query. Query: " + query);
                res.status(404).send("Auth query failed");
			}
			console.log("SUCCESS: Query executed and result sent. Result: " + result);
			res.status(200).send(result);
		});
	})
}

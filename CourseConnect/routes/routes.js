// Route handler of App server.
"use strict;"


/*
 * ================ Set up ================
 */
var mysql = require('mysql'),      // Nodejs driver for MySQL
    util = require('util'),       // Util lib facilitates console.log()
    async = require('async'),      // Async lib helps asynchronized execution
    config = require('./../config.js'),  // App's local config - port#, etc
    express = require('express'),
    router = express.Router(),  // route resolution
    db = require('./db_connection');  // db manager



/*
 *  ================ App routes (API) ================
 */

var authenticate = function (req, res) {
    var query = "SELECT * FROM Users WHERE `Email`='" + req.body.email + "';";
    db.executeQuery(query, function (err, result) {
        if (err) {
            console.log("ERROR: Failed to execute authenticate query. Query: " + query);
            res.status(404).send("Auth query failed");
        }
        console.log("SUCCESS: Authenticate query executed. Result: " + result);
        if (result.length == 0) {
            console.log("ERROR: Login email wasn't found in the database. Result: " + result);
            res.status(200).send(false);
        } else if (result[0]["Password"] != req.body.pwd) {
            console.log("ERROR: Password entered doesn't match password on database. Result: " + result);
            res.status(200).send(false);
        } else {
            console.log("SUCCESS: User logged in.");
            res.status(200).send(true);
        }
    });
};

var signupCheck = function (req, res) {
    var query = "INSERT INTO Users (Email, LastName, FirstName, Password) VALUES ('" + req.body.username + "', '" + req.body.ln + "', '" + req.body.fn + "', '" + req.body.pwd + "');";
    db.executeQuery(query, function (err, result) {
        if (err) {
            if (err.code != "ER_DUP_ENTRY") {
                console.log("ERROR: Query failed to execute. Query: " + query);
                res.status(404).send("Auth query failed");
            } else if (err.code == "ER_DUP_ENTRY") {
                console.log("ERROR: Failed to execute signupCheck. Query: " + query + "\nMessage: " + err);
                res.status(200).send(false);
            }
        } else {
            console.log("SUCCESS: Signup user created. Query: " + query);
            res.status(200).send(true);
        }
    });
};

var getChatRoom = function (req, res) {
    // todo
};


// User login authentication - authentication implemented in routes
router.post('/authenticate', authenticate);
// User sign up and authenticate account info, signUp implemented in routes
router.post('/signupCheck', signupCheck);

// Get data of chat rooms
router.get('/getchatroom/:roomid', getChatRoom);


module.exports = router; // exports whole files as a module

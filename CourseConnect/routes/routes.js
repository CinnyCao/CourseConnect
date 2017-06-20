// Route handler of App server.
"use strict;"


/*
 * ================ Set up ================
 */
var mysql = require('mysql'),      // Nodejs driver for MySQL
    util = require('util'),       // Util lib facilitates console.log()
    async = require('async'),      // Async lib helps asynchronized execution
    config = require('./../config.js');  // App's local config - port#, etc


/*
 * ================ Create Pool for SQL DB ================
 */
var pool = mysql.createPool({
    host: config.dbhost,
    database: config.dbname,
    user: config.dbuser,
    password: config.dbpwd,
    connectionLimit: 10
});


/**
 * Get one connection from DB pool
 */
exports.requestDbConnection = function (callback) {

    // Connect to DB
    pool.getConnection(function (connErr, connection) {
        if (connErr) {
            connection.destroy();
            console.log("ERROR: Failed to connect to database. " + connErr);
            resBody["error"] = "Failed to connect to database."
            res.status(502).send(resBody);
        } else {
            console.log("SUCCESS: Connected to database.");
            callback(connection);
        }
    });
};

/*
 *  ================ App routes (API) ================
 */
exports.api = function (req, res) {
    res.status(200).send('<h3>Course Connect API is running...</h3>');
};

var ctrlChat = require('./ctrl-chat');
exports.chatServices = ctrlChat;

exports.authenticate = function (req, res) {
    exports.requestDbConnection(function (connection) {
        var query = "SELECT * FROM Users WHERE `Email`='" + req.body.email + "';";
        var result = connection.query(query, function (err, result) {
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
    })
}

exports.signupCheck = function (req, res) {
    exports.requestDbConnection(function (connection) {
        var query = "INSERT INTO Users (Email, LastName, FirstName, Password) VALUES ('" + req.body.username + "', '" + req.body.ln + "', '" + req.body.fn + "', '" + req.body.pwd + "');";
        var result = connection.query(query, function (err, result) {
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
    })
}


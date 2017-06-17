// Route handler of App server.
"use strict;"


/*
 * ================ Set up ================
 */
var mysql = require('mysql'),      // Nodejs driver for MySQL
    util  = require('util'),       // Util lib facilitates console.log()
    async = require('async'),      // Async lib helps asynchronized execution
    config = require('./../config.js');  // App's local config - port#, etc


/*
 * ================ Create Pool for SQL DB ================
 */
var pool = mysql.createPool({
  host     : config.dbhost,
  database : config.dbname,
  user     : config.dbuser,
  password : config.dbpwd,
  connectionLimit : 10
});


/**
 * Get one connection from DB pool
 */
exports.requestDbConnection = function(callback) {

  // Connect to DB
  pool.getConnection(function (connErr, connection) {
    if (connErr) {
      connection.destroy();
      console.log("ERROR: Failed to connect to database. " + connErr);
      resBody["error"] = "Failed to connect to database."
      res.status(502).send(resBody);
    } else {
      console.log("Connected to database.");
      callback(connection);
    }});
};

/*
 *  ================ App routes (API) ================
 */

/*
 * Heartbeat test
 */
exports.api = function(req, res) {
  res.status(200).send('<h3>Course Connect API is running...</h3>');
};

exports.authenticate = function(req, res) {
  exports.requestDbConnection(function(connection) {
    var query = "SELECT * FROM Users WHERE `Email`='" + req.body.email + "';";
    var result = connection.query(query, function (err, result) {
      if (err) console.log("Failed to execute authenticate query. Query: " + query);
      console.log("Authenticate query executed. Result: " + result);
      if (result[0]["Password"] == req.body.pwd) {
        res.status(200).send("match");
      }
    });
  })
}


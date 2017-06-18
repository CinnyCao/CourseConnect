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
      if (err) {
       console.log("Failed to execute authenticate query. Query: " + query);
       res.status(404).send("Auth query failed");
     }
      console.log("Authenticate query executed. Result: " + result);
      console.log(result.length);
      if (result.length == 0) {
          console.log("False message");
        res.status(200).send(false);
      } else if (result[0]["Password"] != req.body.pwd) {
        res.status(200).send(false);
      } else {
        res.status(200).send(true);
      }
    });
  })
}

exports.signupCheck = function(req, res){
    exports.requestDbConnection(function(connection){
        var query = "INSERT INTO Users(Email, LastName, FirstName, UTorId, Password) VALUES ('" + req.body.username + "', '"
        + req.body.ln+"', '" +req.body.fn+"', '" + req.body.uid + "', '" +req.body.pwd + "')";
        var result = connection.query(query, function(err, result){
            console.log(query);
            if(err){ /*If the err is related to inserting an existent primary key, the function should return false. For any
            of the other err, 404 should be thrown*/
                console.log("Failed with error message: " + err.prototype.message + " "+ err.prototype.name);
                res.status(200).send(false);
            }/*else{

            }*/

            /*If there is no error with the query, the function should return true*/
            console.log("Insert Query is executed. Result: " + result);
            console.log(result.length);
            res.status(200).send(true);

        });
    })
}


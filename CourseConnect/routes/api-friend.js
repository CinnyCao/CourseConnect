// Route handler of App server.
"use strict;"

var db = require('./db_connection');  // db manager


exports.getFriendInfo = function (req, res) {
    if (req.session.userid) {
        var query = "SELECT fileLocation AS profilePic, " +
            "CASE WHEN DisplayName IS NULL OR DisplayName = '' THEN CONCAT(FirstName, ' ', LastName) ELSE DisplayName END AS name " +
            "FROM Users WHERE u_id IN ("+req.session.userid+", "+req.params.userid+")";
        db.executeQuery(query, function (err, result) {
            if (err) {
                console.error(err);
                res.status(500).json({
                    error: "An unexpected error occurred when querying the database"
                });
            } else if (result.length) {
                res.status(200).json(result);
            } else {
                res.sendStatus(404);
            }
        });
    } else {
        res.status(401).json({
            error: "User not logged in"
        });
    }
};

exports.checkIsFriend = function (req, res) {
    if (req.session.userid) {
        var query = "SELECT * FROM Friends WHERE User1 IN ("+req.session.userid+", "+req.params.userid+") AND " +
            "User2 IN ("+req.session.userid+", "+req.params.userid+") AND User1 != User2 AND hasAccepted = 1";
        console.log(query);
        db.executeQuery(query, function (err, result) {
            if (err) {
                console.error(err);
                res.status(500).json({
                    error: "An unexpected error occurred when querying the database"
                });
            } else if (result.length) {
                res.status(200).json({
                    isFriend: 1
                });
            } else {
                res.status(200).json({
                    isFriend: 0
                });
            }
        });
    } else {
        res.status(401).json({
            error: "User not logged in"
        });
    }
};

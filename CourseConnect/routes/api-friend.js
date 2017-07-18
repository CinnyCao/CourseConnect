// Route handler of App server.
"use strict;"

var db = require('./db_connection');  // db manager


/**Get Friends */
exports.getFriends = function (req, res) {
    if (req.session.userid) {
        var friendQuery = "SELECT User2, fileLocation, LastName, FirstName, DisplayName FROM UsersFriends INNER JOIN Users WHERE User1=" + req.session.userid + " AND User2=u_id;";
        db.executeQuery(friendQuery, function (err, result) {
            if (err) {
                console.error("ERROR: Failed to execute token query." + err);
                res.status(404).send("query failed to execute");
            }
            console.log(result);
            res.status(200).send(result);
        });
    }
};

exports.unfriendUser = function (req, res) {
    if (req.session.userid) {
        var query1 = "DELETE FROM UsersFriends WHERE User1=" + req.session.userid + " AND User2=" + req.body.user + ";";
        var query2 = "DELETE FROM UsersFriends WHERE User2=" + req.session.userid + " AND User1=" + req.body.user + ";";
        db.executeQuery(query1, function (err, result) {
            if (err) {
                console.error("ERROR: Failed to execute delete query. Error: " + err);
                res.status(404).json({
                    result: err,
                    deletion: false
                });
            }
            db.executeQuery(query2, function (err, result) {
                if (err) {
                    console.error("ERROR: Failed to execute delete query. Error: " + err);
                    res.status(404).json({
                        result: err,
                        deletion: false
                    });
                }
                res.status(200).json({
                    result: result,
                    deletion: true
                })
            })
        })
    }
}



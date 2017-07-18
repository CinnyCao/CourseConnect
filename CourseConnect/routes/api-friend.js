// Route handler of App server.
"use strict;"

var db = require('./db_connection');  // db manager


/**Get Friends */
exports.getFriends = function (req, res) {
    if (req.session.userid) {
        var friendQuery = "SELECT User2, fileLocation, LastName, FirstName, DisplayName FROM UsersFriends INNER JOIN Users WHERE User1=" + req.session.userid + " AND User2=u_id;";
        console.log(friendQuery);
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

// Route handler of App server.
"use strict;"

var db = require('./db_connection');  // db manager


exports.sendMessage = function (req, res) {
    if (req.session.userid) {
        var query = "INSERT INTO Message (message, ParticipantID) VALUES ('" + req.body.message + "', " + req.body.pId + ")";
        db.executeQuery(query, function (err, result) {
            if (err) {
                console.error(err);
                res.status(500).json({
                    error: "An unexpected error occurred when querying the database"
                });
            } else {
                res.sendStatus(200);
            }
        });
    } else {
        res.status(401).json({
            error: "User not logged in"
        });
    }
};

exports.sendMessageAnonymously = function(req, res) {
    if(req.session.userid) {
        var createAnonymousID = "INSERT INTO Participant(UserID, ClassID, RoleID) VALUES(50," + req.body.classid + ",4) ON DUPLICATE KEY UPDATE UserID=50 AND ClassID="+ req.body.classid + ";";
        var getAnonymousIDInChatroom = "SELECT p_id FROM Participant WHERE UserID=50 AND ClassID=" + req.body.classid + ";";
        db.executeQuery(createAnonymousID, function(baderr) {
            if(baderr) {
                console.error(baderr);
                res.status(500).json({
                    error: "Unable to post as anonymous user in chatroom."
                });
            } else {
                db.executeQuery(getAnonymousIDInChatroom, function(fetcherr, idResult) {
                    if(fetcherr) {
                        console.error(fetcherr);
                        res.status(500).json({
                            error: "Unable to retrieve Anonymous ID."
                        });
                    } else {
                        console.log(idResult);
                        console.log("FOUND THE RESULT!");
                        var anonymousMessage = "INSERT INTO Message(message, ParticipantID) VALUES('" + req.body.message + "'," + idResult[0]["p_id"] + ");";
                        db.executeQuery(anonymousMessage, function(err, result) {
                            if(err) {
                                console.error(err);
                                res.status(500).json({
                                    error: "An unexpected error occured when sending message."
                                });
                            } else {
                                res.sendStatus(200);
                            }
                        });
                    }
                });
            }
        });
    } else {
        res.status(401).json({
            error:"User not logged in."
        });
    }
}

exports.getMessages = function (req, res) {
    if (req.session.userid) {
        var query = "SELECT Message.m_id AS messageId, Users.u_id AS userId, Users.fileLocation AS profilePic, " +
            "CASE WHEN Users.DisplayName IS NULL OR Users.DisplayName = '' THEN CONCAT(Users.FirstName, ' ', Users.LastName) ELSE Users.DisplayName END AS name, " +
            "Message.message AS message, DATE_FORMAT(CONVERT_TZ(Message.messageTime, '-01:00', '-05:00'), '%Y-%m-%d %T') as time "+
            "FROM Message, Participant, Users WHERE Message.ParticipantID = Participant.p_id AND Participant.UserID = Users.u_id AND " +
            "Participant.ClassID = '" + req.params.classid + "' ORDER BY Message.m_id ASC";
        db.executeQuery(query, function (err, result) {
            if (err) {
                console.error(err);
                res.status(500).json({
                    error: "An unexpected error occurred when querying the database"
                });
            } else if (result.length) {
                res.status(200).json(result);
            } else {
                res.sendStatus(204);
            }
        });
    } else {
        res.status(401).json({
            error: "User not logged in"
        });
    }
};

exports.getPrivateMessages = function (req, res) {
    if (req.session.userid) {
        var query = "SELECT pm.pm_id AS messageId, pm.message AS message, DATE_FORMAT(CONVERT_TZ(pm.messageTime, '-01:00', '-05:00'), '%Y-%m-%d %T') AS time, " +
            "fromU.u_id AS userId, fromU.fileLocation AS profilePic, " +
            "CASE WHEN fromU.DisplayName IS NULL OR fromU.DisplayName = '' THEN CONCAT(fromU.FirstName, ' ', fromU.LastName) ELSE fromU.DisplayName END AS name " +
            "FROM PrivateMessage AS pm, Users AS fromU, Users AS toU WHERE pm.from_user_id = fromU.u_id AND pm.to_user_id = toU.u_id AND " +
            "(pm.from_user_id IN ("+req.session.userid+", "+req.params.userid+") AND pm.to_user_id IN ("+req.session.userid+", "+req.params.userid+")) " +
            "ORDER BY messageId ASC";
        db.executeQuery(query, function (err, result) {
            if (err) {
                console.error(err);
                res.status(500).json({
                    error: "An unexpected error occurred when querying the database"
                });
            } else if (result.length) {
                res.status(200).json(result);
            } else {
                res.sendStatus(204);
            }
        });
    } else {
        res.status(401).json({
            error: "User not logged in"
        });
    }
};

exports.sendPrivateMessage = function (req, res) {
    if (req.session.userid) {
        var query = "INSERT INTO PrivateMessage (message, from_user_id, to_user_id) VALUES ('" + req.body.message + "', " + req.session.userid + ", " + req.body.toUserId + ")";
        db.executeQuery(query, function (err, result) {
            if (err) {
                console.error(err);
                res.status(500).json({
                    error: "An unexpected error occurred when querying the database"
                });
            } else {
                res.sendStatus(200);
            }
        });
    } else {
        res.status(401).json({
            error: "User not logged in"
        });
    }
};

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
            "CONCAT(Users.FirstName, ' ', Users.LastName) AS name, Message.message AS message, DATE_FORMAT(Message.messageTime, '%Y-%m-%d %T') as time "+
            "FROM Message, Participant, Users WHERE Message.ParticipantID = Participant.p_id AND Participant.UserID = Users.u_id AND " +
            "Participant.ClassID = '" + req.params.classid + "' ORDER BY Message.m_id ASC";
        db.executeQuery(query, function (err, result) {
            if (err) {
                console.error(err);
                res.status(500).json({
                    error: "An unexpected error occurred when querying the database"
                });
            } else if (result.length) {
                console.log(result);
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
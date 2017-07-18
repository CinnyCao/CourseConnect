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
};

exports.sendFriendRequest = function(req, res){
    var checkIfReqExist = 
        "SELECT COUNT(f_id) AS Record FROM cscc01.Friends " +
        "WHERE User1=" + req.body.sender + " " +
        "AND User2=" + req.body.receiver; 

    var friendReqSQL = 
        "INSERT INTO cscc01.Friends " +
        "(User1, User2, hasAccepted) " +
        "VALUES (" + req.body.sender + "," + req.body.receiver + "," + "0" + ")";

    db.executeQuery(checkIfReqExist, function(err, reqResult){
        if (err){
            console.error("ERROR: Failed to check if friend request already exist. Query:" + checkIfReqExist + err);
            res.status(400).send({msg:"An unexpected error occured. Please try again."});
        }else if (reqResult[0].Record == 0){
            db.executeQuery(friendReqSQL, function(err, result){
                if (err){
                    console.error("ERROR: Failed to execute query " + friendReqSQL + err);
                    res.status(403).send({msg:"An unexpected error occured. Please try again."});
                }else{
                    console.info("INFO: Successfully injected friend request to DB.");
                    res.status(200).send({msg:"Friend request sent."})
                }
            })
        } else{
            res.status(200).send({msg: "Friend request already sent."})
        }
    })
}


exports.acceptFriendRequest = function (req, res){
    var acceptFriendSQL = 
        "INSERT INTO cscc01.UsersFriends " +
        "VALUES (" + req.body.userOne + "," + req.body.UserTwo + ")," +
         "VALUES (" + req.body.userTwo + "," + req.body.UserOne + ")";
    
    db.executeQuery(acceptFriendSQL, function(err, result){
        if (err){
            console.error("ERROR: Failed to execute query " + acceptFriendSQL + err);
            res.status(403).send({msg:"An unexpected error occured. Please try again."});
        }else{
            console.info("INFO: Successfully added friend to DB.");
            res.status(200).send({msg:"Accepted friend request."})
        }
    })
}

exports.rejectFriendRequest = function (req, res){
    var deleteReqSQL = 
        "DELETE FROM cscc01.Friends " +
        "WHERE f_id=" + req.body.f_id;
    
    db.executeQuery(deleteReqSQL, function(err, result){
        if (err){
            console.error("ERROR: Failed to execute query " + deleteReqSQL + err);
            res.status(403).send({msg:"An unexpected error occured. Please try again."});
        }else{
            console.info("INFO: Successfully removed friend request from DB.");
            res.status(200).send({msg:"Rejected friend request."})
        }
    })
}

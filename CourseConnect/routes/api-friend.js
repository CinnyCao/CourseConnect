// Route handler of App server.
"use strict;"

var db = require('./db_connection');  // db manager


/**Get Friends */
exports.getFriends = function (req, res) {
    if (req.session.userid) {
        var friendQuery = "Call getFriendsByID('" + req.session.userid + "')";
        db.executeQuery(friendQuery, function (err, result) {
            if (err) {
                console.error("ERROR: Failed to execute token query." + err);
                res.status(200).send({ isvalid: false, friends: [] });
            }
            console.log(result);
            if (result.length >= 1) {

                console.log("SUCCESS: " + req.session.userid + " ID has friends." + result[0]);
                res.status(200).send({ isvalid: true, friends: result[0] });
            } else {
                console.log("SUCCESS: " + req.session.userid + " ID is a lone wolf. DangerZone!");
                res.status(200).send({ isvalid: true, friends: result[0] });
            }
        });
    } else {
        res.status(401).json({
            error: "User not logged in"
        });
    }
};

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
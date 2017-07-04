// Route handler of App server.
"use strict;"

var db = require('./db_connection');  // db manager

exports.sendPost = function(req, res){
    var injectPostQuery = 
        "INSERT INTO cscc01.Posts (Title, postTime, description, ParticipantID, Parent_PO_id, room_id, snipet) " +
        "VALUES (" + 
            '"' + req.body.title + '",' +
            '"' + req.body.timestamp + '",' +
            '"' + req.body.description + '",' +
            '"' + req.body.userID + '",' +
            '"' + req.body.parentPostID + '",' +
            '"' + req.body.roomID + '",' +
            '"' + req.body.snipet + '"' +
        ")";

    db.executeQuery(injectPostQuery, function(err){
        if (err){
            console.error("ERROR: Failed to inject post into DB. Query: " + injectPostQuery + err);
            res.status(500).json({
                error: "An unexpected error occurred when querying the database",
                success:false
            });
        }else{
            console.log("SUCCESS: Post injected to DB successfully");
             res.status(200).json({
                message: "Post injected to DB successfully.",
                success:true
            });
        }
    })
}

exports.getPosts = function(req, res){
    var getPostQuery = 
        "SELECT *, " +
        "DATE_FORMAT(postTime,'%d/%m/%Y') as postTime " + 
        "FROM " +
        "cscc01.Posts " +
        "WHERE room_id=" + req.body.roomID;

    db.executeQuery(getPostQuery, function(err, result){
        if (err){
            console.error("ERROR: Failed to get posts from DB. Query: " + injectPostQuery + err);
            res.status(500).json({
                error: "An unexpected error occurred when querying the database",
                success:false
            });
        }else{
            console.log("SUCCESS: Retrieved list of post.");
             res.status(200).json({
                postList: result,
                success:true
            });
        }
        
    })    
}
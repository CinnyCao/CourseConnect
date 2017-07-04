// Route handler of App server.
"use strict;"

var db = require('./db_connection');  // db manager

exports.sendPost = function(req, res){
    var injectPostQuery = 
        "INSERT INTO cscc01.Posts (Title, postTime, description, ParticipantID, Parent_PO_id) " +
        "VALUES (" + 
            "'" + req.body.title + "'," +
            "'" + req.body.timestamp + "'," +
            "'" + req.body.description + "'," + 
            "'" + req.body.userID + "'," + 
            "'" + req.body.parentPostID + "'" + 
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
// Route handler of App server.
"use strict;"

var db = require('./db_connection');  // db manager

// Query DB to inject post.
exports.sendPost = function(req, res){
    var injectPostQuery = 
        "INSERT INTO cscc01.Posts (Title, postTime, description, ParticipantID, Parent_PO_id, room_id, snipet) " +
        "VALUES (" + 
            '"' + req.body.title + '",' +
            '"' + req.body.timestamp + '",' +
            '"' + req.body.description + '",' +
            '"' + req.session.userid + '",' +
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

// Query DB to retrieve posts for given chatroom. 
exports.getPosts = function(req, res){

    var getPostQuery =
        "SELECT *, " +
        "DATE_FORMAT(postTime,'%d/%m/%Y') as postTime " + 
        "FROM " +
        "cscc01.Posts " +
        "INNER JOIN cscc01.Users ON Posts.participantID=Users.u_id " +
        "WHERE room_id=" + req.body.roomID + " " +
        "AND parent_po_id=-1 " + 
        "ORDER BY po_id DESC";

    db.executeQuery(getPostQuery, function(err, result){
        if (err){
            console.error("ERROR: Failed to get posts from DB. Query: " + getPostQuery + err);
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

// Query DB to retrieve follow up posts for given post. 
exports.getFollowups = function(req, res){
    var getFollowupsQuery = 
        "SELECT *, " +
        "DATE_FORMAT(postTime,'%d/%m/%Y') as postTime " + 
        "FROM " +
        "cscc01.Posts " +
        "INNER JOIN cscc01.Users ON Posts.participantID=Users.u_id " +
        "WHERE parent_po_id=" + req.body.postID;
    
    db.executeQuery(getFollowupsQuery, function(err, result){
        if (err){
            console.error("ERROR: Failed to get followup posts from DB. Query: " + getFollowupsQuery + err);
            res.status(500).json({
                error: "An unexpected error occurred when querying the database",
                success:false
            });
        }else{
            console.log("SUCCESS: Retrieved list of post.");
             res.status(200).json({
                followupList: result,
                success:true
            });
        }
        
    })    
}

exports.submitComplaint = function (req, res) {
    var getReportedUserIDQuery = "SELECT u_id FROM Users WHERE FirstName='" + req.body.fn + "' AND LastName='" + req.body.ln + "';";
    db.executeQuery(getReportedUserIDQuery, function(err, result) {
        if (err) {
            console.error("ERROR: cannot retrieve post user information. Error: " + err);
            res.status(500).json({
                error: "An unexpected error occured when querying the database",
                reported: false
            });
        }
        var getPostIDQuery = "SELECT po_id FROM Posts WHERE description='" + req.body.quote + "' AND ParticipantID=" + result[0].u_id + " AND room_id=" + req.body.roomid + ";";
        db.executeQuery(getPostIDQuery, function(err, result) {
            if (err) {
                console.error("ERROR: cannot retrieve post id. Error: " + err);
                res.status(500).json({
                    error: "An unexpected error occured when querying the database",
                    reported: false
                });
            }
            var recordComplaintQuery = "INSERT INTO Complaints (User, Summary, PostNum, Description) VALUES (" + req.session.userid + ", '" + req.body.title + "', " + result[0].po_id + ", '" +
                    req.body.quote + "');";
            db.executeQuery(recordComplaintQuery, function(err, result) {
                if (err) {
                    console.error("ERROR: cannot record complaint. Error: " + err);
                    res.status(500).json({
                        error: "An unexpected error occured when querying the database",
                        reported: false
                    });
                }
                res.status(200).json({
                    result: result,
                    reported: true
                });
            })
        })
    })
}
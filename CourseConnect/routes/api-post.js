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

exports.sendPostAnon = function(req, res) {
    var createAnonymousID = "INSERT INTO Participant(UserID, ClassID, RoleID) VALUES(50," + req.body.roomID + ",4) ON DUPLICATE KEY UPDATE UserID=50 AND ClassID="+ req.body.roomID + ";";

    db.executeQuery(createAnonymousID, function(baderr) {
            if(baderr) {
                console.error(baderr);
                res.status(500).json({
                    error: "Unable to post as anonymous user in chatroom."
                });
            } else {
                var injectPostQuery =
                    "INSERT INTO Posts (Title, postTime, description, ParticipantID, Parent_PO_id, room_id, snipet) " +
                    "VALUES(" +
                        '"' + req.body.title + '",' +
                        '"' + req.body.timestamp + '",' +
                        '"' + req.body.description + '",' +
                        '"50",' +
                        '"' + req.body.parentPostID + '",' +
                        '"' + req.body.roomID + '",' +
                        '"' + req.body.snipet + '"' +
                    ");";

                db.executeQuery(injectPostQuery, function(err) {
                    if(err) {
                        console.error("ERROR: Failed to inject post into DB. Query: " + injectPostQuery + err);
                        res.status(500).json({
                            error: "An unexpected error occurred when querying the database",
                            success:false
                        });
                    } else {
                        console.log("SUCCESS: Anonymous post injected to DB successfully");
                        res.status(200).json({
                            message: "Anonymous post injected to DB successfully.",
                            success: true
                        });
                    }
                });
            }
    });
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
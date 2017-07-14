// Route handler of App server.
"use strict;"

var db = require('./db_connection');  // db manager

// Query DB to inject post.
exports.sendPost = function(req, res){
    //var isSolved = (req.body.solve == 'solved');
    var injectPostQuery = 
        "INSERT INTO cscc01.Posts (Title, postTime, description, ParticipantID, Parent_PO_id, room_id, snipet, solved) " +
        "VALUES (" + 
            '"' + req.body.title + '",' +
            '"' + req.body.timestamp + '",' +
            '"' + req.body.description + '",' +
            '"' + req.session.userid + '",' +
            '"' + req.body.parentPostID + '",' +
            '"' + req.body.roomID + '",' +
            '"' + req.body.snipet + '",' + '"' + req.body.solve + '"' +
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
};

exports.displaySol = function(req, res){
    var query = "Select * from cscc01.Posts INNER JOIN cscc01.Users ON Posts.participantID=Users.u_id " +
        "Where po_id=" + req.body.solution + ";";
    db.executeQuery(query, function(err, result){
        if(err){
            console.error("ERROR: Failed to retrieve the solution from required post" + query + err);
            res.status(500).json({error: "An unexpected error occured when querying the database", success: false});
        }else{
            res.status(200).json({solInfo: result, success: true});
        }
    });

};


exports.checkIdentity = function(req, res){
    var grabAuthor = "Select * from cscc01.Posts Where po_id=" + req.body.id + ";";
    db.executeQuery(grabAuthor, function(err, result){
       if(err){

       } else{
            res.status(200).json({equal: (result[0].ParticipantID == req.session.userid), success: true});
       }
    });
}


exports.adoptAFollowup = function(req, res){
           var parentID = req.body.parent.po_id;
            var addSolution;
            console.log("adopt is " + req.body.adopt);
           if(req.body.adopt == "adopt") {
               addSolution = "UPDATE cscc01.Posts SET Posts.solved='solved', Posts.solution=" + req.body.post.po_id + " " +
                   "Where po_id=" + parentID + ";";
           } else if(req.body.adopt == "unadopt"){
                console.log("Here to unadopt");
                addSolution = "UPDATE cscc01.Posts SET Posts.solved='unsolved', Posts.solution=NULL Where po_id="
               + parentID + ";";
           }

           db.executeQuery(addSolution, function(err, result){
                if(err){
                    console.error("ERROR: Failed to add the solution from DB. Query: " + addSolution + err);
                    res.status(500).json({error: "An unexpected error occured when querying the database",
                        success: false});
                }else{
                    console.log("The parent id is "+ parentID);
                    var retrieveParent = "Select * from cscc01.Posts INNER JOIN cscc01.Users" +
                        " ON Posts.participantID=Users.u_id " +
                        "Where po_id=" + parentID + ";";
                    db.executeQuery(retrieveParent, function(err, result){
                        if(err){
                            console.error("ERROR: Failed to retrieve the parent id from DB. Query: " + retrieveParent +
                                err);
                            res.status(500).json({error: "An unexpected error occured when querying the database",
                                success: false});
                        }else{
                            console.log("Hello");
                            console.log("The parent is " + result);
                            res.status(200).json({select: result, success: true});
                        }

                    });
                   //res.status(200).json({success: true})
                }
           })
       //}
    //});
};


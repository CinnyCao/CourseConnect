// Route handler of App server.
"use strict;"

var db = require('./db_connection');  // db manager
var chatRoom;

exports.setRoom = function(req, res) {
    if (req.body.chatroom != 'default') {
        chatRoom = req.body.chatroom;
    }
};
exports.logout = function (req, res) {
    // destroy session when logout
    req.session.destroy(function () {
        res.status(200).send(true);
    });
};

exports.authenticate = function (req, res) {
    if (req.session.userid) { // this shouldn't happen
        res.status(400).json({
            error: "user already logged in"
        });
    }

    var query = "SELECT * FROM Users WHERE `Email`='" + req.body.email + "';";
    db.executeQuery(query, function (err, result) {
        if (err) {
            console.log("ERROR: Failed to execute authenticate query. Query: " + query);
            res.status(404).send("Auth query failed");
        }
        console.log("SUCCESS: Authenticate query executed. Result: " + result);
        if (result.length == 0) {
            console.log("ERROR: Login email wasn't found in the database. Result: " + result);
            res.status(200).send({ isvalid: false });
        } else if (result[0]["Password"] != req.body.pwd) {
            console.log("ERROR: Password entered doesn't match password on database. Result: " + result);
            res.status(200).send({ isvalid: false });
        } else {
            console.log("SUCCESS: User logged in.");
            // record user id in session
            req.session.userid = result[0].u_id;
            res.status(200).send({ isvalid: true });
        }
    });
};

exports.signupCheck = function (req, res) {
    var query = "INSERT INTO Users (Email, LastName, FirstName, Password, UTorID) VALUES ('" + req.body.username + "', '" + req.body.ln + "', '" + req.body.fn + "', '" + req.body.pwd + "', '" + 
        req.body.utorid + "');";
    db.executeQuery(query, function (err, result) {
        if (err) {
            if (err.code != "ER_DUP_ENTRY") {
                console.log("ERROR: Query failed to execute. Query: " + query);
                res.status(404).send("Auth query failed");
            } else if (err.code == "ER_DUP_ENTRY") {
                console.log("ERROR: Failed to execute signupCheck. Query: " + query + "\nMessage: " + err);
                res.status(200).send(false);
            }
        } else {
            console.log("SUCCESS: Signup user created. Query: " + query);
            res.status(200).send(true);
        }
    });
};

exports.findFile = function(req, res){

    var query;
      query = "Select fileLocation from Resources AS r INNER JOIN Participant AS p ON r.ParticipantID=p.p_id INNER " +
          "JOIN Class AS c ON c.c_id=p.ClassID WHERE c.CourseCode='" + req.body.coursecode + "';";
    db.executeQuery(query, function (err, result){
        if(err){
            console.log("ERROR: Failed to retrieve fileLocation. Error: " + err);
            res.status(404);
        }
        res.status(200).send(result);
    });
};

exports.uploadFile = function(req, res){
    var fs = require('fs');
    var mkdirp = require('mkdirp');
    //var chatroom = req.get('loc');
    console.log(req.files.file.name);
    console.log("The chatRoom is " + chatRoom);


    var fileLocation = __dirname + "/../app/file/" + chatRoom + "/" + req.files.file.name;
    mkdirp(__dirname + "/../app/file/" + chatRoom, function(err){
       if (err){
           console.log(err);
       }
        fs.writeFile(fileLocation, req.files.file.data, function(err){
            if (err){
                console.log(err);
            }

            console.log("The file is saved!")
        });
    });
};

exports.deleteFile = function(req, res) {
    //var query = "Delete "
    var query = "Select user_id from session Where session='" + req.body.token + "';";
    var courseCode = req.body.coursecode;
    var userId;
    var c_id;
    var p_id;
    var r_id;
    console.log(query);

    db.executeQuery(query, function (err, result) {
        if (err) {
            console.log("ERROR: Failed to retreive user ID. Error: " + err);
            res.status(404).send("Failed to retrieve user ID");
        }

        userId = result[0].user_id;

        //var query2 = "UPDATE Users SET fileLocation='" + "img/" + req.body.file + "' WHERE u_id=" + result[0].user_id + ";";
        var query2 = "Select c_id from Class Where CourseCode='" + courseCode + "'; ";
        db.executeQuery(query2, function (err, result) {
            if (err) {
                console.log("ERROR: Failed to retreive c_id. Error: " + err);
                res.status(404);
            }
            c_id = result[0].c_id;
            var query3 = "Select p_id from Participant Where UserID='" + userId + "' and ClassID='" + c_id +
                "';";
            db.executeQuery(query3, function (err, result) {
                if (err) {
                    console.log("ERROR: Failed to retrive p_id. Error: " + err);
                    res.status(404);
                }
                //var resourceTime = new Date();
                p_id = result[0].p_id;
                var query4 = "Select r_id from Resources Where fileLocation='" + req.body.fileName + "' and ParticipantID='" + p_id + "';";
                db.executeQuery(query4, function(err, result){
                   if(err){
                       console.log("ERROR: Failed to retrieve r_id. Error:" + err);
                       res.status(404);
                   }
                   r_id = result[0].r_id;
                   var queryDel = "DELETE FROM Resources Where r_id='" + r_id + "';";
                   db.executeQuery(queryDel, function(err, result){
                      if(err){
                          console.log("ERROR: Failed to delete the file. Error: " + err);
                          res.status(404);
                      }
                      res.status(200).send(true);
                   });
                });
            });
        });
    });

};


exports.storeFile = function(req, res){
    var query = "Select user_id from session Where session='" + req.body.token + "';";
    var courseCode = req.body.coursecode;
    var userId;
    var c_id;
    var p_id;
    console.log(query);
    db.executeQuery(query, function(err, result) {
        if (err) {
            console.log("ERROR: Failed to retreive user ID. Error: " + err);
            res.status(404).send("Failed to retrieve user ID");
        }
        userId = result[0].user_id;
        //var query2 = "UPDATE Users SET fileLocation='" + "img/" + req.body.file + "' WHERE u_id=" + result[0].user_id + ";";
        var query2 = "Select c_id from Class Where CourseCode='" + courseCode + "'; ";
        db.executeQuery(query2, function(err, result){
           if(err){
               console.log("ERROR: Failed to retreive c_id. Error: " + err);
               res.status(404);
           }
           c_id = result[0].c_id;
           var query3 = "Select p_id from Participant Where UserID='" + userId + "' and ClassID='" + c_id +
                   "';";
           db.executeQuery(query3, function(err, result){
              if(err){
                  console.log("ERROR: Failed to retrive p_id. Error: " + err);
                  res.status(404);
              }
              var resourceTime = new Date();
              p_id = result[0].p_id;
              var query4 = "Insert INTO Resources(resourceTime, fileLocation, ParticipantID) Select * FROM (Select '" + resourceTime +
              "', 'file/" + chatRoom + "/" + req.body.file + "', '" + p_id + "') AS tmp WHERE NOT EXISTS (SELECT fileLocation, ParticipantID" +
                  " FROM Resources WHERE fileLocation='file/" + chatRoom + "/" + req.body.file + "' and ParticipantID='" + p_id + "') LIMIT 1;";
              db.executeQuery(query4, function(err, result){
                 if(err){
                     console.log("ERROR: Failed to insert filelocation to Resources. Error:" + err);
                     res.status(404);
                 }
                 var query5 = "Select fileLocation from Resources Where fileLocation='" + "file/" + chatRoom + "/" + req.body.file + "';";
                 db.executeQuery(query5, function(err, result){
                     if(err){
                         console.log("ERROR: Failed to retrieve fileLocation from Reousrces. Error: " + err);
                         res.status(404);
                     }
                     res.status(200).send(result);
                 });


              });
           });
        });
        /*var query3 = "SELECT fileLocation FROM Users WHERE u_id=" + result[0].user_id + ";";
        db.executeQuery(query2, function(err, result) {
            if (err) {
                console.log("ERROR: Failed to set file location. Error: " + err);
                res.status(404).send("cannot set file location");
            }
            db.executeQuery(query3, function(err, result) {
                if (err) {
                    console.log("ERROR: Failed to retrieve file location. Error: " + err);
                    res.status(404).send("cannot refresh profile pic");
                }
                res.status(200).send(result);
            })
        })*/
    });

};

exports.getUserInfo = function (req, res) {
    if (req.session.userid) {
        var query2 = "SELECT * FROM Users WHERE u_id=" + req.session.userid + ";";
        db.executeQuery(query2, function (err, result) {
            if (err) {
                console.log("ERROR: Failed to retrieve user data. Error: " + err);
                res.status(404).send("failed to retrieve user data");
            }
            res.status(200).send(result);
        });
    } else {
        res.status(403).json({
            error: "User not logged in"
        });
    }
};

exports.uploadProfPic = function (req, res) {
    var fs = require('fs');
    var path = __dirname + "/../app/img/" + req.files.file.name;
    fs.writeFile(path, req.files.file.data, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("SUCCESS: The file was saved!");
    }); 
};


exports.refreshProfPic = function (req, res) {
    if (req.session.userid) {
        var query2 = "UPDATE Users SET fileLocation='" + "img/" + req.body.file + "' WHERE u_id=" + req.session.userid + ";";
        var query3 = "SELECT fileLocation FROM Users WHERE u_id=" + req.session.userid + ";";
        db.executeQuery(query2, function(err, result) {
            if (err) {
                console.log("ERROR: Failed to set file location. Error: " + err);
                res.status(404).send("cannot set file location");
            }
            db.executeQuery(query3, function(err, result) {
                if (err) {
                    console.log("ERROR: Failed to retrieve file location. Error: " + err);
                    res.status(404).send("cannot refresh profile pic");
                }
                res.status(200).send(result);
            });
        });
    } else {
        res.status(403).json({
            error: "User not logged in"
        });
    }
};

exports.updateDispName = function (req, res) {
    if (req.session.userid) {
        var query2 = "UPDATE Users SET DisplayName='" + req.body.dispName + "' WHERE u_id=" + req.session.userid + ";";
        var query3 = "SELECT DisplayName FROM Users WHERE u_id=" + req.session.userid + ";";
        db.executeQuery(query2, function(err, result) {
            if (err) {
                console.log("ERROR: Failed to update DisplayName in db. Error: " + err);
                res.status(404).send("failed to update dispName");
            }
            db.executeQuery(query3, function(err, result) {
                if (err) {
                    console.log("ERROR: Failed to retrieve display name. Error: " + err);
                    res.status(404).send("cannot retreive display name");
                }
                res.status(200).send(result);
            });
        });
    } else {
        res.status(403).json({
            error: "User not logged in"
        });
    }
};

exports.updateDescription = function (req, res) {
    if (req.session.userid) {
        var query2 = "UPDATE Users SET Description='" + req.body.desc + "' WHERE u_id=" + req.session.userid + ";";
        var query3 = "SELECT Description FROM Users WHERE u_id=" + req.session.userid + ";";
        db.executeQuery(query2, function(err, result) {
            if (err) {
                console.log("ERROR: Failed to update description. Error: " + err);
                res.status(404).send("failed to update description");
            }
            db.executeQuery(query3, function(err, result) {
                if (err) {
                    console.log("ERROR: Failed to retrieve description for user. Error: " + err);
                    res.status(404).send("failed to retrieve description for user");
                }
                res.status(200).send(result);
            });
        });
    } else {
        res.status(403).json({
            error: "User not logged in"
        });
    }
};

exports.getCoursesEnrolled = function (req, res) {
    if (req.session.userid) {
        var query2 = "SELECT CourseCode, Semester, Year FROM Participant inner join Class WHERE UserID=" + req.session.userid + " AND ClassID=c_id;";
        db.executeQuery(query2, function(err, result) {
            if (err) {
                console.log("ERROR: Failed to retrieve courses user has enrolled. Error: " + err);
                res.status(404).send("failed to retrieve enrolled course");
            }
            res.status(200).send(result);
        });
    } else {
        res.status(403).json({
            error: "User not logged in"
        });
    }
}

exports.getUser = function (req, res) {
    console.log(req.session)
    if (req.session.userid) {
        var query = "SELECT * FROM Users WHERE u_id = '" + req.session.userid + "'";
        db.executeQuery(query, function (err, result) {
            if (err) {
                console.error(err);
                res.status(500).json({
                    error: "An unexpected error occurred when querying the database"
                });
            } else {
                res.status(200).json({
                    userId: result[0].u_id,
                    lastName: result[0].LastName,
                    firstName: result[0].FirstName,
                    email: result[0].email,
                    displayName: result[0].DisplayName,
                    description: result[0].Description,
                    utorId: result[0].UTorId,
                    profilePic: result[0].fileLocation
                });
            }
        });
    } else {
        res.status(204).json({
            message: "User not login"
        });
    }

};



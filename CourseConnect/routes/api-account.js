// Route handler of App server.
"use strict;"

var db = require('./db_connection');  // db manager

exports.isLoggedIn = function (req, res) {
    console.log(req.body.token);
    var query = "SELECT * FROM session WHERE session='" + req.body.token + "';";
    db.executeQuery(query, function(err, result) {
        if (err) {
            console.log("ERROR: Failed to execute retrieve user info query. Error: " + err);
            res.status(404).send("failed to execute db query to retrieve user info.");
        }
        console.log(result);
        res.status(200).send(result);
    })
}

exports.logout = function (req, res) {
    var query = "DELETE FROM session WHERE session='" + req.body.token + "';";
    db.executeQuery(query, function(err, result) {
        if (err) {
            console.log("ERROR: Failed to execute delete user login token. Error: " + err);
            res.status(404).send("failed to execute delete user login");
        }
        res.status(200).send(true);
    })
}

exports.authenticate = function (req, res) {
    if (!req.body.token) {
        checkUserInDB(req, res);
    } else {
        validateToken(req.body.token, function (isValid) {
            if (isValid) {
                console.log("SUCCESS: User logged in with token.");
                res.status(200).send({ isvalid: true, token: req.body.token });

            } else {
                checkUserInDB(req, res);
            }
        });
    }
};

checkUserInDB = function (req, res) {
    var query = "SELECT * FROM Users WHERE `Email`='" + req.body.email + "';";
    db.executeQuery(query, function (err, result) {
        if (err) {
            console.log("ERROR: Failed to execute authenticate query. Query: " + query);
            res.status(404).send("Auth query failed");
        }
        console.log("SUCCESS: Authenticate query executed. Result: " + result);
        if (result.length == 0) {
            console.log("ERROR: Login email wasn't found in the database. Result: " + result);
            res.status(200).send({ isvalid: false, token: null });
        } else if (result[0]["Password"] != req.body.pwd) {
            console.log("ERROR: Password entered doesn't match password on database. Result: " + result);
            res.status(200).send({ isvalid: false, token: null });
        } else {
            console.log("SUCCESS: User logged in.");
            var session = req.session.id;
            saveLoginTokenToDatabase(result[0].u_id, session);
            res.cookie("loginToken", session);
            res.status(200).send({ isvalid: true, token: session });
        }
    });
}

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

exports.getUserInfo = function (req, res) {
    var query = "SELECT user_id FROM session WHERE session='" + req.body.token + "';";
    db.executeQuery(query, function (err, result) {
        if (err) {
            console.log("ERROR: Failed to retrieve user ID. Error: " + err);
            res.status(404).send("failed to retrieve user ID");
        }
        var query2 = "SELECT * FROM Users WHERE u_id=" + result[0].user_id + ";";
        db.executeQuery(query2, function (err, result) {
            if (err) {
                console.log("ERROR: Failed to retrieve user data. Error: " + err);
                res.status(404).send("failed to retrieve user data");
            }
            res.status(200).send(result);
        })
    })
}

exports.uploadProfPic = function (req, res) {
    var fs = require('fs');
    var path = __dirname + "/../app/img/" + req.files.file.name
    fs.writeFile(path, req.files.file.data, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("SUCCESS: The file was saved!");
    }); 
}

exports.refreshProfPic = function (req, res) {
    var query = "SELECT user_id FROM session WHERE session='" + req.body.token + "';";
    db.executeQuery(query, function(err, result) {
        if (err) {
            console.log("ERROR: Failed to retreive user ID. Error: " + err);
            res.status(404).send("Failed to retrieve user ID");
        }
        var query2 = "UPDATE Users SET fileLocation='" + "img/" + req.body.file + "' WHERE u_id=" + result[0].user_id + ";";
        var query3 = "SELECT fileLocation FROM Users WHERE u_id=" + result[0].user_id + ";";
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
        })
    })
}

exports.updateDispName = function (req, res) {
    var query = "SELECT user_id FROM session WHERE session='" + req.body.token + "';";
    db.executeQuery(query, function(err, result) {
        if (err) {
            console.log("ERROR: Failed to retrieve user ID. Error: " + err);
            res.status(404).send("Failed to retrieve user ID");
        }
        var query2 = "UPDATE Users SET DisplayName='" + req.body.dispName + "' WHERE u_id=" + result[0].user_id + ";";
        var query3 = "SELECT DisplayName FROM Users WHERE u_id=" + result[0].user_id + ";";
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
            })
        })
    })
}

exports.updateDescription = function (req, res) {
    var query = "SELECT user_id FROM session WHERE session='" + req.body.token + "';";
    db.executeQuery(query, function(err, result) {
        if (err) {
            console.log("ERROR: Failed to retrieve user ID. Error: " + err);
            res.status(404).send("failed to retrieve user ID");
        }
        var query2 = "UPDATE Users SET Description='" + req.body.desc + "' WHERE u_id=" + result[0].user_id + ";";
        var query3 = "SELECT Description FROM Users WHERE u_id=" + result[0].user_id + ";";
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
            })
        })
    })
}

/**A helper function to insert login token into Session table together with user_id*/
saveLoginTokenToDatabase = function (u_id, token) {
    var injectTokenQuery = "INSERT INTO session (user_id, session)" +
        "Value (" + u_id + ", '" + token + "')";

    db.executeQuery(injectTokenQuery, function (err, insertRes) {
        if (err) {
            console.log("ERROR: Failed to inject login token." + err);
            return false;
        }
        console.log("SUCCESS: Inserted login token for user id=" + u_id);
        return true;
    })
}

/**Helper function to validates token */
validateToken = function (token, callback) {
    var tokenQuery = "SELECT * FROM session, Users WHERE session.session = '" + token + "' AND session.user_id = Users.u_id";
    db.executeQuery(tokenQuery, function (err, result) {
        if (err) {
            console.error("ERROR: Failed to execute token query." + err);
            callback(false);
        } else {
            if (result.length >= 1) {
                console.log("SUCCESS: Token " + token + "is valid");
                callback(true, result);
            } else {
                console.log("SUCCESS: Token " + token + " is invalid.")
                callback(false);
            }
        }
    });
}

exports.getUserByToken = function (req, res) {
    validateToken(req.body.token, function (isValid, result) {
        if (isValid) {
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
        } else {
            res.status(401).json({
                message: "Token is invalid"
            });
        }
    });
};


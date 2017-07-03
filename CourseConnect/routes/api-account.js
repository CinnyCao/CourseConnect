// Route handler of App server.
"use strict;"

var db = require('./db_connection');  // db manager

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
    var query = "INSERT INTO Users (Email, LastName, FirstName, Password) VALUES ('" + req.body.username + "', '" + req.body.ln + "', '" + req.body.fn + "', '" + req.body.pwd + "');";
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

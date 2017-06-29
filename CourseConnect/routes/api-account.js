// Route handler of App server.
"use strict;"

var db = require('./db_connection');  // db manager

exports.authenticate = function (req, res) {
    var query = "SELECT * FROM Users WHERE `Email`='" + req.body.email + "';";
    db.executeQuery(query, function (err, result) {
        if (err) {
            console.log("ERROR: Failed to execute authenticate query. Query: " + query);
            res.status(404).send("Auth query failed");
        }
        console.log("SUCCESS: Authenticate query executed. Result: " + result);
        if (result.length == 0) {
            console.log("ERROR: Login email wasn't found in the database. Result: " + result);
            res.status(200).send(false);
        } else if (result[0]["Password"] != req.body.pwd) {
            console.log("ERROR: Password entered doesn't match password on database. Result: " + result);
            res.status(200).send(false);
        } else {
            console.log("SUCCESS: User logged in.");
            res.status(200).send(true);
        }
    });
};

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

exports.getUserInfo = function (req, res) {
    var query = "SELECT * FROM Users WHERE `Email`='guanyukevin.chen@gmail.com'";
    db.executeQuery(query, function (err, result) {
        if (err) {
            console.log("ERROR: Failed to execute query. Query: " + query);
            res.status(404).send("Auth query failed");
        }
        console.log("SUCCESS: Query executed and result sent. Result: " + result);
        res.status(200).send(result);
    });
}

exports.uploadProfPic = function (req, res) {
    var fs = require('fs');
    fs.writeFile(__dirname + "/app/img/" + req.files.file.name, req.files.file.data, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    }); 
}

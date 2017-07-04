// Route handler of App server.
"use strict;"

var db = require('./db_connection');  // db manager


exports.getClass = function (req, res) {
    // bypass token check, visitors should be able to search class too
    var query = "SELECT * FROM Class WHERE CourseCode = '" + req.params.coursecode +
        "' AND Semester = '" + req.params.semester + "' AND Year = '" + req.params.year + "'";
    db.executeQuery(query, function (err, data) {
        if (err) {
            console.error(err);
            res.status(500).json({
                error: "An unexpected error occurred when querying the database"
            });
        } else if (data.length) {
            res.status(200).json(
                {
                    found: 1,
                    courseCode: data[0].CourseCode,
                    semester: data[0].Semester,
                    year: data[0].Year,
                    title: data[0].title,
                    description: data[0].description
                }
            );
        } else {
            res.status(200).json(
                {
                    found: 0
                }
            );
        }
    });
};

exports.getStudents = function(req, res) {
    var query = "SELECT user_id FROM session CROSS JOIN Users WHERE session='" + req.body.token + "';";
    db.executeQuery(query, function(err, data) {
        if(err) {
            console.log("ERROR: Failed to retrieve user ID. Error: " + err);
            res.status(404).send("failed to retrieve user ID");
        }
        var mainQuery = "SELECT u_id,fileLocation,FirstName,LastName FROM Participant CROSS JOIN Class CROSS JOIN Users WHERE ClassID=c_id and CourseCode='" + req.body.coursecode + "' and UserID=u_id";
        console.log(req.body.coursecode);
        db.executeQuery(mainQuery, function(err, data) {
            if(err) {
                console.error(err);
                res.status(404).json({
                    error: "Class/Students are non-existant here: An expected error occurred when querying the database."
                });
            }
            res.status(200).send(data);
        });
    });
}

/*exports.getStudents = function(req, res) {
    var query = "SELECT FirstName,LastName FROM Participant CROSS JOIN Class CROSS JOIN Users WHERE ClassID=c_id and CourseCode=" + $routeParams.coursecode + " and UserID=u_id";
    db.executeQuery(query, function(err, data) {
        if(err) {
            console.error(err);
            res.status.json({
                error: "Class/Students are non-existant here: An expected error occurred when querying the database.";
            });
        } else {
            console.log(data);
            res.status(200).send(data);
        }
    });
}*/

function joinClassRoom(userid, classid, roleid, res) {
    var query = "INSERT INTO Participant (UserID, ClassID, RoleID) VALUES ('" + userid + "', '" + classid + "', '" + roleid + "')";
    db.executeQuery(query, function (err, data) {
        if (err) {
            console.error(err);
            res.status(500).json({
                error: "Failed joining class: An unexpected error occurred when querying the database"
            });
        } else {
            res.sendStatus(200);
        }
    });
}

exports.createClass = function (req, res) {
    // check for room existence again to ensure no duplicate rooms are created
    var query = "SELECT * FROM Class WHERE CourseCode = '" + req.body.coursecode +
        "' AND Semester = '" + req.body.semester + "' AND Year = '" + req.body.year + "'";
    db.executeQuery(query, function (err, data) {
        if (err) {
            console.error(err);
            res.status(500).json({
                error: "An unexpected error occurred when querying the database"
            });
        } else if (data.length) {
            res.status(403).json(
                {
                    message: "Room for this class already exists"
                }
            );
        } else {
            var query = "INSERT INTO Class (CourseCode, Semester, Year) VALUES ('" + req.body.coursecode + "', '" + req.body.semester + "', '" + req.body.year + "')";
            db.executeQuery(query, function (err, insertRes) {
                if (err) {
                    console.error(err);
                    res.status(500).json({
                        error: "Failed creating new class: An unexpected error occurred when querying the database"
                    });
                } else {
                    // join class room as creator
                    joinClassRoom(req.body.userid, insertRes.insertId, 1, res);
                }
            });
        }
    });
};
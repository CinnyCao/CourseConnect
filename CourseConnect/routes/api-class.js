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
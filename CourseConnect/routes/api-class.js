// Route handler of App server.
"use strict;"

var db = require('./db_connection');  // db manager


exports.getClass = function (req, res) {
    // bypass token check, visitors should be able to search class too
    var query = "SELECT * FROM class WHERE CourseCode = '" + req.params.courseid +
        "' AND Semester = '" + req.params.semester + "' AND Year = '" + req.params.year + "'";
    db.executeQuery(query, function (err, data) {
        if (err) {
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

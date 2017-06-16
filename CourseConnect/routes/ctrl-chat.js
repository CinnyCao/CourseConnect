'use strict';

var msgs = [];

// The user name is stored in the session
function getName(req, res) {
    if (req.session.name) {
        return res.json({ name: req.session.name });
    }
    else {
        return res.json({ name: '' });
    }
}

// Add the username to the session
function setName(req, res) {
    if(!req.body.hasOwnProperty('name')) {
        res.statusCode = 400;
        return res.json({ error: 'Invalid message' });
    }
    else {
        req.session.name = req.body.name;
        console.log(req.session);
        return res.json({ name: req.body.name });
    }
}

// Set the username to empty by clearing the session
function logout(req, res) {
    console.log('logging out ' + req.session.name);
    req.session.destroy(function(err) {
        if (!err) {
            return res.json({});
        }
    });
}

// Get a message from a user
function addMessage(req, res) {
    // We find the message using the "text" key in the JSON object
    var msg = req.body.text;
    console.log("addmsg:" + req.body.text);
    // get msg creation time
    var time = new Date().toLocaleString();
    msgs.push("[" + time + "] " + req.body.text);
    res.send('Success');
}

// Get the full list of messages
function getMessages(req, res) {
    var returnMsgs = msgs;
    var number = req.param('number');
    if (number) {
        number = parseInt(req.param('number'));
    }
    res.send(JSON.stringify(returnMsgs));
}

exports.getName = getName;
exports.setName = setName;
exports.logout = logout;
exports.addMessage = addMessage;
exports.getMessages = getMessages;

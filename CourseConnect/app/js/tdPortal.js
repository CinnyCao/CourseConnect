'use strict';

/* App Modules of TD-Portal */

var tdPortal = angular.module('courseConnect', [
  'ngRoute',
  'Directives',
  'Filters',
  'CtrlNavbar'
]);

/* App route */
tdPortal.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: '/templates/HomePage.html',
            controller: 'HomeCtrl'
        })
        .when('/chattest', {
            templateUrl: '/templates/ChatRoom.html',
            controller: 'ChatCtrl'
        })
        .otherwise({
            templateUrl: '/templates/PageNotFound.html'
        });
  }]);


tdPortal.controller("ChatCtrl", function ($scope) {
    var vm = this;

    // Do some initial setup
    getName();
    buildMessages();

    // poll for new messages every 2.5 seconds
    var msgInterval = setInterval(buildMessages, 2500);


    // Register event handlers
    // $("#post-name").click(function() {
    //     $("#avatar_picker").show();
    // });
    vm.onPostNameClicked = function () {
        console.log("hello");
        $("#avatar_picker").show();
    };

    // Make Enter working for name entering too
    $("#user-name").keypress(function(e) {
        if (e.which == 13) {
            e.preventDefault();
            $('#post-name').click();
        }
    });

    // Set the user to empty string
    $("#logout").click(function() {
        logout();
    });

    // Stop polling for messages.  You will hvave to reload the
    // page to start polling again.
    $("#pause").click(function() {
        var exit = confirm("Are you sure you want to end the session?");
        if (exit == true) {
            clearInterval(msgInterval);
        }
    });

    // When the user enters a message send it to the server
    // The format of the message is: "username: message"
    // where username can be found in the content of the HTML
    // element of class "name", and the message comes from
    // the input text value.
    // Send it using a post message to "addmsg"
    var submitmsgTimer;
    $("#submitmsg").click(function() {
        var username = $(".name").html();
        var clientmsg = username + ": " + insertEmojiIfAny($("#usermsg").val());
        $.post("/addmsg", {
            text: clientmsg
        }, function() {
            // do not execute previous callback if this request is submitted
            // multiple times within a short time
            if (submitmsgTimer) {
                clearTimeout(submitmsgTimer);
            }

            submitmsgTimer = setTimeout(function() {
                // fetch messages inmmediatly after posting succeed
                buildMessages();
                // restart interval
                msgInterval = setInterval(buildMessages, 2500);
            }, 200);
        });
        $("#usermsg").val('');
        // waiting for post callback
        clearInterval(msgInterval);
        return false;
    });

    // Map Enter key to submit message too
    $("#usermsg").keypress(function(e) {
        if (e.which == 13) {
            // by default it seems to refresh the page
            e.preventDefault();
            $('#submitmsg').click();
        }
    });

    // Get the user name from the server by making an
    // ajax GET request to the url "/name"
    // The callback function on success will call updateUI
    // with the new value for name
    function getName() {
        $.ajax({
            type : "GET",
            url : "/name",
            dataType : "json",
            contentType: "application/json; charset=utf-8",
            success : function (response) {
                var name = response['name'];
                updateUI(name);
            }

        });
    }

    function setNameAndAvatar(avatar) {
        $("#avatar_picker").hide();
        postName(avatar.src);
        // set focus on message input box for easy typing
        $("#usermsg").focus();
    }

    // Send the user name to the server
    function postName(avatarSrc) {
        var name = $("#user-name").val();
        var avatar = '<img class="inline_pic" src="' + avatarSrc + '">'

        // Clear the text field
        $("#user-name").val("");

        $.ajax({
            url: "/name",
            type: "POST",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify( { "name": avatar + " " + name } ),
            success: function(response) {
                var name = response['name'];
                updateUI(name);
            }
        });
    }

    // Set the user name to empty
    function logout() {
        $.get("/logout", function(data) {
            updateUI("");
        });
    }

    // If the user has not entered a name show the name entry input
    // Otherwise display the name
    function updateUI(name) {
        $(".name").html(name);
        if (name !== '') {
            $("#name-form").hide();
        } else {
            $("#name-form").show();
        }
    }

    // Get list of messages to display in the chat box
    function buildMessages() {
        $.get('messages', function(data) {
            var parent = $('#chatbox');
            parent.empty();

            var messages = JSON.parse(data);
            for (var i = 0; i < messages.length; i++) {
                var tmp = $('<p class="message">').html(messages[i]);
                parent.append(tmp);
            }
            // scroll to latest message
            parent.animate({
                scrollTop: parent.children().last().offset().top
            }, 500);
        });
    }

    var emojis = [
        [":-)", "smile.png"],
        [";-p", "tongue.jpg"],
        [";-P", "tongue.jpg"],
        [":-(", "sad.png"],
        [":'-)", "tear_happy.png"],
        [":'-(", "cry.png"],
        [":-o", "surprised.png"],
        [":-O", "surprised.png"],
        [":-0", "surprised.png"]
    ];

    function insertEmojiIfAny(text) {
        for (var i = 0; i < emojis.length; i++) {
            text = text.split(emojis[i][0]).join("<img class='inline_pic' src='/assets/images/" + emojis[i][1] + "'>");
        }
        return text;
    }
});
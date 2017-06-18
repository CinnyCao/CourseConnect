'use strict';

var chatCtrls = angular.module('CtrlChat', []);

chatCtrls.service('ChatService', ['$http', function ($http) {
    // TODO: service to get room data

    // TODO: service to get current user info

    // TODO: service to get all users in this chatroom
    this.getAllClassMates = function () {
        // hard code data
        return [
            {"userId": 1, "profilePic": "img/profilePicDefault.jpg", "name": "aa", "friendOfCurrentUser": 0},
            {"userId": 2, "profilePic": "img/profilePicDefault.jpg", "name": "bb", "friendOfCurrentUser": 1},
            {"userId": 3, "profilePic": "img/profilePicDefault.jpg", "name": "cc", "friendOfCurrentUser": 1},
            {"userId": 4, "profilePic": "img/profilePicDefault.jpg", "name": "dd", "friendOfCurrentUser": 0},
            {"userId": 5, "profilePic": "img/profilePicDefault.jpg", "name": "ee", "friendOfCurrentUser": 0},
        ];
    };

    // TODO: service to get list of history messages with limit of N

    // TODO: service to send a message

    // TODO: service to pull messages with limit of N

    // TODO: service to pull all posts

    // TODO: service to pull all resources
}]);

chatCtrls.controller('ChatCtrl', ['$scope', '$location', '$routeParams', 'ChatService',
    function ($scope, $location, $routeParams, ChatService) {
        console.log('ChatCtrl is running');

        // get name of classroom
        $scope.getRoomName = function () {
            // TODO: construct room name from ChatService's room data
            return "CSCC01 Summer 2017";
        };

        $scope.init = function () {
            $scope.var_forum = "chatroom"; // set Chat Room as default forum
            // $scope.var_room = $scope.getRoomData($routeParams.courseid);
            $scope.var_room_name = $scope.getRoomName();
            $scope.var_user_list = ChatService.getAllClassMates();
        };

        $scope.init();

        // $scope.onLogoutClicked
        //
        // $("#logout").click(function() {
        //     logout();
        // });
        //
        // // Set the user name to empty
        // function logout() {
        //     $.get("/logout", function(data) {
        //         updateUI("");
        //     });
        // }
        //
        // // Stop polling for messages.  You will hvave to reload the
        // // page to start polling again.
        // $("#pause").click(function() {
        //     var exit = confirm("Are you sure you want to end the session?");
        //     if (exit == true) {
        //         clearInterval(msgInterval);
        //     }
        // });
        //
        // // When the user enters a message send it to the server
        // // The format of the message is: "username: message"
        // // where username can be found in the content of the HTML
        // // element of class "name", and the message comes from
        // // the input text value.
        // // Send it using a post message to "addmsg"
        // var submitmsgTimer;
        // $("#submitmsg").click(function() {
        //     var username = $(".name").html();
        //     var clientmsg = username + ": " + insertEmojiIfAny($("#usermsg").val());
        //     $.post("/addmsg", {
        //         text: clientmsg
        //     }, function() {
        //         // do not execute previous callback if this request is submitted
        //         // multiple times within a short time
        //         if (submitmsgTimer) {
        //             clearTimeout(submitmsgTimer);
        //         }
        //
        //         submitmsgTimer = setTimeout(function() {
        //             // fetch messages inmmediatly after posting succeed
        //             buildMessages();
        //             // restart interval
        //             msgInterval = setInterval(buildMessages, 2500);
        //         }, 200);
        //     });
        //     $("#usermsg").val('');
        //     // waiting for post callback
        //     clearInterval(msgInterval);
        //     return false;
        // });
        //
        // // Map Enter key to submit message too
        // $("#usermsg").keypress(function(e) {
        //     if (e.which == 13) {
        //         // by default it seems to refresh the page
        //         e.preventDefault();
        //         $('#submitmsg').click();
        //     }
        // });
        //
        // // Get the user name from the server by making an
        // // ajax GET request to the url "/name"
        // // The callback function on success will call updateUI
        // // with the new value for name
        // function getName() {
        //     $.ajax({
        //         type : "GET",
        //         url : "/name",
        //         dataType : "json",
        //         contentType: "application/json; charset=utf-8",
        //         success : function (response) {
        //             var name = response['name'];
        //             updateUI(name);
        //         }
        //
        //     });
        // }
        //
        // function setNameAndAvatar(avatar) {
        //     $("#avatar_picker").hide();
        //     postName(avatar.src);
        //     // set focus on message input box for easy typing
        //     $("#usermsg").focus();
        // }
        //
        // // Send the user name to the server
        // function postName(avatarSrc) {
        //     var name = $("#user-name").val();
        //     var avatar = '<img class="inline_pic" src="' + avatarSrc + '">'
        //
        //     // Clear the text field
        //     $("#user-name").val("");
        //
        //     $.ajax({
        //         url: "/name",
        //         type: "POST",
        //         dataType: "json",
        //         contentType: "application/json; charset=utf-8",
        //         data: JSON.stringify( { "name": avatar + " " + name } ),
        //         success: function(response) {
        //             var name = response['name'];
        //             updateUI(name);
        //         }
        //     });
        // }
        //
        //
        //
        // // If the user has not entered a name show the name entry input
        // // Otherwise display the name
        // function updateUI(name) {
        //     $(".name").html(name);
        //     if (name !== '') {
        //         $("#name-form").hide();
        //     } else {
        //         $("#name-form").show();
        //     }
        // }
        //
        // // Get list of messages to display in the chat box
        // function buildMessages() {
        //     $.get('messages', function(data) {
        //         var parent = $('#chatbox');
        //         parent.empty();
        //
        //         var messages = JSON.parse(data);
        //         for (var i = 0; i < messages.length; i++) {
        //             var tmp = $('<p class="message">').html(messages[i]);
        //             parent.append(tmp);
        //         }
        //         // scroll to latest message
        //         parent.animate({
        //             scrollTop: parent.children().last().offset().top
        //         }, 500);
        //     });
        // }
        //
    }]);
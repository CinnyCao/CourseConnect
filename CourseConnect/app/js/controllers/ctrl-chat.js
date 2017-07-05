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

chatCtrls.service('PostService', ['$http', function ($http) {
    
    // Service to create post
    this.sendPost = function(postMsg){
        $http.post('/api/sendPost', postMsg).error(function(res){
            alert('Error: An unexpected error occured.');
        });
    }

    // Service to retrieve all posts for given class
    this.getPosts = function(roomID, callback){
        $http.post('/api/getPosts', {roomID}).success(function(res){
            callback(res.postList);
        })
        .error(function(res){
            alert('Error: An unexpected error occured. Try refreshing the page.');
        })
    }

    // Service to retrieve all followups for given post
    this.displayFollowupList = function(postID, callback){
        $http.post('/api/getFollowups', {postID})
        .success(function(res){
            callback(res.followupList);
        })
        .error(function(res){
           alert('Error: An unexpected error occured. Try refreshing the page.')
         }) 
    }
}]);

chatCtrls.controller('ChatCtrl', ['$scope', '$location', '$routeParams', 'CommonService', 'ChatService', 'PostService',
    function ($scope, $location, $routeParams, CommonService, ChatService, PostService) {
        console.log('ChatCtrl is running');

        $scope.var_messages = [];

        // get name of classroom
        $scope.getRoomName = function () {
            return $routeParams.coursecode + " " + CommonService.getSemesterName($routeParams.semester) + " " + $routeParams.year;
        };

        $scope.sendMsg = function () {
            // hard code data TODO:
            var time = new Date();
            time = time.toLocaleString();
            $scope.var_messages.push({
                "userId": 1,
                "profilePic": "img/profilePicDefault.jpg",
                "name": "aa",
                "message": $scope.var_chat_message,
                "time": time
            });

            $scope.var_chat_message = "";
        };

        $scope.isCurrentUser = function (userId) {
            // hard code, assume current user is id 1 TODO
            if (userId == 1) {
                return true;
            } else {
                return false;
            }
        };

        $scope.onChatMessageKeyPress = function ($event) {
            if ($event.which === 13) {
                $scope.sendMsg();
            }
        };

        $scope.loadPosts = function(){
            // TODO: Get roomID
            PostService.getPosts(2, function(postList){
                $scope.postList = postList;
                console.log($scope.postList);
            });
        }

        $scope.postQuestion = function(summary, detail){    
            console.log(CommonService.getUserId);
            // TODO: Get userID and RoomID
            var time = new Date().getFullYear() + "-" + new Date().getMonth() + "-" +  new Date().getDate();
            var post = {
                title:summary,
                description:detail,
                timestamp: time,
                userID: 8,
                parentPostID:-1,
                roomID:2,
                snipet: detail
            };
            
            PostService.sendPost(post);
        }   

        $scope.displaySelectedPost = function(post){
            $scope.selectedPost = post;
            $scope.displayFollowupList(post);
        }


        $scope.postFollowup = function(detail){
            //TODO: Allow user to post followup
            var time = new Date().getFullYear() + "-" + new Date().getMonth() + "-" +  new Date().getDate();
            var followupPost = {
                title:null,
                description:detail,
                timestamp: time,
                userID: 8, //TODO: Update userID
                parentPostID:$scope.selectedPost.po_id,
                roomID:2, //TODO: Update roomID
                snipet: null
            };

            PostService.sendPost(followupPost);
            $scope.displayFollowupList($scope.selectedPost);
            $(followupTextInput).val('');
        }

        $scope.displayFollowupList = function(post){
            PostService.displayFollowupList(post.po_id, function(followupList){
                $scope.followupList = followupList;
            });
        }

        $scope.init = function () {
            $scope.var_forum = "chatroom"; // set Chat Room as default forum
            // $scope.var_room = $scope.getRoomData($routeParams.courseid);
            $scope.var_room_name = $scope.getRoomName();
            $scope.var_user_list = ChatService.getAllClassMates();

            $scope.var_messages.push({"userId": 2, "profilePic": "img/profilePicDefault.jpg", "name": "bb", "message": "Hi, this is a test message from other user", "time": "2017-6-20 10:37:20"});
            $scope.postList = [];
            $scope.followupList = [];
            $scope.selectedPost = {};
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
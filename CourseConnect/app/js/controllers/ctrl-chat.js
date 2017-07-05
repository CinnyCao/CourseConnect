'use strict';

var chatCtrls = angular.module('CtrlChat', []);

chatCtrls.service('ChatService', ['$http', function ($http) {
    // get classroom info with current user and its permissions
    this.getClassWithUserPermission = function (classid) {
        var req = {
            method: "GET",
            url: "/api/getClass/" + classid,
        };

        return $http(req);
    };

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

    // pull messages for this classroom
    this.getMessages = function (classid) {
        var req = {
            method: "GET",
            url: "/api/messages/" + classid
        };

        return $http(req);
    };

    // send out a message
    this.sendMessage = function (pId, message) {
        console.log("pid: "+pId+" message"+message);
        var req = {
            method: "POST",
            url: "api/sendMsg",
            data: {
                pId: pId,
                message: message
            }
        };

        return $http(req);
    };

    // TODO: service to pull all posts

    // TODO: service to pull all resources
}]);


chatCtrls.controller('ChatCtrl', ['$scope', '$http', 'fileUpload', '$cookies', '$location', '$routeParams', '$interval', 'CommonService', 'ChatService',
    function ($scope, $http, fileUpload, $cookies, $location, $routeParams, $interval, CommonService, ChatService) {
        console.log('ChatCtrl is running');

        // only show chat room when user is logged in
        if (!CommonService.isLoggedIn()) {
            $location.path("/login");
        }

        $scope.var_messages = [];
        $scope.var_resources = [];//To store the file for display

        // get name of classroom
        $scope.getRoomName = function () {
            return $scope.room_data.courseCode + " " + CommonService.getSemesterName($scope.room_data.semester) + " " + $scope.room_data.year;
        };

        $scope.uploadFile = function(file) {
            var file = $scope.userFile;
            var storedFileloc;
            var uploadUrl = "/api/file-upload";
            fileUpload.uploadFileToUrl(file, uploadUrl, $scope.getRoomName());
            $http.post('/api/file-store', {classid: $routeParams.classid, file : file.name})
                .then(function (res){
                    storedFileloc = res.data;
                    console.log("The file has been stored at " +
                        storedFileloc[0].fileLocation);
                    $scope.displayResource();
            });
        };

        /*$scope.search = function(){
            $http.post('/api/findFile', {fileName : $scope.var_search_info, chatRoom : $scope.getRoomName()})
                .then(function(res){
                console.log(123);

            });

        };*/

        $scope.deleteResource = function($event){
            var fileName = $event.currentTarget.value;

            $http.post('/api/deleteFile', {chatRoom : $scope.getRoomName(), classid: $routeParams.classid, fileName: fileName})
                .then(function(res){
                    if(res.data == true){
                        console.log("Deletion is successful");
                        $scope.displayResource();
                    }
            });
        };

        $scope.displayResource = function(){
            $http.get('/api/files/' + $routeParams.classid).then(function(res){
                if(typeof $scope.var_search_info == 'undefined'){
                    $scope.var_search_info = '';
                }
                console.log("The info we search is " + $scope.var_search_info);
                $scope.var_resources = [];
                //console.log(res.data[1].fileLocation);
                //console.log(res.data[2].fileLocation);
                for (var i in res.data){
                    console.log("The file name is "+ res.data[i].fileLocation.split("/")[2]);
                    if(res.data[i].fileLocation.split("/")[2].indexOf($scope.var_search_info) != -1){
                        //display the info in html and set up the link for downloading
                        console.log("check passed");
                        $scope.var_resources.push({
                            "items": res.data[i].fileLocation.split("/")[2],
                            "address": res.data[i].fileLocation,
                            "display" : true});
                    }
                }
            });
            //TODO : implement it when the users need to see all the files
        };

        $scope.isCurrentUser = function (userId) {
            if (userId == CommonService.getUserId()) {
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

        $scope.fetchMessages = function () {
            ChatService.getMessages($routeParams.classid, $scope.lastMessageId, 100)
                .then(function (result) {
                    if (result.status == 200) {
                        $scope.var_messages = result.data;
                    }
                });
        };

        var submitmsgTimer;
        $scope.sendMsg = function () {
            ChatService.sendMessage($scope.room_data.participantId, $scope.var_chat_message)
                .then(function () {
                    $scope.var_chat_message = "";

                    // do not execute previous callback if this request is submitted multiple times within a short time
                    if (submitmsgTimer) {
                        clearTimeout(submitmsgTimer);
                    }

                    submitmsgTimer = setTimeout(function() {
                        // fetch messages inmmediatly after posting succeed
                        $scope.fetchMessages();
                        // restart interval
                        $scope.msgInterval = $interval($scope.fetchMessages, 2500);
                    }, 200);
                });
            $interval.cancel($scope.msgInterval);
        };

        $scope.init = function () {
            // get room data with current user's permission on it
            ChatService.getClassWithUserPermission($routeParams.classid)
                .then(function (result) {
                    $scope.room_data = result.data;
                    // set room name
                    $scope.var_room_name = $scope.getRoomName();
                });
            // set Chat Room as default forum
            $scope.var_forum = "chatroom";

            // pull messages
            $scope.fetchMessages();
            // poll for new messages every 2.5 seconds
            if ($scope.msgInterval) {
                $interval.cancel($scope.msgInterval);
            }
            $scope.msgInterval = $interval($scope.fetchMessages, 2500);

            $scope.var_user_list = ChatService.getAllClassMates();

        };

        $scope.init();

        $scope.$watch("var_forum", function () {
            if ($scope.var_forum == "resources") {
                $scope.displayResource();
            }
        });

        $scope.$on("$destroy", function(){
            console.log("destroy");
            $interval.cancel($scope.msgInterval);
        });
    }
]);
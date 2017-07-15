'use strict';

var chatCtrls = angular.module('CtrlChat', []);

chatCtrls.directive('onErrorSrc', function($http) {
    return {
        link: function(scope, element, attrs) {
            element.bind('error', function() {
                if (attrs.src != attrs.onErrorSrc) {
                    attrs.$set('src', attrs.onErrorSrc);
                }
            });
        }
    };
});

chatCtrls.service('ChatService', ['$http', '$routeParams', function ($http, $routeParams) {
    // get classroom info with current user and its permissions
    this.getClassWithUserPermission = function (classid) {
        var req = {
            method: "GET",
            url: "/api/getClass/" + classid,
        };

        return $http(req);
    };

    this.getAllClassMates = function (callbackFcn) {
        $http.post('/api/allClassmatesInClass', {classid : $routeParams.classid}).then(function(res) {
            for(var i = 0; i < res.data.length; i++) {
                res.data[i]["friendOfCurrentUser"] = 0;
            }
            callbackFcn(res.data);
        });
        /*return [
            {"userId": 1, "profilePic": "img/profilePicDefault.jpg", "name": "aa", "friendOfCurrentUser": 0},
            {"userId": 2, "profilePic": "img/profilePicDefault.jpg", "name": "bb", "friendOfCurrentUser": 1},
            {"userId": 3, "profilePic": "img/profilePicDefault.jpg", "name": "cc", "friendOfCurrentUser": 1},
            {"userId": 4, "profilePic": "img/profilePicDefault.jpg", "name": "dd", "friendOfCurrentUser": 0},
            {"userId": 5, "profilePic": "img/profilePicDefault.jpg", "name": "ee", "friendOfCurrentUser": 0},
        ];*/
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

    // join class as Student
    this.joinClass = function (classid) {
        var req = {
            method: "GET",
            url: "/api/joinclass/" + classid
        };

        return $http(req);
    };

}]);

chatCtrls.service('PostService', ['$http', function ($http) {
    // Service to create post
    this.sendPost = function (postMsg, callback) {
        $http.post('/api/sendPost', postMsg)
            .success(function () {
                callback();
            })
            .error(function (res) {
                alert('Error: An unexpected error occured.');
            });
    };

    // Service to retrieve all posts for given class
    this.getPosts = function (roomID, callback) {
        $http.post('/api/getPosts', { roomID }).success(function (res) {
            callback(res.postList);
        })
            .error(function (res) {
                alert('Error: An unexpected error occured. Try refreshing the page.');
            });
    };

    // Service to retrieve all followups for given post
    this.displayFollowupList = function (postID, callback) {
        $http.post('/api/getFollowups', { postID })
            .success(function (res) {
                callback(res.followupList);
            })
            .error(function (res) {
                alert('Error: An unexpected error occured. Try refreshing the page.');
            });
    };

    this.displayPostTags = function(callback){
        $http.get('/api/getPostTags')
            .success(function (res) {
                callback(res.postTagList);
            })
            .error(function (res){
                alert('Error: An unexpected error occured for fetch post tags.');
            })
    }

}]);


chatCtrls.controller('ChatCtrl', ['$scope', '$http', 'fileUpload', '$cookies', '$location', '$routeParams', '$interval', 'CommonService', 'ChatService', 'PostService', '$timeout',
    function ($scope, $http, fileUpload, $cookies, $location, $routeParams, $interval,  CommonService, ChatService, PostService, $timeout) {
        console.log('ChatCtrl is running');

        $scope.var_userValid = false;

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

        $scope.uploadFile = function (file) {
            var file = $scope.userFile;
            var storedFileloc;
            var uploadUrl = "/api/file-upload";
            fileUpload.uploadFileToUrl(file, uploadUrl, $scope.getRoomName());
            $http.post('/api/file-store', {classid: $routeParams.classid, file : file.name})
                .then(function (res) {
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

        $scope.deleteResource = function ($event) {
            var fileName = $event.currentTarget.value;

            $http.post('/api/deleteFile', {chatRoom : $scope.getRoomName(), classid: $routeParams.classid, fileName: fileName})
                .then(function (res) {
                    if (res.data == true) {
                        console.log("Deletion is successful");
                        $scope.displayResource();
                    }
                });
        };

        $scope.displayResource = function () {
            $http.get('/api/files/' + $routeParams.classid).then(function(res){
                if (typeof $scope.var_search_info == 'undefined') {
                    $scope.var_search_info = '';
                }
                console.log("The info we search is " + $scope.var_search_info);
                $scope.var_resources = [];
                //console.log(res.data[1].fileLocation);
                //console.log(res.data[2].fileLocation);
                for (var i in res.data) {
                    console.log("The file name is " + res.data[i].fileLocation.split("/")[2]);
                    if (res.data[i].fileLocation.split("/")[2].indexOf($scope.var_search_info) != -1) {
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
                        if (result.data.length > $scope.var_messages.length) {
                            $scope.var_messages = result.data;
                        }
                    }
                });
        };

        var submitmsgTimer;
        $scope.sendMsg = function () {
            ChatService.sendMessage($scope.room_data.participantId, CommonService.sqlEscapeString($scope.var_chat_message))
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

        // ---------------POST FOURM FUNCTION--------------------------
        $scope.loadPostFourm = function () {
            PostService.getPosts($scope.room_data.courseId, function (postList) {
                $scope.postList = postList;
                //$scope.postList = [];
            });

            PostService.displayPostTags(function(postTagList){
                $scope.postTagList = postTagList;
                $scope.tagSelected = postTagList[0];
            })
        }

        $scope.searchPost = function(keyWord, authorName){
            PostService.getPosts($scope.room_data.courseId, function(postList){ //make sure the iteration is not on
                //an empty list

            //var keyWord = $scope.keyWord;
            if(typeof keyWord == 'undefined' || !keyWord){
                keyWord = '';
            }

            if(typeof authorName == 'undefined' || !authorName){
                authorName = '';
            }


               //var posts = $scope.postList;
               var display = [];
                console.log("We are searching" + keyWord);
               for (var i in postList){
                   console.log(postList[i]);
                   var checkName = postList[i].FirstName + " " + postList[i].LastName;
                    if((postList[i].description + postList[i].Title).toUpperCase().indexOf(keyWord.toUpperCase()) != -1
                        && checkName.toUpperCase().indexOf(authorName.toUpperCase()) != -1){
                        display.push(postList[i]);
                    }
            }
            $scope.postList = [];
            $scope.postList = display;
            });
        };

        $scope.postQuestion = function (summary, detail) {
            console.log(CommonService.getUserId);
            // TODO: Get userID and RoomID
            var time = new Date().getFullYear() + "-" + new Date().getMonth() + "-" + new Date().getDate();
            var post = {
                title: summary,
                description: detail,
                timestamp: time,
                parentPostID: -1,
                roomID: $scope.room_data.courseId,
                snipet: detail,
                tagID: $scope.tagSelected.tag_ID
            };

            PostService.sendPost(post, $scope.loadPosts);
            $(post_ques_summary).val('');
            $(post_ques_detail).val('');
        }

        $scope.displaySelectedPost = function (post) {
            $scope.selectedPost = post;
            $scope.displayFollowupList(post);
        }


        $scope.postFollowup = function (detail) {
            //TODO: Allow user to post followup
            var time = new Date().getFullYear() + "-" + new Date().getMonth() + "-" + new Date().getDate();
            var followupPost = {
                title: null,
                description: detail,
                timestamp: time,
                parentPostID: $scope.selectedPost.po_id,
                roomID: $scope.room_data.courseId,
                snipet: null
            };

            PostService.sendPost(followupPost, function () {
                $scope.displayFollowupList($scope.selectedPost);
            });
            $(followupTextInput).val('');

        }

        $scope.displayFollowupList = function (post) {
            PostService.displayFollowupList(post.po_id, function (followupList) {
                $scope.followupList = followupList;
            });
        }

        $scope.selectTag = function(tag){
            $scope.tagSelected = tag;
           
        }

        $scope.submitReport = function (post) {
            $http.post('/api/reportComplaint', {title: $scope.subject[post.po_id], quote: post, description: $scope.description[post.po_id]}).then(function (res) {
                if (res.data.reported == true) {
                    alert("Report successfully filed.");
                } else {
                    alert("Report failed. Please try again or contacy system administrator.");
                }
            })

        }

        $scope.backToPage = function(){
            $scope.selectedPost = {};
            $scope.loadPosts();

        }



        // ^^^^^^^^^^^^^^POST FOURM FUNCTION^^^^^^^^^^^^^^^^^^^^^^^^^^^^

        $scope.init = function () {
            $scope.var_userValid = true;

            // get room data with current user's permission on it
            ChatService.getClassWithUserPermission($routeParams.classid)
                .then(function (result) {
                    $scope.room_data = result.data;
                    // set room name
                    $scope.var_room_name = $scope.getRoomName();
                });
            // set Chat Room as default forum
            $scope.var_forum = "chatroom";

            $scope.displayResource();

            // pull messages
            $scope.fetchMessages();
            // poll for new messages every 2.5 seconds
            if ($scope.msgInterval) {
                $interval.cancel($scope.msgInterval);
            }
            $scope.msgInterval = $interval($scope.fetchMessages, 2500);

            ChatService.getAllClassMates(function(data) { $scope.var_user_list = data; });

            $scope.postList = [];
            $scope.followupList = [];
            $scope.selectedPost = {};
            $scope.postTagList = [];
            $scope.selectedtTag = {};
        };

        // only show chat room when user is enrolled in it
        CommonService.checkIfInClass($routeParams.classid)
            .then(function (result) {
                if (result.data.inClass) {
                    $scope.init();
                } else {
                    var joinClass = confirm("You are not enrolled in this class. Do you want to join as Student?");
                    if (joinClass) {
                        ChatService.joinClass($routeParams.classid)
                            .then(function (result) {
                                $scope.init();
                            })
                            .catch(function (e) {
                                $location.path("/");
                            });
                    } else {
                        $location.path("/"); // back to home page
                    }
                }
            });

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
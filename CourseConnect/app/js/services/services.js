var serviceModule = angular.module('Services', []);

serviceModule.service('fileUpload', ['$http', function ($http) {
            this.uploadFileToUrl = function(file, uploadUrl){
               var fd = new FormData();
               fd.append('file', file);
            
               $http.post(uploadUrl, fd, {
                  transformRequest: angular.identity,
                  headers: {'Content-Type': undefined}
               })
            
               .success(function(){
               })
            
               .error(function(){
               });
            }
         }]);



serviceModule.service('ChatService', ['$http', function ($http) {
    // TODO: service to get room data

    // TODO: service to get current user info

    // TODO: service to get all users in this chatroom

   /*this.getAllClassMates = function() {
        var query = "SELECT * FROM enrolledUsers;";
        db.executeQuery(query, function(err, result) {
            if (err) {
                console.log("ERROR: Failed to retrieve username. Error: " + err);
                res.status(404).send("failed to retrieve username");
            }
            if(err) return err;
            console.log(result);
            return [
                {"userId": 1, "profilePic": "img/profilePicDefault.jpg", "name": "aa", "friendOfCurrentUser": 0},
                {"userId": 2, "profilePic": "img/profilePicDefault.jpg", "name": "bb", "friendOfCurrentUser": 1},
                {"userId": 3, "profilePic": "img/profilePicDefault.jpg", "name": "cc", "friendOfCurrentUser": 1},
                {"userId": 4, "profilePic": "img/profilePicDefault.jpg", "name": "dd", "friendOfCurrentUser": 0},
                {"userId": 5, "profilePic": "img/profilePicDefault.jpg", "name": "ee", "friendOfCurrentUser": 0},
            ];
        })
    };*/
    this.getAllClassMates = function() {
        $http.post('/api/get-users-class', {}).then(function(res) {
            return res;
        });
        return [
            {"userId": 1, "profilePic": "img/profilePicDefault.jpg", "name": "aa", "friendOfCurrentUser": 0},
            {"userId": 2, "profilePic": "img/profilePicDefault.jpg", "name": "bb", "friendOfCurrentUser": 1},
            {"userId": 3, "profilePic": "img/profilePicDefault.jpg", "name": "cc", "friendOfCurrentUser": 1},
            {"userId": 4, "profilePic": "img/profilePicDefault.jpg", "name": "dd", "friendOfCurrentUser": 0},
            {"userId": 5, "profilePic": "img/profilePicDefault.jpg", "name": "ee", "friendOfCurrentUser": 0},
        ];
    }
    /*this.getAllClassMates = function () {
        // hard code data
        return [
            {"userId": 1, "profilePic": "img/profilePicDefault.jpg", "name": "aa", "friendOfCurrentUser": 0},
            {"userId": 2, "profilePic": "img/profilePicDefault.jpg", "name": "bb", "friendOfCurrentUser": 1},
            {"userId": 3, "profilePic": "img/profilePicDefault.jpg", "name": "cc", "friendOfCurrentUser": 1},
            {"userId": 4, "profilePic": "img/profilePicDefault.jpg", "name": "dd", "friendOfCurrentUser": 0},
            {"userId": 5, "profilePic": "img/profilePicDefault.jpg", "name": "ee", "friendOfCurrentUser": 0},
        ];
    };*/

    // TODO: service to get list of history messages with limit of N

    // TODO: service to send a messageu

    // TODO: service to pull messages with limit of N

    // TODO: service to pull all posts

    // TODO: service to pull all resources
}]);
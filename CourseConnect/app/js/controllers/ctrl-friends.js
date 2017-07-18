'use strict';

var CtrlFriends = angular.module('CtrlFriends', []);

CtrlFriends.controller('FriendsCtrl', ['$scope', '$http', function ($scope, $http) {
    console.log('FriendsCtrl is running');

	$scope.loadFriends = function() {
        $http.get('/api/getFriends').success(function (res) {
            $scope.var_friends = res;
        }).error(function (res) {
            console.log(res);
        })
    }

    $scope.unfriend = function(userid) {
	    $http.post('/api/unfriendUser', {user: userid}).then(function (res) {
            console.log(res.data);
            if (res.data.deletion == true) {
                window.location.reload();
            }
        })
    }
}]);
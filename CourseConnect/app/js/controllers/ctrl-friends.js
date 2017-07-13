'use strict';

var CtrlFriends = angular.module('CtrlFriends', []);

CtrlFriends.service('FriendsService', ['$http', function ($http) {
	this.getFriends = function () {
        return $http.get('/api/getFriends');
    };

	this.removeFriend = function (friendID){
		return $http.post('/api/removeFriend', {
			fid: friendID
        });
	};
}]);


CtrlFriends.controller('FriendsCtrl', ['$scope', '$http', '$cookies', 'FriendsService', function ($scope, $http, $cookies, FriendsService) {
    console.log('FriendsCtrl is running');

	$scope.var_friends = [];

	FriendsService.getFriends()
		.then(function(data){
			//$scope.var_friends = data;
			console.log(data.data);
			if (data.data.isvalid){
			$scope.var_friends = data.data.friends;
				console.log(data.data.friends);
			}else {
				$scope.var_friends = data.friends;
				console.log(data.friends);
			}
		});

	$scope.unfriend = function (id) {
		FriendsService.removeFriend(id);
	};
}]);
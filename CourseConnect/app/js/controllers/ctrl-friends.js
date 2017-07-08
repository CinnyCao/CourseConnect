'use strict';

var CtrlFriends = angular.module('CtrlFriends', []);

CtrlFriends.service('FriendsService', ['$http', function ($http) {
	this.getFriends = function (ID) {
        return $http.post('/api/getFriends', {
            id: ID
        });
    };
	this.removeFriend = function (ID, friendID){
		return $http.post('/api/removeFriend', {
            id: ID,
			fid: friendID
        });
	}
}]);


CtrlFriends.controller('FriendsCtrl', ['$scope', '$http', '$cookies', 'FriendsService', function ($scope, $http, $cookies, FriendsService) {

	$scope.var_friends = [];
	console.log($cookies.get('loginToken'));
	FriendsService.getFriends($cookies.get('loginToken'))
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
		FriendsService.removeFriend($cookies.get('loginToken'), id);
	};
}]);
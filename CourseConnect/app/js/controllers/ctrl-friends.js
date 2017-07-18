'use strict';

var CtrlFriends = angular.module('CtrlFriends', []);

CtrlFriends.directive('onErrorSrc', function($http) {
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
			console.log(data);
			if (data.data.isvalid){
				$scope.var_friends = data.data.friends;
			}
		});

	$scope.unfriend = function (id) {
		FriendsService.removeFriend(id);
	};
}]);
'use strict';

var userProfileCtrls = angular.module('CtrlUserProfile', []);

userProfileCtrls.controller('UserProfileCtrl', ['$scope', '$http', function ($scope, $http) {
	$scope.name = "Guan Yu Chen";
	$scope.uploadPic = function(file) {
		
	}
}]);

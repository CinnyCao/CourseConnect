'use strict';

var userProfileCtrls = angular.module('CtrlUserProfile', []);

userProfileCtrls.controller('UserProfileCtrl', ['$scope', '$http', function ($scope, $http) {
	$http.get('/userinfo').then(function (result) {
		$scope.name = result.data[0].FirstName + " " + result.data[0].LastName;
		$scope.email = result.data[0].Email;
		if (result.data[0].UTorId != null) $scope.utorid = result.data[0].UTorId;
		if (result.data[0].Description != null) $scope.description = result.data[0].Description;
	})
	$scope.uploadPic = function(file) {
		console.log(file);
	}
}]);

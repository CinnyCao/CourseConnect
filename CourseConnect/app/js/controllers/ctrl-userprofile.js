'use strict';

var userProfileCtrls = angular.module('CtrlUserProfile', ['ngFileUpload']);

userProfileCtrls.controller('UserProfileCtrl', ['$scope', '$http', function ($scope, $http) {
	$scope.profilePic = "img/defaultAvatar.png";
	$http.get('/api/userinfo').then(function (result) {
		$scope.name = result.data[0].FirstName + " " + result.data[0].LastName;
		$scope.email = result.data[0].Email;
		if (result.data[0].UTorId != null) $scope.utorid = result.data[0].UTorId;
		if (result.data[0].Description != null) $scope.description = result.data[0].Description;
	})
	$scope.uploadPic = function(file) {
		console.log(file);
		$http.post('/api/profpic-upload', {picture: file).then(function (res) {

		})
	}
}]);

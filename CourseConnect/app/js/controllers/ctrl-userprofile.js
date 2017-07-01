'use strict';

var userProfileCtrls = angular.module('CtrlUserProfile', ['ngFileUpload']);

userProfileCtrls.controller('UserProfileCtrl', ['$scope', '$http','fileUpload', '$cookies', function ($scope, $http, fileUpload, $cookies) {
	$scope.profilePic = "img/defaultAvatar.png";

	$http.get('/api/userinfo').then(function (result) {
		$scope.name = result.data[0].FirstName + " " + result.data[0].LastName;
		$scope.email = result.data[0].Email;
		if (result.data[0].UTorId != null) $scope.utorid = result.data[0].UTorId;
		if (result.data[0].Description != null) $scope.description = result.data[0].Description;
		if (result.data[0].fileLocation != null) $scope.profilePic = result.data[0].fileLocation;
	})

	$scope.uploadFile = function (file) {
		var file = $scope.myFile;

		console.log('file is ');
		console.dir(file);

		var uploadUrl = "/api/profpic-upload";
		fileUpload.uploadFileToUrl(file, uploadUrl);
		$http.post('/api/refreshProfile', {file: file.name, token: $cookies.get('loginToken')}).then(function (res) {
			$scope.profilePic = res.data[0].fileLocation;
		})
	};
}]);	

'use strict';

var userProfileCtrls = angular.module('CtrlUserProfile', ['ngFileUpload']);

userProfileCtrls.controller('UserProfileCtrl', ['$scope', '$http','fileUpload',
	function ($scope, $http, fileUpload) {
		$scope.profilePic = "img/defaultAvatar.png";

		$http.get('/api/userinfo').then(function (result) {
			$scope.name = result.data[0].FirstName + " " + result.data[0].LastName;
			$scope.email = result.data[0].Email;
			if (result.data[0].UTorId != null) $scope.utorid = result.data[0].UTorId;
			if (result.data[0].Description != null) $scope.description = result.data[0].Description;
		})

		$scope.uploadFile = function (file) {
			var file = $scope.myFile;

			console.log('file is ');
			console.dir(file);

			var uploadUrl = "/api/profpic-upload";
			// fs.writeFile("/tmp/test", file, function(err) {
			// 	if(err) {
			// 		return console.log(err);
			// 	}

			// 	console.log("The file was saved!");
			// }); 
			fileUpload.uploadFileToUrl(file, uploadUrl);
			
		};
	}]);

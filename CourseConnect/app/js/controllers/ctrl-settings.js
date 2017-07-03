'use strict';

var userChangeDispName = angular.module('CtrlSettings', []);

userChangeDispName.controller('SettingsCtrl', ['$scope', '$http', '$cookies', function ($scope, $http, $cookies) {
	$http.post('/api/userinfo', {token: $cookies.get('loginToken')}).then(function (res) {
		if (res.data[0].DisplayName != null) $scope.dispname = res.data[0].DisplayName;
		if (res.data[0].Description != null) $scope.desc = res.data[0].Description;
	})
	$scope.changeDispName = function () {
		$http.post('/api/updatedispname', {dispName: $scope.newDisplayName, token: $cookies.get('loginToken')}).then(function (res) {
			$scope.dispname = res.data[0].DisplayName;
		})
	};

	$scope.changeDesc = function () {
		$http.post('/api/updateddesc', {desc: $scope.newDesc, token: $cookies.get('loginToken')}).then(function (res) {
			$scope.desc = res.data[0].Description;
		})
	}
}]);
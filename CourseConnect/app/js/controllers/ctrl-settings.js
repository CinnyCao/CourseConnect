'use strict';

var userChangeDispName = angular.module('CtrlSettings', []);

userChangeDispName.controller('SettingsCtrl', ['$scope', '$http', function ($scope, $html) {
	$scope.changeDispName = function () {
		console.log($scope.newDisplayName);
	};

	$scope.changeDesc = function () {
		console.log($scope.newDesc);
	}
}]);
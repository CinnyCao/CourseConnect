'use strict';

var userLoginCtrls = angular.module('CtrlUserLogin', []);

userLoginCtrls.controller('LoginCtrl', ['$scope', function($scope) {
	$scope.login = function () {
		console.log($scope.email);
		console.log($scope.pwd);
	};
	$scope.login();
}]);
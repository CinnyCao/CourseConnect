'use strict';

var userProfileCtrls = angular.module('CtrlUserProfile', []);

userProfileCtrls.controller('displayUserInfoCtrl', ['$scope', '$http', function ($scope, $http) {
	$scope.name = "Kevin Chen";
}]);
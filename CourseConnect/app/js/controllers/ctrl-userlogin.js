'use strict';

var userLoginCtrls = angular.module('CtrlUserLogin', []);

// userLoginCtrls.service('UserLoginService', ['$http', function ($http) {
	
// }]);

userLoginCtrls.controller('LoginCtrl', ['$scope', '$http', function($scope, $http) {
	$scope.login = function () {
		console.log($scope.email);
		console.log($scope.pwd);
		$http.post('/authenticate', {email: $scope.email, pwd: $scope.pwd}).then(function (res) {
			console.log(res.data[0]["Password"] === $scope.pwd);
			if (res.data[0]["Password"] === $scope.pwd) {
				window.location.href = '/loggedin.html';
			}
		});
		$http.get('/authenticate').then(function (res) {
			console.log(res);
		});
	};
}]);
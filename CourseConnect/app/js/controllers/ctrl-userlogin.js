'use strict';

var userLoginCtrls = angular.module('CtrlUserLogin', []);

// userLoginCtrls.service('UserLoginService', ['$http', function ($http) {
	
// }]);

userLoginCtrls.controller('LoginCtrl', ['$scope', '$http', function($scope, $http) {
	$scope.login = function () {
		$http.post('/authenticate', {email: $scope.email, pwd: $scope.pwd}).then(function (res) {
			if (res.data == "match") {
				window.location.href = '/loggedin.html';
			}
		});
	};
}]);
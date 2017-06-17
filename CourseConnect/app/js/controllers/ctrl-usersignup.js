'user strict';

var userSignupCtrls = angular.module('CtrlUserSignup', []);

userSinupCtrls.controller('SignupCtrl', ['$scope', function($scope) {
    $scope.login = function () {
        console.log($scope.email);
        console.log($scope.pwd);

    };
    $scope.login();
}]);
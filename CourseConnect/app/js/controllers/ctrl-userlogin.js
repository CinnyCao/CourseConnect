'use strict';

var userLoginCtrls = angular.module('CtrlUserLogin', []);

userLoginCtrls.controller('LoginCtrl', ['$scope', '$http', '$cookies', function ($scope, $http, $cookies) {
    $('#loginFailedAlert').hide();
    $(function () {
        $("[data-hide]").on("click", function () {
            $(this).closest("." + $(this).attr("data-hide")).hide();
        });
    });
    $scope.login = function () {
        $http.defaults.withCredentials = true;
        $http.post('/api/authenticate', {email: $scope.email, pwd: $scope.pwd, token: $cookies.get('loginToken')}).then(function (res) {
            if (res.data.isvalid) {
                window.location.href = '#/loggedin';
            } else{
                $('#loginFailedAlert').show();
            }
        });
    };
}]);
'use strict';

var userLoginCtrls = angular.module('CtrlUserLogin', []);

userLoginCtrls.controller('LoginCtrl', ['$scope', '$http', function ($scope, $http) {
    $('#loginFailedAlert').hide();
    $(function () {
        $("[data-hide]").on("click", function () {
            $(this).closest("." + $(this).attr("data-hide")).hide();
        });
    });
    $scope.login = function () {
        $http.post('/api/authenticate', {email: $scope.email, pwd: $scope.pwd}).then(function (res) {
            if (res.data == true) {
                window.location.href = '#/loggedin';
            } else if (res.data == false) {
                $('#loginFailedAlert').show();
            }
        });
    };
}]);
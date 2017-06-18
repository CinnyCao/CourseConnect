'user strict';

var userSignupCtrls = angular.module('CtrlUserSignup', []);

userSignupCtrls.controller('SignupCtrl', ['$scope', '$http', function($scope, $http) {
    $('#FailedAlert1').hide();
    $('#FailedAlert2').hide(); /*Leave this to check*/
    $(function(){
        $("[data-hide]").on("click", function(){
            $(this).closest("." + $(this).attr("data-hide")).hide();
        });
    });
    $scope.signup = function () {
        $http.post('/signupCheck', {username: $scope.username, fn: $scope.firstname, ln: $scope.lastname, uid: $scope.utorid, pwd: $scope.password, repwd: $scope.repassword}).then(function (res) {
            if(pwd.toString().trim() != repwd.toString().trim()){
                $('#FailedAlert2').show();
            }
            if (res.data == true) {
                window.location.href = '/login.html';
            } else if (res.data == false){
                $('#FailedAlert1').show();
            }
        });
    };
}]);
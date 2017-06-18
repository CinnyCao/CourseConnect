'user strict';

var userSignupCtrls = angular.module('CtrlUserSignup', []);

userSignupCtrls.controller('SignUpCtrl', ['$scope', '$http', function($scope, $http) {
    $('#FailedAlert').hide();
    $('#MatchingPwd').hide(); /*Leave this to check*/
    $(function(){
        $("[data-hide]").on("click", function(){
            $(this).closest("." + $(this).attr("data-hide")).hide();
        });
    });
    $scope.signup = function () {
        $http.post('/signupCheck', {username: $scope.username, fn: $scope.firstname, ln: $scope.lastname, uid: $scope.utorid, pwd: $scope.password, repwd: $scope.repassword}).then(function (res) {
            if($scope.password != $scope.repassword) {
                $('#MatchingPwd').show();
            }
            console.log(res);
        });
    };
}]);
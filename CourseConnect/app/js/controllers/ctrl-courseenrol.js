var CtrlCourseEnroll = angular.module('CtrlCourseEnroll', []);

CtrlCourseEnroll.controller('CourseEnrollCtrl', ['$scope', '$http', '$cookies', function ($scope, $http, $cookies) {
    $http.post('/api/getcrsenrolled', {token: $cookies.get('loginToken')}).then(function (res) {
        console.log(res);
        $scope.courses = res.data;
    })
}])

var CtrlCourseEnroll = angular.module('CtrlCourseEnroll', []);

CtrlCourseEnroll.controller('CourseEnrollCtrl', ['$scope', '$http', '$cookies', function ($scope, $http, $cookies) {
    $http.get('/api/getcrsenrolled').then(function (res) {
        console.log(res);
        $scope.courses = res.data;
    });
}])

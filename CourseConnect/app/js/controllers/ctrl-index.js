'use strict';

var indexCtrl = angular.module('CtrlIndex', []);

indexCtrl.service('IndexService', ['$http', function ($http) {
    // get class room by courseid, semester and year
    this.getClassroom = function (courseid, semester, year) {
        var req = {
            method: "GET",
            url: "/api/getclass/" + year + "/" + semester + "/" + courseid
        };

        return $http(req);
    };
}]);

indexCtrl.controller('IndexCtrl', ['$scope', '$location', 'CommonService', 'IndexService',
    function ($scope, $location, CommonService, IndexService) {
        console.log('IndexCtrls is running');

        $scope.openYearPicker = function($event) {
            $scope.var_year_picker_opened = true;
        };

        $scope.dateOptions = {
            formatYear: 'yyyy',
            datepickerMode: 'year',
            minMode: 'year'
        };

        $scope.getCourseId = function () {
            return $scope.var_course_code + $scope.var_semester + $scope.var_year;
        };

        $scope.goToChatRoom = function () {
            var roomId = $scope.getCourseId();
            IndexService.getClassroom($scope.var_course_code, $scope.var_semester, $scope.var_year)
                .then(function (data) {
                    if (data.found) {
                        $location.path("/chat/" + data.year + "/" + data.semester + "/" + data.courseCode);
                    } else {
                        // check if user is logged in, if yes, ask him to create a class room

                        // if no, tell him that room doesn't not exist
                    }
                });
        };

        $scope.init = function () {
            $scope.var_date = new Date();
            $scope.var_year_picker_opened = false;

            // get current semester
            var monthIndex = parseInt($scope.var_date.getMonth());
            if (0 <= monthIndex && monthIndex <= 3) {
                $scope.var_semester = "W";
            } else if (4 <= monthIndex && monthIndex <= 7) {
                $scope.var_semester = "S";
            } else {
                $scope.var_semester = "F";
            }
        };

        $scope.init();

        $scope.$watch("var_date", function () {
            $scope.var_year = $scope.var_date.getFullYear();
        });

        $scope.$watch("var_course_code", function () {
            $scope.var_course_code = CommonService.standardizeInput($scope.var_course_code);
        });
    }
]);

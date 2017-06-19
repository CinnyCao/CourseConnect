'use strict';

var indexCtrl = angular.module('CtrlIndex', []);

indexCtrl.service('IndexService', ['$http', function ($http) {
    // TODO: check if classroom exists
    this.roomValidation = function (id) {
        return true;
    };
}]);

indexCtrl.controller('IndexCtrl', ['$scope', '$location', 'IndexService',
    function ($scope, $location, IndexService) {
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
            return $scope.var_course_code.trim() + $scope.var_semester + $scope.var_year;
        };

        $scope.goToChatRoom = function () {
            var roomId = $scope.getCourseId();
            if (IndexService.roomValidation(roomId)) {
                $location.path("/chat/" + roomId);
            } else {
                // TODO: prompt to create room?
                alert("Room not existing");
            }
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
    }
]);

'use strict';

var indexCtrl = angular.module('CtrlIndex', []);

indexCtrl.service('IndexService', ['$http', function ($http) {

}]);

indexCtrl.controller('IndexCtrl', ['$scope', '$location', 'IndexService',
    function ($scope, $location, NavBarService) {
        console.log('IndexCtrls is running');

    }
]);

'use strict';

/* App Modules of TD-Portal */

var tdPortal = angular.module('courseConnect', [
    'ngRoute',
    'Directives',
    'Filters',
    'CtrlChat'
]);

/* App route */
tdPortal.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: '/templates/HomePage.html'
        })
        .when('/chattest', {
            templateUrl: '/templates/ChatRoom.html',
            controller: 'ChatCtrl'
        })
        .otherwise({
            templateUrl: '/templates/PageNotFound.html'
        });
  }]);



'use strict';

/* App Modules of TD-Portal */

var tdPortal = angular.module('courseConnect', [
    'ngRoute',
    'Directives',
    'Filters',
    'CtrlIndex',
    'CtrlChat'
]);

/* App route */
tdPortal.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: '/templates/HomePage.html'
        })
        .when('/chat/:courseid', {
            templateUrl: '/templates/ChatRoom.html',
            controller: 'ChatCtrl'
        })
        .otherwise({
            templateUrl: '/templates/PageNotFound.html'
        });
  }]);



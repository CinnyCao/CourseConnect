'use strict';

/* App Modules of TD-Portal */

var tdPortal = angular.module('courseConnect', [
  'ngRoute',
  'Directives',
  'Filters',
  'CtrlNavbar'
]);


/* App route */

tdPortal.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: '/templates/HomePage.html',
            controller: 'HomeCtrl'
        })
        .when('/chattest', {
            templateUrl: '/templates/ChatRoom.html'
        })
        .otherwise({
            templateUrl: '/templates/PageNotFound.html'
        });
  }]);

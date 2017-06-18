'use strict';

/* App Modules of TD-Portal */

var tdPortal = angular.module('courseConnect', [
  'ngRoute',
  'Directives',
  'Filters',
  'CtrlUserLogin'
]);


/* App route */

tdPortal.config(['$routeProvider', function($routeProvider) {
    $routeProvider
    .when('/', {
      templateUrl: '/templates/HomePage.html'
    })
    .when('/login', {
      templateUrl: '/templates/login.html',
      controller: 'LoginCtrl'
    })
    .when('/loggedin', {
      templateUrl: '/templates/loggedin.html'
    })
    .when('/userprofile', {
      templateUrl: '/templates/userprofile.html'
    })
    .otherwise({
      templateUrl: '/templates/PageNotFound.html'
    });
  }]);

'use strict';

/* App Modules of TD-Portal */

var tdPortal = angular.module('courseConnect', [
  'ngRoute',
  'Directives',
  'Filters'
]);


/* App route */

tdPortal.config(['$routeProvider', function($routeProvider) {
    $routeProvider
    .when('/', {
      templateUrl: '/templates/HomePage.html'
    })
    .when('/signup', {
      templateUrl: '/templates/signUp.html',
      controller: 'SignUpCtrl'
    })
    .when('/login', {
      templateUrl: '/templates/login.html',
      controller: 'LoginCtrl'
    })
    .when('/loggedin', {
      templateUrl: '/templates/loggedin.html'
    })
    .otherwise({
      templateUrl: '/templates/PageNotFound.html'
    });
  }]);

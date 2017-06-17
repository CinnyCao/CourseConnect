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
    .otherwise({
      templateUrl: '/templates/PageNotFound.html'
    });
  }]);

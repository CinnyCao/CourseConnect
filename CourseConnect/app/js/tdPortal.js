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
      templateUrl: '/templates/PageNotFound.html',
      controller: 'HomeCtrl'
    })
    .otherwise({
      templateUrl: '/templates/PageNotFound.html'
    });
  }]);

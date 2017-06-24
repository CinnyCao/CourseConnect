'use strict';

/* App Modules of TD-Portal */

var tdPortal = angular.module('courseConnect', [
    'ngAnimate',
    'ui.bootstrap',
    'ngRoute',
    'Directives',
    'Filters',
    'CtrlIndex',
    'CtrlChat',
    'CtrlUserLogin',
    'CtrlUserSignup',
    'CtrlUserProfile'
]);

/* App route */
tdPortal.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
    .when('/', {
        templateUrl: '/templates/HomePage.html'
    })
    .when('/userprofile', {
        templateUrl: '/templates/userprofile.html'
    })
    .when('/courseenroll', {
        templateUrl: '/templates/courseenrol.html'
    })
    .when('/settings', {
        templateUrl: '/templates/settings.html'
    })
    .when('/chat/:courseid', {
        templateUrl: '/templates/ChatRoom.html',
        controller: 'ChatCtrl'
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

'use strict';

/* App Modules of TD-Portal */

var tdPortal = angular.module('courseConnect', [
    'ngAnimate',
    'ui.bootstrap',
    'ngScrollGlue',
    'ngRoute',
    'Directives',
    'Services',
    'Filters',
    'CtrlIndex',
    'CtrlChat',
    'CtrlUserLogin',
    'CtrlUserSignup',
    'CtrlUserProfile',
    'CtrlSettings',
    'ngCookies'
]);

/* App route */
tdPortal.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
    .when('/', {
        templateUrl: '/templates/HomePage.html'
    })
    .when('/userprofile', {
        templateUrl: '/templates/userprofile.html',
        controller: 'UserProfileCtrl'
    })
    .when('/courseenroll', {
        templateUrl: '/templates/courseenrol.html'
    })
    .when('/settings', {
        templateUrl: '/templates/settings.html',
        controller: 'SettingsCtrl'
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
    .when('/logout', {
        templateUrl: '/templates/HomePage.html',
        controller: 'LogOutCtrl'
    })
    .when('/loggedin', {
        templateUrl: '/templates/loggedin.html'
    })
    .otherwise({
        templateUrl: '/templates/PageNotFound.html'
    });
}]);

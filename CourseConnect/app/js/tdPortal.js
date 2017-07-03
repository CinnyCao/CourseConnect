'use strict';

/* App Modules of TD-Portal */

var tdPortal = angular.module('courseConnect', [
    'ngAnimate',
    'ui.bootstrap',
    'ngScrollGlue',
    'ngRoute',
    'Directives',
    'Filters',
    'CtrlIndex',
    'CtrlChat',
    'CtrlUserLogin',
    'CtrlUserSignup',
    'ngCookies'
]);

/* App route */
tdPortal.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: '/templates/HomePage.html'
        })
        .when('/chat/:year/:semester/:courseid', {
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

/* Global functions and constants */
tdPortal.service('CommonService', function () {
    // trim and capitalize input for DB transactions (compare and insert)
    var standardizeInput = function (input) {
        return input.trim().toUpperCase();
    };

    return {
        standardizeInput: standardizeInput
    };
});

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
tdPortal.service('CommonService', CommonService);
CommonService.$inject = ['$http'];
function CommonService($http) {
    // User info
    var curr_user = {
        loggedIn: 0
    };

    // setUser when logged in and when update profile
    // TODO: call setUser when profile is updated
    var setUser = function (userToken) {
        var req = {
            method: "POST",
            url: "/api/getUser",
            data: {
                token: userToken
            }
        };

        $http(req).then(function (data) {
            curr_user.loggedIn = 1;
            curr_user.userId = data.userId;
            curr_user.lastName = data.lastName;
            curr_user.firstName = data.firstName;
            curr_user.email = data.email;
            curr_user.displayName = data.displayName;
            curr_user.description = data.description;
            curr_user.utorId = data.utorId;
            curr_user.profilePic = data.profilePic;
        });
    };

    // TODO: implement logout
    var logout = function () {
        curr_user = {
            loggedIn: 0
        };
    };

    var isLoggedIn = function () {
        if (curr_user.loggedIn) {
            return true;
        }
        return false;
    };

    // trim and capitalize input for DB transactions (compare and insert)
    var standardizeInput = function (input) {
        return input.trim().toUpperCase();
    };

    return {
        setUser: setUser,
        logout: logout,
        isLoggedIn: isLoggedIn,
        standardizeInput: standardizeInput
    };
}

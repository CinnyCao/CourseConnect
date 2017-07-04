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
    .when('/chat/:year/:semester/:coursecode', {
        templateUrl: '/templates/ChatRoom.html',
        controller: 'ChatCtrl'
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

        $http(req).then(function (result) {
            curr_user.loggedIn = 1;
            curr_user.userId = result.data.userId;
            curr_user.lastName = result.data.lastName;
            curr_user.firstName = result.data.firstName;
            curr_user.email = result.data.email;
            curr_user.displayName = result.data.displayName;
            curr_user.description = result.data.description;
            curr_user.utorId = result.data.utorId;
            curr_user.profilePic = result.data.profilePic;
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

    var getUserId = function () {
        return curr_user.userId;
    }

    // trim and capitalize input for DB transactions (compare and insert)
    var standardizeInput = function (input) {
        return input.trim().toUpperCase();
    };

    // convert semester code to semester
    var getSemesterName = function (semester) {
        if (semester == "F") {
            return "Fall";
        } else if (semester == "W") {
            return "Winter";
        } else {
            return "Summer";
        }
    };

    return {
        setUser: setUser,
        logout: logout,
        isLoggedIn: isLoggedIn,
        getUserId: getUserId,
        standardizeInput: standardizeInput,
        getSemesterName: getSemesterName
    };
}


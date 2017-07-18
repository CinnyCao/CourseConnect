'use strict';

var CtrlFriends = angular.module('CtrlFriends', []);

CtrlFriends.controller('FriendsCtrl', ['$scope', '$http', function ($scope, $http) {
    console.log('FriendsCtrl is running');

    $http.get('/api/getFriends').success(function (res) {
        $scope.var_friends = res;
    }).error(function (res) {
        console.log(res);
    })
}]);
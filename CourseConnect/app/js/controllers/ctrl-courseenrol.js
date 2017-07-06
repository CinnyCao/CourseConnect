var CtrlCourseEnroll = angular.module('CtrlCourseEnroll', []);

CtrlCourseEnroll.controller('CourseEnrollCtrl', ['$scope', '$http', '$cookies', '$routeParams', function ($scope, $http, $cookies, $routeParams) {
    $http.get('/api/getcrsenrolled').then(function (res) {
        console.log(res);
        $scope.courses = res.data;
    });

	$scope.unenrollCourse = function(course_id) {
		$http.post('/api/crsunenroll', {classid : course_id}).then(function(res) {
			console.log("Unenrolled from course!");
			//console.log($routeParams.classid);
			//document.getElementById("unenroll").click();
		});
		/*$http.post('/api/crsunenroll', {classid : $routeParams.classid}).then(function(res) {
			console.log("Unenrolled from course!");
			document.getElementById("unenroll").click();
		})*/

    	/*$http.get('/api/getcrsenrolled').then(function (res) {
        	console.log(res);
        	$scope.courses = res.data;
    	});*/
	};
}])

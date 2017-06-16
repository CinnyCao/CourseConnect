'use strict';

/*
 * Module controller
 */

var navBarCtrls = angular.module('CtrlNavbar', []);

navBarCtrls.service('NavBarService', ['$http', function ($http) {

  this.loadSuites = function(prodName) {

    return $http.get('/' + prodName + '/getSuites').then(
        function (res) {
          return res.data;
        }, function (err) {
          console.log("ERROR: Failed to load test suites. " + err.data);
        });
  };
}]);

/*
 * Navbar controller
 *
 * Notice: NavbarCtrl is associated with components in index.html. The url in
 * the address bar is not static for this controller and its view template, and
 * will be changed by template switching. Therefore, most usages of
 * $location.url() in NavbarCtrl cannot be substituted as a variable with
 * static value.
 */

navBarCtrls.controller('NavbarCtrl', ['$scope', '$location', 'NavBarService',
  function ($scope, $location, NavBarService) {

    // Extract route params
    $scope.prodName = $location.url().split("/")[2];


    /* Scope variables */

    $scope.iconType = []; // Array of css classes to control icons


    /* Scope functions */

    /*
     * Return true if viewLocation is the current url path.
     * This is used in Master nav bar for highlighting the active tag.
     *
     * @param {string} viewLocation - A given url path.
     */
    $scope.isActive = function (viewLocation) {
      return viewLocation === $location.path();
    };

    /*
     * Return true if Side bar needs to be displayed, i.e. current view is either
     * ProductView or SuiteView.
     */
    $scope.isSideBarViewable = function() {
      return (/\/(cloud|desktop)\/[a-z]+/g).test($location.url()) &&
          !(/\/(cloud|desktop)\/[a-z]+\/[a-z]+\/[a-zA-Z\-]+\/[a-z]+/g)
              .test($location.url());
    };

    /*
     * Return value for css display field to hide or display side bar.
     */
    $scope.hideDisplaySideBar = function() {
      return $scope.isSideBarViewable() ? "" : "none";
    };

    /*
     * Load test suites for all active categories of current product. A test
     * category can be activated in config.js
     *
     * API call to /prodName/getSuites.
     */
    $scope.loadSuites = function() {

      // Load suite data using NavBar Service if side bar should be displayed.
      if ($scope.isSideBarViewable()) {

        var prodName = $location.url().split("/")[2];

        NavBarService.loadSuites(prodName).then(
            function (prodData) {
              $scope.productData = prodData;
              // Set test category icon to be arrow-up
              for (var category in $scope.productData.testCategories) {
                $scope.iconType.push("hvr-icon-up");
              }});
      }};

    /*
     * Update the css class type to control the arrow direction of the icons in
     * side bar.
     *
     * @param {number} index - The index of the test category name with which the
     *                         under-controlled icon associates
     */
    $scope.switchIcons = function(index) {
      $scope.iconType[index] =
          (/up/g).test($scope.iconType[index]) ? "hvr-icon-down" : "hvr-icon-up";
    };

    /*
     * Return the base url containing /platform/prodName only from current url.
     * This is used to construct different suite urls in <a> directives and
     * highlight the suite that is currently on the view in side bar.
     */
    $scope.baseUrl = function() {
      var url = $location.url();
      return "/" + url.split("/")[1] + "/" + url.split("/")[2];
    };

    $scope.ifTaxOrSMSF = function() {
      var test = $location.url().split("/")[2];
        return (test == 'tax' || test == 'smsf');
    };
  }
]);

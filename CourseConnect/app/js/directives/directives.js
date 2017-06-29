/* 
 * Module directives
 */

var directiveModule = angular.module('Directives', ['chart.js']); // Create or retrieve module

/*
 * Directive - 'chart-stacked-bar'
 *
 * Define the directive 'chart-stacked-bar', used for creating stacked bar charts
 * in ProductView.html
 */
directiveModule.directive('chartStackedBar', function (ChartJsFactory) {
    return new ChartJsFactory('StackedBar');
});

directiveModule.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function () {
                scope.$apply(function () {
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);
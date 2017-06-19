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
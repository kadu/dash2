'use strict';

/**
 * @ngdoc function
 * @name dashApp.controller:ActivepathCtrl
 * @description
 * # ActivepathCtrl
 * Controller of the dashApp
 */
angular.module('dashApp')
  .controller('ActivepathCtrl', function ($scope, $location) {
    $scope.isActive = function(route) {
      return route === $location.path();
    };

    $scope.baseIsActive = function(route) {
      return $location.path().indexOf(route) > -1;
    };
  });

'use strict';

/**
 * @ngdoc function
 * @name dashApp.controller:StatusCtrl
 * @description
 * # StatusCtrl
 * Controller of the dashApp
 */
angular.module('dashApp')
  .controller('StatusCtrl', function ($scope, $http, mySensors) {
    var sensors = mySensors.all();
    var d = new Date();
    var today = ("0" + d.getDate()).slice(-2) + '/' + ((d.getMonth() + 1) < 10 ? '0'+(d.getMonth() + 1) : (d.getMonth() + 1) ) + '/' + d.getFullYear();

    var r = {};
    $scope.statusResult = [];

    $.each(sensors, function(key, value) {key
      var urlAux = mySensors.transformUrl(value.deviceNumber, value.deviceToken);
      $http.get(urlAux)
        .success(function(data, status, headers, config) {
          var sensorStatus = '';
          if (mySensors.getData(data[0].created_at, true).split('|')[0] === today) {
            sensorStatus = 'glyphicon glyphicon-ok'; // green
          }
          else {
            sensorStatus = 'glyphicon glyphicon-remove'; // yellow
          }

          console.log(data[0].body);
          r = {'location':     value.location,
               'label':        value.label,
               'deviceNumber': value.deviceNumber,
               'HwName' :      data[0].body.device,
               'lastDate':     mySensors.getData(data[0].created_at, true).split('|')[0],
               'lastTime':     mySensors.getData(data[0].created_at).split('|')[1],
               'temperature':  data[0].body.data.Temperature,
               'humidity':     data[0].body.data.Humidity,
               'status'  :     sensorStatus
              };
        $scope.statusResult.push(r);
      })
      .error(function (response) {
        console.log(response);
      });
    });
  });

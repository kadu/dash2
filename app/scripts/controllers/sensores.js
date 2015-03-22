'use strict';

/**
 * @ngdoc function
 * @name dashApp.controller:SensoresCtrl
 * @description
 * # SensoresCtrl
 * Controller of the dashApp
 */
angular.module('dashApp')
    .controller('SensoresCtrl', function ($scope, $location, $http) {
        var devices = [];
        var baseURL = 'http://ciot.kadu.com.br/v1/device/@device_id/streams/@last?token=@token';
        var d = new Date();
        $scope.today = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        $scope.now = d.getDate() + '.' + (d.getMonth() + 1) + '.' + d.getFullYear();
        $scope.devices = [];
        $scope.path = $location.path().split('/').pop();
        $scope.pageResult = [];
        $scope.getData = function (date) {
            var daux = date.split('T')[0];
            var taux = date.split('T')[1].split('.')[0];
            return daux + '|' + taux;
        };
        var transformUrl = function (id, token, fullHistory) {
            var new_url = baseURL.replace('@device_id', id);
            new_url = new_url.replace('@token', token);
            if (typeof fullHistory  === "undefined" || (fullHistory !== false && fullHistory !== true))
                new_url = new_url.replace('@last','');
            else
                new_url = new_url.replace('@last',$scope.today + '/');
            return(new_url);
        };

        var structuredValues = { Temperature: 0, Humidity: 0};
        var structuredData   = { ten : { Temperature: 0, Humidity: 0}, twelve  : { Temperature: 0, Humidity: 0}, fourteen: { Temperature: 0, Humidity: 0}};

        $scope.sensors = [{location: '23a - Terreo',    deviceGroup: '23a', deviceNumber: 13,  deviceToken: 'czwTqPsYgEbYoNmEwyhmgQ', data: [], parsedData: structuredData, detailPath: '/cps/23a/terreo'},
                          {location: '23a - 1o. Piso',  deviceGroup: '23a', deviceNumber: 14,  deviceToken: 'czwTqPsYgEbYoNmEwyhmgQ', data: [], parsedData: structuredData, detailPath: '/cps/23a/1piso'},
                          {location: '23a - 2o. Piso',  deviceGroup: '23a', deviceNumber: 15,  deviceToken: 'czwTqPsYgEbYoNmEwyhmgQ', data: [], parsedData: structuredData, detailPath: '/cps/23a/2piso'},
                          {location: '23b - Terreo',    deviceGroup: '23b', deviceNumber: 16,  deviceToken: 'czwTqPsYgEbYoNmEwyhmgQ', data: [], parsedData: structuredData, detailPath: '/cps/23b/terreo'},
                          {location: '23b - Gefin',     deviceGroup: '23b', deviceNumber: 17,  deviceToken: 'czwTqPsYgEbYoNmEwyhmgQ', data: [], parsedData: structuredData, detailPath: '/cps/23b/gefin'},
                          {location: '23b - 1o. Piso',  deviceGroup: '23b', deviceNumber: 18,  deviceToken: 'czwTqPsYgEbYoNmEwyhmgQ', data: [], parsedData: structuredData, detailPath: '/cps/23b/1piso'},
                          {location: '23b - Garagem',   deviceGroup: '23b', deviceNumber: 23, deviceToken: 'czwTqPsYgEbYoNmEwyhmgQ', data: [], parsedData: structuredData, detailPath: '/cps/23b/garagem'},
                          {location: '16 - Processos',  deviceGroup: '16',  deviceNumber: 19,  deviceToken: 'czwTqPsYgEbYoNmEwyhmgQ', data: [], parsedData: structuredData, detailPath: '/cps/16/corredor1'},
                          {location: '16 - Prox. copa', deviceGroup: '16',  deviceNumber: 20,  deviceToken: 'czwTqPsYgEbYoNmEwyhmgQ', data: [], parsedData: structuredData, detailPath: '/cps/16/corredor2'},
                          {location: '12 - Bayer',      deviceGroup: '12',  deviceNumber: 21,  deviceToken: 'czwTqPsYgEbYoNmEwyhmgQ', data: [], parsedData: structuredData, detailPath: '/cps/12/corredor1'},
                          {location: '12 - Walmart',    deviceGroup: '12',  deviceNumber: 22, deviceToken: 'czwTqPsYgEbYoNmEwyhmgQ', data: [], parsedData: structuredData, detailPath: '/cps/12/corredor2'}
            ];

        var coverDataParser = function (data, sensorKey) {
            var dados = data;
            var parsedAux = { ten : { Temperature: 0, Humidity: 0}, twelve  : { Temperature: 0, Humidity: 0}, fourteen: { Temperature: 0, Humidity: 0}};;

            $.each(dados, function (chave, valor) {
                var dtaux = $scope.getData(valor.created_at);
                var date_aux = dtaux.split('|')[0];
                var time_aux = dtaux.split('|')[1];
                var swithaux = parseInt(time_aux.split(":")[0]);
                var conta = 0;
                switch(swithaux) {
                    case 10:
                        if (parsedAux.ten.Temperature === 0) {
                            parsedAux.ten.Temperature = valor.body.data.Temperature;
                            parsedAux.ten.Humidity    = valor.body.data.Humidity;
                        }
                    case 12:
                        if (parsedAux.twelve.Temperature === 0) {
                            parsedAux.twelve.Temperature = valor.body.data.Temperature;
                            parsedAux.twelve.Humidity    = valor.body.data.Humidity;
                        }
                    case 14:
                        if (parsedAux.fourteen.Temperature === 0) {
                            parsedAux.fourteen.Temperature = valor.body.data.Temperature;
                            parsedAux.fourteen.Humidity    = valor.body.data.Humidity;
                        }
                }
            });
            $scope.sensors[sensorKey].parsedData = parsedAux;
        };

        var fillPageResults = function() {
            $.each($scope.devices, function (key, value) {
                if ($scope.pageResult.length === 0) {
                    $scope.pageResult.push($scope.sensors[value.key]);
                    setTimeout(function () {
                      try {
                        g($scope.sensors[value.key].data[0].body.data.Temperature, 'gauge_' + $scope.sensors[value.key].deviceNumber, 'temperature', $scope.sensors[value.key].location);
                      }
                      catch (err) {}
                    }, 2000);
                }
                else {
                    var controla = false;
                    $.each($scope.pageResult, function (prKey, prValue) {
                        if (value.deviceNumber === $scope.pageResult[prKey].deviceNumber) {
                            controla = true;
                        }
                    });
                    if (!controla) {
                        $scope.pageResult.push($scope.sensors[value.key]);
                        setTimeout(function () {
                          try {
                            g($scope.sensors[value.key].data[0].body.data.Temperature, 'gauge_' + $scope.sensors[value.key].deviceNumber, 'temperature', $scope.sensors[value.key].location);
                          }
                          catch (err) {}
                        }, 2000);
                    }
                }
            });
            setTimeout(function () {
                $('svg').find('text:first').find('tspan').each(function (k, v) {
                   $(v).attr('class','sensores title');
                });
            },2500);
        };

        var onReceiveData = function (data, key) {
            $scope.sensors[key].data = data.data;
            coverDataParser($scope.sensors[key].data, key);
            fillPageResults();
        }

        $.each($scope.sensors, function (key, value) {
            if (value.deviceGroup === $scope.path) {
                var deviceStructure = {deviceNumber : '', key: 0};
                deviceStructure.deviceNumber = value.deviceNumber;
                deviceStructure.key = key;
                $scope.devices.push(deviceStructure);
                var urlAux = transformUrl(value.deviceNumber, value.deviceToken, false);
                $http.get(urlAux)
                    .then(function(data, status, headers, config) {
                      onReceiveData(data, key);
                    });
            }
        });
    });

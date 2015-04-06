'use strict';

/**
 * @ngdoc service
 * @name dashApp.mySensors
 * @description
 * # mySensors
 * Service in the dashApp.
 */
angular.module('dashApp')
  .service('mySensors', function () {

  var baseURL = 'http://ciot.kadu.com.br/v1/device/@device_id/streams/@last?token=@token';
  var d = new Date();
  var today = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
  var now = d.getDate() + '.' + (d.getMonth() + 1) + '.' + d.getFullYear();

    var structuredData   = { ten : { Temperature: 0, Humidity: 0}, twelve  : { Temperature: 0, Humidity: 0}, fourteen: { Temperature: 0, Humidity: 0}};
    var sensors = [{location: '23a - Terreo',  label: 3, deviceGroup: '23a', deviceNumber: 13,  deviceToken: 'czwTqPsYgEbYoNmEwyhmgQ', data: [], parsedData: structuredData, detailPath: '/cps/23a/terreo'},
                      {location: '23a - 1o. Piso',  label: 2, deviceGroup: '23a', deviceNumber: 14,  deviceToken: 'czwTqPsYgEbYoNmEwyhmgQ', data: [], parsedData: structuredData, detailPath: '/cps/23a/1piso'},
                      {location: '23a - Terreo???', label: 0, deviceGroup: '23a', deviceNumber: 15,  deviceToken: 'czwTqPsYgEbYoNmEwyhmgQ', data: [], parsedData: structuredData, detailPath: '/cps/23a/2piso'},
                      {location: '23b - Genfin?',   label: 0, deviceGroup: '23b', deviceNumber: 21,  deviceToken: 'czwTqPsYgEbYoNmEwyhmgQ', data: [], parsedData: structuredData, detailPath: '/cps/23b/terreo'},
                      {location: '23b - Genfin',    label: 6, deviceGroup: '23b', deviceNumber: 17,  deviceToken: 'czwTqPsYgEbYoNmEwyhmgQ', data: [], parsedData: structuredData, detailPath: '/cps/23b/gefin'},
                      {location: '23b - 1o. Piso',  label: 4, deviceGroup: '23b', deviceNumber: 16,  deviceToken: 'czwTqPsYgEbYoNmEwyhmgQ', data: [], parsedData: structuredData, detailPath: '/cps/23b/1piso'},
                      {location: '23b - Garagem',   label: 1, deviceGroup: '23b', deviceNumber: 23,  deviceToken: 'czwTqPsYgEbYoNmEwyhmgQ', data: [], parsedData: structuredData, detailPath: '/cps/23b/garagem'},
                      {location: '16 - Processos',  label: 7, deviceGroup: '16',  deviceNumber: 19,  deviceToken: 'czwTqPsYgEbYoNmEwyhmgQ', data: [], parsedData: structuredData, detailPath: '/cps/16/corredor1'},
                      {location: '16 - Prox. copa', label: 8, deviceGroup: '16',  deviceNumber: 20,  deviceToken: 'czwTqPsYgEbYoNmEwyhmgQ', data: [], parsedData: structuredData, detailPath: '/cps/16/corredor2'},
                      {location: '12 - Bayer',      label: 9, deviceGroup: '12',  deviceNumber: 18,  deviceToken: 'czwTqPsYgEbYoNmEwyhmgQ', data: [], parsedData: structuredData, detailPath: '/cps/12/corredor1'},
                      {location: '12 - Walmart',    label: 10, deviceGroup: '12', deviceNumber: 22,  deviceToken: 'czwTqPsYgEbYoNmEwyhmgQ', data: [], parsedData: structuredData, detailPath: '/cps/12/corredor2'}
    ];

    var getData = function (date, formated) {
      if (typeof formated === undefined)
        formated = false;

        var daux = date.split('T')[0];
        var taux = date.split('T')[1].split('.')[0];

      if (formated) {
        daux = daux.split('-')[2] + '/' + daux.split('-')[1] + '/' + daux.split('-')[0];
      }

      return daux + '|' + taux;
    };

    var transformUrl = function (id, token, fullHistory) {
      var new_url = baseURL.replace('@device_id', id);
      new_url = new_url.replace('@token', token);

      if (typeof fullHistory  === "undefined" || (fullHistory !== false && fullHistory !== true))
          new_url = new_url.replace('@last','last');
      else
          new_url = new_url.replace('@last',today + '/');
      return(new_url);
    };


    return {
      all: function() {
        return sensors;
      },
      transformUrl: function (id, token, fullHistory) {
        return transformUrl(id, token, fullHistory);
      },
      getData: function(date, formated) {
        return getData(date, formated);
      }
    }
  });

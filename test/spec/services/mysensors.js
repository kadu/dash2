'use strict';

describe('Service: mySensors', function () {

  // load the service's module
  beforeEach(module('dashApp'));

  // instantiate service
  var mySensors;
  beforeEach(inject(function (_mySensors_) {
    mySensors = _mySensors_;
  }));

  it('should do something', function () {
    expect(!!mySensors).toBe(true);
  });

});

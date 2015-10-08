/* global beforeEach, afterEach, describe, it, assert */

'use strict';

var supertest = require('supertest');

var Service = require('../../app/Service');
var VersionAPI = require('../../app/api/VersionAPI');

describe('Service', function() {

    var app;

    afterEach(function() {
        if (app) {
            app.close();
        }
    });

    it('should call versionAPI at /admin/version endpoint' , function(done) {

        var versionAPI = new VersionAPI();
        var versionAPIGet = sinon.spy(versionAPI, 'get');

        app = new Service({versionAPI: versionAPI}).start(1234);

        supertest(app)
            .get('/admin/version')
            .expect(function() {
                expect(versionAPIGet).to.have.been.called;
            })
            .end(done);
    });
});

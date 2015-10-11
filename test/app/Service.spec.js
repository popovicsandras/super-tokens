/* global beforeEach, afterEach, describe, it, assert */

'use strict';

var supertest = require('supertest');
var express = require('express');

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

        var config = {'port':1234};
        var versionAPI = new VersionAPI();
        var versionAPIGet = sinon.spy(versionAPI, 'get');

        app = new Service(config, versionAPI).start(express());

        supertest(app)
            .get('/admin/version')
            .expect(function() {
                expect(versionAPIGet).to.have.been.called;
            })
            .end(done);
    });
});

'use strict';

var http = require('http');
var express = require('express');
var SampleAPI = require('./api/SampleAPI');
var VersionAPI = require('./api/VersionAPI');

var swaggerUiMiddleware = require('swagger-ui-middleware');

function Service(apis) {
    apis = apis || {};
    this.sampleAPI = apis.sampleAPI ? apis.sampleAPI: new SampleAPI();
    this.versionAPI  = apis.versionAPI ? apis.versionAPI : new VersionAPI();
}

Service.prototype = {

    start: function(port) {
        var app = express(),
            sampleAPI = this.sampleAPI,
            versionAPI = this.versionAPI;

        // /api-doc endpoint
        swaggerUiMiddleware.hostUI(app, {overrides: __dirname + '/../swagger-ui/'});

        app.get('/sample', function(request, response) {
            sampleAPI.get(request, response);
        });

        app.get('/admin/version', function(request, response) {
            versionAPI.get(request, response);
        });

        var server = http.createServer(app);
        server.listen(port, function() {
            console.log('Service started on port ' + port);
        });

        return server;
    }
};

module.exports = Service;

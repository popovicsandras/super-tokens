'use strict';

var http = require('http');
var SampleAPI = require('./api/SampleAPI');
var VersionAPI = require('./api/VersionAPI');

var AuthenticationMiddleware = require('./auth/Middleware');
var swaggerUiMiddleware = require('swagger-ui-middleware');

class Service {

    constructor(configuration, versionAPI, sampleAPI, authentication) {
        this.configuration = configuration;
        this.sampleAPI = sampleAPI || new SampleAPI();
        this.versionAPI  = versionAPI || new VersionAPI();
        this.authentication = authentication || new AuthenticationMiddleware(this.configuration);
    }

    start(app) {
        // how do we test this?
        var cookieParser = require('cookie-parser');
        app.use(cookieParser());

        // how do we test this?
        swaggerUiMiddleware.hostUI(app, {overrides: __dirname + '/../swagger-ui/'});

        this.versionAPI.install(app);
        this.authentication.install(app, this.configuration);
        this.sampleAPI.install(app);
        
        var port = this.configuration.port;
        var server = http.createServer(app);
        server.listen(port, function() {
            console.log('Service started on port ' + port);
        });

        return server;
    }
}

module.exports = Service;

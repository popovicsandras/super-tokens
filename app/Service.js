'use strict';

var http = require('http');
var TokensAPI = require('./api/TokensAPI');
var VersionAPI = require('./api/VersionAPI');
var Healthcheck = require('./api/Healthcheck');


var log = require('log4js-config').get('app');

var SessionMiddleware = require('./auth/SessionMiddleware');
var swaggerUiMiddleware = require('swagger-ui-middleware');

class Service {

    constructor(configuration, versionAPI, tokensAPI, authentication, healthcheckAPI) {
        this.configuration = configuration;
        this.tokensAPI = tokensAPI || new TokensAPI();
        this.versionAPI  = versionAPI || new VersionAPI();
        this.healthcheckAPI = healthcheckAPI || new Healthcheck(this.configuration);
        this.authentication = authentication || new SessionMiddleware(this.configuration);
    }

    start(app) {
        // how do we test this?
        var cookieParser = require('cookie-parser');
        app.use(cookieParser());

        // how do we test this?
        var bodyParser  = require('body-parser');
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(bodyParser.json());

        // how do we test this?
        swaggerUiMiddleware.hostUI(app, {overrides: __dirname + '/../swagger-ui/'});

        this.versionAPI.install(app);
        this.healthcheckAPI.install(app);

        this.authentication.install(app, this.configuration);
        this.tokensAPI.install(app);

        var port = this.configuration.port;
        var server = http.createServer(app);
        server.listen(port, function() {
            log.info('Service started on port', port);
        });

        return server;
    }
}

module.exports = Service;

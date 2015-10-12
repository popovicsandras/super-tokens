'use strict';

var http = require('http');
var TokensAPI = require('./api/TokensAPI');
var VersionAPI = require('./api/VersionAPI');

var SessionMiddleware = require('./auth/SessionMiddleware');
var swaggerUiMiddleware = require('swagger-ui-middleware');

class Service {

    constructor(configuration, versionAPI, sampleAPI, authentication) {
        this.configuration = configuration;
        this.tokensAPI = sampleAPI || new TokensAPI();
        this.versionAPI  = versionAPI || new VersionAPI();
        this.authentication = authentication || new SessionMiddleware(this.configuration);
    }

    start(app) {
        // how do we test this?
        var cookieParser = require('cookie-parser');
        var bodyParser  = require('body-parser');

        app.use(cookieParser());

        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(bodyParser.json());

        // how do we test this?
        swaggerUiMiddleware.hostUI(app, {overrides: __dirname + '/../swagger-ui/'});

        this.versionAPI.install(app);
        this.authentication.install(app, this.configuration);
        this.tokensAPI.install(app);

        var port = this.configuration.port;
        var server = http.createServer(app);
        server.listen(port, function() {
            console.log('Service started on port ' + port);
        });

        return server;
    }
}

module.exports = Service;

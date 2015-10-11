'use strict';

var appPackageJSON = require('../../package.json');

class VersionAPI {
    
    constructor(packageJSON) {
        this.configJSON = packageJSON || appPackageJSON;
    }

    install(app) {
        var api = this;
        app.get('/admin/version', function(request, response) {
            api.get(request, response);
        });
    }

    get(request, response) {
        var result = {};

        if(this.configJSON && this.configJSON.version) {
            response.status(200);
            result.version = this.configJSON.version;

        } else {
            response.status(500);
            result.error = 'We are unable to determine the version';
        }

        response.json(result);
    }
};

module.exports = VersionAPI;

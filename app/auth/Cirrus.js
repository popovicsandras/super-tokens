'use strict';

var url = require('url');
var log = require('log4js-config').get('auth.cirrus');

class Cirrus {

    constructor(config, http) {
        this.host = config.environment + '.workshare.com';
        this.name = config.environment + '_session_id';
        this.http = http || require('http');
        log.debug("Working with host", this.host, "and session cookie", this.name);
    }

    currentUser(sessionid, onSuccess, onFailure) {
        var options = {
            host: this.host,
            path: '/api/v1.4/current_user.json',
            headers: {
                'Cookie': this.name + '=' + sessionid
            }
        };

        log.debug("Going to call Cirrus with", options);
        this.http.request(options, this.onSessionCheck.bind(this, onSuccess, onFailure)).end();
    }

    onSessionCheck(onSuccess, onFailure, resp) {

        var userData = '';

        resp.on('data', function(chunk) {
            userData += chunk;
        });

        resp.on('end', function() {
            var success = false;
            try {
                var user = JSON.parse(userData);
                if (user.uuid) {
                    success = true;
                    onSuccess(user);
                }
            } catch (err) {
                log.warn("Unexpected error while calling Cirrus", err);
            } finally {
                if (success == false) {
                    onFailure(userData);
                }
            }
        });
    }
};

module.exports = Cirrus;
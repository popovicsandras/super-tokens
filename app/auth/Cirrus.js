'use strict';

var url = require('url');
var log = require('log4js-config').get('auth.cirrus');
var request = require('request');
var Q = require('q');

class Cirrus {

    constructor(config, http) {
        this.host = config.environment + '.workshare.com';
        this.name = config.environment + '_session_id';
        this.http = http || require('http');
        log.debug("Working with host", this.host, "and session cookie", this.name);
    }

    healthcheck() {
        var deferred = Q.defer();

        var requestOptions = {
            url: 'https://' + this.host + '/is_alive',
            strictSSL: false
        };

        request.get(requestOptions, function (error, response) {
            if (!error && response.statusCode === 200) {
                deferred.resolve({healthy: true, message: response.statusMessage });
            } else {
                deferred.reject({healthy: false, message: error.message });
            }
        });

        return deferred.promise;
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
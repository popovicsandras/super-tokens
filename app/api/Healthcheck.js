'use strict';
var mongo = require('mongodb');
var monk = require('monk');

var request = require('request');
var async = require('async');
var Cirrus = require('../auth/Cirrus');
var Tokens = require('../api/Tokens');

class Healthcheck {

    constructor(config, cirrus, tokens) {
        this.cirrus = cirrus || new Cirrus(config);
        this.tokens = tokens || new Tokens();
    }

    install(app) {
        app.get('/admin/healthcheck', this.get.bind(this));
    }

    runCirrusHealthcheck(callback) {
        this.cirrus
            .healthcheck()
            .then(function(healthMessage) {
                callback(null, healthMessage);
            })
            .catch(function(healthMessage) {
                healthMessage.system = 'cirrus';
                callback(healthMessage);
            });
    }

    runTokensHealthcheck(callback) {
        this.tokens
            .healthcheck()
            .then(function(healthMessage) {
                callback(null, healthMessage);
            })
            .catch(function(healthMessage) {
                healthMessage.system = 'tokens';

                callback(healthMessage);
            });
    }


    get(request, response) {
        var healthcheck = {};

        async.parallel([this.runCirrusHealthcheck.bind(this), this.runTokensHealthcheck.bind(this)], function(err, results) {
            if(err) {
                response.status(400);

                healthcheck[err.system] = {
                    healthy: err.healthy,
                    message: err.message
                }

            } else {
                response.status(200);

                healthcheck = {
                    cirrus: {
                        healthy: results[0].healthy,
                        message: results[0].message
                    },
                    tokens: {
                        healthy: results[1].healthy,
                        message: results[1].message
                    }
                }

            }

            response.send(healthcheck);
        });

    }

}

module.exports = Healthcheck;
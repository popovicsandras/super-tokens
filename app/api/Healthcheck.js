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
            .then(function(success) {
                callback(null, success);
            }, function(error) {
                callback(null, error);
            });
    }

    runTokensHealthcheck(callback) {
        this.tokens
            .healthcheck()
            .then(function(success) {
                callback(null, success);
            }, function(error) {
                callback(null, error);
            });
    }


    get(request, response) {
        var healthcheck;

        async.parallel([this.runCirrusHealthcheck.bind(this), this.runTokensHealthcheck.bind(this)], function(err, results) {
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

            response.status(200);
            response.send(healthcheck);
        });

    }

}

module.exports = Healthcheck;
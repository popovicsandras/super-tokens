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
            });
    }

    runTokensHealthcheck(callback) {
        this.tokens
            .healthcheck()
            .then(function(healthMessage) {
                callback(null, healthMessage);
            });
    }


    get(request, response) {
        var healthcheck = {};

        async.parallel([this.runCirrusHealthcheck.bind(this), this.runTokensHealthcheck.bind(this)], function(err, results) {

            var healthy = results.reduce(function(value, result) {
                return value && result.healthy
            }, true);

            if(healthy) {
                response.status(200);
            } else {
                response.status(500);
            }

            var output = results.reduce(function(value, result) {
                value[result.name] = { healthy: result.healthy, message: result.message};

                return value;

            }, {});

            response.send(output);
        });

    }

}

module.exports = Healthcheck;
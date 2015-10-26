'use strict';

var url = require('url');
var Cirrus = require('./Cirrus');

var log = require('log4js-config').get('auth.middleware');


class SessionMiddleware {

    constructor(config, cirrus) {
        this.cirrus = cirrus || new Cirrus(config);
        this.cookieName = config.environment + '_session_id';
    }

    install(app) {
        app.use(this.filter.bind(this));
        log.debug("Authorization middleware using cookie", this.cookieName)
    }

    filter(request, response, next) {
        var sessionID = this.getSessionID(request);
        if (sessionID == null) {
            response.sendStatus(400);
            log.debug("No session ID cookie found");
            return
        }

        this.cirrus.currentUser(
            sessionID,
            this.onSuccess.bind(this, request, next),
            this.onFailure.bind(this, response)
        );
    }

    onSuccess(request, next, user) {
        request.user = user;
        log.debug("Session found, user", user);
        next();
    }

    onFailure(response) {
        log.debug("Session NOT found");
        response.sendStatus(401);
    }

    getSessionID(request) {
        var where, value;
        if (request.cookies[this.cookieName] !== undefined) {
            where = "cookie";
            value = request.cookies[this.cookieName];
        } else {
            where = "querystring";
            value = url.parse(request.url, true).query.sessionid;
        }

        log.debug("Session found in", where, "with value",  value);
        return value;
    }
};

module.exports = SessionMiddleware;
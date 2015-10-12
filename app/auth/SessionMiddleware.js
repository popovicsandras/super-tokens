'use strict';

var url = require('url');
var Cirrus = require('./Cirrus');

class SessionMiddleware {

    constructor(config, cirrus) {
        this.cirrus = cirrus || new Cirrus(config);
        this.cookieName = config.environment + '_session_id';
    }

    install(app) {
        app.use(this.filter.bind(this));
    }
    
    filter(request, response, next) {
    	var sessionID = this.getSessionID(request);
        if (sessionID == null) {
			response.sendStatus(400);
			return
        }

        this.cirrus.currentUser(
        	sessionID, 
        	this.onSuccess.bind(this,request, next),
        	this.onFailure.bind(this,response)	
    	);
    }

    onSuccess(request, next, user) {
    	request.user = user;
    	next();
    }

    onFailure(response) {
		response.sendStatus(401);
    }

	getSessionID(request) {
		if (request.cookies[this.cookieName] !== undefined) {
			return request.cookies[this.cookieName];
		}

	    var url_parts = url.parse(request.url, true);
	    return url_parts.query.sessionid;
	}
};

module.exports = SessionMiddleware;

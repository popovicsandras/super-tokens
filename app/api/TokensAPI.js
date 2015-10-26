'use strict';

var Tokens = require('./Tokens');
var log = require('log4js-config').get('tokens.api');

class TokensAPI {

    constructor(tokens) {
        this.tokens = tokens || new Tokens();
    }

    install(app) {
        app.get('/api/tokens', this.getAll.bind(this));
        app.get('/api/tokens/:uuid', this.getById.bind(this));
        app.post('/api/tokens', this.create.bind(this));
        app.delete('/api/tokens', this.delete.bind(this));
    }

    getAll (request, response) {
        log.debug("getAll from user ", request.user.email);

        var resultPromise = this.tokens.findAllTokensOfUser(request.user.uuid);
        resultPromise.success(this.sendData.bind(this, response));
        resultPromise.error(this.sendError.bind(this, response));
    }

    getById(request, response) {
        log.debug("get from user ", request.user.email, "for token ", request.params.uuid);

        var resultPromise = this.tokens.findById(request.params.uuid);
        resultPromise.success(this.sendData.bind(this, response));
        resultPromise.error(this.sendError.bind(this, response));
    }

    create(request, response) {
        log.debug("create from user ", request.user.email, "for body ", request.body);

        var tokenData = request.body.TokenRequest;
        tokenData.useruuid = request.user.uuid;

        var resultPromise = this.tokens.create(tokenData);
        resultPromise.success(this.sendData.bind(this, response));
        resultPromise.error(this.sendError.bind(this, response));
    }

    delete(request, response) {
        log.debug("delete from user ", request.user.email, "for token  ", request.body);

        var resultPromise = this.tokens.delete(request.params.uuid);

        resultPromise.success(this.sendData.bind(this, response));
        resultPromise.error(this.sendError.bind(this, response));
    }

    sendData(response, data) {
        response.status(200);
        response.json(data);

        log.debug("response successful with data ", data);
    }

    sendError(response, data) {
        response.status(500);
        response.json(data.message);
        log.debug("response failed with error ", data.message);
    }
};

module.exports = TokensAPI;

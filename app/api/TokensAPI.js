'use strict';

var Tokens = require('./Tokens');

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
        var resultPromise = this.tokens.findAllTokensOfUser(request.user.uuid);

        resultPromise.success(this.sendData.bind(this, response));
        resultPromise.error(this.sendError.bind(this, response));
    }

    getById(request, response) {
        var resultPromise = this.tokens.findById(request.params.uuid);

        resultPromise.success(this.sendData.bind(this, response));
        resultPromise.error(this.sendError.bind(this, response));
    }

    create(request, response) {
        var resultPromise = this.tokens.create(request.body.TokenRequest);

        resultPromise.success(this.sendData.bind(this, response));
        resultPromise.error(this.sendError.bind(this, response));
    }

    delete(request, response) {
        var resultPromise = this.tokens.delete(request.params.uuid);

        resultPromise.success(this.sendData.bind(this, response));
        resultPromise.error(this.sendError.bind(this, response));
    }

    sendData(response, data) {
        response.status(200);
        response.json(data);
    }

    sendError(response, data) {
        response.status(500);
        response.json(data);
    }
};

module.exports = TokensAPI;

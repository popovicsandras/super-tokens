var TokensManager = require('./TokensManager');

function TokensAPI() {
    'use strict';
    this.tokensManager = new TokensManager();
}

TokensAPI.prototype = {

    getAll: function(request, response) {
        var resultPromise = this.tokensManager.findAllTokensOfUser(request.user.uuid);

        resultPromise.success(this.sendData.bind(this, response));
        resultPromise.error(this.sendError.bind(this, response));
    },

    getById: function(request, response) {
        var resultPromise = this.tokensManager.findById(request.params.uuid);

        resultPromise.success(this.sendData.bind(this, response));
        resultPromise.error(this.sendError.bind(this, response));
    },

    create: function (request, response) {
        var resultPromise = this.tokensManager.create(request.body.TokenRequest);

        resultPromise.success(this.sendData.bind(this, response));
        resultPromise.error(this.sendError.bind(this, response));
    },

    delete: function (request, response) {
        var resultPromise = this.tokensManager.delete(request.params.uuid);

        resultPromise.success(this.sendData.bind(this, response));
        resultPromise.error(this.sendError.bind(this, response));
    },

    sendData: function(response, data) {
        response.status(200);
        response.json(data);
    },

    sendError: function(response, data) {
        response.status(500);
        response.json(data);
    }
};

module.exports = TokensAPI;

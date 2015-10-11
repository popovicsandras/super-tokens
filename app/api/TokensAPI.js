var TokensManager = require('./TokensManager');

function TokensAPI(user) {
    'use strict';
    this.tokensManager = new TokensManager();
    if(user) {
        this.user = user;
    } else {
       throw {
           name: "Error",
           message: "User is not valid"
       };
    }
}

TokensAPI.prototype = {

    getAll: function(request, response) {
        var resultPromise = this.tokensManager.findAllTokensOfUser(this.user.uuid);

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

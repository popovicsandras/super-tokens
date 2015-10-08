'use strict';

var SampleAPI = function() {};

SampleAPI.prototype = {

    get: function(request, response) {
        response.status(200).json({message: 'Hello world'});
    }
};

module.exports = SampleAPI;

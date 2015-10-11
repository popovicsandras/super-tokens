'use strict';

class SampleAPI {

	install(app) {
		var api = this;
        app.get('/sample', function(request, response) {
            api.get(request, response);
        });
	}

    get(request, response) {
        response.status(200).json({message: 'Hello world'});
    }
};

module.exports = SampleAPI;

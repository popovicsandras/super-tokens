'use strict';

class Tokens {

    constructor(db) {
        this.db = db;
    }

    findActiveTokens(userUuid) {
        var self = this;
        this.db.open()
            .then(function() {
                self.db.find(userUuid)
                    .then(function() {
                        self.db.close();
                    });
            });
    }
}

module.exports = Tokens;

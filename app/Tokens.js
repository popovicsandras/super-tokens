'use strict';

class Tokens {

    constructor(database) {
        this.mongo = database;
    }

    findActive(userUuid) {
        try {
            return this.mongo
                .collection('tokens')
                .find({
                    useruuid: userUuid,
                    expirydate: {
                        $gt: Date.now()
                    }
                })
                .toArray();
        }
        catch (error) {
            return Promise.reject(new Error());
        }
    }
}

module.exports = Tokens;

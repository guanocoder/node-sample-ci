const keys = require('../config/keys');
const mongoose = require('mongoose');
const client = require('redis').createClient(`redis://${keys.redisHost}`);
const util = require('util');
client.hget = util.promisify(client.hget);

const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function(options = {}) {
    this.useCache = true;
    this.hashKey = JSON.stringify(options.key || '');
    return this;
}

mongoose.Query.prototype.exec = async function() {
    console.log("I'm about to run a query");

    if(this.useCache) {
        const keyObject = Object.assign({}, this.getQuery(), { collection: this.mongooseCollection.name });
        const key = JSON.stringify(keyObject);
    
        const cacheValue = await client.hget(this.hashKey, key);
    
        if (cacheValue) {
            console.log("From CACHE:", cacheValue);
            const doc = JSON.parse(cacheValue);
    
            return Array.isArray(doc)
                ? doc.map(doc => new this.model(doc))
                : new this.model(doc);
        }
    
        const result = await exec.apply(this, arguments);
        // expiration in redis set to 10 seconds
        client.hset(this.hashKey, key, JSON.stringify(result), 'EX', 10);
        return result;
    } else {
        return exec.apply(this, arguments);
    }
}

module.exports = {
    clearCache(key) {
        client.del(JSON.stringify(key));
    }
}
const mongoose = require('mongoose');
const client = require('redis').createClient('redis://127.0.0.1:6379');
const util = require('util');
client.get = util.promisify(client.get);

const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function() {
    this.useCache = true;
    return this;
}

mongoose.Query.prototype.exec = async function() {
    console.log("I'm about to run a query");

    if(this.useCache) {
        const keyObject = Object.assign({}, this.getQuery(), { collection: this.mongooseCollection.name });
        const key = JSON.stringify(keyObject);
    
        const cacheValue = await client.get(key);
    
        if (cacheValue) {
            console.log("From CACHE:", cacheValue);
            const doc = JSON.parse(cacheValue);
    
            return Array.isArray(doc)
                ? doc.map(doc => new this.model(doc))
                : new this.model(doc);
        }
    
        const result = await exec.apply(this, arguments);
        // expiration in redis set to 10 seconds
        client.set(key, JSON.stringify(result), 'EX', 10);
        return result;
    } else {
        return exec.apply(this, arguments);
    }
}
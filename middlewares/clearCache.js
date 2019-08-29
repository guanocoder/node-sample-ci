const { clearCache } = require('../services/cache');

module.exports = async (request, response, next) => {
    await next();
    clearCache(request.user.id);
}
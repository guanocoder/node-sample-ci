const Keygrip = require('keygrip');
const Buffer = require('safe-buffer').Buffer;
const keys = require('../../config/keys.js');

module.exports = (user) => {
    const sessionObject = {
        passport: {
            user: user._id
        }
    };
    const sessionBase64String = Buffer.from(JSON.stringify(sessionObject)).toString('base64');
    const keygrip = new Keygrip([keys.cookieKey]);
    const signature = keygrip.sign('session=' + sessionBase64String);
    return { session: sessionBase64String, sig: signature }
}
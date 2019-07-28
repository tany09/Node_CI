const Buffer = require('safe-buffer').Buffer;
const Keygrip = require('keygrip');
const keys = require('../../config/keys');
const keygrip = new Keygrip([keys.cookieKey]);

module.exports = (user) => {
    const sessionKey = {
        passport: {
            user: user._id.toString()
        }
    }
    const sessionString = Buffer.from(JSON.stringify(sessionKey)).toString('base64');
    const sessionSig = keygrip.sign('session=' + sessionString);
    
    return {sessionString, sessionSig};
}
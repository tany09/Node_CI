const mongoose = require('mongoose');
require('../../models/User');
const Buffer = require('safe-buffer').Buffer;
const Cookie = require('cookies').Cookie;
const Keygrip = require('keygrip');
const keys = require('../../config/keys');
const User = mongoose.model('users');

mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI, { useMongoClient: true });

const createSession = async () => {
  const user = await new User({ googleId: '1' }).save();

  const session = JSON.stringify({
    passport: {
      user: user._id.toString()
    }
  });

  return Buffer.from(session).toString('base64');
};

module.exports = {
  async login(page) {
    const session = await createSession();
    const sig = new Keygrip([keys.cookieKey]).sign(`session=${session}`);

    const html = await page
      .goto(require('../url'))
      .clearCookies()
      .setCookies('session', session)
      .setCookies('session.sig', sig)
      .goto(require('../url'));

    console.log(html);

    await page.wait('a[href="/api/logout"]');
  }
};
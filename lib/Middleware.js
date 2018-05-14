const {Strategy} = require('passport-strategy');

module.exports = class Middleware extends Strategy {
  constructor(name) {
    super();
    this.name = name || 'http-signature-strategy';
    this._helpers = {};
  }

  async authenticate(req) {
    const self = this;

    console.log('REQUEST HEADERS', req.headers);

    // parse the req

    const parsedKeyId = 'https://example.com/key/1';

    let keyData;
    try {
      const getKey = self.use('getKey');
      keyData = await getKey(parsedKeyId);
    } catch(err) {
      // if unknown helper do fallback or throw
      // console.log('ERROR', err);
    }
    // if(!keyData.good) {
    //   self.fail();
    // }
    const user = {
      id: 'someId',
      name: 'someName',
    };
    if(keyData) {
      user.keyData = keyData;
    }
    self.success(user);
  }

  /**
   * Allows helpers to be set or retrieved.
   *
   * @param name the name of the helper to use
   * @param [helper] the api to set for the helper, only present for
   *          setter, omit for getter.
   *
   * @return the API for `name` if not using this method as a setter, otherwise
   *           undefined.
   */
  use(name, helper) {
    // setter mode
    if(helper) {
      this._helpers[name] = helper;
      return;
    }
    // getter mode:
    const h = this._helpers[name];
    if(h === undefined) {
      throw new Error(`Unknown helper '${name}'.`);
    }
    return h;
  }
};

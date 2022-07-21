const Configstore = require('conf');
const pkg = require('../package.json');

class KeyManager {
  constructor() {
    this.conf = new Configstore(pkg.name);
  }

  setKey(key) {
    this.conf.set('apiKey', key);
    return key;
  }
  getKey() {
    const key = this.conf.get('apiKey');
    if (!key) {
      throw new Error('No API key found !!');
    } else return key;
  }
  removeKey() {
    const key = this.conf.get('apiKey');
    if (!key) {
      throw new Error('No API key found !!');
    }
    this.conf.delete('apiKey');
    return;
  }
}

module.exports = KeyManager;

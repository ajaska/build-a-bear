var sass = require('node-sass');

module.exports = {
  'rootURL()': function rootURL() {
    var url = process.env.ROOT_URL || '//bear.plus';

    return new sass.types.String(url);
  }
};

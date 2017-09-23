var path = require('path');

module.exports = {
  entry  : './client/src/App.js',
  devtool: 'source-map',
  output : {
    filename: 'app.js',
    path: path.resolve(__dirname, 'client/dist')
  }
};
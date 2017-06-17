var path = require('path');

module.exports = {
  entry: './src/manager/Manager.js',
  devtool: 'source-map',
  output: {
    filename: 'manager.js',
    path: path.resolve(__dirname, 'dist')
  }
};
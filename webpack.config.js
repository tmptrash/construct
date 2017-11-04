const path    = require('path');
const Cleaner = require('clean-webpack-plugin');

module.exports = {
    entry  : './client/src/App.js',
    devtool: 'source-map',
    resolve: {
        alias: {
            CLIENT: path.resolve(__dirname, './client/')
        }
    },
    output : {
        filename: 'app.js',
        path    : path.resolve(__dirname, './client/dist')
    },
    plugins: [
        new Cleaner(['./client/dist/*.js', './client/dist/*.map'])
    ]
};
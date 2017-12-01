const path    = require('path');
const Cleaner = require('clean-webpack-plugin');

module.exports = {
    entry  : './client/src/App.js',
    devtool: 'source-map',
    output : {
        filename: 'app.js',
        path    : path.resolve(__dirname, './client/dist')
    },
    module : {
        loaders: [
            {test: /\.html$/, loader: 'ignore-loader'}
        ]
    },
    plugins: [
        new Cleaner(['./client/dist/*.js', './client/dist/*.map'])
    ]
};
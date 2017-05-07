const path = require('path');
const webpack = require('webpack');
const nyanProgressPlugin = require('nyan-progress-webpack-plugin');

const devPath = __dirname + '/es6/src';

module.exports = {
    entry: {
        option: `${devPath}/option/main.js`,
        background: `${devPath}/background/main.js`,
        core: `${devPath}/core/main.js`,
        popup: `${devPath}/popup/main.js`
    },
    
    output: {
        path: `${__dirname}/chrome/js/`,
        filename: '[name].js'
    },
    
    plugins: [
        new nyanProgressPlugin()
    ],
    
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: '/node_modules/',
                options: {
                    compact: false,
                    presets: ['es2015', 'stage-2']
                }
            }
        ]
    }
}

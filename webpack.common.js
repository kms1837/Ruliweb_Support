const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const nyanProgressPlugin = require('nyan-progress-webpack-plugin');

const devPath = __dirname + '/es6/src';

const commonConfig = {
    entry: {
        option: `${devPath}/option/main.js`,
        background: `${devPath}/background/main.js`,
        core: `${devPath}/core/main.js`,
        popup: `${devPath}/popup/main.js`
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

module.exports = commonConfig;
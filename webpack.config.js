const path = require("path");
const webpack = require("webpack");
const nyanProgressPlugin = require('nyan-progress-webpack-plugin');

const devPath = __dirname + '/es6/src';

module.exports = {
    resolve : {
        extensions : ['', '.js']
    },
    
    entry: {
        option: `${devPath}/option/main.js`,
        background: `${devPath}/background/main.js`,
        core: `${devPath}/core/main.js`,
        popup: `${devPath}/popup/main.js`
    },
    
    output : {
        path: `${__dirname}/chrome/js/`,
        filename: '[name].js'
    },
    
    plugins: [
        new nyanProgressPlugin()
    ],
    
    module : {
        loaders : [
            {
                test: /\.js$/,
                loader: 'babel',
                exclude: './node_modules/',
                query: {
                    compact: false,
                    presets: ["es2015"]
                }
            }
        ]
    }
}

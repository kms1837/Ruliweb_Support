const commonConfig = require('./webpack.common.js');

const chrome = {
    ...commonConfig,

    output: {
        path: `${__dirname}/chrome/js/`,
        filename: '[name].js'
    }
};

const firefox = {
    ...commonConfig,

    output: {
        path: `${__dirname}/firefox/js/`,
        filename: '[name].js'
    }
};

module.exports = [chrome, firefox];
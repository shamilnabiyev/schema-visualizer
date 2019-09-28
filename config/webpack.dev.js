const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'development',
    entry: ['webpack/hot/dev-server', './src/index.js'],
    devServer: {
        contentBase: './src',
        watchContentBase: true,
        compress: true,
        port: 9000
    }
});
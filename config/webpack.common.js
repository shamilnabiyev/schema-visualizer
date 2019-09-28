const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    resolve: {
        modules: ['node_modules', 'src'],
        alias: {
            jointjs_css: path.join(__dirname, '../node_modules/jointjs/dist/joint.css'),
            jointjs_min_css: path.join(__dirname, '../node_modules/jointjs/dist/joint.min.css'),
            normalize_css: path.join(__dirname, '../node_modules/normalize.css')
        }
    },
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: '[id].[hash].bundle.js',
        chunkFilename: '[id].[hash].chunk.js'
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            favicon: path.join(__dirname, '../src/', 'favicon.ico'),
            template: path.join(__dirname, '../src/', 'index.html'),
            inject: true,
            minify: {
                removeComments: true,
                collapseWhitespace: false
            }
        }),
        new MiniCssExtractPlugin({
            filename: '[id].[hash].styles.css',
            chunkFilename: '[id].[hash].styles.css'
        })
    ],
    module: {
        rules: [
            {
                test: /\.html$/,
                loader: "html-loader"
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader']
            },
            {
                test: /\.ico$/,
                loader: 'file-loader?name=[name].[ext]'
            },
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                  loader: 'babel-loader',
                  options: {
                    presets: ['@babel/preset-env']
                  }
                }
              }
        ]
    }
}
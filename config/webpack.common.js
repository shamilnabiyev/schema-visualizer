const Path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    app: Path.resolve(__dirname, '../src/js/index.js')
  },
  output: {
    path: Path.join(__dirname, '../build'),
    filename: 'js/[name].js'
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      name: false
    }
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin([
      { from: Path.resolve(__dirname, '../public'), to: 'public' }
    ]),
    new HtmlWebpackPlugin({
      template: Path.resolve(__dirname, '../src/', 'index.html'),
      favicon: Path.join(__dirname, '../src/', 'favicon.ico'),
    }),
  ],
  resolve: {
    modules: ['node_modules', 'src'],
    alias: {
      '~': Path.resolve(__dirname, '../src'),
      jointjs_min_css: Path.join(__dirname, '../node_modules/jointjs/dist/joint.min.css'),
      normalize_css: Path.join(__dirname, '../node_modules/normalize.css'),
      fontawesome_min_css: Path.join(__dirname, '../node_modules/@fortawesome/fontawesome-free/css/fontawesome.min.css'),
      fontawesome_solid_min_css: Path.join(__dirname, '../node_modules/@fortawesome/fontawesome-free/css/solid.min.css')
    }
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        loader: "html-loader"
      },
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto'
      },
      {
        test: /\.(ico|jpg|jpeg|png|gif|webp)(\?.*)?$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[path][name].[ext]'
          }
        }
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg|otf)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/'
            }
          }
        ]
      }
    ]
  }
};

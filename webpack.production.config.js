var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'dist');
var APP_DIR = path.resolve(__dirname, 'src/client/app');

var config = {
  entry: './src/client/app/index.jsx',
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js'
  },
  module : {
    rules: [
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader?url=false' ]
      },
      {
        test : /\.jsx?/,
        include : APP_DIR, //'./src/client/app/',//APP_DIR,
        loader : 'babel-loader'
      }
    ]
    ,
  },
  devtool: "#cheap-module-source-map",
  plugins: [
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify('production')
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
            },
            output: {
                comments: false,
            },
        }),
    ]
};

module.exports = config;


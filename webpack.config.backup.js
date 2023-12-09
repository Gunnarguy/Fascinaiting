const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html'
    }),
    new HtmlWebpackPlugin({
      template: './index.html'
    })
  ],
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
            plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html'
    }),'transform-class-properties']
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  devServer: {
    static: { directory: path.join(__dirname, 'dist') },
    compress: true,
    port: 9000
  }
};

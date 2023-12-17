echo "## active_line 2 ##"
const HtmlWebpackPlugin = require('html-webpack-plugin');
echo "## active_line 3 ##"
const path = require('path');
echo "## active_line 4 ##"
module.exports = {
echo "## active_line 5 ##"
  entry: './src/index.js',
echo "## active_line 6 ##"
  output: {
echo "## active_line 7 ##"
    path: path.resolve(__dirname, 'dist'),
echo "## active_line 8 ##"
    filename: 'bundle.js'
echo "## active_line 9 ##"
  },
echo "## active_line 10 ##"
  module: {
echo "## active_line 11 ##"
    rules: [
echo "## active_line 12 ##"
      {
echo "## active_line 13 ##"
        test: /\.js$/,
echo "## active_line 14 ##"
        exclude: /node_modules/,
echo "## active_line 15 ##"
        use: {
echo "## active_line 16 ##"
          loader: 'babel-loader',
echo "## active_line 17 ##"
          options: {
echo "## active_line 18 ##"
            presets: ['@babel/preset-env', '@babel/preset-react'],
echo "## active_line 19 ##"
            plugins: ['@babel/plugin-transform-class-properties']
echo "## active_line 20 ##"
          }
echo "## active_line 21 ##"
        }
echo "## active_line 22 ##"
      },
echo "## active_line 23 ##"
      {
echo "## active_line 24 ##"
        test: /\.css$/,
echo "## active_line 25 ##"
        use: ['style-loader', 'css-loader']
echo "## active_line 26 ##"
      }
echo "## active_line 27 ##"
    ]
echo "## active_line 28 ##"
  },
echo "## active_line 29 ##"
  plugins: [
echo "## active_line 30 ##"
    new HtmlWebpackPlugin({
echo "## active_line 31 ##"
      template: "./src/index.html",
echo "## active_line 32 ##"
      filename: "index.html"
echo "## active_line 33 ##"
    })
echo "## active_line 34 ##"
  ],
echo "## active_line 35 ##"
  devServer: {
echo "## active_line 36 ##"
    static: { directory: path.join(__dirname, 'dist') },
echo "## active_line 37 ##"
    compress: true,
echo "## active_line 38 ##"
    port: 9000
echo "## active_line 39 ##"
  }
echo "## active_line 40 ##"
};
echo "## active_line 41 ##"

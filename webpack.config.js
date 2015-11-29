var path = require('path');

module.exports = {
  devtool: 'inline-source-map',
  entry: './src/update-in',

  output: {
    path: path.resolve('./dist'),
    filename: 'update-in.js',
    publicPath: '/static/'
  },

  resolve: {
    extensions: ['', '.js'],
    root: [
      path.resolve('./src')
    ],
    modulesDirectories: ['node_modules']
  },

  module: {
    loaders: [
      {test: /\.js$/, loaders: ['babel'], include: path.resolve('./src')}
    ]
  }
};

const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = (_, argv) => ({
  name: 'server',
  mode: argv.mode ?? 'production',
  target: 'node',
  entry: path.resolve(__dirname, 'src/entry-server.tsx'),
  output: {
    path: path.resolve(__dirname, 'dist/server'),
    filename: 'server.js',
  },
  externals: [nodeExternals()],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  module: {
    rules: [
      {
        test: /\.(jsx?|tsx?)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: { targets: { node: '20' } },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
});

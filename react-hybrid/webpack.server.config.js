const path = require('path');
const nodeExternals = require('webpack-node-externals');
const webpack = require('webpack');
const dotenv = require('dotenv');

// .env 파일 로드
const env = dotenv.config().parsed;

// 환경 변수를 webpack DefinePlugin에 전달할 형태로 변환
const envKeys = Object.keys(env || {}).reduce((prev, next) => {
  prev[`process.env.${next}`] = JSON.stringify(env[next]);
  return prev;
}, {});

module.exports = {
  mode: 'development',
  target: 'node',
  entry: path.resolve(__dirname, 'src/server/main.ts'),
  output: {
    filename: 'server.js',
    path: path.resolve(__dirname, 'dist/server'),
  },
  externals: [nodeExternals()],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  plugins: [new webpack.DefinePlugin(envKeys)],
  module: {
    rules: [
      {
        test: /\.(jsx?|tsx?)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              ['@babel/preset-react', { runtime: 'automatic' }],
              [
                '@babel/preset-typescript',
                { isTSX: true, allExtensions: true },
              ],
            ],
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
};

const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
  mode: 'development',
  entry: './src/client/main.tsx', // 진입점 표시
  output: {
    path: path.resolve('dist/static'), // 빌드 산출물이 저장될 폴더
    filename: 'bundle.js', // 빌드 산출물 이름
    clean: true, // 실행 전에 dist 지울건지?
    publicPath: '/static/', //
  },
  module: {
    rules: [
      {
        test: /\.(jsx?|tsx?)$/, // jsx/tsx 확장자에 대해서 아래 적용
        exclude: /node_modules/, // node modules 안에 있는 jsx/tsx는 제외
        use: {
          loader: 'babel-loader', // babel loader 사용
          options: {
            presets: [
              '@babel/preset-env',
              ['@babel/preset-react', { 'runtime': 'automatic' }],
              ['@babel/preset-typescript', { 'isTSX': true, 'allExtensions': true }],
            ],
          },
        },
      },
      {
        test: /\.css$/, // css 확장자에 대해서
        use: ['style-loader', 'css-loader'], // css-loader와 style-loader 사용
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i, // 이미지를
        type: 'asset/resource', // 이 타입의
        generator: {
          filename: 'images/[name][ext]', // 이 형태로 만든다
        },
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'public/images', to: 'images' },
        { from: 'public/styles', to: 'styles' },
      ],
    }),
    new Dotenv(),
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
};

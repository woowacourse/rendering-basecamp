const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const Dotenv = require('dotenv-webpack');

const webpack = require('webpack');
const {
  sources: { RawSource },
} = webpack;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = (_, argv) => {
  const mode = argv.mode ?? 'production';

  return {
    name: 'assets',
    mode,
    entry: './src/entry-client.tsx',
    output: {
      path: path.resolve('dist/static'),
      filename: 'bundle.js',
      clean: { keep: 'index.html' },
      publicPath: '/static/',
    },
    module: {
      rules: [
        {
          test: /\.(jsx?|tsx?)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: { targets: 'defaults' },
          },
        },
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader'],
        },
        {
          test: /\.(png|jpe?g|gif|svg)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'images/[name][ext]',
          },
        },
      ],
    },
    plugins: [
      new CopyPlugin({
        patterns: [{ from: 'public', to: '.' }],
      }),
      new Dotenv({ systemvars: true }),
      new MiniCssExtractPlugin(),
      {
        apply(compiler) {
          compiler.hooks.thisCompilation.tap('AssetsManifest', (compilation) => {
            compilation.hooks.processAssets.tap(
              {
                name: 'AssetsManifest',
                stage: webpack.Compilation.PROCESS_ASSETS_STAGE_SUMMARIZE,
              },
              () => {
                const files = compilation.entrypoints.get('main').getFiles();
                const publicPath = compilation.outputOptions.publicPath;

                require('dotenv').config({ quiet: true });

                const address =
                  process.env.SITE_URL ||
                  (process.env.VERCEL_PROJECT_PRODUCTION_URL
                    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
                    : undefined) ||
                  (mode === 'development' ? `http://localhost:${process.env.PORT ?? 3000}` : undefined);

                if (!address)
                  throw new Error('사이트 주소가 필요합니다. SITE_URL 또는 VERCEL_PROJECT_PRODUCTION_URL을 설정해주세요.');
                if (!URL.canParse(address))
                  throw new Error('사이트 주소는 유효한 HTTP 또는 HTTPS 절대 주소여야 합니다.');

                const url = new URL(address);

                if (!['http:', 'https:'].includes(url.protocol) || url.pathname !== '/' || url.search || url.hash) {
                  throw new Error('사이트 주소는 경로·쿼리·해시가 없는 HTTP 또는 HTTPS 오리진이어야 합니다.');
                }

                const manifest = {
                  origin: url.origin,
                  assets: {
                    scripts: files.filter((file) => file.endsWith('.js')).map((file) => publicPath + file),
                    styles: files.filter((file) => file.endsWith('.css')).map((file) => publicPath + file),
                  },
                };
                compilation.emitAsset('manifest.json', new RawSource(JSON.stringify(manifest)));
              },
            );
          });
        },
      },
    ],
    optimization: { minimizer: ['...', new CssMinimizerPlugin()] },
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
  };
};

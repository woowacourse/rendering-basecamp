const path = require('path');
const { readFileSync } = require('fs');
const { createRequire } = require('module');
const { runInNewContext } = require('vm');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { Compilation } = require('webpack');
const nodeExternals = require('webpack-node-externals');

module.exports = (_, argv) => {
  const mode = argv.mode ?? 'production';

  const manifestPath = path.resolve(__dirname, 'dist/static/manifest.json');

  return {
    name: 'template',
    dependencies: ['assets'],
    mode,
    target: 'node',
    entry: path.resolve(__dirname, 'src/framework/renderDocument.tsx'),
    output: {
      path: path.resolve(__dirname, 'dist/static'),
      filename: 'template.cjs',
      library: { type: 'commonjs2' },
    },
    externals: [nodeExternals()],
    resolve: { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
    module: {
      rules: [
        {
          test: /\.[jt]sx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: { targets: { node: '20' } },
          },
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: 'index.html',
        inject: false,
        minify: mode === 'production',
        cache: false,
        templateContent({ compilation }) {
          compilation.fileDependencies.add(manifestPath);
          const appData = JSON.parse(readFileSync(manifestPath, 'utf8'));
          const code = compilation.getAsset('template.cjs').source.source();
          const module = { exports: {} };
          runInNewContext(code, {
            module,
            exports: module.exports,
            require: createRequire(__filename),
            URL,
          });
          const { renderDocument } = module.exports;
          return renderDocument(appData);
        },
      }),
      {
        apply(compiler) {
          compiler.hooks.thisCompilation.tap('HtmlOnly', (compilation) => {
            compilation.hooks.processAssets.tap(
              {
                name: 'HtmlOnly',
                stage: Compilation.PROCESS_ASSETS_STAGE_REPORT,
              },
              () => {
                for (const file of compilation.entrypoints.get('main').getFiles()) {
                  compilation.deleteAsset(file);
                }
              },
            );
          });
        },
      },
    ],
  };
};

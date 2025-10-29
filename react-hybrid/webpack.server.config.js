const path = require("path");
const nodeExternals = require("webpack-node-externals");
const webpack = require("webpack");
require("dotenv").config();
module.exports = {
  mode: "development",
  target: "node",
  entry: path.resolve(__dirname, "src/server/main.ts"),
  output: {
    filename: "server.js",
    path: path.resolve(__dirname, "dist/server"),
  },
  externals: [nodeExternals()],
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },
  module: {
    rules: [
      {
        test: /\.(jsx?|tsx?)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env",
              ["@babel/preset-react", { runtime: "automatic" }],
              [
                "@babel/preset-typescript",
                { isTSX: true, allExtensions: true },
              ],
            ],
          },
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.TMDB_ACCESS_TOKEN": JSON.stringify(
        process.env.TMDB_ACCESS_TOKEN
      ),
    }),
  ],
};

const path = require("node:path");
const CopyPlugin = require("copy-webpack-plugin");
const Dotenv = require("dotenv-webpack");
const webpack = require("webpack");

module.exports = {
  mode: "development",
  entry: "./src/client/main.tsx",
  output: {
    path: path.resolve("dist/static"),
    filename: "bundle.js",
    clean: true,
    publicPath: "/static/",
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
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: "asset/resource",
        generator: {
          filename: "images/[name][ext]",
        },
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "public/images", to: "images" },
        { from: "public/styles", to: "styles" },
      ],
    }),
    new Dotenv(),
    new webpack.DefinePlugin({
      "process.env.TMDB_ACCESS_TOKEN": JSON.stringify(
        process.env.TMDB_ACCESS_TOKEN,
      ),
      "process.env.VITE_TMDB_ACCESS_TOKEN": JSON.stringify(
        process.env.VITE_TMDB_ACCESS_TOKEN,
      ),
    }),
  ],
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },
};

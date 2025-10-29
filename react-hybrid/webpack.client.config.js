const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

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
  ],
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },
};

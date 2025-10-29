const path = require("path");
const nodeExternals = require("webpack-node-externals");
const Dotenv = require("dotenv-webpack");

module.exports = {
  mode: "development",
  target: "node",
  entry: path.resolve(__dirname, "src/server/main.ts"),
  output: {
    filename: "server.js",
    path: path.resolve(__dirname, "dist/server"),
  },
  externals: [
    nodeExternals(),
    {
      // React Router와 관련된 모든 패키지를 제외
      "react-router": "commonjs react-router",
      "react-router-dom": "commonjs react-router-dom",
    },
  ],
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
              ["@babel/preset-react", { "runtime": "automatic" }],
              ["@babel/preset-typescript", { "isTSX": true, "allExtensions": true }]
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
    new Dotenv({ systemvars: true }),
  ],
};

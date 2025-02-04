const path = require("path");

module.exports = {
  mode: "production",
  entry: "./popup.jsx",
  output: {
    path: path.resolve(__dirname),
    filename: "popup.js",
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-react"],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
};

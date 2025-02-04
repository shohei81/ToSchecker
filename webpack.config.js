const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // 🔥 追加

module.exports = {
  mode: "production",
  entry: "./popup.jsx",
  output: {
    filename: "popup.js",
    path: path.resolve(__dirname, "./dist"),
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
      {
        test: /\.css$/, // 🔥 CSSを外部ファイルに出力する設定
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({ filename: "popup.css" }), // 🔥 `dist/popup.css` に出力
  ],
  resolve: {
    extensions: [".js", ".jsx"],
  },
};

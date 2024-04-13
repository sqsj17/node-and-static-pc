// Important modules this config uses
const path = require("path");
const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");
// const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
//   .BundleAnalyzerPlugin;

module.exports = {
  mode: "production",

  // In production, we skip all hot-reloading stuff
  entry: [path.join(__dirname, "./browser.js")],

  // Utilize long-term caching by adding content hashes (not compilation hashes) to compiled assets
  output: {
    publicPath:
      "https://res.qixin18.com/qixin-cloud-node-cps-pc/js/huize-service/",
    libraryTarget: "umd",
    path: __dirname + "../../../../static/js/huize-service/", // 输出到老项目的目标目录
    library: "HuizeService",
    filename: "huize-service.js",
    chunkFilename: "[name].chunk.js"
  },
  optimization: {
    minimize: false
  },
  performance: {
    assetFilter: assetFilename =>
      !/(\.map$)|(^(main\.|favicon\.))/.test(assetFilename)
  },
  module: {
    rules: [
      {
        test: /\.(js)?$/, // Transform all .js files required somewhere with Babel
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            sourceType: "unambiguous",
            presets: [
              [
                "@babel/preset-env",
                {
                  useBuiltIns: "usage",
                  modules: false,
                  debug: true,
                  corejs: 3,
                  targets:
                    "> 0.25%, last 4 versions, ie 9-11, Android >=4.4, iOS >= 8.4, Firefox > 20"
                }
              ]
            ],
            plugins: ["@babel/plugin-transform-runtime"]
          }
        }
      }
    ]
  },
  resolve: {
    extensions: [".js"]
  },
  target: "web", // Make web variables accessible to webpack, e.g. window
  node: {
    fs: "empty"
  },
  plugins: [
    new webpack.IgnorePlugin(/^(log4js)$/)
    // , new BundleAnalyzerPlugin()
  ]
};

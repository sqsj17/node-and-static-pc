// Important modules this config uses
const path = require("path");
// const HtmlWebpackPlugin = require("html-webpack-plugin");
// const { HashedModuleIdsPlugin } = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");
// const CompressionPlugin = require("compression-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;

module.exports = env => {
  const plugins = [];
  if (env && env.analyzer) {
    plugins.push(new BundleAnalyzerPlugin());
  }
  return require("./webpack.base.babel")({
    mode: "production",

    // TODO 确认要不要兼容IE9和stable
    // In production, we skip all hot-reloading stuff
    entry: [
      require.resolve("react-app-polyfill/ie9"),
      require.resolve("react-app-polyfill/ie11"),
      require.resolve("react-app-polyfill/stable"),
      require.resolve("custom-event-polyfill"),
      path.join(process.cwd(), "src/PluginHub.js")
    ],

    // Utilize long-term caching by adding content hashes (not compilation hashes) to compiled assets
    output: {
      publicPath:
        "https://res.qx.com/js/hz-plugins/",
      libraryTarget: "umd",
      // path: __dirname + "/../static/src/hz-plugins/", // 输出到老项目的目标目录
      path: __dirname + "/../static/js/hz-plugins/", // 输出到老项目的目标目录
      // path: __dirname + "/../../../../tmp/my-react-app/src/hz-plugins/", // 输出到老项目的目标目录
      library: "hzPlugin",
      filename: "hz-plugin.js",
      chunkFilename: "[name].chunk.js"
      // filename: "[name].[chunkhash].js",
      // chunkFilename: "[name].[chunkhash].chunk.js"
    },

    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            warnings: false,
            compress: {
              comparisons: false
            },
            parse: {},
            mangle: true,
            output: {
              comments: false,
              ascii_only: true
            }
          },
          parallel: true,
          cache: true,
          sourceMap: true
        })
      ],
      nodeEnv: "production",
      sideEffects: true,
      concatenateModules: true
      // TODO runtimeChunk和splitChunks不能使用
      // runtimeChunk: "single"
      // splitChunks: {
      //   chunks: "all",
      //   maxInitialRequests: 10,
      //   minSize: 0,
      //   cacheGroups: {
      //     // core: {
      //     //   name: "main",
      //     //   test: m => {
      //     //     return (
      //     //       /[\\/]node_modules[\\/](webpack|core-js|regenerator-runtime|whatwg-fetch|scheduler|promise|style-loader|css-loader|object-assign|asap|custom-event-polyfill)/.test(
      //     //         m.context
      //     //       ) ||
      //     //       /[\\/]node_modules[\\/](react|react-dom|prop-types)/.test(
      //     //         m.context
      //     //       ) ||
      //     //       /[\\/]src[\\/](libs)/.test(m.context)
      //     //     );
      //     //   },
      //     //   enforce: true,
      //     //   chunks: "all",
      //     //   priority: 20
      //     // },
      //     vendor: {
      //       test: /[\\/]node_modules[\\/]/,
      //       name(module) {
      //         const packageName = module.context.match(
      //           /[\\/]node_modules[\\/](.*?)([\\/]|$)/
      //         )[1];
      //         return `npm.${packageName.replace("@", "")}`;
      //       }
      //     }
      //   }
      // }
    },

    plugins,

    // Emit a source map for easier debugging
    // See https://webpack.js.org/configuration/devtool/#devtool
    devtool: "eval-source-map",

    performance: {
      assetFilter: assetFilename =>
        !/(\.map$)|(^(main\.|favicon\.))/.test(assetFilename)
    }
  });
};

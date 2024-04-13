const path = require("path");
const webpack = require("webpack");

module.exports = (options) => ({
  mode: options.mode,
  entry: options.entry,
  output: Object.assign(
    {
      path: path.resolve(process.cwd(), "build"),
      publicPath: "/",
    },
    options.output
  ),
  optimization: options.optimization,
  module: {
    rules: [
      {
        test: /\.(js|jsx)?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loder",
          options: options.babelQuery,
        },
      },
      {
        test: /\.css$/,
        include: /node_modules/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(eot|otf|ttf|woff|woff2)$/,
        use: "file-loader",
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: "svg-url-loader",
            options: {
              // Inline files smaller than 10 kB
              limit: 10 * 1024,
              noquotes: true,
            },
          },
        ],
      },
      {
        test: /\.(jpg|png|gif)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              // Inline files smaller than 10 kB
              limit: 10 * 1024,
            },
          },
          // image-webpack-loader安装太慢了,先去掉
          // {
          //   loader: "image-webpack-loader",
          //   options: {
          //     mozjpeg: {
          //       enabled: false
          //       // NOTE: mozjpeg is disabled as it causes errors in some Linux environments
          //       // Try enabling it in your environment by switching the config to:
          //       // enabled: true,
          //       // progressive: true,
          //     },
          //     gifsicle: {
          //       interlaced: false
          //     },
          //     optipng: {
          //       optimizationLevel: 7
          //     },
          //     pngquant: {
          //       quality: "65-90",
          //       speed: 4
          //     }
          //   }
          // }
        ],
      },
      {
        test: /\.html$/,
        use: "html-loader",
      },
    ],
  },
  plugins: options.plugins.concat([
      new webpack.EnvironmentPlugin({
          NODE_ENV: "development"
      })
  ]),
  resolve: {
      modules: ["node_modules", "src"],
      extensions: [".js", ".jsx", ".react.js"],
      mainFields: ["browser", "jsnext:main", "main"]
  },
  devtool: options.devtool,
  target: "web",
  performance: options.performance || {}
});

const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
// 清理多余css
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const glob = require("glob");
const PurifyCSSPlugin = require("purifycss-webpack");

// 设置入口文件
const parts = ["index", "investor", "strategy"];
const entryFiles = {};
parts.forEach(item => {
  entryFiles[item] = path.resolve(__dirname, `../src/pages/${item}/${item}.js`);
});

const HtmlWebpackPluginArr = parts.map(item => {
  return new HtmlWebpackPlugin({
    filename: `${item}.html`,
    template: path.resolve(__dirname, `../src/pages/${item}/${item}.html`),
    chunks: [item],
    inject: true,
    minify: {
      removeComments: true,
      collapseWhitespace: true
    }
  });
});
module.exports = {
  entry: entryFiles,
  module: {
    rules: [
      {
        test: /\.(html)$/,
        use: {
          loader: "html-loader",
          options: {
            minimize: true
          }
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "./img/[name].[hash:8].[ext]",
              outputPath: "assets"
            }
          }
        ]
      }
    ]
  },
  plugins: [
    // 分离css
    new MiniCssExtractPlugin({
      filename: "css/[name].[hash:8].css",
      chunkFilename: "[id].[hash:8].css"
    }),
    new PurifyCSSPlugin({
      paths: glob.sync(path.resolve(__dirname, "../src/pages/*/*.html"))
    })
  ],
  // optimization: {
  //   splitChunks: {
  //     cacheGroups: {
  //       commons: {
  //         chunks: "initial", //表示显示块的范围，有三个可选值：initial(初始块)、async(按需加载块)、all(全部块)，默认为all;
  //         name: "common", //拆分出来块的名字(Chunk Names)，默认由块名和hash值自动生成；
  //         minChunks: 1,
  //         minSize: 0,
  //       },
  //     },
  //   },
  // },
};
module.exports.plugins = module.exports.plugins.concat(HtmlWebpackPluginArr);

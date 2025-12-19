const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsWebpackPlugin = require("@soda/friendly-errors-webpack-plugin")

const port = 8080;
module.exports = {
  mode: 'development',
  devServer: {
    historyApiFallback: true,
    static: {
      directory: path.join(__dirname, '../dist'),
    },
    hot: false,
    port,
    proxy: [
      {
        context: ['/api'],
        // target: 'http://localhost:80',
        // target: 'http://47.93.181.79:8082',
        target: "https://nvdv338g40.execute-api.us-east-1.amazonaws.com/dev",
        changeOrigin: true,
        secure: false,
      },
    ],
  },
  output: {
    publicPath: "/",
    //如果是通过loader 编译的 放到scripts文件夹里 filename
    filename: "scripts/[name].bundle.js",
    //如果是通过'asset/resource' 编译的
    assetModuleFilename: "images/[name].[ext]",
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      favicon: './public/favicon.ico',
      template: path.resolve(__dirname, '../src/index-dev.html'),
    }),
    new FriendlyErrorsWebpackPlugin({
      compilationSuccessInfo: {
        messages: ["You application is running here http://localhost:" + port],
        notes: ["💊 构建信息请及时关注窗口右上角"],
      },
      // new WebpackBuildNotifierPlugin({
      //   title: '💿 Solv Dvelopment Notification',
      //   logo,
      //   suppressSuccess: true,
      // }),
      onErrors: function (severity, errors) {
        if (severity !== "error") {
          return;
        }
        const error = errors[0];
        console.log(error);
        notifier.notify({
          title: "👒 Webpack Build Error",
          message: severity + ": " + error.name,
          subtitle: error.file || "",
          icon: join(__dirname, "icon.png"),
        });
      },
      clearConsole: true,
    }),
  ],
}

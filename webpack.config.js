const path = require('path')
const merge = require('webpack-merge')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const { ThemedProgressPlugin } = require("themed-progress-plugin");
const Dotenv = require('dotenv-webpack');
const argv = require('yargs-parser')(process.argv.slice(2))
// console.log('argv', argv)
const _mode = argv.mode || 'development'
const _mergeConfig = require(`./config/webpack.${_mode}.js`)
const _modeflag = _mode === "production" ? true : false;

const webpackBaseConfig = {
  entry: {
    main: path.resolve(__dirname, './src/index.tsx'),
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@layouts': path.resolve(__dirname, 'src/layouts'),
      '@routes': path.resolve(__dirname, 'src/routes'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@abis': path.resolve(__dirname, 'src/abis'),
      '@stores': path.resolve(__dirname, 'src/stores'),
      '@connections': path.resolve(__dirname, 'src/connections'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /(node_modules)/,
        use: {
          // loader: 'ts-loader',
          loader: 'swc-loader',
        },
      },
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          // 'style-loader',
          { loader: "css-loader", options: { importLoaders: 1 } },
          "postcss-loader",
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: _modeflag
        ? "styles/[name].[contenthash:5].css"
        : "styles/[name].css",
      chunkFilename: _modeflag
        ? "styles/[name].[contenthash:5].css"
        : "styles/[name].css",
      ignoreOrder: false,
    }),
    new ThemedProgressPlugin(),
    new Dotenv({
      path: `./.env.${_mode}`,
      safe: false,
      systemvars: true,
    }),
  ],
}

module.exports = merge.default(webpackBaseConfig, _mergeConfig)

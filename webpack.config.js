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
    extensions: ['.tsx', '.ts', '.js', '.mjs'],
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
      '@zack/libs': path.resolve(__dirname, 'node_modules/@zack/libs'),
      '@zack/hooks': path.resolve(__dirname, 'node_modules/@zack/hooks'),
      '@zack/ui': path.resolve(__dirname, 'node_modules/@zack/ui'),
    },
    modules: [path.resolve(__dirname, 'node_modules'), 'node_modules'],
    symlinks: true,
    mainFields: ['module', 'main', 'browser'],
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
        test: /\.(js|mjs)$/,
        include: /node_modules\/@zack/,
        type: 'javascript/auto',
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
  optimization: {
    runtimeChunk: {
      name: "runtime",
    },
    splitChunks: {
      // 对所有类型的 chunk 进行拆分，减少重复并提升缓存复用。
      chunks: "all",
      // 控制首屏请求数量，避免单包过大。
      maxInitialRequests: 6,
      // 放宽异步请求数量，避免被强制合并成大包。
      maxAsyncRequests: 10,
      // 避免过小的碎片化 chunk，保持一个实用的最小体积。
      minRemainingSize: 20000,
      cacheGroups: {
        // 优先级 6：Ethers SDK（体积大，变更频率低）
        ethersSDK: {
          name: "chunk-ethers-sdk",
          test: /[\\/]node_modules[\\/](ethers|@ethersproject[\\/])/,
          chunks: "all",
          priority: 6,
          reuseExistingChunk: true,
          enforce: true,
        },
        // 优先级 5：状态管理库（Jotai + Immer）
        stateLibs: {
          name: "chunk-state",
          test: /[\\/]node_modules[\\/](jotai|jotai-immer|immer)[\\/]/,
          chunks: "all",
          priority: 5,
          reuseExistingChunk: true,
        },
        // 优先级 4：UI 组件库（@mui + @zack/ui）
        uiLibs: {
          name: "chunk-ui-libs",
          test: /[\\/]node_modules[\\/](@mui|@zack[\\/]ui)[\\/]/,
          chunks: "all",
          priority: 4,
          reuseExistingChunk: true,
        },
        // 优先级 3：@zack 私有工具库
        zackLibs: {
          name: "chunk-zack-libs",
          test: /[\\/]node_modules[\\/]@zack[\\/](libs|hooks)[\\/]/,
          chunks: "all",
          priority: 3,
          reuseExistingChunk: true,
        },
        // 优先级 2：其他第三方依赖
        vendors: {
          name: "chunk-vendors",
          test: /[\\/]node_modules[\\/]/,
          chunks: "all",
          priority: 2,
          reuseExistingChunk: true,
          maxSize: 300000,
        },
        // 优先级 1：业务代码公共部分
        commons: {
          name: "chunk-common",
          chunks: "all",
          minChunks: 2,
          priority: 1,
          reuseExistingChunk: true,
          maxSize: 200000,
        },
      },
      // minSize: {
      //   javascript: 20000,
      //   style: 20000,
      // },
      // maxSize: {
      //   javascript: 300000,
      //   style: 50000,
      // },
    },
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

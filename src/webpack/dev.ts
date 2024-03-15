import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import { HotModuleReplacementPlugin } from 'webpack'
import merge from 'webpack-merge'
import webpackCommonConfig from './common'

const webpackDevConfig = {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  output: {
    filename: '[name]_[hash].js'
  },
  devServer: {
    contentBase: 'dist',
    open: true,
    port: 3000,
    hot: true,
    hotOnly: true
  },
  plugins: [
    new HotModuleReplacementPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name]_[hash].css'
    })
  ]
}

export default merge(webpackCommonConfig, webpackDevConfig as any)

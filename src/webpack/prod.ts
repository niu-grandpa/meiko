import CssMinimizerPlugin from 'css-minimizer-webpack-plugin'
import ImageMinimizerPlugin from 'image-minimizer-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import { cpus } from 'node:os'
import TerserPlugin from 'terser-webpack-plugin'
import merge from 'webpack-merge'
import webpackCommonConfig from './common'

const threads = cpus().length

const webpackProdConfig = {
  mode: 'production',
  devtool: 'cheap-module-source-map',
  output: {
    filename: '[name].min.js'
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].min.css'
    })
  ],
  optimization: {
    usedExports: true,
    minimizer: [
      new CssMinimizerPlugin(),
      new TerserPlugin({
        parallel: threads // 开启多进程
      }),
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminGenerate,
          options: {
            plugins: [
              ['gifsicle', { interlaced: true }],
              ['jpegtran', { progressive: true }],
              ['optipng', { optimizationLevel: 5 }],
              [
                'svgo',
                {
                  plugins: [
                    'preset-default',
                    'prefixIds',
                    {
                      name: 'sortAttrs',
                      params: {
                        xmlnsOrder: 'alphabetical'
                      }
                    }
                  ]
                }
              ]
            ]
          }
        }
      })
    ]
  }
}

export default merge(webpackCommonConfig, webpackProdConfig as any)

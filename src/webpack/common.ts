// @ts-ignore
import PreloadWebpackPlugin from '@vue/preload-webpack-plugin'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import { cpus } from 'node:os'

const threads = cpus().length

const getStyleLoaders = (preProcessor?: string) => {
  return [
    {
      loader: MiniCssExtractPlugin.loader,
      options: {
        hmr: true,
        reloadAll: true
      }
    },
    {
      loader: 'css-loader',
      options: {
        modules: true
      }
    },
    {
      loader: 'postcss-loader',
      options: {
        postcssOptions: {
          plugins: [
            'postcss-preset-env' // 解决大多数样式兼容性问题
          ]
        }
      }
    },
    preProcessor
  ].filter(Boolean)
}

const webpackCommonConfig = {
  cache: {
    type: 'filesystem' // 使用文件缓存
  },

  plugins: [
    new CleanWebpackPlugin(),
    new PreloadWebpackPlugin({
      rel: 'preload', // preload兼容性更好
      as: 'script'
      // rel: 'prefetch' // prefetch兼容性更差
    })
  ],

  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 30000,
      maxSize: 0,
      minChunks: 1,
      name: true,
      automaticNameDelimiter: '-',
      vendors: {
        test: /[\\/]node_modules[\\/]/,
        priority: -10,
        filename: 'vendors.js'
      },
      default: {
        minChunks: 2,
        priority: -20,
        reuseExistingChunk: true
      }
    }
  },

  module: {
    rules: [
      {
        oneOf: [
          {
            test: /\.css$/,
            use: getStyleLoaders()
          },
          {
            test: /.less$/,
            use: getStyleLoaders('less-loader')
          },
          {
            test: /.s[ac]ss$/,
            use: getStyleLoaders('sass-loader')
          },
          {
            test: /\.js$/,
            exclude: /node_modules/,
            use: [
              {
                loader: 'thread-loader', // 开启多进程
                options: {
                  workers: threads
                }
              },
              {
                loader: 'babel-loader',
                options: {
                  cacheDirectory: true, // 开启babel编译缓存
                  cacheCompression: false, // 缓存文件不要压缩
                  plugins: ['@babel/plugin-transform-runtime'] // 减少代码体积
                }
              },
              {
                loader: 'imports-loader?this=>window'
              }
            ]
          },
          {
            test: /\.ts?$/,
            use: {
              loader: 'ts-loader'
            }
          },
          {
            test: /.(png|jpe?g|gif|svg)$/,
            type: 'asset',
            parser: {
              dataUrlCondition: {
                maxSize: 10 * 1024 // 小于10kb的图片会被base64处理
              }
            },
            generator: {
              filename: 'static/images/[name]_[hash:8][ext]'
            }
          },
          {
            test: /.(ttf|woff2?)$/,
            type: 'asset/resource',
            generator: {
              filename: 'static/media/[name]_[hash:8][ext]'
            }
          }
        ]
      }
    ]
  }
}

export default webpackCommonConfig

const path = require('path')

module.exports = {
  rootDir: path.resolve(__dirname),
  baseUrl: '.', // 作为从当前配置项所在目录的基础跳跃路径
  outDir: 'dist',
  mode: 'development',
  pages: [{ path: '/pages/home' }],
  alais: {},
  webpack: {}
}

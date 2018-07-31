const webpack = require('webpack')

module.exports = {
  devServer: {
    proxy: 'http://besterp-server.test/'
  },
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        _: 'lodash'
      })
    ]
  },
  pluginOptions: {
    enableInSFC: false
  },
  chainWebpack: config => {
    config
      .plugin('html')
      .tap(args => {
        args[0].chunksSortMode = 'none'

        return args
      })
  }
}

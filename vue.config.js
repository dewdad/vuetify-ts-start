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
  }
}

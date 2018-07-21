const webpack = require('webpack')

module.exports = {
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

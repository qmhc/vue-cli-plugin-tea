const StylelintPlugin = require('stylelint-webpack-plugin')

module.exports = (api, options) => {
  api.chainWebpack(webpackConfig => {
    webpackConfig
      .plugin('stylelint')
      .use(StylelintPlugin)
  })
}

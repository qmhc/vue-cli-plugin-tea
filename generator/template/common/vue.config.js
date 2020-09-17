'use strict'

<%_ if (useSass) { _%>
const StylelintPlugin = require('stylelint-webpack-plugin')
<%_ } _%>

const isProd = process.env.NODE_ENV === 'production'
const publicPath = isProd ? './' : '/'

<%_ if (useSass) { _%>
module.exports = {
  publicPath,
  chainWebpack(config) {
    config
      .plugin('stylelint')
      .use(StylelintPlugin)
  }
}
<%_ } else { _%>
module.exports = {
  publicPath
}
<%_ } _%>

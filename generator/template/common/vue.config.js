'use strict'

const isProd = process.env.NODE_ENV === 'production'
const publicPath = isProd ? './' : '/'

module.exports = {
  publicPath
}

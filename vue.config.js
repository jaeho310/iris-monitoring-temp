module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  devServer: {
    overlay: false
  },
  lintOnSave: false,
  configureWebpack: {
    devtool: 'source-map'
  },
}

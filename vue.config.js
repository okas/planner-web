module.exports = {
  runtimeCompiler: true,
  baseUrl: undefined,
  outputDir: undefined,
  assetsDir: undefined,
  productionSourceMap: undefined,
  parallel: undefined,
  css: {
    loaderOptions: {
      sass: {
        data: '@import "@/assets/app_initial_variables.scss";'
      },
      postcss: {
        plugins: [require('autoprefixer')]
      }
    }
  },
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      // mutate config for production...
    } else if (process.env.NODE_ENV === 'development') {
      // mutate for development...
      config.devtool = 'eval-source-map' // test instead of 'source-map'
    }
  },

  lintOnSave: undefined
}

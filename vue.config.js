module.exports = {
  runtimeCompiler: true,
  baseUrl: undefined,
  outputDir: undefined,
  assetsDir: undefined,
  productionSourceMap: undefined,
  parallel: undefined,
  lintOnSave: undefined,
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
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        ws: true,
        logLevel: 'debug'
      }
    }
  },
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      // mutate config for production...
    } else if (process.env.NODE_ENV === 'development') {
      config.devtool = 'eval-source-map' // test instead of 'source-map'
    }
  }
}

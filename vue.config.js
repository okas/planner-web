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
        data: '@import "@globalVarScss";'
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
  chainWebpack: config => {
    config.resolve.alias
      .set('@globalVarScss', '@/assets/global_variables.scss')
      .set('@globalImpScss', '@/assets/global_imports.scss')
  }
}

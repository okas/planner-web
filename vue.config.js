module.exports = {
  runtimeCompiler: true,
  baseUrl: undefined,
  outputDir: undefined,
  assetsDir: undefined,
  productionSourceMap: undefined,
  parallel: undefined,
  css: {
    loaderOptions: {
      postcss: {
        plugins: [require('autoprefixer')]
      }
    }
  },
  }
}

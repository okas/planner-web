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
        data: '@import "@globalScss";'
      },
      postcss: {
        plugins: [require('autoprefixer')]
      }
    }
  },
  chainWebpack: config => {
    config.resolve.alias.set('@globalScss', '@/assets/globals.scss')
  }
}

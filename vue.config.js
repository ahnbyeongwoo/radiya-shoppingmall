const { defineConfig } = require('@vue/cli-service')
const webpack = require('webpack');

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false
      }),
    ],
  },
  devServer:{
    proxy:{
      '/api':{
        target:`${process.env.VUE_APP_API_URL}`,
        changeOrigin:true,
        pathRewrite:{
          '^/api':''
        }
      }
    }
  }
})

// const webpack = require('webpack');

// module.exports = {
//   configureWebpack: {
//     plugins: [
//       new webpack.DefinePlugin({
//         __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false
//       })
//     ]
//   }
// };


const path = require('path');

module.exports = {
devServer:{

  historyApiFallback:true

},
  entry:path.resolve(_dirname,"../src/Components/map.js"),
  output: {
    filename: 'map.js',
  },
  module: {
    rules: [{ test: /\.txt$/, use: {
      loader: 'html-loader',
      options: {
        attrs: [':data-src']
      }
    } }],
  },

  
};
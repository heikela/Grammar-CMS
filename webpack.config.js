module.exports = {
  entry: {
    index: [
      './FirebaseCMS.js'
    ],
    tests: [
      './trivialReporter',
      './documentTest.js',
      './documentSerialization.test.js'
    ]
  },
  output: {
    path: './dist',
    filename: '[name].js'
  },
  devServer: {
    inline: true,
    hot: false,
    port: 3334
  },
  module: {
    preLoaders: [
      {
        test: /\.js/,
        loader: 'eslint',
        exclude: /node_modules/
      }
    ],
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015', 'react', 'stage-2']
        }
      },
      { test: /\.css$/, loader: "style!css" }
    ]
  }
}

module.exports = {
  entry: {
    index: [
      'babel-polyfill',
      './DocumentEditor.js'
    ],
    testBundle: [
      './trivialReporter',
      './documentTest.js'
    ]
  },
  output: {
    path: './dist',
    filename: '[name].js'
  },
  devServer: {
    inline: true,
    port: 3334
  },
  module: {
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

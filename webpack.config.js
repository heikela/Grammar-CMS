module.exports = {
  entry: ['babel-polyfill', './DocumentEditor.js'],
  output: {
    path: './dist',
    filename: 'index.js'
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

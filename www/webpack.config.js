const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require('path');

module.exports = {
  entry: [
  "./bootstrap.js",
  ],
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bootstrap.js",
  },
  mode: "development",
  experiments: {
    asyncWebAssembly: true,
  },
  plugins: [
    new CopyWebpackPlugin([
      'index.html',
      { from: 'js', to: 'js' },
      { from: 'css', to: 'css' },
      { from: 'assets', to: 'assets' },
    ])
  ],
};
module.rules = [
  {
    test: /\.(?:js|mjs|cjs)$/,
    exclude: /node_modules/,
    use: {
      loader: 'babel-loader',
      options: {
        presets: [
          ['@babel/preset-env', { targets: "defaults" }]
        ]
      }
    }
  }
]

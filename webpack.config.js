const path = require('path');
module.exports = {
    entry: {
        bundle: './src/TicTacToe.ts'
    },
    output: {
        path: path.join(__dirname,'dist/js'),
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        extensions:['.ts','.js']
    },
    devServer: {
        static: {
            directory: path.join(__dirname, "dist"),
        },
    },
    module: {
        rules: [
            {
              test: /\.ts$/, // .tsファイルに対して
              exclude: /node_modules/, // node_modulesは除外
              use: [
                {
                  loader: 'babel-loader',
                  options: {
                    presets: ['@babel/preset-env'],
                  },
                },
                'ts-loader', // ts-loaderは最後に実行
              ],
            },
            {
                test: /\.js$/, // .jsファイルに対して
                enforce: 'pre',
                use: ['source-map-loader'], // source-map-loaderを使用
              },
          ],
    },
    devtool: 'source-map', // ソースマップを有効にする
    mode: 'development'
}

const path = require('path');
module.exports = {
    entry: {
        bundle: './scripts/TicTacToe.ts'
    },
    output: {
        path: path.join(__dirname,'dist/js'),
        filename: '[name].js'
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
                test:/\.ts$/,loader:'ts-loader'
            }
        ]
    },
    devtool: 'source-map', // ソースマップを有効にする
    plugins: [
        // ソースマップファイルを別ディレクトリに移動するためのプラグイン
        new (require('webpack-source-map-support'))({
            appendTo: 'source-maps' // ソースマップファイルをsource-mapsディレクトリに出力
        })
    ]
}

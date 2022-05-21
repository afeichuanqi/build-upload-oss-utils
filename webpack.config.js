const path = require('path');
const TypescriptDeclarationPlugin = require('typescript-declaration-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: './src/index.ts',

    output: {
        libraryTarget: 'commonjs2',
        path: path.join(__dirname, '/dist'),
        filename: "index.js"
    },
    resolve: {
        extensions: [".ts", ".js"],
        fallback: {
            "fs": false
        }
    },
    target: 'node',
    module: {
        rules: [
            {
                test: /\.ts$/,
                // use:['awesome-typescript-loader']
                // 1.该 Loader 是把 TypeScript 转换成 JavaScript, 只负责新语法的转换，新增的API不会自动添加polyfill
                loader: 'awesome-typescript-loader',
                include: [path.resolve('src')]
            }
        ]
    },
    plugins: [
        new TypescriptDeclarationPlugin({
            // Options for TypescriptDeclarationPlugin (see below)
        })
    ]

}
const path = require('path');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
var autoprefixer = require('autoprefixer');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: {
        //slideSlider : './slideSlider.scss'
        //目录结构
        // a.js
        // style.scss

        // a.js
        // import './style.scss';

        // style.scss
        // .hello{
        //     font-size:1rem;
        // }
    },
    output: {
        path: path.resolve(__dirname, 'css'),
        publicPath: '/',
        filename: '[name].min.css'
    },
    module: {
        rules: [
            {
                test: /(\.js|\.jsx)$/, 
                use: 'babel-loader?cacheDirectory=true'
                //没有.babelrc时添加
                // options: {
                //     presets: [
                //         ['es2015', {
                //         modules: false
                //         }]
                //     ]
                // }
            },
            {
                test: /(\.scss|\.css)$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [
                        'css-loader',
                        'sass-loader',
                        'style-loader'
                    ],
                    publicPath: '/'
                })
            },
            {
                test: /\.(jpe?g|png|gif)/,
                loader: 'url-loader',
                query: {
                    name: 'images/[name].[ext]',
                    limit: 8192
                }
            }
        ]
    },
    devServer: {
        port: 8080,
        contentBase: __dirname,
        historyApiFallback: true,
        host: '127.0.0.1'
    },
    plugins: [
        require('autoprefixer'),
        new webpack.BannerPlugin('版权所有，翻版必究，哈哈哈'),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.LoaderOptionsPlugin({
            options: {
                postcss: [
                    autoprefixer({
                        browsers: ['last 2 versions']
                    })
                ]
            }
        }),
        new ExtractTextPlugin({
            filename: "css/[name].min.css",
            disable: false,
            allChunks: true
        })
    ]
};


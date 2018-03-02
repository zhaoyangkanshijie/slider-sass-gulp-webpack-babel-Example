'use strict';

const
	webpack = require('webpack'),
	path = require('path');

const src_path = './src/';

module.exports = {

	watch: true,

	entry: {
		'common': [
			src_path + 'js/pages/common.js'
		],
		'home': [
			src_path + 'js/pages/home.js'
		],
		'solution': [
			src_path + 'js/pages/solution.js'
		],
        'case': [
            src_path + 'js/pages/case.js'
        ],
		'product': [
			src_path + 'js/pages/product.js'
		]
	},

	output: {
		path: path.join(__dirname, 'static'),
		publicPath: '/static/',
		filename: 'js/[name].js'
	},

	resolve: {
		extensions: ['', '.js', '.jsx']
	},

    externals: {
        $: "jQuery",
        _: "lodash",
		FastClick: "FastClick"
    },

	module: {
		loaders: [
			{
				test: /\.js?$/,
				loader: 'babel',
				exclude: /node_modules/
			}
		]
	},

	plugins: [
    	new webpack.NoErrorsPlugin()
	]

};

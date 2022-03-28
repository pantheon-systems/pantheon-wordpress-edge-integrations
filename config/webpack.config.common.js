const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WebpackBar = require('webpackbar');
const ESLintPlugin = require('eslint-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';

// Config files.
const settings = require('./webpack.settings.js');

/**
 * Configure entries.
 *
 * @return {Object[]} Array of webpack settings.
 */
const configureEntries = () => {
	const entries = {};

	for (const [key, value] of Object.entries(settings.entries)) {
		entries[key] = path.resolve(process.cwd(), value);
	}

	return entries;
};

module.exports = {
	entry: configureEntries(),
	output: {
		path: path.resolve(process.cwd(), settings.paths.dist.base),
		filename: settings.filename.js,
	},

	// Console stats output.
	// @link https://webpack.js.org/configuration/stats/#stats
	stats: settings.stats,

	// External objects.
	externals: {
		jquery: 'jQuery',
		lodash: 'lodash',
	},

	// Performance settings.
	performance: {
		maxAssetSize: settings.performance.maxAssetSize,
	},

	// Build rules to handle asset files.
	module: {
		rules: [
			// Scripts.
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'babel-loader',
						options: {
							cacheDirectory: true,
							sourceMap: !isProduction,
						},
					},
				],
			},
		],
	},

	plugins: [
		// Clean the `dist` folder on build.
		new CleanWebpackPlugin({
			cleanStaleWebpackAssets: false,
		}),

		new ESLintPlugin({
			extensions: ['.js'],
			fix: true,
		}),

		// Fancy WebpackBar.
		new WebpackBar(),
	],
};

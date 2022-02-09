// Webpack settings exports.
module.exports = {
	entries: {
		// JS files
		'assets': './assets/js/assets.js',
		'assets.min': './assets/js/assets.js',
	},
	filename: {
		js: 'js/[name].js',
	},
	paths: {
		src: {
			base: './assets/',
			js: './assets/js/',
		},
		dist: {
			base: './dist/',
			clean: ['./js'],
		},
	},
	stats: {
		// Copied from `'minimal'`.
		all: false,
		errors: true,
		maxModules: 0,
		modules: true,
		warnings: true,
		// Our additional options.
		assets: true,
		errorDetails: true,
		excludeAssets: /\.(jpe?g|png|gif|svg|woff|woff2)$/i,
		moduleTrace: true,
		performance: true,
	},
	performance: {
		maxAssetSize: 100000,
	},
	manifestConfig: {
		basePath: '',
	},
};

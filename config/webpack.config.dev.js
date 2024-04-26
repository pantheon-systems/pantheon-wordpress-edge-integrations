const { merge } = require('webpack-merge');
const common = require('./webpack.config.common.js');

// Config files.
const settings = require('./webpack.settings.js');

module.exports = merge(common, {
	mode: 'development',
	devtool: 'inline-cheap-module-source-map',
});

const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
	publicPath: process.env.NODE_ENV === 'production'
		? '/covid19/'
		: '/',
	chainWebpack: (config) => {
		config.plugin('CompressionPlugin').use(CompressionPlugin);
	}
};

const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
	publicPath: process.env.NODE_ENV === 'production'
		? '/covid19/'
		: '/',
	pwa: {
		name: 'mediawatch.io',
		themeColor: '#0F0F18',
		msTileColor: '#0F0F18'
	},

	lintOnSave: process.env.NODE_ENV !== 'production',
	productionSourceMap: false,
	parallel: true,
	css: {
		sourceMap: true
	},
	transpileDependencies: ['vuetify'],
	configureWebpack: {
		plugins: []
	},
	pluginOptions: {
		i18n: {
			locale: 'el',
			fallbackLocale: 'en',
			enableInSFC: true
		}
	},
	chainWebpack: (config) => {
		config.plugin('CompressionPlugin').use(CompressionPlugin);
	}
};

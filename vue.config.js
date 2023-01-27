const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
	publicPath: process.env.NODE_ENV === 'production'
		? '/covid19/'
		: '/',
	outputDir: 'dist/covid19/',
	pwa: {
		name: 'COVID—19',
		themeColor: '#114B5F',
		msTileColor: '#114B5F',
		appleMobileWebAppCapable: 'yes',
		manifestOptions: {
			name: 'COVID—19',
			short_name: 'COVID—19',
			start_url: '',
			orientation: 'portrait',
			display: 'fullscreen',
			background_color: '#114B5F',
			theme_color: '#114B5F'
		}
	},

	lintOnSave: process.env.NODE_ENV !== 'production',
	productionSourceMap: process.env.NODE_ENV === 'development',
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
		config.plugin("copy").tap(([options]) => {
			options[0].ignore.push("shared/decoded/**");
			return [options];
		});
		config.plugins.delete('prefetch');
		config.plugin('CompressionPlugin').use(CompressionPlugin);
	}
};

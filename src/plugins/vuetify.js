import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import { en, el } from 'vuetify/es5/locale';

Vue.use(Vuetify);

el.dataTable.sortBy = 'Ταξινόμηση ανά';
el.dataTable.itemsPerPageText = 'Σειρές ανά σελίδα';
el.dataFooter.pageText = '{0}-{1} από {2}';
el.dataFooter.itemsPerPageAll = 'Όλες';

export default new Vuetify({
	icons: {
		iconfont: 'mdi' // 'mdi' || 'mdiSvg' || 'md' || 'fa' || 'fa4' || 'faSvg'
	},
	theme: {
		themes: {
			light: {
				accent: '#BA3A0A',
				primary: '#114B5F',
				secondary: '#ED2038',
				error: '#FF5252',
				info: '#2196F3',
				success: '#4CAF50',
				warning: '#FFC107'
			},
			dark: {
				accent: '#BA3A0A',
				primary: '#114B5F',
				secondary: '#ED2038',
				error: '#FF5252',
				info: '#2196F3',
				success: '#4CAF50',
				warning: '#FFC107'
			}
		},
		options: {
			minifyTheme: function (css) {
				return process.env.NODE_ENV === 'production'
					? css.replace(/[\r\n|\r|\n]/g, '')
					: css;
			}
		}
	},
	lang: {
		locales: { el, en },
		current: 'el'
	}
});

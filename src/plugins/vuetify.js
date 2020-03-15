import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import VueI18n from 'vue-i18n';
// import el from 'vuetify/es5/locale/en';

Vue.use(Vuetify);
Vue.use(VueI18n);

// el.$vuetify.dataTable.sortBy = 'Ταξινόμηση ανά';
// el.$vuetify.dataTable.itemsPerPageText = 'Σειρές ανά σελίδα';
// el.$vuetify.dataFooter.itemsPerPageAll = 'Όλες';

const messages = {
	el: {
		$vuetify: {
			dataTable: {
				sortBy: 'Ταξινόμηση ανά',
				itemsPerPageText: 'Σειρές ανά σελίδα'
			},
			dataFooter: {
				pageText: '{0}-{1} από {2}',
				itemsPerPageAll: 'Όλες'
			}
		},
	}
};

// Create VueI18n instance with options
const i18n = new VueI18n({
	locale: 'el', // set locale
	messages, // set locale messages
});

export default new Vuetify({
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
		t: (key, ...params) => i18n.t(key, params),
	},
});

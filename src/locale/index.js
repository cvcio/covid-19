import Vue from 'vue';
import VueI18n from 'vue-i18n';

Vue.use(VueI18n);

const locale = require('@/locale/locale.json');
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
			},
		},
	},
	en: {
		$vuetify: {
			dataTable: {
				sortBy: 'Sort By',
				itemsPerPageText: 'Rows per page'
			},
			dataFooter: {
				pageText: '{0}-{1} of {2}',
				itemsPerPageAll: 'All'
			},
		},
	}
};


for (let [key, value] of Object.entries(locale)) {
	messages.el[key] = key;
	messages.en[key] = value;
}

// Create VueI18n instance with options
export default new VueI18n({
	locale: 'el',
	fallbackLocale: 'el',
	messages,
});

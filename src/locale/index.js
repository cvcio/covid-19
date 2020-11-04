// import Vue from 'vue';
// import VueI18n from 'vue-i18n';

// Vue.use(VueI18n);

// const locale = require('@/locale/locale.json');
// const messages = {
// 	el: {
// 		$vuetify: {
// 			dataTable: {
// 				sortBy: 'Ταξινόμηση ανά',
// 				itemsPerPageText: 'Σειρές ανά σελίδα'
// 			},
// 			dataFooter: {
// 				pageText: '{0}-{1} από {2}',
// 				itemsPerPageAll: 'Όλες'
// 			}
// 		}
// 	},
// 	en: {
// 		$vuetify: {
// 			dataTable: {
// 				sortBy: 'Sort By',
// 				itemsPerPageText: 'Rows per page'
// 			},
// 			dataFooter: {
// 				pageText: '{0}-{1} of {2}',
// 				itemsPerPageAll: 'All'
// 			}
// 		}
// 	}
// };

// for (const [key, value] of Object.entries(locale)) {
// 	messages.el[key] = key;
// 	messages.en[key] = value;
// }

// // Create VueI18n instance with options
// export default new VueI18n({
// 	locale: 'el',
// 	fallbackLocale: 'el',
// 	messages
// });

const defaultLocale = 'el';
const SUPPORTED_LOCALES = [
	{
		code: 'el',
		base: '',
		name: 'Ελληνικά',
		short: 'ΕΛ',
		translation: '/locale/el.json'
	},
	{
		code: 'en',
		base: '/en',
		name: 'English',
		short: 'EN',
		translation: '/locale/en.json'
	}
];

const getLocaleRegex = () => {
	let reg = '';
	SUPPORTED_LOCALES.forEach((locale, index) => {
		reg = `${reg}${locale.code}${index !== SUPPORTED_LOCALES.length - 1 ? '|' : ''}`;
	});
	return `(${reg})`;
};

const getLocale = (locale) => {
	return SUPPORTED_LOCALES.find(loc => loc.code === locale);
};

export {
	defaultLocale,
	getLocale,
	getLocaleRegex,
	SUPPORTED_LOCALES
};

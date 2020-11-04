import Vue from 'vue';
import VueI18n from 'vue-i18n';

Vue.use(VueI18n);

// Create VueI18n instance with options
export default new VueI18n({
	silentTranslationWarn: true,
	locale: process.env.VUE_APP_I18N_LOCALE || 'el',
	fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'dev',
	messages: {
		dev: require('@/locale/dev.json')
	}
});

import Vue from 'vue';
import VueGtag from 'vue-gtag';
import { sync } from 'vuex-router-sync';
import '@/registerServiceWorker';

// Import Plugins
import vuetify from '@/plugins/vuetify';
import i18n from '@/plugins/i18n';

import router from '@/router';
import store from '@/store';

import App from '@/App.vue';

// Global Packages
import moment from 'moment';
// Set Global Packages
Vue.prototype.$moment = moment;

Vue.config.productionTip = process.env.NODE_ENV === 'development';
Vue.config.performance = process.env.NODE_ENV === 'development';

Vue.prototype.$BASE_URL = process.env.VUE_APP_BASE_URL || '/';
Vue.prototype.$BASE_API = process.env.VUE_APP_BASE_API || '';
Vue.prototype.$APP_DOMAINNAME = process.env.VUE_APP_DOMAINNAME;
Vue.prototype.$APP_TITLE = process.env.VUE_APP_TITLE;
Vue.prototype.$CHARTS_URL = 'https://raw.githubusercontent.com/iMEdD-Lab/open-data/master/COVID-19/charts/';

Vue.use(VueGtag, {
	config: { id: process.env.VUE_APP_GOOGLE_TAG || '' },
	enabled: false
}, router);

// Init Base API Handler

sync(store, router);

// Create Application
new Vue({
	i18n,
	router,
	store,
	vuetify,
	render: h => h(App)
}).$mount('#app');

import Vue from 'vue';
import VueGtag from 'vue-gtag';

import { sync } from 'vuex-router-sync';
import '@/registerServiceWorker';

// Components
import { api } from '@/api';
import router from '@/router';
import store from '@/store';
import i18n from '@/plugins/i18n';
import vuetify from '@/plugins/vuetify';
import filters from '@/filters';

import VueObserveVisibility from 'vue-observe-visibility';

import App from '@/App.vue';

// Global Packages
import moment from 'moment';
// Set Global Packages
Vue.prototype.$moment = moment;
Vue.prototype.$http = api;

Vue.config.productionTip = process.env.NODE_ENV === 'development';
Vue.config.performance = process.env.NODE_ENV === 'development';
Vue.config.devtools = process.env.NODE_ENV === 'development';
Vue.config.debug = process.env.NODE_ENV === 'development';
Vue.config.silent = process.env.NODE_ENV === 'production';

Vue.prototype.$BASE_URL = process.env.VUE_APP_BASE_URL || '/';
Vue.prototype.$BASE_API = process.env.VUE_APP_BASE_API || '';
Vue.prototype.$DISPLAY_URL = process.env.VUE_APP_DISPLAY_URL || '';
Vue.prototype.$APP_MAPBOX = process.env.VUE_APP_MAPBOX || 'pk.eyJ1IjoiYW5kZWZpbmVkIiwiYSI6ImNpcWY2OHN5bDAwOHZpMWt4ODV2a2EzdnUifQ.q-XTbW4kXMSRhT5alQ2J4g';
Vue.prototype.$CHARTS_URL = 'https://raw.githubusercontent.com/iMEdD-Lab/open-data/master/COVID-19/charts/';

Vue.use(filters);
Vue.use(VueGtag, {
	config: { id: process.env.VUE_APP_GOOGLE_TAG || 'UA-129030467-1' },
	enabled: false
}, router);
Vue.use(VueObserveVisibility);
// Init Base API Handler
api.init(Vue.prototype.$BASE_API);
sync(store, router);

// Create Application
new Vue({
	i18n,
	router,
	store,
	vuetify,
	render: h => h(App)
}).$mount('#app');

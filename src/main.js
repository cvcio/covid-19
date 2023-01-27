import Vue from 'vue';

import { sync } from 'vuex-router-sync';
// import '@/registerServiceWorker';

// Components
import { api } from '@/api';
import router from '@/router';
import store from '@/store';
import i18n from '@/plugins/i18n';
import vuetify from '@/plugins/vuetify';
import filters from '@/filters';

import VueObserveVisibility from 'vue-observe-visibility';
import VueSocialSharing from 'vue-social-sharing';
import VueCookieBot from '@ambitiondev/vue-cookiebot-plugin';

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

Vue.prototype.$VERSION = process.env.VUE_APP_VERSION;
Vue.prototype.$BASE_URL = process.env.VUE_APP_BASE_URL;
Vue.prototype.$BASE_API = process.env.VUE_APP_BASE_API || '';
Vue.prototype.$DISPLAY_URL = process.env.VUE_APP_DISPLAY_URL || '';
Vue.prototype.$APP_MAPBOX = process.env.VUE_APP_MAPBOX || '';
Vue.prototype.$APP_MAPBOX_STYLE = process.env.VUE_APP_MAPBOX_STYLE || 'mapbox://styles/mapbox/light-v10';

if (process.env.NODE_ENV !== 'production') {
	console.log("Mode: ", `${process.env.NODE_ENV}`);
	console.log("App Version: ", `v${process.env.VUE_APP_VERSION}`);
}

Vue.use(filters);
Vue.use(VueObserveVisibility);
Vue.use(VueSocialSharing);
Vue.use(VueCookieBot, {
	cookieBotID: 'f5f84b33-c06b-4b63-b6d3-ca71ab5275a0'
});

sync(store, router);

// Create Application
new Vue({
	i18n,
	router,
	store,
	vuetify,
	render: h => h(App)
}).$mount('#app');

import Vue from 'vue';

import vuetify from '@/plugins/vuetify';
import App from '@/App.vue';
import router from '@/router';
import store from '@/store';
import i18n from '@/locale';

import '@/registerServiceWorker';

import moment from 'moment';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = process.env.VUE_APP_MAPBOX || '';
moment.locale('el');

Vue.prototype.$mapboxgl = mapboxgl;
Vue.prototype.$moment = moment;

Vue.prototype.$BASE_URL = process.env.BASE_URL || '/';
Vue.prototype.$CHARTS_URL = 'https://raw.githubusercontent.com/iMEdD-Lab/open-data/master/COVID-19/charts/';
Vue.config.productionTip = process.env.NODE_ENV === 'development';
Vue.config.performance = process.env.NODE_ENV === 'development';

new Vue({
	i18n,
	router,
	store,
	vuetify,
	render: h => h(App),
}).$mount('#app');

import Vue from 'vue';

import vuetify from '@/plugins/vuetify';
import App from '@/App.vue';
import store from '@/store';

import '@/registerServiceWorker';

import VueClipboards from 'vue-clipboards';

import moment from 'moment';
import mapboxgl from 'mapbox-gl';

Vue.use(VueClipboards);

mapboxgl.accessToken = process.env.VUE_APP_MAPBOX || '';
moment.locale('el');

Vue.prototype.$mapboxgl = mapboxgl;
Vue.prototype.$moment = moment;
Vue.prototype.$APP_URL = process.env.VUE_APP_URL || '';

Vue.config.productionTip = process.env.NODE_ENV === 'development';
Vue.config.performance = process.env.NODE_ENV === 'development';

new Vue({
	store,
	vuetify,
	render: h => h(App),
}).$mount('#app');

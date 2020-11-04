import Vue from 'vue';
import VueRouter from 'vue-router';
import i18n from '@/plugins/i18n';
import store from '@/store';

import { defaultLocale, getLocale } from '@/locale';

Vue.use(VueRouter);

const routes = [
	// {
	// 	path: '/:lang/',
	// 	children: [
	{
		path: '/',
		name: 'home',
		props: { isNav: true, lang: '' },
		component: () => import(/* webpackChunkName: "home" */ '@/views/home.vue')
	},
	{
		path: '/stats/',
		name: 'stats',
		props: { isNav: true, lang: '' },
		component: () => import(/* webpackChunkName: "stats" */ '@/views/stats.vue')
	},
	{
		path: '/iframe/',
		name: 'frame',
		props: { isNav: true, lang: '' },
		component: () => import(/* webpackChunkName: "frame" */ '@/views/frame.vue')
	},
	{
		path: '*',
		redirect: '/'
	}
	// ]
	// }
];

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
});

const hasQueryParams = (route) => {
	return !!Object.keys(route.query).length;
};

router.beforeEach((to, from, next) => {
	const locale = getLocale(to.query.lang || defaultLocale);
	console.debug('Locale:', locale.name);
	// const lang = to.query.lang;
	// if (lang && lang !== i18n.locale) {
	// 	i18n.locale = lang;
	// 	vuetify.framework.lang.current = lang;
	// }

	// if (!hasQueryParams(to) && hasQueryParams(from)) {
	// 	next({ name: to.name, query: from.query });
	// }
	// return next();
	store.dispatch('setLocale', locale);
	// get translations from params
	if (locale) {
		i18n.locale = locale.code;
	}
	next();
});

export default router;

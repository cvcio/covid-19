import Vue from 'vue';
import VueRouter from 'vue-router';
import i18n from '@/plugins/i18n';
import store from '@/store';
import layoutAPP from '@/layouts/app';
import layoutIframe from '@/layouts/iframe';
import { api } from '@/api';

import { defaultLocale, getLocale, SUPPORTED_LOCALES } from '@/locale';

Vue.use(VueRouter);

SUPPORTED_LOCALES.forEach((locale) => {
	api.get(locale.translation).then((res) => {
		console.debug('Merge Locale:', locale.code);
		i18n.mergeLocaleMessage(locale.code, res.data || {});
	}).catch(err => console.error(err));

	api.get('/locale/locale.json').then(res => {
		const messages = { el: {}, en: {} };
		for (const [key, value] of Object.entries(res.data)) {
			messages.el[key] = value;
			messages.en[key] = key;
		}

		i18n.mergeLocaleMessage('el', messages.el || {});
		i18n.mergeLocaleMessage('en', messages.en || {});
	});
});

const routes = [
	{
		path: '/',
		name: 'home',
		props: { isNav: true, lang: '' },
		meta: { layout: layoutAPP },
		component: () => import(/* webpackChunkName: "home" */ '@/views/home.vue')
	},
	{
		path: '/greece/',
		name: 'greece',
		props: { isNav: true, lang: '' },
		meta: { layout: layoutAPP },
		component: () => import(/* webpackChunkName: "greece" */ '@/components/content/greece/posts.vue')
	},
	{
		path: '/global/',
		name: 'global',
		props: { isNav: true, lang: '' },
		meta: { layout: layoutAPP },
		component: () => import(/* webpackChunkName: "global" */ '@/components/content/global/posts.vue')
	},
	{
		path: '/iframe/',
		name: 'frame',
		props: { isNav: true, lang: '' },
		meta: { layout: layoutIframe },
		component: () => import(/* webpackChunkName: "frame" */ '@/views/frame.vue'),
		children: [
			// Greece
			{
				path: 'greece-key-by-region-table',
				name: 'greece-key-by-region-table',
				props: {},
				meta: { iframe: true },
				component: () => import(/* webpackChunkName: "d-frame" */ '@/components/iframes/greece-key-by-region-table.vue')
			},
			{
				path: 'greece-key-daily-agg-bar',
				name: 'greece-key-daily-agg-bar',
				props: {},
				meta: { iframe: true },
				component: () => import(/* webpackChunkName: "d7-line" */ '@/components/iframes/greece-key-daily-agg-bar.vue')
			},
			{
				path: 'greece-intubated-daily-agg-bar',
				name: 'greece-intubated-daily-agg-bar',
				props: {},
				meta: { iframe: true },
				component: () => import(/* webpackChunkName: "d7-line" */ '@/components/iframes/greece-intubated-daily-agg-bar.vue')
			},

			{
				path: 'greece-key-subplot-regions',
				name: 'greece-key-subplot-regions',
				props: {},
				meta: { iframe: true },
				component: () => import(/* webpackChunkName: "d7-line" */ '@/components/iframes/greece-key-subplot-regions.vue')
			},
			{
				path: 'greece-tests-daily-agg-bar',
				name: 'greece-tests-daily-agg-bar',
				props: {},
				meta: { iframe: true },
				component: () => import(/* webpackChunkName: "d7-line" */ '@/components/iframes/greece-tests-daily-agg-bar.vue')
			},
			// Global
			{
				path: 'global-key-by-country-table',
				name: 'global-key-by-country-table',
				props: {},
				meta: { iframe: true },
				component: () => import(/* webpackChunkName: "d-frame" */ '@/components/iframes/global-key-by-country-table.vue')
			},
			{
				path: 'global-key-daily-agg-bar',
				name: 'global-key-daily-agg-bar',
				props: {},
				meta: { iframe: true },
				component: () => import(/* webpackChunkName: "d7-line" */ '@/components/iframes/global-key-daily-agg-bar.vue')
			},
			{
				path: 'global-key-subplot-countries',
				name: 'global-key-subplot-countries',
				props: {},
				meta: { iframe: true },
				component: () => import(/* webpackChunkName: "d7-line" */ '@/components/iframes/global-key-subplot-countries.vue')
			},
			{
				path: 'global-key-daily-similar',
				name: 'global-key-daily-similar',
				props: {},
				meta: { iframe: true },
				component: () => import(/* webpackChunkName: "d7-line" */ '@/components/iframes/global-key-daily-similar.vue')
			},

			{
				path: 'map-view',
				name: 'map-view',
				props: { lang: '' },
				meta: { iframe: true },
				component: () => import(/* webpackChunkName: "map-view" */ '@/components/iframes/map-view.vue')
			}
		]
	},
	{
		path: '*',
		redirect: '/'
	}
];

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
});

router.beforeEach((to, from, next) => {
	const locale = getLocale(to.query.lang || defaultLocale);
	store.dispatch('setLocale', locale);
	if (locale) {
		i18n.locale = locale.code;
	}
	next();
});

export default router;

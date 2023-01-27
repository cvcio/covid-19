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
	api.get(process.env.VUE_APP_BASE_URL + locale.translation).then((res) => {
		// console.debug('Merge Locale:', locale.code);
		i18n.mergeLocaleMessage(locale.code, res.data || {});
	}).catch(err => console.error(err));

	api.get(process.env.VUE_APP_BASE_URL + 'locale/locale.json').then(res => {
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
		path: '/iframe/',
		name: 'frame',
		props: { isNav: true, lang: '' },
		meta: { layout: layoutIframe },
		component: () => import(/* webpackChunkName: "frame" */ '@/views/frame.vue'),
		children: [
			{
				path: 'greece-key-by-region-table',
				name: 'greece-key-by-region-table',
				props: {},
				meta: { iframe: true },
				component: () => import(/* webpackChunkName: "d-frame" */ '@/components/iframes/greece-key-by-region-table.vue')
			},
			{
				path: 'greece-vaccines-by-region-table',
				name: 'greece-vaccines-by-region-table',
				props: {},
				meta: { iframe: true },
				component: () => import(/* webpackChunkName: "d-frame" */ '@/components/iframes/greece-vaccines-by-region-table.vue')
			},
			{
				path: 'greece-key-by-municipality-table',
				name: 'greece-key-by-municipality-table',
				props: {},
				meta: { iframe: true },
				component: () => import(/* webpackChunkName: "d-frame" */ '@/components/iframes/greece-key-by-municipality-table.vue')
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
				path: 'greece-add-dis-bar',
				name: 'greece-add-dis-bar',
				props: {},
				meta: { iframe: true },
				component: () => import(/* webpackChunkName: "d7-line" */ '@/components/iframes/greece-add-dis-bar.vue')
			},
			{
				path: 'greece-vac-doses-stacked',
				name: 'greece-vac-doses-stacked',
				props: {},
				meta: { iframe: true },
				component: () => import(/* webpackChunkName: "d7-line" */ '@/components/iframes/greece-vac-doses-stacked.vue')
			},
			{
				path: 'greece-pandemic-per-age-stacked',
				name: 'greece-pandemic-per-age-stacked',
				props: {},
				meta: { iframe: true },
				component: () => import(/* webpackChunkName: "d7-subplot" */ '@/components/iframes/greece-pandemic-per-age-stacked.vue')
			},
			{
				path: 'greece-key-subplot-regions',
				name: 'greece-key-subplot-regions',
				props: {},
				meta: { iframe: true },
				component: () => import(/* webpackChunkName: "d7-subplot" */ '@/components/iframes/greece-key-subplot-regions.vue')
			},
			{
				path: 'greece-tests-daily-agg-bar',
				name: 'greece-tests-daily-agg-bar',
				props: {},
				meta: { iframe: true },
				component: () => import(/* webpackChunkName: "d7-line" */ '@/components/iframes/greece-tests-daily-agg-bar.vue')
			},
			{
				path: 'map-view-municipalities',
				name: 'map-view-municipalities',
				props: { lang: '' },
				meta: { iframe: true },
				component: () => import(/* webpackChunkName: "map-view-municipalities" */ '@/components/iframes/map-view-municipalities.vue')
			},
			{
				path: 'map-view-cases',
				name: 'map-view-cases',
				props: { lang: '' },
				meta: { iframe: true },
				component: () => import(/* webpackChunkName: "map-view-cases" */ '@/components/iframes/map-view-cases.vue')
			},
			{
				path: 'map-view-vaccinations',
				name: 'map-view-vaccinations',
				props: { lang: '' },
				meta: { iframe: true },
				component: () => import(/* webpackChunkName: "map-view-vaccinations" */ '@/components/iframes/map-view-vaccinations.vue')
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
	base: process.env.VUE_APP_BASE_URL,
	scrollBehavior (to, from, savedPosition) {
		if (savedPosition) {
			return savedPosition;
		} else {
			return { x: 0, y: 0 };
		}
	},
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

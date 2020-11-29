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
			{
				path: 'greece-cases-by-7d-line-events-intubated',
				name: 'greece-cases-by-7d-line-events-intubated',
				props: {},
				meta: { iframe: true },
				component: () => import(/* webpackChunkName: "d7-line" */ '@/components/iframes/greece-cases-by-7d-line-events-intubated.vue')
			},
			{
				path: 'greece-cases-by-7d-line-events',
				name: 'greece-cases-by-7d-line-events',
				props: {},
				meta: { iframe: true },
				component: () => import(/* webpackChunkName: "d7-line" */ '@/components/iframes/greece-cases-by-7d-line-events.vue')
			},
			{
				path: 'greece-cases-by-7d-line',
				name: 'greece-cases-by-7d-line',
				props: {},
				meta: { iframe: true },
				component: () => import(/* webpackChunkName: "d7-line" */ '@/components/iframes/greece-cases-by-7d-line.vue')
			},
			{
				path: 'greece-cases-by-region',
				name: 'greece-cases-by-region',
				props: {},
				meta: { iframe: true },
				component: () => import(/* webpackChunkName: "d-frame" */ '@/components/iframes/greece-cases-by-region.vue')
			},
			{
				path: 'greece-tests-by-7d-line-events',
				name: 'greece-tests-by-7d-line-events',
				props: {},
				meta: { iframe: true },
				component: () => import(/* webpackChunkName: "d7-line" */ '@/components/iframes/greece-tests-by-7d-line-events.vue')
			},
			{
				path: 'global-cases-by-country',
				name: 'global-cases-by-country',
				props: {},
				meta: { iframe: true },
				component: () => import(/* webpackChunkName: "d-frame" */ '@/components/iframes/global-cases-by-country.vue')
			},
			{
				path: 'global-cases-by-7d-line',
				name: 'global-cases-by-7d-line',
				props: {},
				meta: { iframe: true },
				component: () => import(/* webpackChunkName: "d7-line" */ '@/components/iframes/global-cases-by-7d-line.vue')
			},
			{
				path: 'global-cases-by-7d-line-no-events',
				name: 'global-cases-by-7d-line-no-events',
				props: {},
				meta: { iframe: true },
				component: () => import(/* webpackChunkName: "d7-line" */ '@/components/iframes/global-cases-by-7d-line-no-events.vue')
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

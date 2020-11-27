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
		component: () => import(/* webpackChunkName: "frame" */ '@/views/frame.vue')
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

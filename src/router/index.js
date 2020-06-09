import Vue from 'vue';
import VueRouter from 'vue-router';
import i18n from '@/locale';
import vuetify from '@/plugins/vuetify';

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
		props: { isNav: true, lang: ''  },
		component: () => import(/* webpackChunkName: "stats" */ '@/views/stats.vue')
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
	const lang = to.query.lang;
	if (lang && lang !== i18n.locale) {
		i18n.locale = lang;
		vuetify.framework.lang.current = lang;
	}

	if (!hasQueryParams(to) && hasQueryParams(from)) {
		next({name: to.name, query: from.query});
	}
	return next();
});

export default router;

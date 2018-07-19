import Vue from 'vue';
import store from '@/store';
import Meta from 'vue-meta';
import routes from './routes';
import Router, { RouterOptions, Route, RouteRecord, RawLocation } from 'vue-router';
import { sync } from 'vuex-router-sync';
import { PositionResult, RouteConfig, Position, NavigationGuard } from 'vue-router/types/router';
import Auth from '@/auth';
// import { getToken } from '@/utils/auth' // getToken from cookie

Vue.use(Meta);
Vue.use(Router);

/**
 * Redirect to login if guest.
 *
 * @param  {RouteConfig[]} routes
 * @return {Array}
 */
type Guard = (arg: RouteConfig[]) => RouteConfig[];


const authGuard: Guard = (routes) => {
	return beforeEnter(routes, (to, from, next) => {
		// if (!getToken()) {
		//   next({
		//     name: 'login',
		//     query: { redirect: to.fullPath }
		//   })
		// } else {
		//   next()
		// }
		next();
	});
};

/**
 * Redirect home if authenticated.
 *
 * @param  {RouteConfig[]} routes
 * @return {Array}
 */
const guestGuard: Guard = (routes: RouteConfig[]) => {
	return beforeEnter(routes, (to, from, next) => {
		next();
	});
};


const router = make(
	routes({ authGuard, guestGuard }),
);

sync(store, router);

export default router;

/**
 * Create a new router instance.
 *
 * @param  {RouteConfig[]} routes
 * @return {Router}
 */
function make(routes: RouteConfig[]) {
	const router = new Router({
		routes,
		scrollBehavior,
		mode: 'history',
	});

	const auth = new Auth(router);
	auth.attempt(setLayout);

	return router;
}

/**
 * Set the application layout from the matched page component.
 *
 * @param {Router} router
 * @param {Route} to
 */
export type SetLayout = (router: Router, to: Route) => void;

function setLayout(router: Router, to: Route) {
	// Get the first matched component.
	router.onReady(() => {
		const [component] = router.getMatchedComponents({ ...to });
		if (component) {
			router.app.$nextTick(() => {
			// Start the page loading bar.
				if ((component as any).loading !== false) {
					(router.app as any).start();
				}
				// Set application layout.
				(router.app as any).setLayout((component as any).layout || '');
			});
		}
	});
}


/**
 * Apply beforeEnter guard to the routes.
 *
 * @param  {RouteConfig[]} routes
 * @param  {Function} beforeEnter
 * @return {Array}
 */
function beforeEnter(routes: RouteConfig[], beforeEnter: NavigationGuard): RouteConfig[] {
	return routes.map((route) => {
		return { ...route, beforeEnter };
	});
}

/**
 * @param  {Route} to
 * @param  {Route} from
 * @param  {Object|undefined} savedPosition
 * @return {Object}
 */

type ScrollBehavior = (
		to: Route,
		from: Route,
		savedPosition: Position | void,
	) => PositionResult | Promise<PositionResult>;

// tslint:disable-next-line:max-line-length
const  scrollBehavior: ScrollBehavior = (to, from, savedPosition) => {
	if (savedPosition) {
		return savedPosition;
	}

	const position: any = {};

	if (to.hash) {
		position.selector = to.hash;
	}

	if (to.matched.some((m) => m.meta.scrollToTop)) {
		position.x = 0;
		position.y = 0;
	}

	return position;
};

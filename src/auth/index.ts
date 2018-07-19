import store from '@/store';
import Cookies from 'js-cookie';
import Router from 'vue-router';
import { SetLayout } from '../router/index';
const TokenKey = 'Admin-Token';


export default class Auth {
	public router: Router;
	public store: any;

	constructor(router: Router) {
		this.router = router;
		this.store = store;
	}

	get token() {
		return Cookies.get(TokenKey);
	}

	get roles() {
		return this.store.getters.roles;
	}

	get addRouters() {
		return this.store.getters.addRouters;
	}

	set addRouters(routers) {
		const addRouters = routers || this.addRouters;
		(this.router as any).addRouters(addRouters);
	}

	// public hasPermission(roles, permissionRoles) {
	// 	if (roles.indexOf('admin') >= 0) { return true; } // admin permission passed directly
	// 	if (!permissionRoles) { return true; }
	// 	return roles.some((role) => permissionRoles.indexOf(role) >= 0);
	// }

	public attempt(setLayout: SetLayout) {
		this.beforeEach(setLayout);

		this.afterEach();
	}

	public beforeEach(setLayout: SetLayout) {
		this.router.beforeEach(async (to, from, next) => {
			// if (this.token) {
			// 	if (this.roles.length === 0) {
			// 		try {
			// 			const { data: { roles }} = await this.store.dispatch('user/GetUserInfo');
			//    		await this.store.dispatch('permission/GenerateRoutes', { roles });
			//    		this.addRouters();
			//    		setLayout(this.router, to);
			// 			next({ ...to, replace: true });
			// 		} catch (error) {
			// 			await store.dispatch('user/FedLogOut');
			// 			setLayout(this.router, to);
			// 			next({ path: '/' });
			// 		}
			// 	} else {
			// 		// 没有动态改变权限的需求可直接next() 删除下方权限判断 ↓
			// 		if (this.hasPermission(this.roles, to.meta.roles)) {
			// 			setLayout(this.router, to);
			// 			next(); //
			// 		} else {
			// 			setLayout(this.router, to);
			// 			next({ path: '/401', replace: true, query: { noGoBack: true }});
			// 		}
			// 	// 可删 ↑
			// 	}
			// } else {
				setLayout(this.router, to);
				next();
			// }
		});
	}

	public afterEach() {
		this.router.afterEach((to, from) => {
			const { app } = this.router;
			app.$nextTick(() => {
				app.$bus.$emit('linear:start');
			});
		});
	}
}

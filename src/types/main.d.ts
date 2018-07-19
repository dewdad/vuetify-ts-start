import {LoDashStatic} from 'lodash';
import { EventBus } from '@/plugins/event';

declare global {
	const _: LoDashStatic;
}

declare module 'vue/types/vue' {
	interface Vue {
$bus: EventBus;
	}
}

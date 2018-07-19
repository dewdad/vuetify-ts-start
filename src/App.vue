<template>
    <div id="app">
        <v-loading ref="loading"></v-loading>
        <transition name="page" mode="out-in">
            <component v-if="layout" :is="layout.default"></component>
        </transition>
    </div>
</template>

<script lang="ts">
const requireContext = require.context('./layouts', false, /.*\.vue$/);
const layouts: any = requireContext.keys()
	.map((file) =>
		[file.replace(/(^.\/)|(\.vue$)/g, ''), requireContext(file)],
	)
	.reduce((components, [name, component]) => {
		(components as any)[name] = component;
		return components;
	}, {});

import { Component, Vue } from 'vue-property-decorator';
import Linear from '@/components/loading/Linear.vue';
@Component({
	components: {
		'v-loading': Linear,
	},
})
export default class App extends Vue {

	public $refs!: {
		loading: Linear,
	};

	public layout: any = null;
	public defaultLayout: string = 'app';

	public metaInfo() {
		const appName = 'bestkit erp';

		return {
			title: appName,
			titleTemplate: `%s · ${appName}`,
		};
	}

	public setLayout(layout: string): void {
		if (!layout || !layouts[layout]) {
			layout = this.defaultLayout;
		}
		this.layout = layouts[layout];
	}

	public start() {
		this.$refs.loading.start();
	}

	public finish() {
		this.$refs.loading.finish();
	}

}
</script>
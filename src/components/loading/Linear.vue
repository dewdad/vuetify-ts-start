<template>
  <v-progress-linear
    v-model="percent"
    height="2"
    v-show="show"
    :color="canSuccess ? color : failedColor"
  >
  </v-progress-linear>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
})
export default class Linear extends Vue {
		public percent = 0;
		public show = false;
		public canSuccess = true;
		public duration = 3000;
		public color = 'accent';
		public failedColor = 'error';
		private timer: any;
		private cut: any;

		public start() {
			this.show = true;
			this.canSuccess = true;
			if (this.timer) {
				clearInterval(this.timer);
				this.percent = 0;
			}
			this.cut = 10000 / Math.floor(this.duration);
			this.timer = setInterval(() => {
				this.increase(this.cut * Math.random());
				if (this.percent > 95) {
					this.finish();
				}
			}, 100);
			return this;
		}

		public set(num: number) {
			this.show = true;
			this.canSuccess = true;
			this.percent = Math.floor(num);
			return this;
		}

		public get() {
			return Math.floor(this.percent);
		}

		public increase(num: number) {
			this.percent = this.percent + Math.floor(num);
			return this;
		}

		public decrease(num: number) {
			this.percent = this.percent - Math.floor(num);
			return this;
		}

		public finish() {
			this.percent = 100;
			this.hide();
			return this;
		}

		public pause() {
			clearInterval(this.timer);
			return this;
		}

		public hide() {
			clearInterval(this.timer);
			this.timer = null;
			setTimeout(() => {
				this.show = false;
				Vue.nextTick(() => {
					setTimeout(() => {
						this.percent = 0;
					}, 200);
				});
			}, 500);
			return this;
		}

		public fail() {
			this.canSuccess = false;
			return this;
		}
}
</script>
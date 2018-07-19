<template>
	<v-app>
		<drawer></drawer>
		<toolbar></toolbar>
		<v-content>
			<app-main></app-main>
			<footerbar></footerbar>
		</v-content>
		<snackbar></snackbar>
	</v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
})
export default class AppComponent extends Vue {

}
</script>
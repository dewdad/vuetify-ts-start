<template>
    <div id="app">
      <v-app>
        <v-loading ref="loading"></v-loading>
        <transition name="page" mode="out-in">
            <component v-if="layout" :is="layout.default"></component>
        </transition>
        <loading-progress></loading-progress>
      </v-app>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Linear from '@/components/loading/Linear.vue'
import LoadingProgress from '@/components/loading/Progress.vue'

const requireContext = require.context('./layouts', false, /.*\.vue$/)
const layouts: any = requireContext.keys()
  .map(file =>
    [file.replace(/(^.\/)|(\.vue$)/g, ''), requireContext(file)])
  .reduce((components, [name, component]) => {
    (components as any)[name] = component
    return components
  }, {})
@Component({
  components: {
  'v-loading': Linear,
  'loading-progress':LoadingProgress
  },
  })
export default class App extends Vue {
  public $refs!: {
    loading: Linear,
  };

  public layout: any = null;
  public defaultLayout: string = 'app';

  public metaInfo () {
    const appName = 'bestkit erp'

    return {
      title: appName,
      titleTemplate: `%s · ${appName}`
    }
  }

  public mounted () {
    this.$bus.$on('linear:start', this.start, this)
    this.$bus.$on('linear:finish', this.finish, this)
    this.$bus.$on('setLayout', (layout: string) => {
      this.setLayout(layout)
    }, this)
  }

  private setLayout (layout: string): void {
    if (!layout || !layouts[layout]) {
      layout = this.defaultLayout
    }
    this.layout = layouts[layout]
  }

  private start () {
    this.$refs.loading.start()
  }

  private finish () {
    this.$refs.loading.finish()
  }
}
</script>

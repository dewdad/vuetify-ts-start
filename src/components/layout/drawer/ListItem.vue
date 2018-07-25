<script lang="tsx">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { VNode, VNodeChildren } from 'vue'
@Component({
  })
export default class ListItem extends Vue {
  @Prop(Array) routes!:any[]

  // 创建单个 一级
  createItem (item: any, parent: any) {
    return (
      <v-list-tile exact to={{ name: item.name }}>
        {!parent && this.createIcon(item)}
        <v-list-tile-content>
          <v-list-tile-title>{item.meta.title}</v-list-tile-title>
        </v-list-tile-content>
        {parent && this.createIcon(item)}

      </v-list-tile>
    )
  }

  // 创建组 一级组
  createItems (item: any, parent: any): VNode {
    return (
      <v-list-group
        no-action
        prependIcon={parent ? '' : item.meta.icon}
        subGroup={!!parent}
      >
        <v-list-tile slot='activator'>
          <v-list-tile-content>
            <v-list-tile-title>{item.meta.title}</v-list-tile-title>
          </v-list-tile-content>
          {parent && this.createIcon(item)}
        </v-list-tile>
        {this.createEle(item.routes, item)}
      </v-list-group>
    )
  }

  createIcon (item: any) {
    return _.has(item, 'meta.icon') ? (
      <v-list-tile-action>
        <v-icon>{item.meta.icon}</v-icon>
      </v-list-tile-action>
    ) : []
  }

  createEle (items: any[], parent = null): VNodeChildren {
    return _.map(items, (item) => {
      if (_.has(item, 'routes')) {
        return this.createItems(item, parent)
      }
      return this.createItem(item, parent)
    })
  }

  render (): VNode {
    return (<div>{this.createEle(this.routes)}</div>)
  }
}
</script>

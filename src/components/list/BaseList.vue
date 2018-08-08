<script lang="tsx">
import { Component, Vue, Prop, Model } from 'vue-property-decorator'
import BaseListItem from './BaseListItem.vue'
@Component({
  components:{
  'base-list-item':BaseListItem
  }
  })
export default class BaseList extends Vue {
  @Model('input', {type: Object, default: () => null}) actived!:object
  @Prop({type: Array, default: () => []}) items!:any[]

  active:any = null

  onActiveChange (item:any) {
    console.log(item)
    // this.$emit('input',item)
  }

  render () {
    const node = this.items.map(item => <base-list-item deep={1} item={item} actived={this.actived} onActive={(item:any) => this.$emit('input', item)}></base-list-item>)
    return <v-list expand>{node}</v-list>
  }
}
</script>

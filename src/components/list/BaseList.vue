<script lang="tsx">
import { Component, Vue, Prop } from 'vue-property-decorator'
import BaseListItem from './BaseListItem.vue'
@Component({
  components:{
  'base-list-item':BaseListItem
  }
  })
export default class BaseList extends Vue {
  @Prop({type: Array, default: () => []}) items!:any[]

  render () {
    const node = this.items.map(item => <base-list-item deep={1} item={item}></base-list-item>)
    return <div>{node}</div>
  }
}
</script>

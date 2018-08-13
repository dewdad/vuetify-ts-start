<template>
  <form-item-card name="属性组">
      <v-layout row wrap>
        <v-flex xs6 sm3 md3 v-for="group in groups" :key="group.id">

          <v-checkbox :readonly="readonly" :disabled="disabled"  v-model="groupIds" :label="group.name" :value="group.id">
            <v-tooltip slot="prepend" fixed bottom>
              <v-icon v-if="group.variant" slot="activator"  color="primary">build</v-icon>
              <v-icon v-else slot="activator" >info</v-icon>
              <div>
                <ul>
                  <li v-for="(item,key) in group" :key="key">
                    <i>{{key}}</i>
                    <i>:{{item}}</i>
                  </li>
                </ul>
              </div>
            </v-tooltip>
          </v-checkbox>

        </v-flex>
      </v-layout>
  </form-item-card>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { AttributeGroup } from '@/store/modules/attributeGroup'
import FormItemCard from '@/components/card/FormItemCard.vue'
@Component({
  components:{
  'form-item-card':FormItemCard
  }
  })
export default class RelationAttributeGroupForm extends Vue {
  @Prop(Array) orginFormData!:number[]
  @Prop(Boolean) disabled!:boolean
  @Prop(Boolean) readonly!:boolean
  groups:any[] = []

  loaded = false

  groupIds:number[] = []

  async fetchGroups () {
    const {data} = await AttributeGroup.index()
    this.groups = data
  }

  get getGroupIds () {
    return this.groupIds
  }

  clear () {
    this.groupIds = _.cloneDeep(this.orginFormData)
    this.$validator.reset()
  }

  async created () {
    await this.fetchGroups()
    if (this.orginFormData) {
      this.groupIds = _.cloneDeep(this.orginFormData)
    }
    this.loaded = true
  }
}
</script>

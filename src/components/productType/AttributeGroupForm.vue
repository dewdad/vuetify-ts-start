<template>
  <v-form :value="true" ref='group' lazy-validation v-if="loaded">
    <v-container grid-list-xs>
      <v-layout row wrap>
        <v-flex xs12>
        <v-card>
          <v-card-title primary-title>
            <div>
              <div class='headline'>包含属性</div>
              <!-- {this.orginFormData && time && <span class='grey--text'>{'更新时间' + ':' + time}</span>} -->
            </div>
          </v-card-title>
          <v-card-text>
            <v-layout row wrap>
              <v-flex xs6 sm3 md3 v-for="group in groups" :key="group.id">
                <v-checkbox  v-model="groupIds" :label="group.name" :value="group.id"></v-checkbox>
              </v-flex>
            </v-layout>
          </v-card-text>

        </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-form>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { AttributeGroup } from '@/store/modules/attributeGroup'

@Component({
  })
export default class RelationAttributeGroupForm extends Vue {
  @Prop(Array) orginFormData!:number[]
  groups:any[] = []

  loaded = false

  groupIds:number[] = []

  async fetchGroups () {
    const {data} = await AttributeGroup.getInstance.index()
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

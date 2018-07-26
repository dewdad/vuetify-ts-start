<template>
  <v-form :value="true"
          ref='group'
          lazy-validation
          >
    <v-container grid-list-xs>
      <v-layout row
                wrap>
        <v-flex xs12>
          <v-card>
            <v-card-title primary-title>
              <div>
                <div class='headline'>{{name}}</div>
                <!-- <span class='grey--text'>{'更新时间' + ':' + time}</span> -->
              </div>
            </v-card-title>
            <v-card-text>
              <slot></slot>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-form>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class FormItemCard extends Vue {
  @Prop({default: '元素标题', type: String})
  name!:string
}
</script>

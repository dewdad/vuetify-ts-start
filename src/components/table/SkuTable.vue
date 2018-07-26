<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="items"
    >
      <template slot="items" slot-scope="props">

        <td class="text-xs-right" v-for="variant in props.item" :key="variant.group_name+ '' +variant.value_name">{{ variant.value_name }}</td>

      </template>
      <template slot="pageText" slot-scope="{ pageStart, pageStop }">
        From {{ pageStart }} to {{ pageStop }}
      </template>
    </v-data-table>

    <v-snackbar v-model="snack" :timeout="3000" :color="snackColor">
      {{ snackText }}
      <v-btn flat @click="snack = false">Close</v-btn>
    </v-snackbar>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class SkuTable extends Vue {
  @Prop(Array) items!:any[]

  snack= false;
  snackColor= '';
  snackText= '';
  max25chars= (v:any) => v.length <= 25 || 'Input too long!';
  pagination= {};
  headers= [
    {
      text: 'Dessert (100g serving)',
      align: 'left',
      sortable: false,
      value: 'name'
    },
    {text: 'Calories', value: 'calories'},
    {text: 'Fat (g)', value: 'fat'},
    {text: 'Carbs (g)', value: 'carbs'},
    {text: 'Protein (g)', value: 'protein'},
    {text: 'Iron (%)', value: 'iron'}
  ]

  save () {
    this.snack = true
    this.snackColor = 'success'
    this.snackText = 'Data saved'
  }
  cancel () {
    this.snack = true
    this.snackColor = 'error'
    this.snackText = 'Canceled'
  }
  open () {
    this.snack = true
    this.snackColor = 'info'
    this.snackText = 'Dialog opened'
  }
  close () {
    console.log('Dialog closed')
  }
}
</script>

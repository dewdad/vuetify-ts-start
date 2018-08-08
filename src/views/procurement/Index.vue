<template>
  <v-layout fill-height  justify-center>
  <v-flex xs12 sm 12 md12 lg8 xl8>
    <v-card>
      <v-card-title>采购管理</v-card-title>
      <v-card-text>
        <v-flex>
          <v-btn @click="click(1)">id1</v-btn>
          <v-btn @click="click(2)">id2</v-btn>
        </v-flex>
      </v-card-text>
    </v-card>
  </v-flex>
  </v-layout>
</template>

<script>
export default{
  data () {
    return {
      queryId: 0
    }
  },
  methods: {
    click (id) {
      this.queryId = id
    }
  },
  watch: {
    'queryId': function (val) {
      this.$router.push({path: this.$route.path, query: {id: val}})
    }
  },
  mounted () {
    console.log('mounted')
  }
}
</script>

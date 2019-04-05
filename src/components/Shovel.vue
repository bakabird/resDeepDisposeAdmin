<template>
  <div class='shovel' v-if="rdd">
    <!-- 你正在修改这个条目 -->
    <button @click="wholeInspection">🐞全体检查！</button>
    <div><input type="button" value="添加一个默认项" @click="addItem"></div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import axios from 'axios'
import cloneDeep from 'lodash.clonedeep';
import moment from 'moment'

const now = moment()

@Component({
  computed: {
    rdd() {
      return this.$store.state.rdd
    }
  },
  methods: {
    async addItem() {
      try {
        const currentTime = moment();
        const rock: any = {
          mainUrl: '/izone/',
          name: '施工中',
          date: currentTime.format('YY-MM-DD'),
          members: '',
          tag: '综艺',
          site: 'B站',
          itemType: 'note'
        }
        const response = await axios.post(Vue.rootPath + '/izone/add', rock);
        if (response.status === 200) {
          this.$emit('flash')
        }
      } catch (error) {
        console.error(error);
      }
    },
    async wholeInspection() {
      axios.get(Vue.rootPath + '/izone/wholeInspection')
      .then(res => {
        console.log(res)
      })
      .catch(err => {
        console.error(err)
      })
    }
  }
})
export default class Shovel extends Vue {
}
</script>

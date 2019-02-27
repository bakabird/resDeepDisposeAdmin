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
        const now = moment();
        const rock: any = {
          mainUrl: '/izone/',
          name: '施工中',
          date: now.format('YY-MM-DD'),
          members: '',
          tag: '综艺',
          site: 'B站',
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.shovel{
  position: fixed;
  bottom: 0;
  left: 0;
  max-height: 200px;
  overflow: auto;
  // text-align: left;
  background: #fff;
  width: 100vw;
}
.handle{
  background: yellow;
  width: 100vw;
  height:30px;
  line-height: 30px;
  position: absolute;
  top:-30px;
  left: 0;
}
input[type='text']{
  max-width: 400px;
  width: 100%;
}
.longInput{
  width: 400px;
}
.taijiBtn{
  background: none;
  border:none;
}
</style>

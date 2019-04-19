<template>
  <div class='shovel' v-if="rdd">
    <!-- 你正在修改这个条目 -->
    <button @click="wholeInspection">🐞全体检查！</button>
    <div><input type="button" value="添加一个默认项" @click="addItem"></div>

    <Criteria v-if="editCriteria" :criteriaString='criteriaString' @revise='updateCriteria' @hide='editCriteria = false'/>
    <button v-else @click="editCriteria = true">对分类规则进行调整</button>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import axios from 'axios'
import cloneDeep from 'lodash.clonedeep';
import Criteria from './Criteria.vue'
import moment from 'moment'

const now = moment()

@Component({
  data(){
    return {
      editCriteria: false
    }
  },
  computed: {
    rdd() {
      return this.$store.state.rdd
    }
  },
  components:{
    Criteria
  },
  props:{
    criteriaString:{
        type: String,
        required: true
    }
  },
  methods: {
    updateCriteria(newCriteriaString){
      try{
        JSON.parse(newCriteriaString)
        axios.post(Vue.rootPath + '/util/setVal',{
          key: 'izoniCriteria',
          value: newCriteriaString
        }).then((re)=>{
          console.log('修改完成')
        }).catch(err => {
          console.error(err)
        })
      }catch(err){
        console.error(err)
      }
      
    },
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

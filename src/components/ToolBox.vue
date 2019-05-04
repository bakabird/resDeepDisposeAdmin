<template>
  <div class='shovel' v-if="rdd">
    <!-- 你正在修改这个条目 -->
    <div class="btnGroup">
      <input class="actionBtn" type="button" value="添加一个默认项" @click="addItem">
      <input class="actionBtn" type="button" value='刷新数据' @click="$emit('flash')">
    </div>

    <Criteria v-if="editCriteria" :criteriaString='criteriaString' @revise='updateCriteria' @hide='editCriteria = false'/>
    <div class='btnGroup' v-else>
      <button class="showUpBtn"  @click="editCriteria = true">对分类规则进行调整</button>
    </div>
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
  data() {
    return {
      editCriteria: false
    }
  },
  computed: {
    rdd() {
      return this.$store.state.rdd
    }
  },
  components: {
    Criteria
  },
  props: {
    criteriaString: {
        type: String,
        required: true
    }
  },
  methods: {
    updateCriteria(newCriteriaString) {
      try {
        JSON.parse(newCriteriaString)
        axios.post(Vue.rootPath + '/util/setVal', {
          key: 'izoniCriteria',
          string: newCriteriaString
        }).then((re) => {
          Vue.log('修改完成')
        }).catch(err => {
          Vue.error(err)
        })
      } catch (err) {
        Vue.error(err)
      }

    },
    async addItem() {
      try {
        const response = await axios.post(Vue.rootPath + '/izoneAdmin/new');
        if (response.status === 200) {
          this.$emit('flash')
        }
      } catch (error) {
        Vue.error(error);
      }
    }
  }
})
export default class Shovel extends Vue {
}
</script>

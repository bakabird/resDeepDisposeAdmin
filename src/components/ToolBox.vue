<template>
  <div class='shovel'>
    <!-- 你正在修改这个条目 -->
    <div class="btnGroup">
      <input class="actionBtn" type="button" value="添加一个默认项" @click="addItem">
      <input class="actionBtn" type="button" value='刷新数据' @click="$emit('flash')">
    </div>

    <Criteria v-if="editCriteria" :criteriaString='criteriaString' @revise='updateCriteria'
      @hide='editCriteria = false' />
    <div class='btnGroup' v-else>
      <button class="showUpBtn" @click="editCriteria = true">对分类规则进行调整</button>
    </div>
  </div>
</template>

<script lang="ts">
import {
  Component,
  Prop,
  Vue,
  Mixins,
} from 'vue-property-decorator';
import axios from 'axios'
import cloneDeep from 'lodash.clonedeep';
import Criteria from './Criteria.vue'
import moment from 'moment'
import IZONIVue from '../IZONIVue';

const now = moment()


@Component({
  components: {
    Criteria
  }
})
export default class ToolBox extends Mixins(IZONIVue) {
  public editCriteria: boolean = false
  @Prop({
    type: String,
    required: true
  }) public criteriaString: string;

  public updateCriteria(newCriteriaString) {
    try {
      JSON.parse(newCriteriaString)
      axios.post(this.ROOTPATH + '/util/setVal', {
        key: 'izoniCriteria',
        string: newCriteriaString
      }).then((re) => {
        this.$LOG('修改完成')
      }).catch(err => {
        this.$ERROR(err)
      })
    } catch (err) {
      this.$ERROR(err)
    }
  }
  public async addItem() {
    try {
      const re = await axios.post(this.ROOTPATH + '/izoneAdmin/new');
      if (re.data.errno === 0) {
        // setTimeout(()=>{
        //   this.$nextTick(()=>{
        this.$emit('flash')
        //   })
        // },1100)
      }
    } catch (error) {
      this.$ERROR(error);
    }
  }
}
</script>
<template>
  <div v-if="rdd">
    <div><input type="button" value="添加一个默认项" @click="addItem"></div>
    <div v-if="revising">
      <div>
        site <input type="text" v-model="rock.site">
        <div>
          <input type="button" v-for="i in sites" :key="'siteBtn' + i" :value="i" @click="rock.site = i">
        </div>
      </div>
      <div>
        up <input type="text" v-model="rock.up">
        <div>
          <input type="button" v-for="i in ups" :key="'upBtn' + i" :value="i" @click="rock.up = i">
        </div>
      </div>
      <div>date* <input type="text" v-model="rock.date"></div>
      <div>name* <input class="longInput" type="text" v-model="rock.name"></div>
      <div>
        综艺<input type="radio" value="综艺" v-model="rock.tag">
        直播<input type="radio" value="直播" v-model="rock.tag">
        其他<input type="radio" value="其他" v-model="rock.tag">
      </div>
      <div>ep <input type="text" v-model="rock.ep"></div>
      <div>part <input type="text" v-model="rock.part"></div>
      <div>isNew <input type="checkbox" v-model="rock.isNew"></div>
      <div>
        mainUrl* <input class="longInput" type="text" v-model="rock.mainUrl">
      </div>
      <div>
        <template v-for="(val,K) in membersInfo">
          <label :for="K" :key="K + 'label'">{{val}}</label>
          <input type="checkbox" :value="K" v-model="members" :key="K + 'input'">
        </template>
        <input type="button" value="全选" @click="members = ['圆','樱','柔','椰','安','奈','权','惠','仁','彩','珉','燕']">
      </div>
      
      <div><input type="button" value="修改" @click="revise"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import axios from 'axios'
import { Rock, WipedGold } from './Api'
import cloneDeep from 'lodash.clonedeep';

@Component({
  data() {
    return {
      rock: {},
      members: [],
      membersInfo: Vue.members
    }
  },
  watch: {
    revisingObj(nVal) {
      this.$data.rock = cloneDeep(nVal)
      this.$data.rock.id = nVal.sqlId
      this.$data.members = nVal.members ? nVal.members.split('&') : []
    },
    members(nVal) {
      this.$data.rock.members = nVal.join('&')
    }
  },
  computed: {
    rdd() {
      return this.$store.state.rdd
    },
    revising() {
      return this.$store.state.revising
    },
    revisingObj() {
      return this.$store.state.revisingObj;
    }
  },
  methods: {
    async revise() {
      try {
        const obj = cloneDeep(this.$data.rock)
        obj.isNew = obj.isNew ? 1 : 0;
        const response = await axios.post(Vue.rootPath + '/izone/upt', obj);
        this.$emit('flash')
      } catch (error) {
        console.error(error);
      }
    },
    async addItem() {
      try {
        const rock: Rock = {
          mainUrl: '/izone/',
          name: '爱上IZONE',
          date: '99-99-99',
          members: '圆&樱&柔&椰&安&奈&权&惠&仁&彩&珉&燕',
          tag: '其他'
        }
        const response = await axios.post(Vue.rootPath + '/izone/add', rock);
        this.$emit('flash')
      } catch (error) {
        console.error(error);
      }
    }
  }
})
export default class Shovel extends Vue {
  @Prop() private ups!: string[];
  @Prop() private sites!: string[];
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.longInput{
  width: 400px;
}
</style>

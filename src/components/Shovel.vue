<template>
  <div class='shovel' v-if="rdd">
    <!-- 你正在修改这个条目 -->
    <div><input type="button" value="添加一个默认项" @click="addItem"></div>
    <div v-if="revising">
      <div>name* <input type="text" v-model="name"></div>
      <div>
        mainUrl* <input type="text" v-model="mainUrl">
        <button class='taijiBtn' @click="fetchInfo">☯️</button>
      </div>
      <div>date* <input type="date" v-model="date"></div>

      <div>
        <template v-for="(val,K) in membersInfo">
          <label :for="K" :key="K + 'label'">{{val}}</label>
          <input type="checkbox" :value="K" v-model="membersArr" :key="K + 'input'">
        </template>
        <input type="button" value="全选" @click="membersArr = ['圆','樱','柔','椰','安','奈','权','惠','仁','彩','珉','燕']">
      </div>

      <div>
        site <input type="text" v-model="site">
        <btnList :values="sites" name="site" v-on:biubiubiu="changeSite"/>
      </div>
      <div>
        up <input type="text" v-model="up">
        <btnList :values="ups" name="up" v-on:biubiubiu="changeUp"/>
      </div>
      <div>
        <input type="text" v-model="tag">
        <btnList :values="tags" :name="tag" v-on:biubiubiu="changeTag"/>
      </div>

      <div>
        ep <input type="number" v-model="ep">
        part <input type="number" v-model="part">
        index <input type="number" min="0" v-model="index">
      </div>
      <div>
        isCut <input type="checkbox" v-model="isCut">
        isRaw <input type="checkbox" v-model="isRaw">
        toFlash <input type="checkbox" v-model="toFlash">
      </div>
      <div><input type="button" value="修改" @click="revise"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import axios from 'axios'
import cloneDeep from 'lodash.clonedeep';
import btnList from './btnList.vue'
import moment from 'moment'

// /main/~/model/iznoi.js
function setIfHave(gold: any, rock: any, key: string) {
  if (rock.hasOwnProperty(key) && rock[key] !== undefined && rock[key] != null) {
    if (typeof rock[key] === 'boolean') { gold[key] = rock[key] ? 1 : 0 } else { gold[key] = rock[key] }
  }
}
function newTrueGold(rock: any) {
  const gold: any = {
    mainUrl: rock.mainUrl,
    name: rock.name,
    date: rock.date
  }
  setIfHave(gold, rock, 'tag')
  setIfHave(gold, rock, 'site')
  setIfHave(gold, rock, 'up')
  setIfHave(gold, rock, 'members')
  setIfHave(gold, rock, 'ep')
  setIfHave(gold, rock, 'part')
  setIfHave(gold, rock, 'isRaw')
  setIfHave(gold, rock, 'isCut')
  setIfHave(gold, rock, 'bakedTime')
  setIfHave(gold, rock, 'index')
  return gold
}

@Component({
  data() {
    return {
      name: '',
      mainUrl: '',
      date: '',
      members: '',
      up: '', site: '', tag: '',
      ep: 0, part: '', index: '',
      isCut: false, isRaw: false, toFlash: false,

      sqlId: -1,
      membersArr: [],
      membersInfo: Vue.members
    }
  },
  watch: {
    revisingObj(nVal) {
      this.$data.sqlId = nVal.sqlId

      this.$data.name = nVal.name
      this.$data.mainUrl = nVal.mainUrl
      this.$data.date = '20' + nVal.date

      this.$data.up = nVal.up
      this.$data.site = nVal.site
      this.$data.tag = nVal.tag

      this.$data.ep = nVal.ep
      this.$data.part = nVal.part
      this.$data.index = nVal.index

      this.$data.isRaw = nVal.isRaw
      this.$data.isCut = nVal.isCut

      this.$data.membersArr = nVal.members ? nVal.members.split('&') : []
    },
    membersArr(nVal) {
      this.$data.members = nVal.join('&')
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
        const gold = newTrueGold(this.$data)
        gold.id = this.$data.sqlId
        gold.date = gold.date.substring(2)
        if (this.$data.toFlash) {
          const cur = new Date()
          const now = moment();
          gold.bakedTime = now.format('YYYY-MM-DD HH:mm:ss')
        }
        const response = await axios.post(Vue.rootPath + '/izone/upt', gold);
        this.$data.isFlash = false
        this.$store.commit('reviseOver')
        this.$emit('flash')
      } catch (error) {
        console.error(error);
      }
    },
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
    async fetchInfo(){
      axios.get(Vue.rootPath + '/izone/biliInfo?url=' + this.$data.mainUrl)
      .then(res => {
        this.$data.name = res.data.data.title
        this.$data.up = res.data.data.up
      })
      .catch(err => {
        console.error(err)
      })
    },
    changeUp(nVal) {
      this.$data.up = nVal
    },
    changeTag(nVal) {
      this.$data.tag = nVal
    },
    changeSite(nVal) {
      this.$data.site = nVal
    },
  },
  components: {
    btnList
  }
})
export default class Shovel extends Vue {
  @Prop() private ups!: string[];
  @Prop() private sites!: string[];
  @Prop() private tags!: string[];
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

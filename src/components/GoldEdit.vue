<template>
  <div class="goldedit">
    <div class="cell name">
      <div>
        <label :for="`isCut_${sqlId}`">剪辑</label>
        <input type="checkbox" :id="`isCut_${sqlId}`" v-model="ISCUT">
        <input type="date" v-model="DATE">
        <label :for="`isRaw_${sqlId}`">生肉</label>
        <input type="checkbox" :id="`isRaw_${sqlId}`" v-model="ISRAW">
      </div>
      <div>
        <input class='longInput' type="text" v-model="NAME">
      </div>
      <div>
        <input class='longInput' type="text" v-model="URL">
        <button class='taijiBtn' @click="fetchInfo">☯️</button>
      </div>
      <div class="cell section">
        part <input type="text" v-model="PART">
        EP <input type="text" v-model="EP">
        排序数 <input type="text" v-model="INDEX">
      </div>
      <div class='flexWrap'>
        <div class="cell tag">
          TAG<input type="text" v-model="TAG">
          <btnList :values="tags" :name="tag" v-on:biubiubiu="changeTag"/>
        </div>
        <div class="cell from">
          SITE<input type="text" v-model="SITE">
          <btnList :values="sites" name="site" v-on:biubiubiu="changeSite"/>
        </div>
        <div class="up">
          UP<input type="text" v-model="UP">
        </div>
      </div>
      <div class="cell members">
        <template v-for="(val,K) in membersInfo">
          <label :for="`${K}_${sqlId}`" :key="K + 'label'">{{val}}</label>
          <input type="checkbox" :value="K" v-model="MEMBERARR" :id='`${K}_${sqlId}`' :key="K + 'input'">
        </template>
        <input type="button" value="全选" @click="MEMBERARR = ['圆','樱','柔','椰','安','奈','权','惠','仁','彩','珉','燕']">
        <input type="button" value="猫组" @click="MEMBERARR = ['樱','柔','椰','奈','珉']">
        <input type="button" value="分手" @click="MEMBERARR = ['圆','安','权','惠','仁','彩','燕']">
      </div>
      <div>
        <label :for="`toFlashBtn_${sqlId}`">回锅</label>
        <input type="checkbox" :id='`toFlashBtn_${sqlId}`' v-model="TOFLASH">
        <button @click="revise">完成编辑</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import btnList from './btnList.vue'
import moment from 'moment'
import axios from 'axios'

// /main/~/model/iznoi.js
function setIfHave(gold: any, gkey: string, rock: any, rkey: string) {
  if (rock.hasOwnProperty(rkey) && rock[rkey] !== undefined && rock[rkey] != null) {
    if (typeof rock[rkey] === 'boolean') { gold[gkey] = rock[rkey] ? 1 : 0 } else { gold[gkey] = rock[rkey] }
  }
}

@Component({
  components: {
    btnList
  },
  data() {
    return {
      DATE: '',
      NAME: '',
      URL: '',

      ISCUT: false,
      ISRAW: false,

      PART: -1,
      EP: -1,
      INDEX: -1,

      TAG: '',
      SITE: '',
      UP: '',
      MEMBERARR: [],
      membersInfo: Vue.members,

      TOFLASH: false
    }
  },
  computed: {
    rdd() {
      return this.$store.state.rdd
    },
  },
  methods: {
    async revise() {
      try {
        const data = this.$data
        const prop = this.$props
        const gold: any = {
          id: prop.sqlId,
          mainUrl: data.URL,
          name: data.NAME,
          tag: data.TAG,
          site: data.SITE,
          date: data.DATE.substring(2),
          up: data.UP,
          index: data.INDEX,
          members: data.MEMBERARR.join('&')
        }
        setIfHave(gold, 'ep', data, 'EP')
        setIfHave(gold, 'part', data, 'PART')
        setIfHave(gold, 'isRaw', data, 'ISRAW')
        setIfHave(gold, 'isCut', data, 'ISCUT')

        if (this.$data.TOFLASH) {
          const now = moment();
          gold.bakedTime = now.format('YYYY-MM-DD HH:mm:ss')
        }

        const response = await axios.post(Vue.rootPath + '/izone/upt', gold);
        this.$emit('finishEdit')
      } catch (error) {
        console.error(error);
      }
    },
    changeTag(nVal) {
      this.$data.TAG = nVal
    },
    changeSite(nVal) {
      this.$data.SITE = nVal
    },
    async fetchInfo() {
      axios.get(Vue.rootPath + '/izone/biliInfo?url=' + this.$data.URL)
      .then(res => {
        this.$data.NAME = res.data.data.title
        this.$data.UP = res.data.data.up
      })
      .catch(err => {
        console.error(err)
      })
    },
  },
  mounted() {
    this.$data.DATE = '20' + this.$props.date
    this.$data.NAME = this.$props.name
    this.$data.URL = this.$props.mainUrl

    this.$data.ISCUT = this.$props.isCut
    this.$data.ISRAW = this.$props.isRaw

    this.$data.PART = this.$props.part
    this.$data.EP = this.$props.ep
    this.$data.INDEX = this.$props.index

    this.$data.TAG = this.$props.tag
    this.$data.SITE = this.$props.site
    this.$data.UP = this.$props.up
    this.$data.MEMBERARR = !!this.$props.members ? this.$props.members.split('&') : []
  }
})
export default class GoldEdit extends Vue {
  @Prop() private sqlId!: number;

  @Prop() private mainUrl!: string;
  @Prop() private date!: string;
  @Prop() private name!: string;

  @Prop() private site!: string;
  @Prop() private up!: string;

  @Prop() private ep!: number;
  @Prop() private part!: number;
  @Prop() private index!: number;

  @Prop() private tag!: string;
  @Prop() private members!: string;

  @Prop() private isRaw!: boolean;
  @Prop() private isCut!: boolean;

  @Prop() private sites!: string[];
  @Prop() private tags!: string[];
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.goldedit{
  // margin-top: 0.5em;
  margin-bottom: 0.5em;
  color: #E4555B;
  background: #FAFAFA;
  border-bottom: 1px solid #c9bccc;
  position: relative;
}
.longInput{
  width: 90%;
}



.link{
  display: flex;
  // height: 2em;
  line-height: 2em;
  font-size: 1.3em;
  color: #E4555B;
  background: #ffffff;
  font-weight: bold;
  text-decoration: none;
}

.meta{
  display: flex;
  // color: #efa8ab;
  // background: #bf9e9e;
  flex-wrap: wrap;
  color: #de7579;
  overflow: hidden;
}
.link:hover{
  cursor: pointer;
}
.cell{
  width: 100%;
  // background: #efe;
}
.name{
  flex: 2;
  padding: 0 5px;
  // background: #FAFAFA;
}
.new{
  .cell{
    color: #dc4c65;
    background: #fdebea;
  }
}
.raw{
  .cell{
    background: #f0f4ee;
    color: #9cb599;
    .part, .ep, .cut{
      background: #f0f4ee;
      color: #9cb599;
    }
  }
}
.part,.ep,.cut{
  font-size: 12px;
  color: #de7579;
}
.members{
  min-width: 290px;
  flex:1;
  // border-right: 1px dashed;
}
.cut{
  flex: 1;
}

.flexWrap{
 display: flex;
 flex-wrap: wrap;
}
.up,.more{
  flex:0.9;
  min-width: 60px;
  border-top: 1px dashed;
  max-width: 100%;
}
.from{
  flex: 1;
  min-width: 60px;
  max-width: 100%;
  border-top: 1px dashed;
}
.tag{
  min-width: 200px;
  max-width: 100%;
  border-right: 1px dashed;
  flex: 0.5;
}

</style>

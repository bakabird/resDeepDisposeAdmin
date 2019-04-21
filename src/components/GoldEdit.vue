<template>
  <div class="goldedit">
      <div class="cell name">
      【{{sqlId}}】
      </div>
      <div>
        <label for='note'>纸条</label>
        <input type='radio' id='note' v-model='ITEMTYPE' value='note'/>
        <label for='clamp'>夹子</label>
        <input type='radio' id='clamp' v-model='ITEMTYPE' value='clamp'/>
        <label for='riddle'>时空洞</label>
        <input type='radio' id='riddle' v-model='ITEMTYPE' value='riddle'/>
        排序数 <input type="text" v-model="INDEX">
      </div>
      <div>
        <label :for="`isCut_${sqlId}`">剪辑</label>
        <input type="checkbox" :id="`isCut_${sqlId}`" v-model="ISCUT">
        <input type="date" v-model="DATE">
        <label :for="`isRaw_${sqlId}`">生肉</label>
        <input type="checkbox" :id="`isRaw_${sqlId}`" v-model="ISRAW">
      </div>
      <div>
        <input class='name' type="text" v-model="NAME">
        <button @click="proConfig = !proConfig">{{proConfig ? '简易' : 'PRO'}}</button>
      </div>
      <div class="cell section" v-if='proConfig'>
        part <input type="text" v-model="PART">
        EP <input type="text" v-model="EP">
      </div>
      <div class='meta' v-if='proConfig'>
        <div class="cell from">
          SITE<input type="text" v-model="SITE">
          <btnList :values="sites" name="site" v-on:biubiubiu="changeSite"/>
        </div>
        <div class="up">
          UP<input type="text" v-model="UP">
        </div>
      </div>
      <div>
        <input class='url' type="text" v-model="URL">
        <button class='taijiBtn' @click="fetchInfo">☯️</button>
      </div>
      <div class="cell tagWrap">
        <div class='curTag'>
          TAG<input type="text" v-model="TAG">
        </div>
        <div v-for="(tag,key) in tags" :key="key + '_tag_group'" class="cell tag">
          {{key}}
          <btnList :values="tag" :name="tag" v-on:biubiubiu="changeTag"/>
        </div>
      </div>
      <div class="cell members">
        <template v-for="(val,K) in membersInfo">
          <label :for="`${K}_${sqlId}`" :key="K + 'label'">{{val}}</label>
          <input type="checkbox" :value="K" v-model="MEMBERARR" :id='`${K}_${sqlId}`' :key="K + 'input'">
        </template>
        <div>
          <input type="button" value="全不选" @click="MEMBERARR = []">
          <input type="button" value="全选" @click="MEMBERARR = ['圆','樱','柔','椰','安','奈','权','惠','仁','彩','珉','燕']">
          <input type="button" value="猫组" @click="MEMBERARR = ['樱','柔','椰','奈','珉']">
          <input type="button" value="分手" @click="MEMBERARR = ['圆','安','权','惠','仁','彩','燕']">
        </div>
      </div>
      <div>
        <label :for="`toFlashBtn_${sqlId}`">回锅</label>
        <input type="checkbox" :id='`toFlashBtn_${sqlId}`' v-model="TOFLASH">
        <button @click="revise">完成编辑</button>
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

function checkThen(source, pattern, whenSucess) {
  const checkRlt = source.match(pattern)
  if (!!checkRlt) {
    whenSucess(checkRlt)
  }
}

function isOneOf(itm, arr) {
    for (const i of arr) {
        if (itm === i) {
            return true
        }
    }
    return false
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
      ITEMTYPE: '',
      membersInfo: Vue.members,

      TOFLASH: false,

      proConfig: false
    }
  },
  computed: {
    rdd() {
      return this.$store.state.rdd
    }
  },
  methods: {
    async revise() {
      try {
        const data = this.$data
        const prop = this.$props
        const gold: any = {
          id: prop.sqlId,
          itemType: data.ITEMTYPE,
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
    dateEvaluate(vname) {
      // 190417
      const dateCheck1  = '(18|19|20|21)(0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|30|31)'
      // 2019.04.17
      const dateCheck2 = '20(18|19|20|21).(0[1-9]|1[0-2]).(0[1-9]|[1-2][0-9]|30|31)'

      checkThen(vname, dateCheck1, (checkRlt) => {
        this.$data.DATE = `20${checkRlt[1]}-${checkRlt[2]}-${checkRlt[3]}`
      })
      checkThen(vname, dateCheck2, (checkRlt) => {
        this.$data.DATE = `20${checkRlt[1]}-${checkRlt[2]}-${checkRlt[3]}`
      })
    },
    metaInfoEvaluate(vname) {
      const kkuraRaido = '今夜 咲良树下'
      const hitomiRadio = 'World Get You'

      checkThen(vname, kkuraRaido, (checkRlt) => {
        this.$data.TAG = '樱花电台'
        this.$data.MEMBERARR = ['樱']
      })
      checkThen(vname, hitomiRadio, (checkRlt) => {
        this.$data.TAG = '仁美电台'
        this.$data.MEMBERARR = ['仁']
      })
    },
    async fetchInfo() {
      axios.get(Vue.rootPath + '/izone/biliInfo?url=' + this.$data.URL)
      .then(res => {
        const videoName = res.data.data.title
        const videoUp = res.data.data.up

        this.$data.NAME = videoName
        this.$data.UP = videoUp

        const that: any = this
        that.dateEvaluate(videoName)
        that.metaInfoEvaluate(videoName)
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

    this.$data.ITEMTYPE = this.$props.itemType
  }
})
export default class GoldEdit extends Vue {
  @Prop() private sqlId!: number;
  @Prop() private itemType!: string;

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
  @Prop() private tags!: {};
}
</script>
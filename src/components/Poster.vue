<template>
  <div class="bar poster" :class="{ new:!!isNew, raw:!!isRaw, inClamp: inClamp}">
    <table>
      <!-- ZERO LINE -->
      <tr>
        <template v-if='!edit'>
          <td class='name' v-if='!edit' @click="edit = true">
            {{name}}
            <span class='part' v-if="!!part">Part {{part}}</span>
            <span class='ep' v-else-if="!!ep">EP {{ep}}</span>
          </td>
        </template>
        <template v-else>
          <td class='name' :class="{'changed': name !== NAME}" colspan="3">
            <PopOutInput v-model="NAME" type='longtext' />
          </td>
          <td class='btn' @click="reset">
            重载
          </td>
          <td class='btn' @click="revise">
            修改
          </td>
          <td class='btn' @click="bake">
            回锅
          </td>
          <td class='btn' @click="remove(name)">
            删除
          </td>
        </template>
      </tr>
      <!-- FIRST LINE -->
      <template v-if='edit'>
        <tr>
          <th colspan="3" class='th_url' @click="fetchInfo">URL</th>
          <th colspan="2" class='th_tag'>Tag</th>
          <th colspan="2" class='th_date'>日期</th>
        </tr>
        <tr>
          <td :class="{'changed': mainUrl !== URL}" colspan="3">
            <PopOutInput v-model="URL" type='longtext' />
          </td>
          <td :class="{'changed': tag !== TAG}" colspan="2">
            <PopOutTagEditor v-model='TAG' :tags='tags' />
          </td>
          <td :class="{'changed': date !== DATE}" colspan="2">
            <PopOutInput v-model="DATE" />
          </td>
        </tr>
        <!-- SECOND LINE -->
        <tr>
          <th class='th_memberstr' colspan="7">MemberStr</th>
        </tr>
        <tr>
          <td :class="{'changed': members !== MEMBERS}" colspan="7">
            <PopOutMembersEditor v-model="MEMBERS" />
          </td>
        </tr>
        <!-- THIRD LINE -->
        <tr>
          <th class='th_part'>Part</th>
          <th class='th_ep'>EP</th>
          <th class='th_type'>纸条类型</th>
          <th class='th_site'>Site</th>
          <th class='th_up'>Up</th>
          <th class='th_iscut'>isCut</th>
          <th class='th_iscut'>isRaw</th>
        </tr>
        <tr>
          <td :class="{'changed': part !== PART}">
            <PopOutInput v-model.number="PART" type='number' />
          </td>
          <td :class="{'changed': ep !== EP}">
            <PopOutInput v-model.number="EP" type='number' />
          </td>
          <td :class="{'changed': itemType !== ITEMTYPE}">
            <PopOutInput v-model="ITEMTYPE" :range="allItemTypes" type='checkbox' />
          </td>
          <td :class="{'changed': site !== SITE}">
            <PopOutSiteEditor v-model="SITE" :sites='sites' />
          </td>
          <td :class="{'changed': up !== UP}">
            <PopOutInput v-model="UP" />
          </td>
          <td :class="{'changed': isCut !== ISCUT}" @click="ISCUT = !ISCUT">{{ISCUT ? '✅' : '❌'}}</td>
          <td :class="{'changed': isRaw !== ISRAW}" @click="ISRAW = !ISRAW">{{ISRAW ? '✅' : '❌'}}</td>
        </tr>
      </template>
    </table>
    <div class='elevator'>
      <div :class="{'unuseable': onHead}" @click="moveUp">⬆</div>
      <div :class="{'unuseable': onFloor}" @click="moveDown">⬇</div>
    </div>
  </div>
</template>

<script lang="ts">
  import {
    Component,
    Prop,
    Vue
  } from 'vue-property-decorator';
  import btnList from './btnList.vue'
  import PopOut from './PopOut.vue'
  import PopOutInput from './PopOutInput.vue'
  import PopOutTagEditor from './PopOutTagEditor.vue'
  import PopOutSiteEditor from './PopOutSiteEditor.vue'
  import PopOutMembersEditor from './PopOutMembersEditor.vue'

  import moment from 'moment'
  import axios from 'axios'

  const now = moment();

  function setIfHave(gold: any, gkey: string, rock: any, rkey: string) {
    if (rock.hasOwnProperty(rkey) && rock[rkey] !== undefined && rock[rkey] != null) {
      if (typeof rock[rkey] === 'boolean') {
        gold[gkey] = rock[rkey] ? 1 : 0
      } else {
        gold[gkey] = rock[rkey]
      }
    }
  }

  function checkThen(source, pattern, whenSucess) {
    const checkRlt = source.match(pattern)
    if (!!checkRlt) {
      whenSucess(checkRlt)
    }
  }


  @Component({
    data() {
      return {
        edit: false,

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
        MEMBERS: '',
        ITEMTYPE: '',
        TOFLASH: false,
        proConfig: false,

        allItemTypes: {
          note: '纸条',
          clamp: '夹子',
          riddle: '谜面'
        }
      }
    },
    computed: {
      isNew() {
        return !this.$props.isRaw && now.diff(this.$props.bakedTime, 'hour') < 36
      }
    },
    watch: {
      flashSignal() {
        const that: any = this
        that.loadPropsToDatas()
      }
    },
    components: {
      PopOut,
      PopOutInput,
      PopOutTagEditor,
      PopOutSiteEditor,
      PopOutMembersEditor,
      btnList,
    },
    methods: {
      // MOVE FUNCTION
      moveUp() {
        if (!this.$props.onHead) this.$emit('moveUp')
      },
      moveDown() {
        if (!this.$props.onFloor) this.$emit('moveDown')
      },
      // RESET
      reset() {
        const that: any = this
        that.loadPropsToDatas()
      },
      loadPropsToDatas() {
        this.$data.DATE = this.$props.date
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
        this.$data.MEMBERS = this.$props.members

        this.$data.ITEMTYPE = this.$props.itemType
      },
      record(url) {
        this.$record('跳转', this.$props.name, url, this.$props.sqlId)
      },
      dateEvaluate(vname) {
        // 190417
        const dateCheck1 = '(18|19|20|21)(0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|30|31)'
        // 2019.04.17
        const dateCheck2 = '20(18|19|20|21).(0[1-9]|1[0-2]).(0[1-9]|[1-2][0-9]|30|31)'

        checkThen(vname, dateCheck1, (checkRlt) => {
          this.$data.DATE = `20${checkRlt[1]}-${checkRlt[2]}-${checkRlt[3]}`
        })
        checkThen(vname, dateCheck2, (checkRlt) => {
          this.$data.DATE = `20${checkRlt[1]}-${checkRlt[2]}-${checkRlt[3]}`
        })
      },
      siteEvaluate(url){
        const bilibili = 'bilibili.com'
        checkThen(url, bilibili, ()=>{
          this.$data.SITE = 'B站'
        })
      },
      otherMetaInfoEvaluate(vname,vup) {
        const kkuraRaido = '今夜 咲良树下'
        checkThen(vname, kkuraRaido, (checkRlt) => {
          this.$data.TAG = '樱花电台'
          this.$data.MEMBERS = '樱'
        })

        const hitomiRadio = 'World Get You'
        checkThen(vname, hitomiRadio, (checkRlt) => {
          this.$data.TAG = '仁美电台'
          this.$data.MEMBERS = '仁'
        })

        const tsks = '凤凰天使TSKS韩剧社官方账号'
        checkThen(vup, tsks, ()=>{
          this.$data.TAG = '综艺'
        })
      },
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
            date: data.DATE,
            up: data.UP,
            index: data.INDEX,
            members: data.MEMBERS,
            ep: data.EP,
            part: data.PART,
            isRaw: data.ISRAW,
            isCut: data.ISCUT
          }

          const response = await axios.post(Vue.rootPath + '/izoneAdmin/upt', gold);
          this.$emit('finishEdit')
        } catch (error) {
          Vue.error(error);
        }
      },
      async fetchInfo() {
        axios.get(Vue.rootPath + '/izoneAdmin/biliInfo?url=' + this.$data.URL)
          .then(res => {
            const videoName = res.data.data.title
            const videoUp = res.data.data.up

            this.$data.NAME = videoName
            this.$data.UP = videoUp

            const that: any = this
            that.dateEvaluate(videoName)
            that.siteEvaluate(this.$data.URL)
            that.otherMetaInfoEvaluate(videoName,videoUp)
          })
          .catch(err => {
            Vue.error(err)
          })
      },
      async bake() {
        const rlt = await axios.post(Vue.rootPath + '/izoneAdmin/bake', {
          id: this.$props.sqlId
        })
        this.$emit('finishEdit')
      },
      async remove(posterName) {
        const input = prompt(`准备删除「${posterName}」？`, "再此重复该纸条的名称")
        if (input != null && input === posterName) {
          const response = await axios.post(Vue.rootPath + '/izoneAdmin/remove', {
            id: this.$props.sqlId
          });
          this.$emit('finishEdit')
        }
      }
    },
    mounted() {
      this.loadPropsToDatas()
    }
  })
  export default class Gold extends Vue {
    @Prop() private sqlId!: number;
    @Prop() private itemType!: string;

    @Prop() private mainUrl!: string;
    @Prop() private date!: string;
    @Prop() private name!: string;

    @Prop() private site!: string;
    @Prop() private up!: string;
    @Prop() private bakedTime!: string;

    @Prop() private ep!: number;
    @Prop() private part!: number;
    @Prop() private index!: number;

    @Prop() private tag!: string;
    @Prop() private members!: string;

    @Prop() private isRaw!: boolean;
    @Prop() private isCut!: boolean;

    // setting
    @Prop() private flashSignal!: number;
    @Prop() private inClamp!: boolean;

    @Prop() private tags!: {};
    @Prop() private sites!: [];

    // setting
    @Prop() private onHead!: boolean;
    @Prop() private onFloor!: boolean;
  }
</script>
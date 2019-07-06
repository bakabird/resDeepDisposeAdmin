<template>
  <div class="bar"
    :class="{ poster: itemType === 'note' ,new:!!isNew, raw:!!isRaw, invalid: !!invalid,
      inClamp: inClamp, clamp: itemType === 'clamp'}">
    <table>
      <!-- ZERO LINE -->
      <tr>
        <template v-if='!edit'>
          <td class='name' v-if='!edit' @click="startEdit">
            {{name}}
            <span class='part' v-if="!!part">Part {{part}}</span>
            <span class='ep' v-else-if="!!ep">EP {{ep}}</span>
          </td>
        </template>
        <template v-else>
          <td class='name' :class="{'changed': name !== NAME}" colspan="2">
            <PopOutInput v-model="NAME" type='longtext' />
          </td>
          <td class='btn' @click="reset">
            重载
          </td>
          <td class='btn cpoybtn' @click="copy">
            复制Id
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
  Vue,
  Watch
} from 'vue-property-decorator';
import btnList from './btnList.vue'
import PopOut from './PopOut/PopOut.vue'
import PopOutInput from './PopOut/PopOutInput.vue'
import PopOutTagEditor from './PopOut/PopOutTagEditor.vue'
import PopOutSiteEditor from './PopOut/PopOutSiteEditor.vue'
import PopOutMembersEditor from './PopOut/PopOutMembersEditor.vue'


import moment from 'moment'
import axios from 'axios'

const now = moment();

function checkThen(source, pattern, whenSucess) {
  const checkRlt = source.match(pattern)
  if (!!checkRlt) {
    whenSucess(checkRlt)
  }
}


@Component({
  components: {
    PopOut,
    PopOutInput,
    PopOutTagEditor,
    PopOutSiteEditor,
    PopOutMembersEditor,
    btnList,
  }
})
export default class Poster extends Vue {
  @Prop() private sqlId!: string
  @Prop() private itemType!: string

  @Prop() private mainUrl!: string
  @Prop() private date!: string
  @Prop() private name!: string

  @Prop() private site!: string
  @Prop() private up!: string
  @Prop() private bakedTime!: string;

  @Prop() private ep!: number;
  @Prop() private part!: number;

  @Prop() private tag!: string;
  @Prop() private members!: string;

  @Prop() private isRaw!: boolean;
  @Prop() private isCut!: boolean;
  @Prop() private invalid!: boolean;

  // setting
  @Prop() private flashSignal!: number;
  @Prop() private inClamp!: boolean;

  @Prop() private tags!: {};
  @Prop() private sites!: [];

  // setting
  @Prop() private onHead!: boolean;
  @Prop() private onFloor!: boolean;

  private edit: boolean = false

  private DATE: string = ''
  private NAME: string = ''
  private URL: string = ''

  private ISCUT: boolean = false
  private ISRAW: boolean = false

  private PART: number = -1
  private EP: number = -1

  private TAG: string = ''
  private SITE: string = ''
  private UP: string = ''
  private MEMBERS: string = ''

  private ITEMTYPE: string = ''

  private allItemTypes: object = {
    note: '纸条',
    clamp: '夹子',
    riddle: '谜面'
  }

  get isNew() {
    return !this.$props.isRaw && now.diff(this.$props.bakedTime, 'hour') < 36
  }

  @Watch('flashSignal')
  public watchFlashSignal() {
    const that: any = this
    that.loadPropsToDatas()
  }

  private mounted() {
    this.loadPropsToDatas()
  }

  // load props -x
  private loadPropsToDatas() {
    this.$data.DATE = this.$props.date
    this.$data.NAME = this.$props.name
    this.$data.URL = this.$props.mainUrl

    this.$data.ISCUT = this.$props.isCut
    this.$data.ISRAW = this.$props.isRaw

    this.$data.PART = this.$props.part
    this.$data.EP = this.$props.ep

    this.$data.TAG = this.$props.tag
    this.$data.SITE = this.$props.site
    this.$data.UP = this.$props.up
    this.$data.MEMBERS = this.$props.members

    this.$data.ITEMTYPE = this.$props.itemType
  }
  // load props +x

  // UI triggle -x
  private startEdit() {
    this.$data.edit = true
    if (this.$props.itemType === 'clamp') {
      this.$emit('openClamp')
    }
  }
  private reset() {
    const that: any = this
    that.loadPropsToDatas()
  }
  private copy(){
    const input = document.createElement('input')
    input.type = "text"
    input.value = this.sqlId
    document.body.append(input)
    input.select()
    document.execCommand("Copy")
    document.body.removeChild(input)
  }
  private async fetchInfo() {
    axios.get(Vue.rootPath + '/izoneAdmin/biliInfo?url=' + this.$data.URL)
      .then(res => {
        const videoName = res.data.data.title
        const videoUp = res.data.data.up

        this.$data.NAME = videoName
        this.$data.UP = videoUp

        const that: any = this
        that.dateEvaluate(videoName)
        that.siteEvaluate(this.$data.URL)
        that.otherMetaInfoEvaluate(videoName, videoUp)
      })
      .catch(err => {
        Vue.error(err)
      })
  }
  private async revise() {
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
        members: data.MEMBERS,
        ep: data.EP,
        part: data.PART,
        isRaw: data.ISRAW,
        isCut: data.ISCUT
      }

      const response = await axios.post(Vue.rootPath + '/izoneAdmin/upt', gold);
      if(response.data.errno === 0){
        this.$emit('finishEdit')
      }else{
        alert(`[${response.data.errno}]${response.data.errmsg}`)
      }
    } catch (error) {
      Vue.error(error);
    }
  }
  private async bake() {
    const rlt = await axios.post(Vue.rootPath + '/izoneAdmin/bake', {
      id: this.$props.sqlId
    })
    if(rlt.data.errno == 0){
      this.$emit('finishEdit')
    }else{
        alert(`[${rlt.data.errno}]${rlt.data.errmsg}`)
      }
  }
  private async remove(posterName) {
    const input = prompt(`准备删除「${posterName}」？`, "再此重复该纸条的名称")
    if (input != null && input === posterName) {
      const response = await axios.post(Vue.rootPath + '/izoneAdmin/remove', {
        id: this.$props.sqlId
      });
      this.$emit('finishEdit')
    }
  }
  // UI triggle +x

  // Evaluate FUNCTION -x
  private dateEvaluate(vname) {
    // 190417
    const dateCheck1 = '(18|19|20|21)(0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|30|31)'
    checkThen(vname, dateCheck1, (checkRlt) => {
      this.$data.DATE = `${checkRlt[1]}-${checkRlt[2]}-${checkRlt[3]}`
    })

    // 2019.04.17
    const dateCheck2 = '20(18|19|20|21).(0[1-9]|1[0-2]).(0[1-9]|[1-2][0-9]|30|31)'
    checkThen(vname, dateCheck2, (checkRlt) => {
      this.$data.DATE = `${checkRlt[1]}-${checkRlt[2]}-${checkRlt[3]}`
    })
  }
  private siteEvaluate(url) {
    const bilibili = 'bilibili.com'
    checkThen(url, bilibili, () => {
      this.$data.SITE = 'B站'
    })
  }
  private otherMetaInfoEvaluate(vname, vup) {
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
    checkThen(vup, tsks, () => {
      this.$data.TAG = '综艺'
    })
  }
  // Evaluate FUNCTION +x

  // MOVE FUNCTION -x
  private moveUp() {
    if (!this.$props.onHead) { this.$emit('moveUp') }
  }
  private moveDown() {
    if (!this.$props.onFloor) { this.$emit('moveDown') }
  }
  // MOVE FUNCTION +x

  // Util FUNCTION -x
  private record(url) {
    if (Vue.isDev) {
      this.$record('跳转', this.$props.name, url, this.$props.sqlId)
    }
  }
  // Util FUNCTION +x
}
</script>
<style lang="scss">
  @import "../color";


  .bar {
    position: relative;
    border-bottom: 2px solid #fff;
    background: $normal_bgcolor;

    .changed {
      background: #7eff3066;
    }
    .part,.ep{
      font-size: 12px;
    }

    table {
      border: 1px solid #ffb4b4;
      border-radius: 3px;
      width: 100%;

      .btn {
        border: none;
        background: #ffe4e580;
        color: #cb5959;
        border-radius: 4px;
        transition: .42s;
      }

      .btn:hover {
        background: #e4555bcc;
        color: #fff;
      }

      .name {
        font-size: 2em;
        font-weight: bold;
      }

      .th_url {
        background: #8aad7533;
        color: #a79898;
      }

      .th_url:hover {
        background: #5f8a47e6;
        color: #ffd1cc;
      }

      .th_type {
        background: #7589ad33;
        color: #a7a698;
      }

      .th_iscut {
        background: #a475ad33;
        color: #b3b292;
      }

      .th_part {
        background: #ad757533;
        color: #9992b3;
      }

      .th_ep {
        background: #ad9f7533;
        color: #a0b392;
      }

      .th_tag {
        background: #adac7533;
        color: #92b3b2;
      }

      .th_site {
        background: #75ad7c33;
        color: #9e92b3;
      }

      .th_up {
        background: #85a1ae33;
        color: #b3b292;
      }

      .th_memberstr {
        background: #b17da933;
        color: #b292b3;
      }

      .th_date {
        background: #c5828233;
        color: #92b3b2;
      }
    }
  }


  .poster {
    &.new {
      color: $new_color;
      background: $new_bgcolor;

      .meta {
        color: $new_meta;
      }
    }

    &.invalid {
      background: $invalid_bgcolor;
      color: $invalid_color;

      .meta {
        color: $invalid_color;
      }

      .link {
        color: $invalid_color;
      }
    }

    &.raw {
      background: $raw_bgcolor;
      color: $raw_meta;

      .meta {
        color: $raw_meta;
      }

      .link {
        color: $raw_color;
      }
    }
  }


  .inClamp {
    border-left: 20px solid #fff;
    border-right: 20px solid #fff;
    border-bottom: 2px solid #fff;
  }

  .clamp {
    background: $clamp_bgcolor;
    color: $clamp_color;

    .cell {
      color: $clamp_color;
    }

    &.clamp-open {
      background: $clamp_open_bgcolor;
      color: $clamp_open_color;
      border-bottom: none;
    }
  }

  .elevator {
    position: absolute;
    right: -50px;
    top: 0px;
    width: 26px;
    height: 38px;

    div {
      background: #fdebea;
      color: rgb(228, 85, 91);
    }

    div:hover {
      background: #ffcece;
      color: #1abeff;
    }

    div.unuseable {
      background: #f5f5f5;
      color: #e4e1e1;
    }
  }
</style>
<template>
  <div class="bar poster" :class="{ new:!!isNew, raw:!!isRaw, inClamp: inClamp}">
    <table>
      <tr>
        <template v-if='!edit'>
          <td class='name' v-if='!edit' @click="edit = true">
            {{name}}
            <span class='part' v-if="!!part">Part {{part}}</span>
            <span class='ep' v-else-if="!!ep">EP {{ep}}</span>
          </td>
        </template>
        <template v-else>
          <td class='name' colspan="3">{{NAME}}</td>
          <td class='btn' @click="reset">
            复原
          </td>
          <td class='btn' @click="revise">
            修改
          </td>
          <td class='btn'>
            回锅
          </td>
          <td class='btn'>
            删除
          </td>
        </template>
      </tr>
      <template v-if='edit'>
        <tr>
          <th colspan="3" class='th_url' @click="fetchInfo">URL</th>
          <th colspan="2" class='th_tag'>Tag</th>
          <th colspan="2" class='th_date'>日期</th>
        </tr>
        <tr>
          <td colspan="3">
            <!-- {{URL}} -->
            <PopOut @pop='autofocus("url_input")'>
              <template slot="face">
                {{URL}}
              </template>
              <template slot="body">
                <input class='url_input' v-model="URL" type="text">
              </template>
            </PopOut>
          </td>
          <td colspan="2">{{TAG}}</td>
          <td colspan="2">{{DATE}}</td>
        </tr>
        <tr>
          <th class='th_memberstr' colspan="7">MemberStr</th>
        </tr>
        <tr>
          <td colspan="6">{{memberStr}}</td>
        </tr>
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
          <td>{{PART}}</td>
          <td>{{EP}}</td>
          <td>{{ITEMTYPE}}</td>
          <td>{{SITE}}</td>
          <td>{{UP}}</td>
          <td>{{ISCUT ? '✅' : '❌'}}</td>
          <td>{{ISRAW ? '✅' : '❌'}}</td>
        </tr>
      </template>
    </table>
    <div class='elevator'>
      <div>⬆</div>
      <div :class="{'unuseable': index === 0}">⬇</div>
    </div>
  </div>
</template>

<script lang="ts">
  import {
    Component,
    Prop,
    Vue
  } from 'vue-property-decorator';
  import PopOut from './PopOut.vue'

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
      },
      memberStr() {
        let arr = this.$props.members.split('&')
        arr = arr.sort(() => {
          return Math.random() > 0.5 ? -1 : 1
        })
        let re = ''

        arr.forEach((i: string) => {
          re += Vue.members[i]
        })
        return re
      },
      isNew() {
        return !this.$props.isRaw && now.diff(this.$props.bakedTime, 'hour') < 36
      }
    },
    components: {
      PopOut
    },
    methods: {
      autofocus(className) {
        const that: any = this.$el.querySelector(`.${className}`)
        that.select()
      },
      reset() {
        const that:any = this
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
        this.$data.MEMBERARR = !!this.$props.members ? this.$props.members.split('&') : []

        this.$data.ITEMTYPE = this.$props.itemType
      },
      record(url) {
        this.$record('跳转', this.$props.name, url, this.$props.sqlId)
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

          console.log(gold)
          // const response = await axios.post(Vue.rootPath + '/izone/upt', gold);
          // this.$emit('finishEdit')
        } catch (error) {
          Vue.error(error);
        }
      },
      async fetchInfo() {
        axios.get(Vue.rootPath + '/izone/biliInfo?url=' + this.$data.URL)
          .then(res => {
            const videoName = res.data.data.title
            const videoUp = res.data.data.up

            this.$data.NAME = videoName
            this.$data.UP = videoUp

            // const that: any = this
            // that.dateEvaluate(videoName)
            // that.metaInfoEvaluate(videoName)
          })
          .catch(err => {
            Vue.error(err)
          })
      },
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
    @Prop() private inClamp!: boolean;
  }
</script>
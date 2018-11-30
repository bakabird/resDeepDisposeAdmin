<template>
  <div class="set">
    <div class='dateCard' v-for="(GoldenBall,ballIdx) in GoldenChains" :key="GoldenBall[0].date">
      <div class="date" >
        {{GoldenBall[0].date === '66-66-66' ? '置顶' : GoldenBall[0].date}}
      </div>
        <Gold v-for="(i,idx) in GoldenBall"
        v-if="GoldenBallHideMarks[ballIdx] <= 0 || idx <= 2"
        :noShell="GoldenBall[0].date === '66-66-66'"
        :key="i.id" 
        :sqlId="i.id" :mainUrl='i.mainUrl' :date="i.date" :name="i.name" 
        :site="i.site" :up="i.up" :tag="i.tag"
        :ep="i.ep" :part="i.part" :index="i.index"
        :bakedTime="i.bakedTime" :isRaw="i.isRaw" :isCut="i.isCut"
        :members="i.members" />
      <span 
        class="handle"
        :class="{'handle-In': GoldenBallHideMarks[ballIdx] === -1 }" 
        v-if="GoldenBallHideMarks[ballIdx] !== 0" 
        @click="switchMark(ballIdx,GoldenBall[0].date)">
        {{GoldenBallHideMarks[ballIdx] == 1  ? `展开纸条(${ GoldenBall.length - 3})` : `叠回去`}}
      </span>
    </div>
    <Shovel :ups="Ups" :sites="Sites" :tags="Tags" @flash="flashData"/>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import axios from 'axios'
import Gold from './Gold.vue';
import Shovel from './Shovel.vue';
import _keys from 'lodash.keys';
import moment from 'moment'


function strSum(str: string) {
  const strarr = str.split('')
  let i = 0
  strarr.forEach((a) => {
    i = i + a.charCodeAt(0)
  })
  return i;
}

function sortMethod(a: any, b: any) {
  const Adate = parseInt( a.date.split('-').join('') , 10 ) * 1000
  const Bdate = parseInt( b.date.split('-').join('') , 10 ) * 1000
  const Astr = strSum(a.name) / 1000
  const Bstr = strSum(b.name) / 1000
  const AScore = Adate + Astr + a.ep + a.part
  const BScore = Bdate + Bstr + b.ep + b.part
  return BScore - AScore;
}

function sortIndex(a: any, b: any) {
  return b.index - a.index
}
function sortRaw(a: any, b: any) {
  return a.isRaw - b.isRaw
}

@Component({
  data() {
    return {
      Golds: [],
      GoldenChains: [],
      GoldenBallHideMarks: [],
      Ups: [],
      Sites: [],
      Tags: []
    }
  },
  methods: {
    BallLimter(ball, hide) {
      if (hide > 0) {
        return ball.slice( 0 , ball.length - hide )
      } else {
        return ball;
      }
    },
    switchMark(ballIdx, ballDate) {
      if (this.$data.GoldenBallHideMarks === 1) {
        this.$record('过量折叠', ballDate, 'open')
      } else {
        this.$record('过量折叠', ballDate, 'close')
      }

      Vue.set(this.$data.GoldenBallHideMarks, ballIdx, -this.$data.GoldenBallHideMarks[ballIdx])
    },
  },
  watch: {
    Golds(nVal) {
      // split by the date
      // group the new meat
      const newChains: any = []
      const newHideMarks: any = []
      const now = moment();
      let i = -1;
      let lastDate = ''
      nVal.map( (a: any) => {
        if (lastDate === a.date) {
          newChains[i].push(a)
        } else {
          i++
          lastDate = a.date
          newChains[i] = [a]
        }
      })

      // sort by index & isRaw
      // hideMark setting
      newChains.map( (a: any, idx: number) => {
        a.sort(sortIndex)
        a.sort(sortRaw)
        // <0 代表不隐藏
        // >0 代表隐藏
        if (idx <= 2) {
          newHideMarks[idx] = 0
        } else {
          newHideMarks[idx] = a.length > 3 ? 1 : 0;
        }
      })
      this.$data.GoldenChains = newChains;
      this.$data.GoldenBallHideMarks = newHideMarks;

      // Ups and Sites
      const upCounter = new Object();
      const siteCounter = new Object();
      const tagCounter = new Object();
      nVal.map( (a: any) => {
        if (upCounter.hasOwnProperty(a.up)) { upCounter[a.up]++ } else { upCounter[a.up] = 0; }
        if (siteCounter.hasOwnProperty(a.site)) { siteCounter[a.site]++ } else { siteCounter[a.site] = 0; }
        if (tagCounter.hasOwnProperty(a.tag)) { tagCounter[a.tag]++ } else { tagCounter[a.tag] = 0; }
      })
      const ups = _keys(upCounter)
      const sites = _keys(siteCounter)
      const tags = _keys(tagCounter)
      ups.sort((a: string, b: string) => {
        return upCounter[b] - upCounter[a]
      })
      sites.sort((a: string, b: string) => {
        return siteCounter[b] - siteCounter[a]
      })
      tags.sort((a: string, b: string) => {
        return tagCounter[b] - tagCounter[a]
      })
      this.$data.Ups = ups
      this.$data.Sites = sites
      this.$data.Tags = tags
    }
  },
  components: {
    Gold, Shovel
  },
})
export default class Mine extends Vue {
  public flashData() {
    axios.get(Vue.rootPath + '/izone/all')
    .then((golds) => {
      this.$data.Golds = golds.data.data.sort(sortMethod)
    })
    .catch((err) => {
      console.error(err)
    })
  }
  public mounted() {
    this.flashData();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.set{
  max-width: 700px;
  margin: 0 auto;
}
.date{
  font-size: 12px;
  color: #a58a78;
  width: 30%;
  margin: .7em auto 1em;
  background: #f5eee887;
}
.handle{
  width: 90%;
  height: 20px;
  margin: 0 auto;
  display: block;
  border-bottom: 3px dashed #fcfffd;
  color: #d1b8a9;
  line-height: 20px;
  box-shadow: inset 0px 1px 2px #5c6a5745;
  font-size: 12px;
  background: rgba(241, 229, 221, 0.64);
}
.handle-In{
  opacity: 0.5;
  border: none;
}
.dateCard{
  // border-bottom: 1px solid #c9bccc;
}
</style>

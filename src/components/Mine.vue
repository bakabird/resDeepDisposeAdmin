<template>
  <div class="set">
    <div class='dateCard' v-for="(GoldenBall,ballIdx) in GoldenChains" :key="GoldenBall[0].date">
      <div class="date" >
        {{GoldenBall[0].date === '66-66-66' ? '置顶' : (GoldenBall[0].date === '00-00-00' ? '生肉' : GoldenBall[0].date)}}
      </div>
      <Gold v-for="i in BallLimter(GoldenBall,GoldenBallHideMarks[ballIdx])" 
      :key="i.id" 
      :sqlId="i.id" :mainUrl='i.mainUrl' :date="i.date" :name="i.name" 
      :site="i.site" :up="i.up" 
      :ep="i.ep" :part="i.part" 
      :tag="i.tag" :members="i.members" :isNew="i.isNew"/>
      <div 
        class="handle"
        :class="{'handle-In': GoldenBallHideMarks[ballIdx] < 0 }" 
        v-if="GoldenBallHideMarks[ballIdx] !== 0" 
        @click="switchMark(ballIdx)">
        {{GoldenBallHideMarks[ballIdx] > 0 ? `展(${GoldenBallHideMarks[ballIdx]})` : `叠`}}
        </div>
    </div>
    <Shovel :ups="Ups" :sites="Sites" @flash="flashData"/>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import axios from 'axios'
import Gold from './Gold.vue';
import Shovel from './Shovel.vue';

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
  return Bdate + Bstr + b.ep + b.part
       - Adate - Astr - a.ep - a.part;
}

@Component({
  data() {
    return {
      Golds: [],
      GoldenChains: [],
      GoldenBallHideMarks: [],
      Ups: [],
      Sites: []
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
    switchMark(ballIdx) {
      Vue.set(this.$data.GoldenBallHideMarks, ballIdx, -this.$data.GoldenBallHideMarks[ballIdx])
    }
  },
  watch: {
    Golds(nVal) {
      // split by the date
      const newChains: any = []
      const newHideMarks: any = []
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
      newChains.map( (a: any, idx: number) => {
        newHideMarks[idx] = a.length > 3 ? (a.length - 3 - Math.floor(( a.length - 3 ) * 0.3)) : 0;
      })
      this.$data.GoldenChains = newChains;
      this.$data.GoldenBallHideMarks = newHideMarks;

      // Ups and Sites
      const upSet = new Set()
      const siteSet = new Set()
      nVal.map( (a: any) => {
        upSet.add(a.up)
        siteSet.add(a.site)
      })
      this.$data.Ups = Array.from(upSet)
      this.$data.Sites = Array.from(siteSet)
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
  margin-top: .7em;
  margin-bottom: 1em;
  font-size: 12px;
  color: #da4c4d;
  background: #ffc6e44a;
  text-indent: 1em;
}
.handle{
  width: 90%;
  height: 20px;
  margin: 0 auto;
  border-bottom: 3px dashed #fffcfc;
  color: #bba3a4;
  line-height: 20px;
  box-shadow: inset 0px 1px 2px #5c6a5745;
  font-size: 12px;
  background: rgba(212, 183, 183, 0.49019607843137253);
}
.handle-In{
  opacity: 0.5;
  border: none;
}
.dateCard{
  // border-bottom: 1px solid #ccc;
}
</style>

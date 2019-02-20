<template>
  <div class="set">
    <div class='dateCard' v-for="(GoldenBall,ballIdx) in GoldenChainsShow" :key="GoldenBall[0].date">
      <div class="date" >
        {{GoldenBall[0].date === '66-66-66' ? '置顶' : GoldenBall[0].date}}
      </div>
        <Gold v-for="(i,idx) in (GoldenBallHideMarks[ballIdx] <= 0 ? GoldenBall : GoldenBall.slice(0,3))"
        :noShell="noShell || GoldenBall[0].date === '66-66-66'"
        :key="i.id + '_gold_' + idx" 
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

function attrStatistics(sample, attrName){
  // 将某个由多个对象组成数组，对该数组中对象的某个属性的值进行数量统计
  const statistics = {}
  for(let i = 0;i < sample.length;i++){
    const itm = sample[i]
    const itmAttrValue = itm[attrName]
    if(statistics.hasOwnProperty(itmAttrValue)){
      statistics[itmAttrValue]++
    }else{
      statistics[itmAttrValue] = 0
    }
  }
  return statistics
}

function statisticsSort(stat){
  // 按照数量统计进行排序，返回一个有顺序的值数组
  const sort = Object.keys(stat)  
  sort.sort((a: string, b: string) => {
    return stat[b] - stat[a]
  })
  return sort
}

function shouldPlacedAtTheTop(gold){
  return gold.date === '66-66-66'
}

@Component({
  data() {
    return {
      Golds: [],
      GoldenChains: [],
      GoldenBallHideMarks: [],
      Ups: [],
      Sites: [],
      Tags: [],
      limitLength: 8,
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
      if (this.$data.GoldenBallHideMarks[ballIdx] === 1) {
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
      this.$data.GoldenChains = newChains;

      // Ups and Sites
      // 将某个由多个对象组成数组，对该数组中对象的某个属性进行数量统计
      this.$data.Ups = statisticsSort(attrStatistics(nVal,'up'))
      this.$data.Sites = statisticsSort(attrStatistics(nVal,'site'))
      this.$data.Tags = statisticsSort(attrStatistics(nVal,'tag'))
    }
  },
  computed: {
    GoldenChainsShow(){
      // 预先添加日期为66-66-66的条目
      let chain = []
      switch(this.filter){
        case 'GroupVariety':
          this.GoldenChains.map(gc => {
            let gcF = gc.filter(i => i.tag === '团综' || i.tag === '小团综' || shouldPlacedAtTheTop(i))
            if(gcF.length !== 0){ chain.push(gcF) }
          })
          break
        case 'Variety':
          this.GoldenChains.map(gc => {
            let gcF = gc.filter(i => i.tag === '综艺' || shouldPlacedAtTheTop(i))
            if(gcF.length !== 0){ chain.push(gcF) }
          })
          break
        case 'Vlive':
          this.GoldenChains.map(gc => {
            let gcF = gc.filter(i => i.tag === 'Vlive直播' || shouldPlacedAtTheTop(i))
            if(gcF.length !== 0){ chain.push(gcF) }
          })
          break
        case 'No':
          chain = this.GoldenChains
          break
      }

      const newHideMarks: any = []
      // sort by index & isRaw
      // hideMark setting
      chain.map( (a: any, idx: number) => {
        a.sort(sortIndex)
        a.sort(sortRaw)
        // <0 代表不隐藏
        // >0 代表隐藏
        if (idx <= 3) {
          newHideMarks[idx] = 0
        } else {
          newHideMarks[idx] = a.length > this.$data.limitLength ? 1 : 0;
        }
      })
      this.$data.GoldenBallHideMarks = newHideMarks;

      return chain
    }
  },
  components: {
    Gold, Shovel
  },
})
export default class Mine extends Vue {
  @Prop() private noShell!: boolean;
  @Prop() private filter!: string;
  
  public flashData() {
    axios.get(Vue.rootPath + '/izone/all')
    .then((golds) => {
      this.$data.Golds = golds.data.data.sort(sortMethod)
    })
    .catch((err) => {
      console.error(err)
    })
  }
  public headData(){
    axios.get(Vue.rootPath + '/izone/head')
    .then((golds) => {
      this.$data.Golds = golds.data.data.sort(sortMethod)
      setTimeout(()=>{
        this.flashData()
      },4200)
    })
    .catch((err) => {
      console.error(err)
    })
  }
  public mounted() {
    this.headData();

    const updateSingleLH = () => {
      const firstGoldCell = document.querySelector('.gold .cell')
      if (firstGoldCell.textContent.trim() == 'PD48') {
        if (firstGoldCell.clientHeight != 0) {
          this.$store.commit('updateSingleLH', firstGoldCell.clientHeight)
        }
      } else {
        setTimeout(updateSingleLH, 1000)
      }
    }

    setTimeout(updateSingleLH.bind(this), 1000)
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
  
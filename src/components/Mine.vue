<template>
  <div class="set">
    <div class='dateCard' v-for="(GoldenBall,ballIdx) in GoldenChainsShow" :key="GoldenBall[0].date">
      <div class="date" >
        {{GoldenBall[0].date === '66-66-66' ? '置顶' : GoldenBall[0].date}}
      </div>
      <template v-for="(i,idx) in (GoldenBallHideMarks[ballIdx] <= 0 ? GoldenBall : GoldenBall.slice(0,3))">
         <Gold 
        v-if="!rdd || !i.edit"
        :noShell="GoldenBall[0].date === '66-66-66'"
        :key="i.id + '_gold_' + idx" 
        :sqlId="i.id" :mainUrl='i.mainUrl' :date="i.date" :name="i.name" 
        :site="i.site" :up="i.up" :tag="i.tag"
        :ep="i.ep" :part="i.part" :index="i.index"
        :bakedTime="i.bakedTime" :isRaw="i.isRaw" :isCut="i.isCut"
        :members="i.members" />
        <GoldEdit 
        v-if="rdd && i.edit"
        :sites="Sites" :tags="Tags"
        :key="i.id + '_goldEdit_' + idx" 
        :sqlId="i.id" :mainUrl='i.mainUrl' :date="i.date" :name="i.name" 
        :site="i.site" :up="i.up" :tag="i.tag"
        :ep="i.ep" :part="i.part" :index="i.index"
        :isRaw="i.isRaw" :isCut="i.isCut"
        :members="i.members" 
        @finishEdit='flashData'/>
        <button v-if="rdd && !i.edit" :key="`${i.id}_toEditBtn`" @click="toEdit(i)">编辑</button>
      </template>
       
      <span 
        class="handle"
        :class="{'handle-In': GoldenBallHideMarks[ballIdx] === -1 }" 
        v-if="GoldenBallHideMarks[ballIdx] !== 0" 
        @click="switchMark(ballIdx,GoldenBall[0].date)">
        {{GoldenBallHideMarks[ballIdx] == 1  ? `展开纸条(${ GoldenBall.length - 3})` : `叠回去`}}
      </span>
    </div>
    <Shovel @flash="flashData"/>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import axios from 'axios'
import Gold from './Gold.vue';
import GoldEdit from './GoldEdit.vue'
import Shovel from './Shovel.vue';

import moment from 'moment'


// 排序
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
function shouldPlacedAtTheTop(gold) {
  return gold.date === '66-66-66'
}

// 分析
function attrStatistics(sample, attrName) {
  // 将某个由多个对象组成数组，对该数组中对象的某个属性的值进行数量统计
  const statistics = {}
  for (let i = 0; i < sample.length; i++) {
    const itm = sample[i]
    const itmAttrValue = itm[attrName]
    if (statistics.hasOwnProperty(itmAttrValue)) {
      statistics[itmAttrValue]++
    } else {
      statistics[itmAttrValue] = 0
    }
  }
  return statistics
}
function statisticsSort(stat) {
  // 按照数量统计进行排序，返回一个有顺序的值数组
  const sort = Object.keys(stat)
  sort.sort((a: string, b: string) => {
    return stat[b] - stat[a]
  })
  return sort
}

// 筛选
function isOneOf(itm, arr) {
  for (let i = 0; i < arr.length; i++) {
    if (itm === arr[i]) {
      return true
    }
  }
  return false
}


@Component({
  data() {
    return {
      Golds: [],
      GoldenChains: [],
      GoldenBallHideMarks: [],
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
    toEdit(goldObj) {
      const newGold = Object.assign({}, this.$data.Golds[goldObj.goldNo], {
        edit: true
      })
      Vue.set(this.$data.Golds, goldObj.goldNo, newGold)
    }
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
      // this.$data.Ups = statisticsSort(attrStatistics(nVal, 'up'))
      this.$data.Sites = statisticsSort(attrStatistics(nVal, 'site'))
      this.$data.Tags = statisticsSort(attrStatistics(nVal, 'tag'))
    }
  },
  computed: {
    GoldenChainsShow() {
      // 预先添加日期为66-66-66的条目
      let chain = []
      switch (this.filter) {
        case 'GroupVariety':
        // 团综：团综、小团综、团综花絮、SHOWCON
          this.GoldenChains.map(gc => {
            const gcF = gc.filter(i => ( isOneOf(i.tag, ['团综', '小团综', '团综花絮', 'SHOWCON']) || shouldPlacedAtTheTop(i) ) )
            if (gcF.length !== 0) { chain.push(gcF) }
          })
          break
        case 'Stage':
        // 舞台：练习室、舞台、典礼舞台
          this.GoldenChains.map(gc => {
            const gcF = gc.filter(i => ( isOneOf(i.tag, ['练习室', '舞台', '典礼舞台']) || shouldPlacedAtTheTop(i) ) )
            if (gcF.length !== 0) { chain.push(gcF) }
          })
          break
        case 'Album':
        // 专辑：MV披露、音源、MV、MV花絮、专辑花絮
          this.GoldenChains.map(gc => {
            const gcF = gc.filter(i => ( isOneOf(i.tag, ['MV披露', '音源', 'MV', 'MV花絮', '专辑花絮']) || shouldPlacedAtTheTop(i) ) )
            if (gcF.length !== 0) { chain.push(gcF) }
          })
          break
        case 'Ceremony':
        // 典礼：颁奖、典礼配料、红毯、受赏、典礼舞台、典礼花絮
          this.GoldenChains.map(gc => {
            const gcF = gc.filter(i => ( isOneOf(i.tag, ['颁奖', '典礼配料', '红毯', '受赏', '典礼舞台', '典礼花絮']) || shouldPlacedAtTheTop(i) ) )
            if (gcF.length !== 0) { chain.push(gcF) }
          })
          break
        case 'Radio':
        // 电台
          this.GoldenChains.map(gc => {
            const gcF = gc.filter(i => ( isOneOf(i.tag, ['电台']) || shouldPlacedAtTheTop(i) ) )
            if (gcF.length !== 0) { chain.push(gcF) }
          })
          break
        case 'Variety':
        // 综艺：采访、综艺、综艺花絮
          this.GoldenChains.map(gc => {
            const gcF = gc.filter(i => ( isOneOf(i.tag, ['采访', '综艺', '综艺花絮']) || shouldPlacedAtTheTop(i) ) )
            if (gcF.length !== 0) { chain.push(gcF) }
          })
          break
        case 'Live':
        // 直播：SHOWROOM、Vlive、直播
          this.GoldenChains.map(gc => {
            const gcF = gc.filter(i => ( isOneOf(i.tag, ['SHOWROOM', 'Vlive', '直播']) || shouldPlacedAtTheTop(i) ) )
            if (gcF.length !== 0) { chain.push(gcF) }
          })
          break
        case 'No':
          chain = this.GoldenChains
          break
      }

      // 可省略
          //  默认省略： 配料、预告、报道、广告、杂志、饭拍
          //  可选省略： 采访、典礼配料

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
    },
    rdd() {
      return this.$store.state.rdd
    },
  },
  components: {
    Gold, Shovel, GoldEdit
  },
})
export default class Mine extends Vue {
  @Prop() private noShell!: boolean;
  @Prop() private filter!: string;

  public flashData() {
    axios.get(Vue.rootPath + '/izone/all')
    .then((golds) => {
      const goldAfterSort = golds.data.data.sort(sortMethod)
      const goldAfterAddEdit = goldAfterSort.map( (i, idx) => {
        i.goldNo = idx
        i.edit = false
        return i
      })
      this.$data.Golds = goldAfterAddEdit
    })
    .catch((err) => {
      console.error(err)
    })
  }
  public headData() {
    axios.get(Vue.rootPath + '/izone/head')
    .then((golds) => {
      this.$data.Golds = golds.data.data.sort(sortMethod)
      setTimeout(() => {
        this.flashData()
      }, 4200)
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
  
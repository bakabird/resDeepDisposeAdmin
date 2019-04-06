<template>
  <div class="mine">
    <Shovel @flash="flashData"/>
    <template v-for="GoldChain in GoldChainsFiltered">
      <div class='dateCard' :key="GoldChain[0].date">
        <Golds 
        @edit='toEdit' @finishEdit='flashData' 
        :GoldChain='GoldChain' :Sites='Sites' :Tags='Tags'/>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import axios from 'axios'
import Golds from './Golds.vue'
import Shovel from './Shovel.vue';

import moment from 'moment'
import { sortIndex, sortRaw } from './sort.js'
function isOneOf(itm, arr) {
    for (const i of arr) {
        if (itm === i) {
            return true
        }
    }
    return false
}


// 排序
function strSum(str: string) {
  const strarr = str.split('')
  let i = 0
  strarr.forEach((a) => {
    i = i + a.charCodeAt(0)
  })
  return i;
}
function sortByDateAndOther(a: any, b: any) {
  const Adate = parseInt( a.date.split('-').join('') , 10 ) * 1000
  const Bdate = parseInt( b.date.split('-').join('') , 10 ) * 1000
  const Astr = strSum(a.name) / 1000
  const Bstr = strSum(b.name) / 1000
  const AScore = Adate + Astr + a.ep + a.part
  const BScore = Bdate + Bstr + b.ep + b.part
  return BScore - AScore;
}

// 分析
function attrStatistics(sample, attrName) {
  // 将某个由多个对象组成数组，对该数组中对象的某个属性的值进行数量统计
  const statistics = {}
  for (const itm of sample) {
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


@Component({
  data() {
    return {
      Golds: [],
      GoldChains: [],
      Sites: [],
      Tags: []
    }
  },
  methods: {
    toEdit(goldNo) {
      const newGold = Object.assign({}, this.$data.Golds[goldNo], {
          edit: true
      })
      Vue.set(this.$data.Golds, goldNo, newGold)
    }
  },
  watch: {
    Golds(nVal) {
      // Ups and Sites
      // 将某个由多个对象组成数组，对该数组中对象的某个属性进行数量统计
      // this.$data.Ups = statisticsSort(attrStatistics(nVal, 'up'))
      this.$data.Sites = statisticsSort(attrStatistics(nVal, 'site'))
      this.$data.Tags = statisticsSort(attrStatistics(nVal, 'tag'))
      this.makeChain(nVal)
    }
  },
  computed: {
    rdd() {
      return this.$store.state.rdd
    },
    GoldChainsFiltered() {
        // 预先添加日期为66-66-66的条目;
        const chains = this.GoldChains
        const chainsFiltered = []
        for (let chain of chains) {
          const date = chain[0].date
          if (date !== '66-66-66') {
            switch (this.filter) {
                case 'GroupVariety':
                // 团综：团综、小团综、团综花絮、SHOWCON
                chain = chain.filter( i => ( isOneOf(i.tag, ['团综', '小团综', '团综花絮', 'SHOWCON']) ) )
                break
                case 'Stage':
                // 舞台：练习室、舞台、典礼舞台
                chain = chain.filter( i => ( isOneOf(i.tag, ['练习室', '舞台', '典礼舞台']) ) )
                break
                case 'Album':
                // 专辑：MV披露、音源、MV、MV花絮、专辑花絮
                chain = chain.filter( i => ( isOneOf(i.tag, ['MV披露', '音源', 'MV', 'MV花絮', '专辑花絮']) ) )
                break
                case 'Ceremony':
                // 典礼：颁奖、典礼配料、红毯、受赏、典礼舞台、典礼花絮
                chain = chain.filter( i => ( isOneOf(i.tag, ['颁奖', '典礼配料', '红毯', '受赏', '典礼舞台', '典礼花絮']) ) )
                break
                case 'Radio':
                // 电台
                chain = chain.filter( i => ( isOneOf(i.tag, ['电台']) ) )
                break
                case 'Variety':
                // 综艺：采访、综艺、综艺花絮
                chain = chain.filter( i => ( isOneOf(i.tag, ['采访', '综艺', '综艺花絮']) ) )
                break
                case 'Live':
                // 直播：SHOWROOM、Vlive、直播
                chain = chain.filter( i => ( isOneOf(i.tag, ['SHOWROOM', 'Vlive', '直播']) ) )
                break
            }
          }
          chain = chain.sort(sortIndex)
          chain = chain.sort(sortRaw)
          if (chain.length !== 0) {
            chainsFiltered.push(chain)
          }
        }

        // if(!this.$props.insideClamp) chain = chain.filter(i => i.inClamp === -1)
        return chainsFiltered
      },
  },
  components: {
    Shovel, Golds
  },
})
export default class Mine extends Vue {
  @Prop() private filter!: string;

  // factory for the useful date
  //    including: Golds Sites Tag & GoldChain
  public setGold(rawGolds) {
      // the gold will be date-sequential after sort
      const goldSorted = rawGolds.data.data.sort(sortByDateAndOther)
      // add some field into the obj for edit-useage
      const goldHasEditMark = goldSorted.map( (i, idx) => {
        i.goldNo = idx
        i.edit = false
        return i
      })
      this.$data.Golds = goldHasEditMark
  }
  public makeChain(golds) {
    // make up goldchain according to the date of the gold
    const newChains: any = []
    const now = moment();
    let i = -1;
    let lastDate = ''
    golds.map( (a: any) => {
      if (lastDate === a.date) {
        newChains[i].push(a)
      } else {
        i++
        lastDate = a.date
        newChains[i] = [a]
      }
    })
    this.$data.GoldChains = newChains;
  }
  // fetch date from api
  public flashData() {
    axios.get(Vue.rootPath + '/izone/all')
    .then((golds) => {
      this.setGold(golds)
    })
    .catch((err) => {
      console.error(err)
    })
  }
  public headData() {
    axios.get(Vue.rootPath + '/izone/head')
    .then((golds) => {
      this.setGold(golds)
      setTimeout(() => {
        this.flashData()
      }, 4200)
    })
    .catch((err) => {
      console.error(err)
    })
  }
  // startFrom here
  public mounted() {
    this.headData();

    const updateSingleLH = () => {
      const firstGoldCell = document.querySelector('.gold .cell')
      if (firstGoldCell.textContent.trim() === 'PD48') {
        if (firstGoldCell.clientHeight !== 0) {
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
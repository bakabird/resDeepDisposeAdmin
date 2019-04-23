<template>
  <div class="mine">
    <ToolBox @flash="flashData" :criteriaString='criteriaString' :curTags="tagsClassified"/>
    <template v-for="GoldChain in GoldChainsFiltered">
      <div class='dateCard' :key="GoldChain[0].date">
        <Page 
        @edit='toEdit' @finishEdit='flashData' 
        :GoldChain='GoldChain' :Sites='Sites' :Tags='tagsClassified'/>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Page from './Page.vue'
import ToolBox from './ToolBox.vue';

import axios from 'axios'
import store from 'store'
import isEqual from 'lodash.isequal'
import moment from 'moment'

function sortIndex(a, b) {
return b.index - a.index
}
function sortRaw(a, b) {
return a.isRaw - b.isRaw
}
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
      Tags: [],
      criteria: store.get('criteria') || {},
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
      const newSites = statisticsSort(attrStatistics(nVal, 'site'))
      const newTags = statisticsSort(attrStatistics(nVal, 'tag'))
      this.$data.Sites = isEqual(this.$data.Sites, newSites)  ? this.$data.Sites : newSites
      this.$data.Tags = isEqual(this.$data.Tags, newTags)  ? this.$data.Tags : newTags
      this.makeChain(nVal)
    }
  },
  computed: {
    rdd() {
      return this.$store.state.rdd
    },
    criteriaString() {
      return JSON.stringify(this.$data.criteria)
    },
    tagsClassified() {
      const criteria = this.$data.criteria
      const tags = this.$data.Tags
      const keys = Object.keys(criteria)

      let include = []
      const re: any = {}
      for (const key of keys) {
        re[key] = tags.filter(i => isOneOf(i, criteria[key]))
        include = [...include, ...criteria[key]]
      }

      re.Other = tags.filter(i => !isOneOf(i, include))
      Vue.log(re)
      return re
    },
    GoldChainsFiltered() {
        // 预先添加日期为66-66-66的条目;
        Vue.log('密集计算打卡点')
        const chains = this.GoldChains
        const chainsFiltered = []
        for (let chain of chains) {
          const date = chain[0].date
          if (date !== '66-66-66' && this.filter !== 'No') {
            chain = chain.filter( i => ( isOneOf(i.tag, this.$data.criteria[this.filter] || []) ) )
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
    ToolBox, Page
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
      Vue.error(err)
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
      Vue.error(err)
    })
  }
  public fetchCriteria() {
    axios.get(Vue.rootPath + '/util/getVal?key=izoniCriteria')
    .then(re => {
      this.$data.criteria = JSON.parse(re.data.data)
      store.set('criteria', JSON.parse(re.data.data))
    }).catch(err => {
      Vue.error(err)
    })
  }
  // startFrom here
  public mounted() {
    this.headData();
    this.fetchCriteria()
  }
}
</script>
<template>
  <div class="mine">
    <Shovel @flash="flashData"/>
    <div class='dateCard' v-for="GoldChain in GoldenChains" :key="GoldChain[0].date">
      <Golds 
      @edit='toEdit' @finishEdit='flashData' 
      :GoldChain='GoldChain' :Sites='Sites' :Tags='Tags' :filter='filter'/>
    </div>
    <!-- <Plate :Golds="Golds" :Sites='Sites' :Tags='Tags' :filter='filter'/> -->
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import axios from 'axios'
// import Plate from './Plate.vue'
import Golds from './Golds.vue'
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
      GoldenChains: [],
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
      this.makeChain(nVal)
      this.$data.Sites = statisticsSort(attrStatistics(nVal, 'site'))
      this.$data.Tags = statisticsSort(attrStatistics(nVal, 'tag'))
    }
  },
  computed: {
    rdd() {
      return this.$store.state.rdd
    },
  },
  components: {
    // Gold,
    Shovel, Golds, 
    // Plate
    // GoldEdit
  },
})
export default class Mine extends Vue {
  @Prop() private filter!: string;

  public setGold(rawGolds) {
      // the gold will be date-sequential after sort
      const goldAfterSort = rawGolds.data.data.sort(sortMethod)
      // add some field into the obj for edit-useage
      const goldAfterAddEdit = goldAfterSort.map( (i, idx) => {
        i.goldNo = idx
        i.edit = false
        return i
      })
      this.$data.Golds = goldAfterAddEdit
      this.makeChain(goldAfterAddEdit)
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
    this.$data.GoldenChains = newChains;
  }
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
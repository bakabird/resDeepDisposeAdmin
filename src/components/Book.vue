<template>
  <div class="mine">
    <ToolBox @flash="flashData" :criteriaString='criteriaString' :curTags="tagsClassified" />
    <template v-for="Page in PagesFiltered">
      <div class='dateCard' :key="Page[0].date">
        <Page @edit='toEdit' @finishEdit='flashData' :PageContent='Page' :Sites='Sites' :Tags='tagsClassified' />
      </div>
    </template>
  </div>
</template>

<script lang="ts">
  import {
    Component,
    Prop,
    Vue
  } from 'vue-property-decorator';
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
    const Adate = parseInt(a.date.split('-').join(''), 10) * 1000
    const Bdate = parseInt(b.date.split('-').join(''), 10) * 1000
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
        allPosters: [],
        freshPosters: [],
        criteria: store.get('criteria') || {},
      }
    },
    methods: {
      toEdit(posterNo) {
        const that:any = this
        const Posters = that.getCurrentPosters()
        const newPosters = Object.assign({}, Posters[posterNo], {
          edit: true
        })
        Vue.set(Posters, posterNo, newPosters)
      },
      getCurrentPosters(){
        if(this.$props.filter === 'Latest'){
          return this.$data.freshPosters
        }else{
          return this.$data.allPosters
        }
      }
    },
    computed: {
      Posters(){
        return this.getCurrentPosters()
      },
      rdd() {
        return this.$store.state.rdd
      },
      criteriaString() {
        return JSON.stringify(this.criteria)
      },
      Tags(){
        const newTags = statisticsSort(attrStatistics(this.Posters, 'tag'))
        return isEqual(this.$data.Tags, newTags) ? this.$data.Tags : newTags
      },
      Sites(){
        const newSites = statisticsSort(attrStatistics(this.Posters, 'site'))
        return isEqual(this.$data.Sites, newSites) ? this.$data.Sites : newSites
      },
      tagsClassified() {
        const criteria = this.criteria
        const tags = this.Tags
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
      Pages(){
        // make up goldchain according to the date of the gold
        const newPages: any = []
        const now = moment();
        let i = -1;
        let lastDate = ''
        this.Posters.map((poster: any) => {
          if (lastDate === poster.date) {
            newPages[i].push(poster)
          } else {
            i++
            lastDate = poster.date
            newPages[i] = [poster]
          }
        })
        return isEqual(this.$data.Pages, newPages) ? this.$data.Pages : newPages;
      },
      PagesFiltered() {
        // 预先添加日期为66-66-66的条目;
        Vue.log('密集计算打卡点')
        const pages = this.Pages
        const pagesFiltered = []
        for (let page of pages) {
          const date = page[0].date
          if (date !== '66-66-66' && this.filter !== 'No' && this.filter !== 'Latest') {
            page = page.filter(i => (isOneOf(i.tag, this.$data.criteria[this.filter] || [])))
          }
          page = page.sort(sortIndex)
          page = page.sort(sortRaw)
          if (page.length !== 0) {
            pagesFiltered.push(page)
          }
        }

        // if(!this.$props.insideClamp) chain = chain.filter(i => i.inClamp === -1)
        return pagesFiltered
      },
    },
    components: {
      ToolBox,
      Page
    },
  })
  export default class Book extends Vue {
    @Prop() private filter!: string;

    // factory for the useful date
    //    including: Golds Sites Tag & Page
    public setFreshPosters(posters){
      this.$data.freshPosters = this.processPosters(posters)
    }
    public setAllPosters(posters){
      this.$data.allPosters = this.processPosters(posters)
    }
    public processPosters(posters) {
      // the gold will be date-sequential after sort
      const posterSorted = posters.sort(sortByDateAndOther)
      // add some field into the obj for edit-useage
      const posterHasEditMark = posterSorted.map((i, idx) => {
        i.posterNo = idx
        i.edit = false
        return i
      })
      return posterHasEditMark
    }
    // fetch date from api
    public flashData() {
      axios.get(Vue.rootPath + '/izone/all')
        .then((re) => {
          this.setAllPosters(re.data.data)
        })
        .catch((err) => {
          Vue.error(err)
        })
    }
    public headData() {
      axios.get(Vue.rootPath + '/izone/fresh')
        .then((re) => {
          this.setFreshPosters(re.data.data)
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
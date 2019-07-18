<template>
  <div class="mine">
    <ToolBox @flash="delayFetchPages" :criteriaString='criteriaString' :curTags="tagsClassified" />
    <div v-for="Page in Pages" class='dateCard' :key="Page[0].date">
      <Page @edit='toEdit' :flashSignal='flashSignal' @finishEdit='delayFetchPages' :PageContent='Page' :Sites='sites' :Tags='tagsClassified' />
    </div>
    <input class="pageAction" :disabled='size === total' type="button" :value="size === total ? '卷轴已经展开完毕' : '展开卷轴'" @click="turnPage">
  </div>
</template>

<script lang="ts">
import {
  Component,
  Prop,
  Vue,
  Mixins
} from 'vue-property-decorator';
import Page from './Page.vue'
import ToolBox from './ToolBox.vue';

import axios from 'axios'
import isEqual from 'lodash.isequal'
import moment from 'moment'
import paging from './paging'
import IZONIVue from '../IZONIVue';

@Component({
  components: {
    ToolBox,
    Page
  },
})
export default class Book extends Mixins(IZONIVue) {
  public version: number = -1
  public size: number = 0
  public flashSignal: number = 0
  public total: number = 0
  public waitForTurnPage: boolean = false
  public criteria: object = {}

  public tags: string[] = []
  public sites: string[] = []
  public Pages: object[][] = []

  get tagsClassified() {
    const criteria = this.criteria
    const tags = this.tags
    const keys = Object.keys(criteria)

    let include: any = []
    const re: any = {}

    for (const key in criteria) {
      if (criteria.hasOwnProperty(key)) {
        re[key] = tags.filter(tag => criteria[key].includes(tag))
        include = [...include, ...criteria[key]]
      }
    }
    re.Other = tags.filter(tag => !include.includes(tag))

    // this.$LOG(re)
    return re
  }
  get criteriaString() {
    return JSON.stringify(this.criteria, null, 2)
  }

  public mounted() {
    this.fetchMeta()
    this.fetchCriteria()
    this.fetchPages()
  }
  public fetchMeta() {
    axios.get(this.ROOTPATH + '/izoneAdmin/meta')
      .then(re => {
        if (re.data.errno === 0) {
          const meta = re.data.data
          this.tags = meta.Tags
          this.sites = meta.Sites
        }
      })
  }
  public fetchCriteria() {
    axios.get(this.ROOTPATH + '/util/getVal?key=izoniCriteria')
      .then(re => {
        this.$data.criteria = JSON.parse(re.data.data)
      }).catch(err => {
        this.$ERROR(err)
      })
  }
  public fetchPages(counter: number = 0) {
    axios.post(this.ROOTPATH + '/izone/page1', {
      size: 25,
      query: {
        tags: ' '
      }
    }).then(re => {
      if (re.data.errno === 0 ) {
        if (this.version !== re.data.data.version) {
          this.Pages = re.data.data.pages
          this.size = re.data.data.size
          this.total = re.data.data.total
          this.version = re.data.data.version
        } else if (counter <= 3) {
          setTimeout(() => {
            this.$nextTick(() => {
              this.fetchPages(counter + 1)
            })
          }, 1000 * counter)
        }
      }
    }).catch(err => {
      this.$ERROR(err)
    })
  }
  public delayFetchPages() {
    setTimeout(() => {
      this.$nextTick(() => {
        this.fetchPages()
      })
    }, 1000)
  }
  public turnPage() {
    if (!this.waitForTurnPage) {
        this.waitForTurnPage = true
        axios.post(this.ROOTPATH + `/izone/page`, {
            from: this.size,
            size: this.total,
            query: {
              tags: ' '
            },
            version: this.version
        }).then(re => {
            const {
                pages,
                version,
                size,
                total
            } = re.data.data
            if (version === this.version) {
                this.$LOG(`merge local pages on updatePage`)
                const oldPages = this.Pages.map(page => page.map(poster => poster))
                this.Pages = this.PagesMerger(oldPages, pages)
                this.size = this.size + size
            } else {
                this.$LOG(`replace local pages on updatePage`)
                this.Pages = []
                this.Pages = pages
                this.size = this.size
            }
            this.total = total

            this.waitForTurnPage = false
        }).catch(err => {
            this.$ERROR(err)
        })
    }
  }
  public PagesMerger(opages, npages) {
      if (npages.length !== 0) {
          const opLastPage = opages.pop()
          npages.reverse()
          const npFirstPage = npages.pop()
          npages.reverse()
          if (opLastPage[0].date === npFirstPage[0].date) {
              const mergePage = paging(opLastPage.concat(npFirstPage))[0]
              return [...opages, mergePage, ...npages]
          } else {
              return [...opages, opLastPage, npFirstPage, ...npages]
          }
      } else {
          return opages
      }
  }
  public toEdit(posterNo) {
    const that: any = this
    const Posters = that.getCurrentPosters()
    const newPosters = Object.assign({}, Posters[posterNo], {
      edit: true
    })
    Vue.set(Posters, posterNo, newPosters)
  }
}
</script>
<style lang="scss">
.mine {
  max-width: 700px;
  margin: 0 auto;
}

.date {
  color: #a58a78;
  background: #f5eee887;
}

.date {
  font-size: 12px;
  width: 30%;
  margin: .7em auto 1em;
}
</style>

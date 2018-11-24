<template>
  <div class="set">
    <div v-for="GoldenBall in GoldenChains" :key="GoldenBall[0].date">
      <div class="date">{{GoldenBall[0].date}}</div>
      <Gold v-for="i in GoldenBall" 
      :key="i.id" 
      :sqlId="i.id" :mainUrl='i.mainUrl' :date="i.date" :name="i.name" 
      :site="i.site" :up="i.up" 
      :ep="i.ep" :part="i.part" 
      :tag="i.tag" :members="i.members" :isNew="i.isNew"/>
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
      Ups: [],
      Sites: []
    }
  },
  watch: {
    Golds(nVal) {
      // split by the date
      const newChains: any = []
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
  margin-top: 0.5em;
  margin-bottom: 1em; 
  text-align: left;
  font-size: 12px;
  color: #da4c4d;
  text-indent: 1em;
}
</style>

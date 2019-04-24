<template>
  <div id="app">
    <div v-show="voice == 10">
      <input v-model="word" />
      <input type="button" value="YES" @click="veritify()">
    </div>
    <header>
      <div class='introduction'>
        <img class="logo" @click="knock()" width="150" src="./assets/iz-one-logo.png">
        <div class="new">刚出炉的熟肉呈浅珊瑚色</div>
        <div class="raw">较难食用的生肉呈墨绿色</div>
        <div class="clampTip">包含了其他纸条的夹子呈米黄色</div>
      </div>
      <!-- <div>比起弹幕数量更关注弹幕的友善度</div> -->
      <div>{{announcement}}</div>
      <div v-if="rdd">
        <input type="text" v-model="newAnnouncement">
        <button @click="setAnnouncement">修改公告</button>
      </div>
      <!-- <div>个人维护，更新不及时见谅</div> -->
      <form class='filter'>
        <label for="No"><input id='No' name='filter' v-model="filter" type='radio' value='No' />全部</label>
        <label for="Variety"><input id='Variety' name='filter' v-model="filter" type='radio'
            value='Variety' />综艺</label>
        <label for="GroupVariety"><input id='GroupVariety' name='filter' v-model="filter" type='radio'
            value='GroupVariety' />团综</label>
        <label for="Stage"><input id='Stage' name='filter' v-model="filter" type='radio' value='Stage' />表演</label>
        <br>
        <label for="Live"><input id='Live' name='filter' v-model="filter" type="radio" value='Live' />直播</label>
        <label for="Album"><input id='Album' name='filter' v-model="filter" type='radio' value='Album' />专辑</label>
        <label for="Radio"><input id='Radio' name='filter' v-model="filter" type='radio' value='Radio' />电台</label>
        <label for="Ceremony"><input id='Ceremony' name='filter' v-model="filter" type="radio"
            value='Ceremony' />典礼</label>
      </form>
    </header>
    <Book :filter='filter' />
    <footer>- 暂由RDD个人维护 -</footer>
  </div>
</template>

<script lang="ts">
  import {
    Component,
    Vue
  } from 'vue-property-decorator';
  import Book from './components/Book.vue';
  import store from 'store'
  import axios from 'axios'

  @Component({
    data() {
      return {
        voice: 0,
        word: '',
        hasComforted: false,
        filter: 'No',
        announcement: store.get('announcement') || '',
        newAnnouncement: '',
      }
    },
    components: {
      Book
    },
    watch: {
      filter(to, from) {
        this.$record('过滤器切换(to,from)', to, from)
      }
    },
    computed: {
      rdd() {
        return this.$store.state.rdd
      }
    },
    methods: {
      knock() {
        if (this.$data.voice < 10) {
          this.$data.voice++;
        }
      },
      veritify() {
        if (this.$data.word === 'Violeta1210' || (this.$data.word === 'RDD' && Vue.isDev)) {
          this.$store.commit('rddIsGod')
        }
        this.$data.voice++;
      },
      fetchAnnouncement() {
        axios.get(Vue.rootPath + '/util/getVal?key=izoniAnnouncement')
          .then(re => {
            this.$data.announcement = re.data.data
            store.set('announcement', re.data.data)
          }).catch(err => {
            this.$data.announcement = 'ErrorCode:42'
            Vue.error(err)
          })
      },
      setAnnouncement() {
        const that: any = this
        axios.post(Vue.rootPath + '/util/setVal', {
            key: 'izoniAnnouncement',
            value: this.$data.newAnnouncement
          })
          .then(re => {
            that.fetchAnnouncement()
          }).catch(err => {
            Vue.error(err)
          })
      }
    },
    mounted() {
      document.getElementsByTagName('html')[0].className = 'rose'
      this.fetchAnnouncement()
    }
  })
  export default class App extends Vue {}
</script>
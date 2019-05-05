<template>
  <div id="app">
    <header>
      <DashBoard @switchPart='switchPart' />
      <template v-if='handlePart === "Setting"'>
        <div>{{announcement}}</div>
        <div v-if="rdd">
          <input type="text" v-model="newAnnouncement">
          <button @click="setAnnouncement">修改公告</button>
        </div>
      </template>

      <div v-show='handlePart === "Manage"'>
        <!-- <div>个人维护，更新不及时见谅</div> -->
        <form class='filter'>
          <label class='mainItem Latest' :class="{'itemActived': filter === 'Latest'}" for="Latest">
            <input id='Latest' name='filter' v-model="filter" type='radio' value='Latest' />最近更新</label>
          <!-- sec line -->
          <label class='item No' :class="{'itemActived': filter === 'No'}" for="No">
            <input id='No' name='filter' v-model="filter" type='radio' value='No' />全部</label>
          <label class='item Variety' :class="{'itemActived': filter === 'Variety'}" for="Variety">
            <input id='Variety' name='filter' v-model="filter" type='radio' value='Variety' />综艺</label>
          <label class='item GroupVariety' :class="{'itemActived': filter === 'GroupVariety'}" for="GroupVariety"><input
              id='GroupVariety' name='filter' v-model="filter" type='radio' value='GroupVariety' />团综</label>
          <label class='item Stage' :class="{'itemActived': filter === 'Stage'}" for="Stage">
            <input id='Stage' name='filter' v-model="filter" type='radio' value='Stage' />表演</label>
          <!-- trd line -->
          <label class='item Live' :class="{'itemActived': filter === 'Live'}" for="Live">
            <input id='Live' name='filter' v-model="filter" type="radio" value='Live' />直播</label>
          <label class='item Album' :class="{'itemActived': filter === 'Album'}" for="Album">
            <input id='Album' name='filter' v-model="filter" type='radio' value='Album' />专辑</label>
          <label class='item Radio' :class="{'itemActived': filter === 'Radio'}" for="Radio">
            <input id='Radio' name='filter' v-model="filter" type='radio' value='Radio' />电台</label>
          <label class='item Ceremony' :class="{'itemActived': filter === 'Ceremony'}" for="Ceremony">
            <input id='Ceremony' name='filter' v-model="filter" type="radio" value='Ceremony' />典礼</label>
        </form>
        <Book :filter='filter' />
      </div>
    </header>
    <footer>- 暂由RDD个人维护 -</footer>
  </div>
</template>

<script lang="ts">
  import {
    Component,
    Vue
  } from 'vue-property-decorator';

  import Book from './components/Book.vue';
  import DashBoard from './components/DashBoard.vue'

  import store from 'store'
  import axios from 'axios'

  @Component({
    data() {
      return {
        hasComforted: false,
        filter: 'No',
        announcement: store.get('announcement') || '',
        newAnnouncement: '',
        handlePart: 'Manage',
      }
    },
    components: {
      Book,
      DashBoard
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
      switchPart(newPart: string) {
        this.$data.handlePart = newPart
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
            string: this.$data.newAnnouncement
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
<style lang="scss">
  @import "color";
  @import "filter";

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
  }

  html {
    background: #fcfffd;
    // color: rgb(243, 211, 213);

    #app {
      color: #E4555B;
    }
  }

  header {
    font-size: 12px;
    margin-top: 12px;
  }

  footer {
    margin-top: 30px;
    font-size: 12px;
    // color: #e6afb1;
  }

  .btnGroup {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
  }


  .actionBtn {
    background: #ffc9c9;
    flex: 1;
    border: none;
    height: 3em;
    border: 1px solid #fff;
    // margin-top: 20px;
    color: #b34348;
  }

  .actionBtn:hover {
    background: #E4555B;
    color: #fff;
  }

  .showUpBtn {
    background: #fafafa;
    flex: 1;
    border: none;
    height: 5em;
    border: 1px dashed #ff6363;
    margin-top: 20px;
    color: #ff6363;
  }
</style>
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
        <Book/>
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

  import axios from 'axios'

  @Component({
    components: {
      Book,
      DashBoard
    }
  })
  export default class App extends Vue {
      private hasComforted: boolean = false
      private announcement: string = ''
      private newAnnouncement: string = ''
      private handlePart: string = 'Manage'

      get rdd() {
        return this.$store.state.rdd
      }

      private mounted() {
        this.fetchAnnouncement()
      }
      private switchPart(newPart: string) {
        this.$data.handlePart = newPart
      }
      private fetchAnnouncement() {
        axios.get(Vue.rootPath + '/util/getVal?key=izoniAnnouncement')
          .then(re => {
            this.$data.announcement = re.data.data
          }).catch(err => {
            this.$data.announcement = 'ErrorCode:42'
            Vue.error(err)
          })
      }
      private setAnnouncement() {
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
  }
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

  .pageAction {
    background: #ffc9c9;
    flex: 1;
    border: none;
    width: 100%;
    height: 3em;
    border: 1px solid #fff;
    margin-top: 20px;
    color: #b34348;
    &:disabled{
      background: #eaeaea;
      color: #888888;
    }
  }

  .pageAction:hover {
    background: #E4555B;
    color: #fff;
    &:disabled{
      background: #eaeaea;
      color: #888888;
    }
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
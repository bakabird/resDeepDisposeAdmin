<template>
  <div id="app">
    <header>
      <DashBoard @switchPart='switchPart' />
      <template v-if='handlePart === "Setting"'>
        <div>{{announcement}}</div>
        <input type="text" v-model="newAnnouncement">
        <button @click="setAnnouncement">修改公告</button>
      </template>
      <ClipBoard />
      <AdminClipBoard />
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
  Vue,
  Mixins
} from 'vue-property-decorator';
import IZONIVue from "./IZONIVue"
import Book from './components/Book.vue'
import DashBoard from './components/DashBoard.vue'
import AdminClipBoard from "./components/AdminClipBoard.vue"
import ClipBoard from "./components/ClipBoard.vue"

import axios from 'axios'

@Component({
  components: {
    Book,
    DashBoard,
    ClipBoard, AdminClipBoard
  }
})
export default class App extends Mixins(IZONIVue) {
    public hasComforted: boolean = false
    public announcement: string = ''
    public newAnnouncement: string = ''
    public handlePart: string = 'Manage'

    public mounted() {
      this.fetchAnnouncement()
    }
    public switchPart(newPart: string) {
      this.$data.handlePart = newPart
    }
    public fetchAnnouncement() {
      axios.get(this.ROOTPATH + '/util/getVal?key=izoniAnnouncement')
        .then(re => {
          this.$data.announcement = re.data.data
        }).catch(err => {
          this.$data.announcement = 'ErrorCode:42'
          this.$ERROR(err)
        })
    }
    public setAnnouncement() {
      const that: any = this
      axios.post(this.ROOTPATH + '/util/setVal', {
          key: 'izoniAnnouncement',
          string: this.$data.newAnnouncement
        })
        .then(re => {
          that.fetchAnnouncement()
        }).catch(err => {
          this.$ERROR(err)
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
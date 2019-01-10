<template>
<div>
  <div class='dashboard' >
    <div class='mogolia' v-if='mongolia' @click.self="closeMogolia">
      <textarea name="feedbackCnt" id="feedbackCnt" cols="30" rows="10" placeholder="填写你的反馈" v-model="feedbackValue"></textarea>
      <div class='btnBox'>
        <button @click="closeMogolia">取消</button>
        <button @click="submitFeedback">提交</button>
      </div>
    </div>
  </div>
  <div id="app" :class="{blur: mongolia}">
    <div v-show="voice == 10">
      <input v-model="word"></input>
      <input type="button" value="YES" @click="veritify()">
    </div>
    <header>
      <button class='feedback' @click="startMogolia">反馈</button>
      <img class="logo" @click="knock()" width="250" src="./assets/iz-one-logo.png">
      <div class="new">刚出炉的熟肉呈浅珊瑚色</div>
      <div class="raw">较难食用的生肉呈墨绿色</div>
      <div>个人维护，更新不及时见谅</div>
      <!-- <div>比起弹幕数量更关注弹幕的友善度</div> -->
    </header>
    <Mine/>
    <footer>- 暂由RDD个人维护 -</footer>
  </div>
</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Mine from './components/Mine.vue';
import axios from 'axios'

@Component({
  data() {
    return {
      voice: 0 ,
      word: '',
      hasComforted: false,
      mongolia: false,
      feedbackValue: ''
    }
  },
  components: {
    Mine,
  },
  methods: {
    knock() {
      if (this.$data.voice < 10) { this.$data.voice++; }
    },
    veritify() {
      if ( this.$data.word === 'LoviRose123' || (this.$data.word === 'RDD' && Vue.isDev) ) {
        this.$store.commit('rddIsGod')
      }
      this.$data.voice++;
    },
    startMogolia() {
      this.$data.mongolia = true
    },
    closeMogolia() {
      this.$data.mongolia = false
    },
    submitFeedback() {
      axios.post(Vue.rootPath + '/izone/feedback', {
        from: 'izoni',
        feedback: this.$data.feedbackValue
      }).then((res) => {
        console.log(res)
        this.$data.feedbackValue = ''
        this.$data.mongolia = false
      }).catch((err) => {
        console.error(err)
        this.$data.mongolia = false
      })
    }
  }
})
export default class App extends Vue {
}
</script>

<style lang="scss">
.sorry{
  color: red;
  font-size: 14px;
}
.new{
  color: #dc4c65;
  background: #fdebea;
}
.raw{
  background: #f0f4ee;
  color: #9cb599;
}
html{
  background: #fcfffd;
  color: rgb(243, 211, 213);
}
header,{
  color: #e6afb1;
  font-size: 12px;
  margin-top: 12px;
}
footer{
  margin-top: 30px;
  font-size: 12px;
  color: #e6afb1;
}
.toConfort{
  border: none;
  background: #eeeef4;
  color: #9191de;
  height: 15px;
  font-size: 12px;
  line-height: 12px;
  border-bottom: 1px solid #d4d4f1;
}
.logo{
  margin:25px auto 15px;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #E4555B;
}
.feedback{
  background: #fcfffd;
  position: absolute;
  top: 10px;
  border-radius: 20px;
  color: #e36b7f;
  right: 10px;
  border: 1px solid #e77e8f;
}
#feedbackCnt{
  resize: none;
}
.mogolia{
  position: fixed;
  top: 0;
  z-index: 2;
  bottom: 0;
  right: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.29);
}
.mogolia textarea{
  background: #fffaf7;
  width: calc(100vw - 80px);
  color: #a23c41;
  margin-left: 20px;
  padding: 20px;
  margin-top: 40px;
  border: 1px solid #c69da5;
  border-radius: 10px;
}

.mogolia button{
  border-radius: 5px;
  color: #a9676b;
  border: none;
  flex: 1;
  margin: 0 50px;
  background: #fffaf7;
}
.mogolia .btnBox{
  display: flex;
}
.dashboard{
  display: bloack;
  position: absolute;
  top: 0;
  left: 0;
}
.blur{
  filter: blur(2px);
}
</style>

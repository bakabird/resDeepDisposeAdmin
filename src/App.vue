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
      <button class='removeSkin' :class="{skinOn: noShell}" @click="noShell = !noShell">去皮</button>
      <button class='feedback' @click="startMogolia">反馈</button>
      <img class="logo" @click="knock()" width="250" src="./assets/iz-one-logo.png">
      <div class="new">刚出炉的熟肉呈浅珊瑚色</div>
      <div class="raw">较难食用的生肉呈墨绿色</div>
      <div>个人维护，更新不及时见谅</div>
      <!-- <div>比起弹幕数量更关注弹幕的友善度</div> -->
      <form class='filter'>
        <label><input name='filter' v-model="filter" type='radio' value='No'/>全部</label>
        <label><input name='filter' v-model="filter" type='radio' value='Variety'/>综艺</label>
        <label><input name='filter' v-model="filter" type='radio' value='GroupVariety'/>团综</label>
        <label><input name='filter' v-model="filter" type="radio" value='Vlive'/>Vlive</label>
      </form>
    </header>
    <Mine :noShell='noShell' :filter='filter'/>
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
      feedbackValue: '',
      noShell: false,
      filter: 'No'
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
      console.log('当前的开发环境是' + Vue.isDev )
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

// button
.removeSkin{
  position: absolute;
  top: 10px;
  border-radius: 20px;
  color: #e36b7f;
  background: #fff;
  left: 10px;
  border: 1px solid #e77e8f;
}
.skinOn{
  color: #e4687c;
  background: #fdebea;
  border: 1px solid #e46378;
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

// filter
.filter input[type='radio'] {
    outline: none;
    margin: -2px 5px 1px 20px;
    width: 14px;
    height: 14px;
    vertical-align: middle;
    font-family: PingFangSC-Regular;
    color: rgba(56, 71, 68, 1);
    -webkit-appearance: none;
    border: 1px solid #ddd;
    display: inline-block;
    border-radius: 50%;
}

.filter input[type='radio']:checked:before {
    content: '';
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #e65357;
    position: absolute;
    top: 1px;
    left: 1px;
}

.filter input[type='radio']:checked {
    display: inline-block;
    border: 1px solid #e65357;
    border-radius: 50%;
    position: relative;
}
</style>

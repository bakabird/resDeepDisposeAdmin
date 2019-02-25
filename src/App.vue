<template>
<div>
  <div id="app">
    <div v-show="voice == 10">
      <input v-model="word"/>
      <input type="button" value="YES" @click="veritify()">
    </div>
    <header>
      <button class='removeSkin' :class="{skinOn: noShell}" @click="switchShell">去皮</button>
      <img class="logo" @click="knock()" width="250" src="./assets/iz-one-logo.png">
      <div class="new">刚出炉的熟肉呈浅珊瑚色</div>
      <div class="raw">较难食用的生肉呈墨绿色</div>
      <div>个人维护，更新不及时见谅</div>
      <!-- <div>比起弹幕数量更关注弹幕的友善度</div> -->
      <form class='filter'>
        <label><input name='filter' v-model="filter" type='radio' value='No'/>全部</label>
        <label><input name='filter' v-model="filter" type='radio' value='Variety'/>综艺</label>
        <label><input name='filter' v-model="filter" type='radio' value='GroupVariety'/>团综</label>
        <label><input name='filter' v-model="filter" type='radio' value='Stage'/>舞台</label>
        <br>
        <label><input name='filter' v-model="filter" type="radio" value='Live'/>直播</label>
        <label><input name='filter' v-model="filter" type='radio' value='Album'/>专辑</label>
        <label><input name='filter' v-model="filter" type='radio' value='Radio'/>电台</label>
        <label><input name='filter' v-model="filter" type="radio" value='Ceremony'/>典礼</label>
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
    switchShell(){
      this.$record('去皮', 'blaba', 'blaba', 'blaba')
      this.$data.noShell = !this.$data.noShell
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

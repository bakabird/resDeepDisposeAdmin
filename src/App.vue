<template>
  <div id="app">
    <div v-show="voice == 10">
      <input v-model="word"></input>
      <input type="button" value="YES" @click="veritify()">
    </div>
    <header>
      <img class="logo" @click="knock()" width="250" src="./assets/iz-one-logo.png">
      <div class="new">刚出炉的熟肉呈浅珊瑚色</div>
      <div class="raw">较难食用的生肉呈墨绿色</div>
      <div >个人维护，更新不及时见谅</div>
      <!-- <div>比起弹幕数量更关注弹幕的友善度</div> -->
    </header>
    <Mine/>
    <footer>- 暂由RDD个人维护 -</footer>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Mine from './components/Mine.vue';

@Component({
  data() {
    return { voice: 0 , word: ''}
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
    }
  }
})
export default class App extends Vue {
}
</script>

<style lang="scss">
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
  // margin-bottom: 30px;
}
footer{
  margin-top: 30px;
  font-size: 12px;
  color: #e6afb1;
}
.logo{
  
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #E4555B;
  margin-top: 20px;
}
</style>

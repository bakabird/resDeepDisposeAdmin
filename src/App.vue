<template>
  <div id="app">
    <div v-show="voice == 10">
      <input v-model="word"></input>
      <input type="button" value="YES" @click="veritify()">
    </div>
    <header>
      <img class="logo" @click="knock()" width="250" src="./assets/iz-one-logo.png">
      <div>收集各种IZONE中字视频资源</div>
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
      if ( this.$data.word === 'ROSE' || this.$data.word === 'RDD' ) {
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
html{
  background: #fff5f2;
  color: rgb(243, 211, 213);
}
header,{
  color: #e6afb1;
  font-size: 12px;
  margin-bottom: 30px;
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
  margin-top: 60px;
}
</style>

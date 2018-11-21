<template>

  <a class="gold" :href="mainUrl" target="_blank">
    <div class="cell from">{{from}}</div>
    <div class="cell date">{{date}}</div>
    <div class="cell name">{{name}}</div>
    <div class="cell ep">{{ep}}</div>
    <!-- <div class="cell more" @click.stop="log()">
      <Button>其他资源</Button>
    </div> -->
    <div v-if="rdd">
      <input value="修改" type="button" @click.stop="revise">
    </div>
  </a>

</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  computed: {
    rdd() {
      console.log(this.$store.state.rdd)
      return this.$store.state.rdd
    }
  },
  methods: {
    revise(){
      this.$store.commit("revising", this.$props)
    },
    jumpTo(url) {
      window.location.assign(url)
    }
  }
})
export default class Gold extends Vue {
  @Prop() private mainUrl!: string;
  @Prop() private from!: string;
  @Prop() private date!: string;
  @Prop() private name!: string;
  @Prop() private ep!: string;
  @Prop() private sqlId!: number;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.gold{
    display: flex;
    margin-bottom: 0.5em;
}
.gold:hover{
  cursor: pointer;
  color: #B21322;
  text-decoration: underline;
}
.gold:visited{
  color: #C20362;
}
.cell{
  // background: #efe;
}
.name{
  flex: 2;
  background: #FAFAFA;
}
.date,.ep{
  flex: 0.7;
}
.from,.more{
  flex:0.9;
}
</style>

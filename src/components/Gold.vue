<template>
  <div class="gold">
    <a class="link" :href="mainUrl" target="_blank">
      <div class='cell new' v-if='!!isNew'></div>
      <div class="cell name">{{name}}
        <span class='part' v-if="!!part">Part {{part}}</span>
        <span class='ep' v-else-if="!!ep">EP {{ep}}</span>
        <span v-else></span>
      </div>
    </a>
    <div class="meta">
      <div class="cell tag">{{tag}}</div>
      <div class="cell from">【{{site}}】{{up}}</div>
      <div class="cell members">{{memberStr}}</div>
    </div>
    <div v-if="rdd">
        <input value="修改" type="button" @click.stop="revise">
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  computed: {
    rdd() {
      return this.$store.state.rdd
    },
    memberStr() {
      const arr = this.$props.members.split('&')
      // arr = arr.sort( () => {
      //   return Math.random() > 0.5 ? -1 : 1
      // })
      let re = ''
      arr.forEach( (i: string) => {
        re += Vue.members[i]
      })
      return re
    }
  },
  methods: {
    revise() {
      this.$store.commit('revising', this.$props)
    },
    jumpTo(url) {
      window.location.assign(url)
    }
  }
})
export default class Gold extends Vue {
  @Prop() private sqlId!: number;

  @Prop() private mainUrl!: string;
  @Prop() private date!: string;
  @Prop() private name!: string;

  @Prop() private site!: string;
  @Prop() private up!: string;

  @Prop() private ep!: number;
  @Prop() private part!: number;

  @Prop() private tag!: string;
  @Prop() private members!: string;
  @Prop() private isNew!: any;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.gold{
  // margin-top: 0.5em;
  // margin-bottom: 0.5em;
  color: #E4555B;
  background: #FAFAFA;
  border-bottom: 1px solid #c9bccc;
}

.link{
  display: flex;
  height: 2em;
  line-height: 2em;
  font-size: 1.3em;
  color: #E4555B;
  background: #ffffff;
  font-weight: bold;
  text-decoration: none;
}
.meta{
  display: flex;
  // color: #efa8ab;
  // background: #bf9e9e;
  flex-wrap: wrap;
  color: #de7579;
}
.link:hover{
  cursor: pointer;
}
// .link:visited{
//   color: #E4555B;
// }
.cell{
  // background: #efe;
}
.name{
  flex: 2;
  // background: #FAFAFA;
}
.new{
  width: 10px;
  background: #ffc7c7;
}
.tag{
  min-width: 60px;
  flex: 0.5;
}
.part,.ep{
  font-size: 12px;
  color: #de7579;
}
.members{
  min-width: 320px;
  flex:1;
}
.from{
  flex: 1;
  min-width: 200px;
}
.up,.more{
  flex:0.9;
}
</style>

<template>
  <div class="gold" :class="{ new:!!isNew, raw:!!isRaw}">
    <a class="link" @click="record(mainUrl)" :href="mainUrl" target="_blank">
      <div class="cell name">
        {{name}}
        <span class='cut' v-if="!!isCut">[cut]</span>
        <span class='part' v-if="!!part">Part {{part}}</span>
        <span class='ep' v-else-if="!!ep">EP {{ep}}</span>
        <span v-else></span>
      </div>
    </a>
    <div v-if="!noShell" class="meta">
      <div class="cell tag">{{tag}}</div>
      <div class="cell from">【{{site}}】{{up}}</div>
      <div class="cell members">{{memberStr}}</div>
    </div>
    <!-- <div v-if="rdd">
        <input value="修改" type="button" @click.stop="revise">
    </div> -->
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import moment from 'moment'

const now = moment();


@Component({
  computed: {
    rdd() {
      return this.$store.state.rdd
    },
    singleLineHeight() {
      return this.$store.state.singleLineHeight
    },
    memberStr() {
      let arr = this.$props.members.split('&')
      arr = arr.sort( () => {
        return Math.random() > 0.5 ? -1 : 1
      })
      let re = ''

      arr.forEach( (i: string) => {
        re += Vue.members[i]
      })
      return re
    },
    isNew() {
      return !this.$props.isRaw && now.diff(this.$props.bakedTime , 'hour') < 36
    }
  },
  watch: {
    async singleLineHeight(nVal) {
      if (nVal != 0) {
        const updateFontSize = () => {
          const height = this.$el.querySelector('.cell').clientHeight
          if (height > nVal * 1.4) {
            const size = parseInt( getComputedStyle(this.$el.querySelector('.cell'))['font-size']  )
            if (size > 12) {
              this.$el.querySelector('.cell').style.fontSize = `${size - 1}px`
              setTimeout(updateFontSize, 200)
            }
          }
        }
        updateFontSize.bind(this)()
      }
    }
  },
  methods: {
    revise() {
      this.$store.commit('revising', this.$props)
    },
    record(url) {
      this.$record('跳转', this.$props.name, url, this.$props.sqlId)
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
  @Prop() private bakedTime!: string;

  @Prop() private ep!: number;
  @Prop() private part!: number;
  @Prop() private index!: number;

  @Prop() private tag!: string;
  @Prop() private members!: string;

  @Prop() private isRaw!: boolean;
  @Prop() private isCut!: boolean;

// setting
  @Prop() private noShell!: boolean;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.gold{
  // margin-top: 0.5em;
  // margin-bottom: 0.5em;
  color: #E4555B;
  background: #FAFAFA;
  // border-bottom: 1px solid #c9bccc;
  position: relative;
}
.gold:last-of-type{
  border-bottom: 1px solid #c9bccc;
}


.link{
  display: flex;
  // height: 2em;
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
  overflow: hidden;
}
.link:hover{
  cursor: pointer;
}
.cell{
  // background: #efe;
}
.name{
  flex: 2;
  padding: 0 5px;
  // background: #FAFAFA;
}
.new{
  .cell{
    color: #dc4c65;
    background: #fdebea;
  }
}
.raw{
  .cell{
    background: #f0f4ee;
    color: #9cb599;
    .part, .ep, .cut{
      background: #f0f4ee;
      color: #9cb599;
    }
  }
}
.tag{
  min-width: 60px;
  flex: 0.5;
}
.part,.ep,.cut{
  font-size: 12px;
  color: #de7579;
}
.members{
  min-width: 290px;
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

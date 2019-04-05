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
      if (nVal !== 0) {
        const updateFontSize = () => {
          const height = this.$el.querySelector('.cell').clientHeight
          if (height > nVal * 1.4) {
            const size = parseInt( getComputedStyle(this.$el.querySelector('.cell'))['font-size'] , 10 )
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
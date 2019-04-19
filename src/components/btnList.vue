<template>
  <div class="btnList">
    <input type="button" v-for="(i) in filtedValues" :key="name + i" :value="i" @click="$emit('biubiubiu',i)">
    <input v-if="values.length > limitNumber" class="trigger" type="button" :value="limit ? '>>>>' : '<<<<'" @click="limit = !limit">
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit } from 'vue-property-decorator';

@Component({
  data() {
    return {
      limit: true,
      limitNumber: 8
    }
  },
  computed:{
    filtedValues(){
      const values = this.$props.values
      return values.filter((a,idx)=>{
        return !this.$data.limit || idx <= this.$data.limitNumber
      })
    }
  },
  methods: {
    // biubiubiu(bullet :string){
    //   this.$emit('biubiubiu',bullet)
    // }
  }
})
export default class BtnList extends Vue {
  @Prop() private values !: string[];
  @Prop() private name !: string;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.trigger{
  // background: wheat;
  background: transparent;
  color:blueviolet;
  border: none;
}
</style>

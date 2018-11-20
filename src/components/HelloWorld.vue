<template>
  <div class="set">
      <div class="itemHead">
        <div class="cell from">来源</div>
        <div class="cell date">更新日期</div>
        <div class="cell name">综艺名</div>
        <div class="cell ep">EP</div>
        <div class="cell more"></div>
      </div>
      <div class="itemBody">
        <div class="cell from">B站</div>
        <div class="cell date">2019-08-10</div>
        <div class="cell name">IZONE CHU</div>
        <div class="cell ep">1</div>
        <div class="cell more">
          <Button>其他资源</Button>
        </div>
      </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class HelloWorld extends Vue {
  @Prop() private msg!: string;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.itemHead{
  margin-top: 10px;
}
.itemHead,.itemBody{
    display: flex;
  }
.cell{
  background: #efe;
}
.name{
  flex: 2;
}
.date,.ep{
  flex: 0.5;
}
.from,.more{
  flex:1;
}
</style>

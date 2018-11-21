<template>
  <div class="set">
    <Gold v-for="i in Golds" :key="i.id" :sqlId="i.id" :mainUrl='i.mainUrl'
      :from="i.from" :date="i.date" :name="i.name" :ep="i.ep"/>
    <Shovel @flash="flashData"/>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import axios from "axios"
import Gold from './Gold.vue';
import Shovel from './Shovel.vue';

@Component({
  data(){
    return {
      Golds:[]
    }
  },
  components: {
    Gold, Shovel
  },
  methods:{
    flashData(){
      axios.get('http://127.0.0.1:8360/izone/all')
      .then((golds)=>{
        this.$data.Golds = golds.data.data
      })
      .catch((err)=>{
        console.error(err)
      })
    }
  },
  mounted(){
    this.flashData();
  }
})
export default class Mine extends Vue {

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>

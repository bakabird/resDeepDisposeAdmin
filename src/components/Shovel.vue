<template>
  <div v-if="rdd">
    <div>
      from <input type="text" v-model="newFrom">
      date <input type="text" v-model="newDate">
      name <input type="text" v-model="newName">
      ep <input type="text" v-model="newEp">
      <div> mainUrl <input class="urlInput" type="text" v-model="newMainUrl"> </div>
      <input type="button" value="添加" @click="addItem">
    </div>
    <div v-if="revising">
      from <input type="text" v-model="reviseingFrom">
      date <input type="text" v-model="reviseingDate">
      name <input type="text" v-model="reviseingName">
      ep <input type="text" v-model="reviseingEp">
      <div>
        mainUrl <input class="urlInput" type="text" v-model="reviseingMainUrl">
      </div>
      <div>
        Other links 
        <div>name <input type="text"> link <input type="text"></div>
        <div>name <input type="text"> link <input type="text"></div>
      </div>
      <input type="button" value="修改" @click="revise">
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import axios from "axios"
import { Rock, WipedGold } from './Api'

@Component({
  data(){
    return {
      newDate: '',
      newEp: '',
      newFrom: '',
      newName: '',
      newMainUrl: '',

      reviseingDate: '',
      reviseingEp: '',
      reviseingFrom: '',
      reviseingMainUrl: '',
      reviseingName: '',
      reviseingId: -1,
    }
  },
  watch:{
    revisingObj(nVal){
      this.$data.reviseingDate = nVal.date
      this.$data.reviseingEp = nVal.ep
      this.$data.reviseingFrom = nVal.from
      this.$data.reviseingMainUrl = nVal.mainUrl
      this.$data.reviseingName = nVal.name
      this.$data.reviseingId = nVal.sqlId
    }
  },
  computed: {
    rdd() {
      return this.$store.state.rdd
    },
    revising() {
      return this.$store.state.revising
    },
    revisingObj() {
      return this.$store.state.revisingObj;
    }
  },
  methods:{
    async revise(){
      try {
        let obj: WipedGold = {
          mainUrl: this.$data.reviseingMainUrl,
          name: this.$data.reviseingName,
          date: this.$data.reviseingDate,
          from: this.$data.reviseingFrom,
          id: this.$data.reviseingId
        }
        if ( this.$data.reviseingEp != '' ){
          obj.ep = parseInt( this.$data.reviseingEp );
        }
        const response = await axios.post('http://127.0.0.1:8360/izone/upt',obj);
        this.$emit('flash')
      } catch (error) {
        console.error(error);
      }
    },
    async addItem(){
      try {
        let rock: Rock = {
          mainUrl: this.$data.newMainUrl,
          name: this.$data.newName,
          date: this.$data.newDate,
          from: this.$data.newFrom
        }
        if ( this.$data.newEp != '' ){
          rock.ep = parseInt( this.$data.newEp );
        }
        const response = await axios.post('/izone/add',rock);
        this.$emit('flash')
      } catch (error) {
        console.error(error);
      }
    }
  }
})
export default class Shovel extends Vue {
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.urlInput{
  width: 400px;
}
</style>

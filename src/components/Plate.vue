<template>
    <div class="plate" v-if="goldsOnPlate !== ''">
        <div class='closePanel' @click='closeClamp'>合上夹子「{{plateName}}」</div>
        <Golds 
        :GoldChain='goldsChain' :Sites='Sites' :Tags='Tags'
        :insideClamp='true' :showDate='false' :filter='filter'/>
    </div>
</template>
<script>
import Golds from './Golds.vue'

function isOneOf(itm, arr) {
  for (let i = 0; i < arr.length; i++) {
    if (itm === arr[i]) {
      return true
    }
  }
  return false
}

export default {
    components:{
        Golds
    },
    methods:{
        closeClamp(){
            this.$store.commit('updateGoldsOnPlate','')
            this.$store.commit('updatePlateName','')
        }
    },
    computed:{
        goldsOnPlate(){
            return this.$store.state.goldsOnPlate
        },
        plateName(){
            return this.$store.state.plateName
        },
        goldsChain(){
            const goldsId = this.goldsOnPlate.split(',').map(a => parseInt(a,10))
            const chain = this.$props.Golds.filter(obj => {
                return isOneOf(obj.id,goldsId)
            }) 
            return chain
        }
    },
    props:{
        Golds:{
            type: Array
        },
        Sites: {
            type: Array,
            default: ()=>{
                return []
            }
        },
        Tags: {
            type: Array,
            default: []
        },
        filter: {
            type: String,
            required: true
        }
    }
}
</script>

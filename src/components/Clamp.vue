<template>
    <div class="clamp" @click='openClamp'>
        <div class="cell title">
            {{name}}
            <span class='part' v-if="!!part">Part {{part}}</span>
            <span class='ep' v-else-if="!!ep">EP {{ep}}</span>
            <span v-else></span>
        </div>
        <div class="meta">
            <div class="cell tag">{{tag}}</div>
        </div>
    </div>
</template>
<script>
// click -> send the mesage to the mask -> show the mask
    import Golds from './Golds.vue'

    export default {
        name: 'clamp',
        components: { 
            Golds
        },
        methods:{
            openClamp(){
                this.$record('打开夹子', this.$props.name, 'default')
                this.$store.commit('updateGoldsOnPlate',this.$props.mainUrl)
                this.$store.commit('updatePlateName',this.$props.name)
            }
        },
        props: {
            chain:{
                type: Array,
                default: ()=>{
                    return []
                }
            },
            mainUrl:{
                type: String,
                required: true
            },
            name:{
                type: String,
                required: true
            },
            tag: {
                type: String,
                required: true
            },
            ep: {
                type: String
            },
            part: {
                type: String
            },

        },
    };
</script>

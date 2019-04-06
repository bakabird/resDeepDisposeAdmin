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
    export default {
        name: 'clamp',
        methods:{
            openClamp(){
                this.$record('打开夹子', this.$props.name, 'default')
                this.$emit('open')
                // this.$store.commit('updateGoldsOnPlate',this.$props.mainUrl)
                // this.$store.commit('updatePlateName',this.$props.name)
            }
        },
        props: {
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
                type: Number,
                required: false
            },
            part: {
                type: Number,
                required: false
            },

        },
    };
</script>

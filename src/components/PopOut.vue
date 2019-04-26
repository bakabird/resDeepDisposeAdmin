<template>
    <div>
        <div @click="show">
            <slot name='face'></slot>
        </div>
        <div v-if="popoutttt" class='PopOutBlock' @click.self="hide">
            <div class='PopOutBody'>
                <slot name='body'></slot>
            </div>
            <button @click="hide">关闭</button>
        </div>
    </div>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
    data(){
        return {
            popoutttt: false
        }
    },
    methods:{
        show(){
            this.popoutttt = true
            Vue.nextTick(()=>{
                this.$emit('pop')
            })
        },
        hide(){
            this.popoutttt = false
        }
    },
    props:{

    },
})
</script>

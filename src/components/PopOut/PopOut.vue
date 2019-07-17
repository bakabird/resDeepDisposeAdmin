<template>
    <div>
        <div @click="show">
            <slot name='face'>
            </slot>
        </div>
        <div v-if="popoutttt" class='PopOutBlock' @click.self="hide">
            <div class='PopOutBody'>
                <slot name='body'></slot>
            </div>
        </div>
    </div>
</template>
<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';

@Component({})
export default class PopOut extends Vue {
    private popoutttt: boolean = false
    private show() {
        this.popoutttt = true
        Vue.nextTick(() => {
            this.$emit('pop')
        })
    }
    private hide() {
        this.popoutttt = false
    }
}
</script>
<style lang="scss">
.PopOutBlock{
    position: fixed;
    z-index: 100000;
    bottom: 0;
    left:0;
    right: 0;
    top: 0;
    background: #0002;
    .PopOutBody{
        z-index: 200000;
        display: inline-block;
        margin: 0 auto;
        margin-top: 20vh;
        background: #ededed;
        border-radius: 7px;
        border: 1px solid #9f9f9f;
        padding: 10px;
        box-sizing: border-box;
    }
}
</style>

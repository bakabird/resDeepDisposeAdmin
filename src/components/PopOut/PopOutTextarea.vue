<template>
    <div>
        <PopOut>
            <template slot="face">
                {{title}}
            </template>
            <template slot="body">
                <textarea class="popout_textarea" v-on:change="$emit('input',$event.target.value)" v-bind:value="text"></textarea>
            </template>
        </PopOut>
    </div>
</template>
<script lang='ts'>
    import { Component, Vue, PropSync, Prop, Model } from 'vue-property-decorator'
    import PopOut from './PopOut.vue'

    @Component({ 
        components:{
            PopOut
        } 
    })
    export default class PopOutTextarea extends Vue {
        @Prop({default: "在此处输入你的表面值"}) title!:string
        @Model("input",{type: String}) text!: string
    }
</script>

<style lang="scss">
.popout_input_text{
    max-width: 95vw;
    width: 200px;
    height: 2em;
    border-radius: 10px;
    font-size: 1.3em;
}
.popout_input_longtext{
    max-width: 95ww;
    width: 400px;
    height: 2em;
    border-radius: 10px;
    font-size: 1.3em;
}
.popout_input_number{
    width: 60px;
}
.popout_textarea{
    width: 60vw;
    min-width: 640px;
    height: 50vh;
    min-height: 200px;
}
</style>

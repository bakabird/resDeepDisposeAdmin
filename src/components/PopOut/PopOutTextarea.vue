<template>
    <div>
        <PopOut @pop='autofocus("popout_input")'>
            <template slot="face">
                {{title}}
            </template>
            <template slot="body">
                <input type="text" v-model="textareaModel">
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
        @Model("change",{type: String}) textareaModel!: string
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
</style>

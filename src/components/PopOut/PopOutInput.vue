<template>
    <div>
        <PopOut @pop='autofocus("popout_input")'>
            <template slot="face">
                {{bindVal}}
            </template>
            <template slot="body">
                <input v-if='type === "number"' class='popout_input popout_input_number' v-bind:value="bindVal" v-on:change="$emit('change', $event.target.value)" type="number">
                <template v-if='type === "boolean"'>
                    <Button @click="$emit('change',!bindVal)">当前状态：{{ bindVal ? 'True' : 'False'}} 点击切换</Button>
                </template>
                <template v-if='type === "checkbox"'>
                    <template v-for="(val,key) in range">
                        <label :for='key' :key='"label_" + key'>{{val}}</label>
                        <input type='radio' :key='"radio_" + key' :id='key' v-model='radioVal' :value='key' />
                    </template>
                </template>
                <input v-if='type === "date"' class='popout_input popout_input_text' v-bind:value="bindVal" v-on:change="$emit('change', $event.target.value)" type="date">
                <input v-if='type === "text"' class='popout_input popout_input_text' v-bind:value="bindVal" v-on:change="$emit('change', $event.target.value)" type="text">
                <input v-if='type === "longtext"' class='popout_input popout_input_longtext' v-bind:value="bindVal" v-on:change="$emit('change', $event.target.value)" type="text">
            </template>
        </PopOut>
    </div>
</template>
<script lang='ts'>
    import { Component, Vue, Mixins, Model, Watch, Prop } from 'vue-property-decorator';
    import PopOut from './PopOut.vue'
    import IZONIVue from '../../IZONIVue';

    @Component({components:{PopOut}})
    export default class PopOutInput extends Mixins(IZONIVue) {
        radioVal:string = ""
        @Model("change",{type:[String, Number]}) readonly bindVal!: string | number
        @Prop({type: String,default: 'text'}) readonly type!: string
        @Prop(Object) readonly range!: object
        @Watch("radioVal")
        onRadioValWatch(nVal){
            this.$emit('change', nVal)
        }
        mounted(){
            this.$data.radioVal = this.$props.bindVal
        }
        autofocus(className) {
            if (this.$props.type !== 'boolean' && this.$props.type !== 'checkbox') {
                const that: any = this.$el.querySelector(`.${className}`)
                if (this.$props.type === 'number') {
                    that.focus()
                    that.select()
                } else {
                    that.select()
                }
            }
        }
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

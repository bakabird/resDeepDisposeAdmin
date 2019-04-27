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
                        <input type='radio' :key='"radio_" + key' :id='key' v-model='bindVal' :value='key' />
                    </template>
                </template>
                <input v-if='type === "date"' class='popout_input popout_input_text' v-bind:value="bindVal" v-on:change="$emit('change', $event.target.value)" type="date">
                <input v-if='type === "text"' class='popout_input popout_input_text' v-bind:value="bindVal" v-on:change="$emit('change', $event.target.value)" type="text">
                <input v-if='type === "longtext"' class='popout_input popout_input_longtext' v-bind:value="bindVal" v-on:change="$emit('change', $event.target.value)" type="text">
            </template>
        </PopOut>
    </div>
</template>
<script lang="ts">
import Vue from 'vue'
import PopOut from './PopOut.vue'

const counterWrap = {
    coutner: 0
}

export default Vue.extend({
    data() {
        return {
            popoutId: counterWrap.coutner++
        }
    },
    model: {
        prop: 'bindVal',
        event: 'change'
    },
    methods: {
        autofocus(className) {
            if (this.$props.type !== 'boolean' && this.$props.type !== 'checkbox') {
                const that: any = this.$el.querySelector(`.${className}`)
                that.select()
            }
        },
    },
    props: {
        bindVal: [String, Number],
        type: {
            type: String,
            default: 'text'
        },
        range: Object
    },
    components: {
        PopOut
    }
})
</script>
<template>
    <PopOut>
        <template slot="face">
            {{member_emoji_str}}
        </template>
        <template slot='body'>
            <div class="members">
                <template v-for="(emoji,name) in members_emoji_table">
                    <label :for="`${name}`" :key="name + 'label'">{{emoji}}</label>
                    <input type="checkbox" :value="name" :checked='members_arr.includes(name)' @change="dealCheck(name,$event.target.checked)" :id='`${name}`' :key="name + 'input'">
                </template>
                <div>
                    <input type="button" value="全不选" @click="$emit('change','')">
                    <input type="button" value="全选" @click="$emit('change','圆&樱&柔&椰&安&奈&权&惠&仁&彩&珉&燕')">
                    <input type="button" value="猫组" @click="$emit('change','樱&柔&椰&奈&珉')">
                    <input type="button" value="分手" @click="$emit('change','圆&安&权&惠&仁&彩&燕')">
                </div>
            </div>
        </template>
    </PopOut>
</template>
<script lang="ts">
import Vue from 'vue'
import PopOut from './PopOut.vue'
export default Vue.extend({
    data(){
        return {
            members_emoji_table: Vue.members
        }
    },
    methods:{
        dealCheck(name,checked){
            let new_members_arr = []
            if(checked && !this.members_arr.includes(name)){
                new_members_arr = [...this.members_arr,name]
            }else if(!checked && this.members_arr.includes(name)){
                new_members_arr = this.members_arr.filter(i => {
                    return i !== name
                })
            }
            this.$emit('change',new_members_arr.join('&'))
        }
    },
    computed:{
        members_arr(){
            return this.$props.members.split('&')
        },
        member_emoji_str() {
            const random_members_arr = this.members_arr.sort(() => {
                return Math.random() > 0.5 ? -1 : 1
            })
            let re = ''
            random_members_arr.forEach((i: string) => {
                re += this.members_emoji_table[i] || ''
            })
            return re === '' ? '无' : re
        }
    },
    components:{
        PopOut
    },
    model:{
        prop: 'members',
        event: 'change'
    },
    props:{
        members: String
    }
})
</script>

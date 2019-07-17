<template>
    <PopOut>
        <template slot="face">
            {{member_emoji_str}}
        </template>
        <template slot='body'>
            <div class="members">
                <template v-for="(emoji,name) in membersEmojiTable">
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
<script lang='ts'>
import { Component, Mixins, Model } from 'vue-property-decorator';
import PopOut from "./PopOut.vue"
import IZONIVue from '../../IZONIVue';

@Component({ components: { PopOut } })
export default class PopOutMembersEditor extends Mixins(IZONIVue) {
    public membersEmojiTable = this.MEMBERSTABLE
    @Model("change", {type: String}) public readonly members!: string
    get members_arr(): [any] {
        return this.$props.members === '' ? [] : this.$props.members.split('&')
    }
    get member_emoji_str(): string {
        const randomMembersArr = this.members_arr.sort(() => {
            return Math.random() > 0.5 ? -1 : 1
        })
        let re = ''
        randomMembersArr.forEach((i: string) => {
            re += this.membersEmojiTable[i] || ''
        })
        return re === '' ? '无' : re
    }

    public dealCheck(name: string, checked: boolean) {
        let newMemberArr: any = []
        if (checked && !this.members_arr.includes(name)) {
            newMemberArr = [...this.members_arr, name]
        } else if (!checked && this.members_arr.includes(name)) {
            newMemberArr = this.members_arr.filter(i => {
                return i !== name
            })
        }
        this.$emit('change', newMemberArr.join('&'))
    }
}
</script>

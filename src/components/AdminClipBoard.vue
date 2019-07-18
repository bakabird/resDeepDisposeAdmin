<template>
    <div class="clip_board" @mouseenter="adminHoving = true" @mouseleave="adminHoving = false" :style="{width: adminClipBoardWidthPx,right: adminHoving ? '0' : '-'+adminClipBoardWidthPx}">
        <div class="extendBtn" >
            <PopOutTextarea title="调整管理端剪贴板" v-model="adminClipBoardString"/>
            <button class="submitBtn" @click="reviseClipBoard">提交修改</button>
        </div>
        <div class="clipboard_body">
            <div class="clipboard_usearea_column" v-for="(words, usearea) in adminClipBoard" :key="'admin_clip_board_usearea_'+usearea">
                <div class="clipboard_usearea">
                    {{usearea}}
                </div>
                <div class="clipboard_word" v-for="word in words" :key="'admin_clip_board_usearea_'+usearea+'_word_'+word" @click="copy(word)">
                    {{word}}
                </div>
            </div>
        </div>
    </div>
</template>
<script lang='ts'>
import { Component, Vue, Mixins } from 'vue-property-decorator';
import { IZONEClipBoard } from "../DistInterface";
import IZONIVue from '../IZONIVue';
import PopOutTextarea from "./PopOut/PopOutTextarea.vue"
import axios from "axios"

@Component({components: {PopOutTextarea}})
export default class AdminClipBoard extends Mixins(IZONIVue) {
    private adminClipBoardString: string = "{}"
    private adminHoving: boolean = false

    get adminClipBoardWidth(): number {
        if (!!this.adminClipBoard) {
            const clipBoardUseareas = Object.keys(this.adminClipBoard)
            return clipBoardUseareas.length * 75
        } else {
            return 0
        }
    }
    get adminClipBoardWidthPx(): string {
        return this.adminClipBoardWidth + 'px'
    }
    get adminClipBoard(): IZONEClipBoard {
        return JSON.parse(this.adminClipBoardString)
    }

    private mounted(): void {
        this.fetchIZONEAdminClipBoard()
    }
    private copy(copyWord: string) {
        const input = document.createElement('input')
        input.type = "text"
        input.value = copyWord
        document.body.append(input)
        input.select()
        document.execCommand("Copy")
        document.body.removeChild(input)
    }
    private async fetchIZONEAdminClipBoard(): Promise<void> {
        try {
            const res = await axios.get(this.ROOTPATH  + "/util/getVal", {
                params: {
                    key: 'IZONEAdminClipBoard'
                }
            })
            if (res.data && res.data.data !== "") {
                const adminClipBoard = JSON.parse(res.data.data)
                this.adminClipBoardString = res.data.data
            } else {
                this.adminClipBoardString = "{}"
            }
        } catch (err) {
            this.$ERROR(err)
        }
    }
    private async reviseClipBoard() {
        try {
            const res = await axios.post(this.ROOTPATH + "/util/setVal", {
                key: 'IZONEAdminClipBoard',
                string: JSON.stringify(JSON.parse(this.adminClipBoardString), null, 2)
            })
        } catch (err) {
            this.$ERROR(err)
        }
    }
}
</script>
<style lang="scss" scoped>
.clip_board{
    position: fixed;
    top: 0;
    z-index: 999999;
    height: 100vh;
    background: #ececec;
    transition: all .42s;
}
.extendBtn{
    position: absolute;
    height: 200px;
    width: 20px;
    left: -20px;
    top: calc(70vh - 50px);
    background: #bfbfbf;
    border-radius: 20px;
    .submitBtn{
        background: #7eff30;
        width: 20px;
        color: #bfbfbf;
        padding: 0;
    }
}
.clipboard_body{
    display: flex;
    .clipboard_usearea_column{
        flex-direction: column;
        display: flex;
        flex: 1;
        .clipboard_usearea,.clipboard_word{
            flex: 1;
            background: #24657f;
            color: #ffe730;
            font-size: 20px;
        }
        .clipboard_usearea{
            font-weight: bold;
        }
        .clipboard_word{
            background: #3f823c;
            border-top: 2px solid #ececec;
            color: #ffc130;
            font-size: 15px;
        }
        .clipboard_word:hover{
            background: #823c4b;
            color: #fad25b;
            font-weight: bold;
        }
    }
}
</style>


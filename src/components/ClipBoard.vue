<template>
    <div class="clip_board" @mouseenter="hoving = true" @mouseleave="hoving = false" :style="{width: clipBoardWidthPx,right: hoving ? '0' : '-'+clipBoardWidthPx}">
        <div class="extendBtn" >
            <PopOutTextarea title="调整剪贴板" v-model="clipBoardString"/>
            <button class="submitBtn" @click="reviseClipBoard">提交修改</button>
        </div>
        <div class="clipboard_body">
            <div class="clipboard_usearea_column" v-for="(words, usearea) in clipBoard" :key="'clip_board_usearea_'+usearea">
                <div class="clipboard_usearea">
                    {{usearea}}
                </div>
                <div class="clipboard_word" v-for="(word,index) in words" :key="'clip_board_usearea_'+usearea+'_word_'+word+'_index_'+index" @click="copy(word)">
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
export default class ClipBoard extends Mixins(IZONIVue) {
    private clipBoardString: string = "{}"
    private hoving: boolean = false

    get clipBoardWidth(): number {
        if (!!this.clipBoard) {
            const clipBoardUseareas = Object.keys(this.clipBoard)
            return clipBoardUseareas.length * 75
        } else {
            return 0
        }
    }
    get clipBoardWidthPx(): string {
        return this.clipBoardWidth + 'px'
    }
    get clipBoard(): IZONEClipBoard {
        return JSON.parse(this.clipBoardString)
    }

    private mounted(): void {
        this.fetchIZONEClipBoard()
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
    private async fetchIZONEClipBoard(): Promise<void> {
        try {
            const res = await axios.get(this.ROOTPATH  + "/util/getVal", {
                params: {
                    key: 'IZONEClipBoard'
                }
            })
            if (res.data && res.data.data !== "") {
                const clipBoard = JSON.parse(res.data.data)
                this.clipBoardString = res.data.data
            } else {
                this.clipBoardString = "{}"
            }
        } catch (err) {
            this.$ERROR(err)
        }
    }
    private async reviseClipBoard() {
        try {
            const res = await axios.post(this.ROOTPATH + "/util/setVal", {
                key: 'IZONEClipBoard',
                string: JSON.stringify(JSON.parse(this.clipBoardString), null, 2)
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
    height: 100px;
    width: 20px;
    left: -20px;
    top: calc(20vh - 50px);
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


<template>
    <div class="clip_board" :style="{width: clipBoardWidthPx}">
        <PopOutTextarea />
    </div>
</template>
<script lang='ts'>
    import { Component, Vue, Mixins } from 'vue-property-decorator';
    import { IZONEClipBoard } from "../DistInterface";
    import IZONIVue from '../IZONIVue';
    import PopOutTextarea from "./PopOut/PopOutTextarea.vue"
    import axios from "axios"

    @Component({components:{PopOutTextarea}})
    export default class ClipBoard extends Mixins(IZONIVue) {
        private clipBoard: IZONEClipBoard = {}

        get clipBoardWidth():number{
            if(!!this.clipBoard){
                const clipBoardUseareas = Object.keys(this.clipBoard)
                return clipBoardUseareas.length * 25
            }else{
                return 0
            }
        }
        get clipBoardWidthPx():string{
            return this.clipBoardWidth + 'px'
        }

        private mounted():void{
            this.fetchIZONEAdminClipBoard()
        }
        private async fetchIZONEAdminClipBoard():Promise<void>{
            try{
                const res = await axios.get(this.ROOTPATH  + "/util/getVal",{
                    params:{
                        key: 'IZONEAdminClipBoard'
                    }
                })
                if(res.data && res.data.data !== ""){
                    const clipBoard = JSON.parse(res.data)
                    this.clipBoard = clipBoard
                }
            }catch(err){
                console.error(err)
            }
        }
    }
</script>
<style lang="scss">
.clip_board{
    position: fixed;
    right: 0;
    top: 0;
    z-index: 999999;
    height: 100vh;
    background: red;
    transition: all .42s;
}
</style>


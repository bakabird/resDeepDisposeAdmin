<template>
    <div class='dashboard'>
        <button class="actionBtn" @click="$emit('switchPart','Setting')">设置</button>
        <button class="actionBtn" @click="$emit('switchPart','Manage')">管理纸条</button>
        <div>
            <button class="actionBtn" @click="wholeInspection">🐞全体检查！</button>
            <!-- <a target="_blank" href="/static/izone/InsepectionResult.json">查看结果</a> -->
        </div>
    </div>
</template>
<script lang='ts'>
import axios from 'axios'
import { Component, Vue, Mixins } from 'vue-property-decorator';
import IZONIVue from '../IZONIVue';

@Component({})
export default class DashBoard extends Mixins(IZONIVue) {
    public async wholeInspection() {
        axios.get(this.ROOTPATH + '/izoneAdmin/cheackInvalid')
        .then(res => {
            this.$LOG(res)
        })
        .catch(err => {
            this.$ERROR(err)
        })
    }
}
</script>
<style lang="scss">
.dashboard{
    position: fixed;
    left: -100px;
    top: 0;
    height: 100vh;
    width: 100px;
    border-right: 1px solid #c9c9c9;
    background: #ececec;
    z-index: 100000;
}
.dashboard::after{
    content: "";
    position: absolute;
    height: 30px;
    width: 40px;
    right: -20px;
    top: calc(50vh - 30px);
    background: #bfbfbf;
    border-radius: 20px;
}
.dashboard:hover{
    left: 0;
    transition: all .42s;
}
</style>

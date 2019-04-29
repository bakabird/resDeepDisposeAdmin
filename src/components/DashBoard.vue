<template>
    <div class='dashboard'>
        <button @click="$emit('switchPart','Setting')">设置</button>
        <button @click="$emit('switchPart','Manage')">管理纸条</button>
        <div>
            <button @click="wholeInspection">🐞全体检查！</button>
            <a target="_blank" href="/static/izone/InsepectionResult.json">查看结果</a>
        </div>
    </div>
</template>
<script lang="ts">
    import Vue from 'vue'
    import axios from 'axios'

    export default Vue.extend({
        methods:{
            async wholeInspection() {
                axios.get(Vue.rootPath + '/izoneAdmin/wholeInspection')
                .then(res => {
                    Vue.log(res)
                })
                .catch(err => {
                    Vue.error(err)
                })
            },
        }
    })
</script>
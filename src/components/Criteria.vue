<template>
    <div>
        <textarea v-model="newCriteriaString" name="newCriteriaString" id="newCriteriaString" cols="30"
            rows="10"></textarea>
        <div>
            <div class='btnGroup'>
                <button class='actionBtn' @click="paintNewCriteria">更新图像</button>
                <button class='actionBtn' @click="$emit('revise',newCriteriaString)">提交修改</button>
                <button class='actionBtn' @click="$emit('hide')">隐藏</button>
            </div>
            <table>
                <tr>
                    <th>
                        类别名
                    </th>
                    <th>
                        包括
                    </th>
                </tr>
                <tr v-for="(val,key) in criteria" :key="key + '_criteria'">
                    <td>{{key}}</td>
                    <td>{{val.toString()}}</td>
                </tr>
            </table>
        </div>
    </div>
</template>
<script lang='ts'>
    import { Component, Vue, Prop } from 'vue-property-decorator';

    @Component({})
    export default class Criteria extends Vue {
        newCriteriaString:String = '{}'
        criteria:Object = {}
        @Prop({type: String, required:true}) criteriaString: string
        paintNewCriteria():void{
            this.criteria = JSON.parse(this.$data.newCriteriaString)
        }
        mounted(){
            this.$data.newCriteriaString = this.$props.criteriaString
            this.paintNewCriteria()
        }
    }
</script>

<style lang="scss">

#newCriteriaString{
  font-size: 12px;
}

#newCriteriaString{
  width: 100%;
  font-size: 13px;
}

</style>

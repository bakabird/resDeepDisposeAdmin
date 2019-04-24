<template>
    <div>
        <textarea v-model="newCriteriaString" name="newCriteriaString" id="newCriteriaString" cols="30"
            rows="5"></textarea>
        <div>
            <button @click="paintNewCriteria">更新图像</button>
            <button @click="$emit('revise',newCriteriaString)">提交修改</button>
            <button @click="$emit('hide')">隐藏</button>
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
<script>
    export default {
        data() {
            return {
                newCriteriaString: '{}',
                criteria: {}
            }
        },
        computed: {},
        props: {
            criteriaString: {
                type: String,
                required: true
            }
        },
        methods: {
            paintNewCriteria() {
                this.criteria = JSON.parse(this.$data.newCriteriaString)
            }
        },
        mounted() {
            this.$data.newCriteriaString = this.$props.criteriaString
            this.paintNewCriteria()
        }
    }
</script>
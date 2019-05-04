<template>
    <PopOut>
        <template slot="face">
            {{TAG}}
        </template>
        <template slot='body'>
            <div class="tagWrap">
                <div class='curTag'>
                    <input type="text" :value="TAG" @change="$emit('change',$event.target.value)">
                </div>
                <Table>
                    <tr>
                        <th>大类</th>
                        <th>小类</th>
                    </tr>
                    <tr v-for="(tag,key) in tags" :key="key + '_tag_group'" class="tag">
                        <td>{{key}}</td>
                        <td>
                            <btnList :values="tag" :name="tag" v-on:biubiubiu="changeTag" />
                        </td>
                    </tr>
                </Table>
            </div>
        </template>
    </PopOut>
</template>
<script>
    import PopOut from './PopOut.vue'
    import btnList from '../btnList.vue'
    export default {
        components: {
            PopOut,
            btnList
        },
        model: {
            prop: 'TAG',
            event: 'change'
        },
        methods: {
            changeTag(nval) {
                this.$emit('change', nval)
            }
        },
        props: {
            TAG: String,
            tags: Object
        }
    }
</script>
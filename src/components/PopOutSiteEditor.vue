<template>
    <PopOut>
        <template slot="face">
            {{SITE}}
        </template>
        <template slot='body'>
            <div>
                <input type="text" :value="SITE" @change="$emit('change',$event.target.value)">
            </div>
            <btnList :values="sites" :name="sites" v-on:biubiubiu="changeSite" />
        </template>
    </PopOut>
</template>
<script>
    import PopOut from './PopOut.vue'
    import btnList from './btnList.vue'
    export default {
        components: {
            PopOut,
            btnList
        },
        model: {
            prop: 'SITE',
            event: 'change'
        },
        methods: {
            changeSite(nval) {
                this.$emit('change', nval)
            }
        },
        props: {
            SITE: String,
            sites: Object
        }
    }
</script>
<template>
    <div class="bar clamp" :class="{'clamp-open': hasOpen}">
        <div class="title" @click='openClamp'>
            {{name}}
            <span class='part' v-if="!!part">Part {{part}}</span>
            <span class='ep' v-else-if="!!ep">EP {{ep}}</span>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'clamp',
        data() {
            return {
                open: false
            }
        },
        methods: {
            openClamp() {
                if (!this.$props.hasOpen) {
                    this.$emit('triggle')
                }
            }
        },
        props: {
            mainUrl: {
                type: String,
                required: true
            },
            name: {
                type: String,
                required: true
            },
            tag: {
                type: String,
                required: true
            },
            ep: {
                type: Number,
                required: false
            },
            part: {
                type: Number,
                required: false
            },
            hasOpen: {
                type: Boolean,
                default: false
            }
        },
    };
</script>
<style lang="scss">
@import "../color";

.clamp {
    .title {
        display: block;
        line-height: 2em;
        font-size: 2em;
        font-weight: bold;
        text-decoration: none;
    }
}

</style>

<template>
    <div class="bar clamp" :class="{'clamp-open': hasOpen}" @click='triggle'>
        <div class="title">
            {{name}}
            <span class='part' v-if="!!part">Part {{part}}</span>
            <span class='ep' v-else-if="!!ep">EP {{ep}}</span>
        </div>
        <!-- <div class="meta">
            <div class="tag">{{tag}}</div>
        </div> -->
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
            triggle() {
                if (this.$props.hasOpen) {
                    this.$record('关闭夹子', this.$props.name, "" + this.$props.ep + this.$props.part)
                } else {
                    this.$record('打开夹子', this.$props.name, "" + this.$props.ep + this.$props.part)
                }
                this.$emit('triggle')
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
    .meta {
        .tag {
            flex: 1;
        }
    }
}

.cushion {
  background: $clamp_open_bgcolor;
  color: $clamp_open_color;
  height: 40px;
  line-height: 40px;
  font-weight: bold;
}

.inClamp{
    border-left: 10px solid $clamp_open_bgcolor;
    border-right: 10px solid $clamp_open_bgcolor;
    border-bottom: none;
}

.clamp {
    background: $clamp_bgcolor;
    color: $clamp_color;

    .cell {
        color: $clamp_color;
    }
    &.clamp-open {
        background: $clamp_open_bgcolor;
        color: $clamp_open_color;
        border-bottom: none;
    }
}
</style>

<template>
    <div class="clamp">
        <Notice
          v-for="notice in notices"
          :key="notice.name"
          :name="notice.name"
          :className="notice.type"
          :styles="notice.styles"
          :content="notice.content"
        >
        </Notice>
    </div>
</template>
<script>
    import Notice from './Notice.vue';
    import Vue from 'vue'

    export default {
        components: { Notice },
        props: {
        },
        data () {
            return {
                notices: [],
            };
        },
        computed: {
        },
        methods: {
            add (notice) {
              Vue.set(this.notices,this.notices.length,notice)
            },
            close (name) {
              const notices = this.notices;
              for (let i = 0; i < notices.length; i++) {
                  if (notices[i].name === name) {
                      this.notices.splice(i, 1);
                      break;
                  }
              }
            },
        }
    };
</script>
<style scoped>
.clamp{
  font-size: 14px;
  position: fixed;
  width: 100%;
  z-index: 1010;
  top: 16px;
  text-align: center;
  left: 0;
  pointer-events: none;
}
</style>

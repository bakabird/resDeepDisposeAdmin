<template>
    <div class="golds" :class="{ 
        tomorrow: dateDescription === '明天',
        theDayAfterTomorrow: dateDescription === '后天' || dateDescription === '未来',
    }">
        <div class="date" v-if="PostersSorted.length !== 0">
            {{dateDescription}} {{ PostersSorted[0].date != '66-66-66' ? PostersSorted[0].date : '' }}
        </div>
        <template v-for="(poster,idx) in PostersSorted">
            <Poster v-if="poster.itemType === 'note' || poster.itemType === 'clamp'"
                :noShell="poster.date === '66-66-66'" :itemType='poster.itemType' :tags='Tags'
                @openClamp='clampOpened[poster.id] = true' :onHead='idx === 0'
                :onFloor='idx === PostersSorted.length - 1' :sites='Sites' :inClamp='poster.inClamp !== -1'
                :key="poster.id + '_poster_' + idx" :sqlId="poster.id" :mainUrl='poster.mainUrl' :date="poster.date"
                :name="poster.name" :site="poster.site" :up="poster.up" :tag="poster.tag" :ep="poster.ep"
                :part="poster.part" :bakedTime="poster.bakedTime" 
                :isRaw="poster.isRaw" :isCut="poster.isCut" :invalid="poster.invalid"
                :members="poster.members" :flashSignal='flashSignal'
                @finishEdit='$emit("finishEdit")' @moveUp='moveUp(idx)' @moveDown='moveDown(idx)' />
        </template>
    </div>
</template>

<script lang='ts'>
    import {
        Component,
        Vue,
        Prop,
        Mixins
    } from 'vue-property-decorator';
    import Poster from './Poster.vue'

    import axios from 'axios'
    import moment from 'moment'
    import IZONIVue from '../IZONIVue';

    @Component({
        components: {
            Poster
        }
    })
    export default class Page extends Mixins(IZONIVue) {
        private clampOpened: object = {}
        @Prop() private PageContent!: [] 
        @Prop() private Sites!: []
        @Prop() private Tags!: []
        @Prop() private flashSignal!: number;

        get dateDescription() {
            const posters:any = this.PageContent
            const date = posters[0].date
            let dateDescription = ''
            if (date !== '66-66-66') {
                const validDate = '20' + date
                dateDescription = moment(validDate).fromNow()
                if (moment(validDate).isSame(moment().subtract(2, 'day'), 'day')) {
                    dateDescription = '前天'
                } else if (moment(validDate).isSame(moment().subtract(1, 'day'), 'day')) {
                    dateDescription = '昨天'
                } else if (moment(validDate).isSame(moment(), 'day')) {
                    dateDescription = '今天'
                } else if (moment(validDate).isSame(moment().add(1, 'day'), 'day')) {
                    dateDescription = '明天'
                } else if (moment(validDate).isSame(moment().add(2, 'day'), 'day')) {
                    dateDescription = '后天'
                } else if (moment(validDate).isAfter(moment(), 'day')) {
                    dateDescription = '未来'
                } else {
                    dateDescription = ''
                }
            } else {
                dateDescription = '置顶'
            }
            return dateDescription
        }
        get clampMarkBook() {
            const posters:any = this.PageContent
            const newClampMarkBook = {}
            posters.map(poster => {
                const inClamp = poster.inClamp
                if (inClamp !== '') {
                    newClampMarkBook[inClamp] = newClampMarkBook[inClamp] || []
                    newClampMarkBook[inClamp].push(poster)
                }
            })
            return newClampMarkBook
        }
        get PostersSorted() {
            let pageSorted:any = []
            const pagePosters = this.PageContent
            const pagePostersWithoutPostersInClamp = this.PageContent.filter((poster:any) => {
                return poster.inClamp === ''
            })
            const clampMarkBook = this.clampMarkBook
            const clampOpened = this.clampOpened

            for (const _poster of pagePostersWithoutPostersInClamp) {
                const poster:any = _poster
                pageSorted.push(poster)
                if (poster.itemType === 'clamp') {
                    const id = poster.id
                    const postersInTheClamp = clampMarkBook[id]
                    if (clampOpened[id]) {
                        pageSorted = [...pageSorted, ...postersInTheClamp]
                    }
                }
            }

            return pageSorted
        }

        private mounted() {
            const clampOpened = {}
            this.$props.PageContent.map(poster => {
                if (poster.inClamp !== '') {
                    const inClamp = poster.inClamp
                    clampOpened[inClamp] = clampOpened[inClamp] || false
                }
            })
            this.$data.clampOpened = clampOpened
        }

        // MOVE FUNCTION -x *****
        private async moveUp(idx :number) {
            // 找到上一个
            const me:any = this.PostersSorted[idx]
            const faceUp:any = this.PostersSorted[idx - 1]
            await axios.post(this.ROOTPATH + '/izoneAdmin/update', {
                id: me.id,
                index: faceUp.index + 1
            })
            this.$emit('finishEdit')
        }
        private async moveDown(idx :number) {
            // 找到下一个
            const me:any = this.PostersSorted[idx]
            const buttDown:any = this.PostersSorted[idx + 1]
            await axios.post(this.ROOTPATH + '/izoneAdmin/update', {
                id: me.id,
                index: buttDown.index - 1
            })
            this.$emit('finishEdit')
        }
        // MOVE FUNCTION +x *****

    }
</script>


<style lang="scss">
    @import "../color";

    // 时间相关
    .tomorrow {
        opacity: .5;
    }

    .theDayAfterTomorrow {
        opacity: .25;
    }
</style>
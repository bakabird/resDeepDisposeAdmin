<template>
    <div class="golds" :class="{ 
        tomorrow: dateDescription === '明天',
        theDayAfterTomorrow: dateDescription === '后天' || dateDescription === '未来',
    }">
        <div class="date" v-if="PostersSorted.length !== 0">
            {{dateDescription}} {{ PostersSorted[0].date != '66-66-66' ? PostersSorted[0].date : '' }}
        </div>
        <template v-for="(i,idx) in PostersSorted">
            <Poster v-if="i.itemType === 'note'" :noShell="i.date === '66-66-66'" :itemType='i.itemType' :tags='Tags'
                :onHead='idx === 0' :onFloor='idx === PostersSorted.length - 1'
                :sites='Sites' :inClamp='i.inClamp !== -1' :key="i.id + '_poster_' + idx" :sqlId="i.id"
                :mainUrl='i.mainUrl' :date="i.date" :name="i.name" :site="i.site" :up="i.up" :tag="i.tag" :ep="i.ep"
                :part="i.part" :index="i.index" :bakedTime="i.bakedTime" :isRaw="i.isRaw" :isCut="i.isCut"
                :members="i.members" :flashSignal='flashSignal' @finishEdit='$emit("finishEdit")' @moveUp='moveUp(idx)' @moveDown='moveDown(idx)'/>
            <div :key="i.id + '_goldCushion_' + idx" v-if="i.itemType === 'cushion' && clampOpened[i.inClamp]"
                @click="clampOpened[i.inClamp] = false" class='bar cushion'>合上夹子</div>
            <Clamp v-if="i.itemType === 'clamp'" @triggle="clampOpened[i.id] = !clampOpened[i.id]"
                :hasOpen="clampOpened[i.id]" :noShell="i.date === '66-66-66'" :key="i.id + '_clamp_' + idx"
                :sqlId="i.id" :mainUrl='i.mainUrl' :name="i.name" :tag="i.tag" :ep="i.ep" :part="i.part"
                :index="i.index" :bakedTime="i.bakedTime" :members="i.members" />
        </template>
    </div>
</template>
<script>
    import Vue from 'vue'

    import Poster from './Poster.vue'
    import Clamp from './Clamp.vue'
    import axios from 'axios'


    import moment from 'moment'

    export default {
        name: 'page',
        data() {
            return {
                clampOpened: {

                },
            }
        },
        methods: {
            async moveUp(idx){
                // 找到上一个
                const me = this.PostersSorted[idx]
                const faceUp = this.PostersSorted[idx - 1]
                await axios.post(Vue.rootPath + '/izoneAdmin/update',{
                    id: me.id,
                    index: faceUp.index + 1
                })
                this.$emit('finishEdit')
            },
            async moveDown(idx){
                // 找到下一个
                const me = this.PostersSorted[idx]
                const buttDown = this.PostersSorted[idx + 1]
                await axios.post(Vue.rootPath + '/izoneAdmin/update',{
                    id: me.id,
                    index: buttDown.index - 1
                })
                this.$emit('finishEdit')
            }
        },
        computed: {
            dateDescription() {
                const posters = this.PageContent
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
            },
            clampMarkBook() {
                const posters = this.PageContent
                const newClampMarkBook = {}
                posters.map(poster => {
                    const inClamp = poster.inClamp
                    if (inClamp !== -1) {
                        newClampMarkBook[inClamp] = newClampMarkBook[inClamp] || []
                        newClampMarkBook[inClamp].push(poster)
                    }
                })
                return newClampMarkBook
            },
            PostersSorted() {
                let pageSorted = []
                const pagePosters = this.PageContent
                const pagePostersWithoutPostersInClamp = this.PageContent.filter((poster) => {
                    return poster.inClamp === -1;
                })
                const clampMarkBook = this.clampMarkBook
                const clampOpened = this.clampOpened

                for (const poster of pagePostersWithoutPostersInClamp) {
                    pageSorted.push(poster)
                    if (poster.itemType === 'clamp') {
                        const id = poster.id
                        const postersInTheClamp = clampMarkBook[id]
                        if (clampOpened[id]) {
                            pageSorted = [...pageSorted, ...postersInTheClamp, {
                                itemType: 'cushion',
                                inClamp: id
                            }]
                        }
                    }
                }

                return pageSorted
            },
            rdd() {
                return this.$store.state.rdd
            },
        },
        components: {
            Poster,
            Clamp,
        },
        mounted() {
            const clampOpened = {}
            this.$props.PageContent.map(poster => {
                const inClamp = poster.inClamp
                clampOpened[inClamp] = clampOpened[inClamp] || false
            })
            this.$data.clampOpened = clampOpened
        },
        props: {
            PageContent: {
                type: Array,
                default: () => {
                    return []
                }
            },
            Sites: {
                type: Array,
                default: () => {
                    return []
                }
            },
            Tags: {
                type: Object,
                default: () => {
                    return {}
                }
            },
            flashSignal: {
                type: Number
            }
        }
    }
</script>

<style lang="scss">

@import "../color";

.bar {
    position: relative;
    border-bottom: 2px solid #fff;
    background: $normal_bgcolor;

    table {
        border: 1px solid #ffb4b4;
        border-radius: 3px;
        width: 100%;

        .btn{
            border: none;
            // background: #e4555b80;
            // color: #753838;
            background: #ffe4e580;
            color: #cb5959;
            border-radius: 4px;
            transition: .42s;
        }
        .btn:hover{
            background: #e4555bcc;
            color: #fff;
        }

        .name{
            font-size: 2em;
            font-weight: bold;
        }

        .th_url {
            background: #8aad7533;
            color: #a79898;
        }
        .th_url:hover{
            background: #5f8a47e6;
            color: #ffd1cc;
        }

        .th_type {
            background: #7589ad33;
            color: #a7a698;
        }

        .th_iscut {
            background: #a475ad33;
            color: #b3b292;
        }

        .th_part {
            background: #ad757533;
            color: #9992b3;
        }

        .th_ep {
            background: #ad9f7533;
            color: #a0b392;
        }

        .th_tag {
            background: #adac7533;
            color: #92b3b2;
        }

        .th_site {
            background: #75ad7c33;
            color: #9e92b3;
        }

        .th_up {
            background: #85a1ae33;
            color: #b3b292;
        }

        .th_memberstr {
            background: #b17da933;
            color: #b292b3;
        }

        .th_date{
            background: #c5828233;
            color: #92b3b2;
        }
    }
}

.title {
    display: block;
    line-height: 2em;
    font-size: 1.3em;
    font-weight: bold;
    text-decoration: none;
}

.titleMeta {
    font-size: 12px;
    opacity: .6;
}

.meta {
    display: flex;
    flex-wrap: wrap;
    font-size: 12px;
}

// 时间相关

.tomorrow {
    opacity: .5;
}

.theDayAfterTomorrow {
    opacity: .25;
}

</style>

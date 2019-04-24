<template>
    <div class="golds" :class="{ 
        tomorrow: dateDescription === '明天',
        theDayAfterTomorrow: dateDescription === '后天' || dateDescription === '未来',
    }">
        <div class="date" v-if="GoldChainSorted.length !== 0">
            {{dateDescription}} {{ GoldChainSorted[0].date != '66-66-66' ? GoldChainSorted[0].date : '' }}
        </div>
        <template v-for="(i,idx) in GoldChainSorted">
            <template v-if="!i.edit">
                <template v-if="rdd">
                    <!-- 调试模式时 -->
                    <Poster v-if="i.itemType === 'note'" :noShell="i.date === '66-66-66'" :inClamp='i.inClamp !== -1'
                        :key="i.id + '_poster_' + idx" :sqlId="i.id" :mainUrl='i.mainUrl' :date="i.date" :name="i.name"
                        :site="i.site" :up="i.up" :tag="i.tag" :ep="i.ep" :part="i.part" :index="i.index"
                        :bakedTime="i.bakedTime" :isRaw="i.isRaw" :isCut="i.isCut" :members="i.members" />
                    <button :key="`${i.id}_toEditBtn`" @click="toEdit(i.goldNo)">编辑【{{i.id}}】</button>
                    <!-- <div :key="i.id + '_board_' + idx" v-if="i.inClamp !== -1">🎈🎈🎈🎈🎈🎈🎈🎈🎈🎈🎈</div> -->
                </template>
                <template v-else>
                    <!-- 用户使用时 -->
                    <Poster v-if="i.itemType === 'note' && clampOpened[i.inClamp]" :noShell="i.date === '66-66-66'"
                        :inClamp='i.inClamp !== -1' :key="i.id + '_poster_' + idx" :sqlId="i.id" :mainUrl='i.mainUrl'
                        :date="i.date" :name="i.name" :site="i.site" :up="i.up" :tag="i.tag" :ep="i.ep" :part="i.part"
                        :index="i.index" :bakedTime="i.bakedTime" :isRaw="i.isRaw" :isCut="i.isCut"
                        :members="i.members" />
                    <div :key="i.id + '_goldCushion_' + idx"
                        v-else-if="i.itemType === 'cushion' && clampOpened[i.inClamp]"
                        @click="clampOpened[i.inClamp] = false" class='bar cushion'>合上夹子</div>
                </template>
                <Clamp v-if="i.itemType === 'clamp'" @triggle="clampOpened[i.id] = !clampOpened[i.id]"
                    :hasOpen="clampOpened[i.id]" :noShell="i.date === '66-66-66'" :key="i.id + '_clamp_' + idx"
                    :sqlId="i.id" :mainUrl='i.mainUrl' :name="i.name" :tag="i.tag" :ep="i.ep" :part="i.part"
                    :index="i.index" :bakedTime="i.bakedTime" :members="i.members" />
            </template>
            <Molecule v-else :sites="Sites" :tags="Tags" :key="i.id + '_molecule_' + idx" :sqlId="i.id"
                :itemType='i.itemType' :mainUrl='i.mainUrl' :date="i.date" :name="i.name" :site="i.site" :up="i.up"
                :tag="i.tag" :ep="i.ep" :part="i.part" :index="i.index" :isRaw="i.isRaw" :isCut="i.isCut"
                :members="i.members" @finishEdit="$emit('finishEdit')" />
        </template>
    </div>
</template>
<script>
    import Vue from 'vue'

    import Poster from './Poster.vue'
    import Clamp from './Clamp.vue'
    import Molecule from './Molecule.vue'

    import moment from 'moment'

    export default {
        name: 'page',
        data() {
            return {
                clampOpened: {

                }
            }
        },
        methods: {
            toEdit(goldNo) {
                this.$emit('edit', goldNo)
            }
        },
        computed: {
            dateDescription() {
                const chain = this.GoldChain
                const date = chain[0].date
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
            GoldChainSorted() {
                const chainSorted = []

                const clampOpened = {
                    '-1': true
                }
                const clampMarkBook = {}
                const chain = this.GoldChain.filter(gold => {
                    const inClamp = gold.inClamp
                    if (inClamp !== -1) {
                        clampOpened[inClamp] = clampOpened[inClamp] || false
                        clampMarkBook[inClamp] = clampMarkBook[inClamp] || []
                        clampMarkBook[inClamp].push(gold)
                    }
                    return inClamp === -1
                })
                this.clampOpened = clampOpened


                for (const gold of chain) {
                    chainSorted.push(gold)
                    if (gold.itemType === 'clamp') {
                        const id = gold.id
                        const clampNotes = clampMarkBook[id]
                        for (const note of clampNotes) {
                            chainSorted.push(note)
                        }
                        if (!this.rdd) {
                            chainSorted.push({
                                itemType: 'cushion',
                                inClamp: id
                            })
                        }
                    }
                }

                return chainSorted
            },
            rdd() {
                return this.$store.state.rdd
            },
        },
        components: {
            Poster,
            Molecule,
            Clamp
        },
        props: {
            GoldChain: {
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
            }
        }
    }
</script>
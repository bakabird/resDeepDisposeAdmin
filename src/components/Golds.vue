<template>
    <div class="golds" :class="{ 
        tomorrow: dateDescription === '明天',
        theDayAfterTomorrow: dateDescription === '后天' || dateDescription === '未来',
    }">
        <div class="date" v-if="GoldChainSorted.length !== 0 && showDate">
            {{dateDescription}} {{ GoldChainSorted[0].date != '66-66-66' ? GoldChainSorted[0].date : '' }}
        </div>
        <template v-for="(i,idx) in GoldChainSorted">        
            <template v-if="!i.edit">
                <template v-if="rdd">
                    <!-- 调试模式时 -->
                    <Gold 
                    v-if="i.itemType === 'note'"
                    :noShell="i.date === '66-66-66'"
                    :key="i.id + '_gold_' + idx" 
                    :sqlId="i.id" :mainUrl='i.mainUrl' :date="i.date" :name="i.name" 
                    :site="i.site" :up="i.up" :tag="i.tag"
                    :ep="i.ep" :part="i.part" :index="i.index"
                    :bakedTime="i.bakedTime" :isRaw="i.isRaw" :isCut="i.isCut"
                    :members="i.members" />
                    <button :key="`${i.id}_toEditBtn`" @click="toEdit(i.goldNo)">编辑【{{i.id}}】</button>
                </template>
                <template v-else>
                    <!-- 用户使用时 -->
                    <Gold 
                    v-if="i.itemType === 'note' && clampOpened[i.inClamp]"
                    :noShell="i.date === '66-66-66'"
                    :key="i.id + '_gold_' + idx" 
                    :sqlId="i.id" :mainUrl='i.mainUrl' :date="i.date" :name="i.name" 
                    :site="i.site" :up="i.up" :tag="i.tag"
                    :ep="i.ep" :part="i.part" :index="i.index"
                    :bakedTime="i.bakedTime" :isRaw="i.isRaw" :isCut="i.isCut"
                    :members="i.members" />
                    <div 
                    v-else-if="i.itemType === 'cushion' && clampOpened[i.inClamp]" 
                    @click="clampOpened[i.inClamp] = false"
                    class='closePanel'>合上夹子</div>
                </template>
                <Clamp 
                v-if="i.itemType === 'clamp'"
                @open="clampOpened[i.id] = !clampOpened[i.id]"
                :noShell="i.date === '66-66-66'"
                :key="i.id + '_clamp_' + idx" 
                :sqlId="i.id" :mainUrl='i.mainUrl' :name="i.name" 
                :tag="i.tag"
                :ep="i.ep" :part="i.part" :index="i.index"
                :bakedTime="i.bakedTime"
                :members="i.members" />
            </template>
            <GoldEdit 
            v-else
            :sites="Sites" :tags="Tags"
            :key="i.id + '_goldEdit_' + idx" 
            :sqlId="i.id" :itemType='i.itemType' :mainUrl='i.mainUrl' :date="i.date" :name="i.name" 
            :site="i.site" :up="i.up" :tag="i.tag"
            :ep="i.ep" :part="i.part" :index="i.index"
            :isRaw="i.isRaw" :isCut="i.isCut"
            :members="i.members" 
            @finishEdit="$emit('finishEdit')"/>
        </template>
    </div>
</template>
<script>
import Vue from 'vue'
import Gold from './Gold.vue'
import Clamp from './Clamp.vue'
import GoldEdit from './GoldEdit.vue'

import moment from 'moment'
// import { isOneOf, sortIndex, sortRaw } from './sort.js'

export default {
    name: 'golds',
    data(){
        return {
            clampOpened:{

            }
        }
    },
    methods:{
        toEdit(goldNo) {
            this.$emit('edit',goldNo)
        }
    },
    computed:{
        dateDescription(){
            let chain = this.GoldChain
            let date = chain[0].date
            let dateDescription = ''
            if(date !== '66-66-66'){
                dateDescription = moment('20' + date).fromNow()
                if( moment('20'+date).isSame(moment().subtract(2,'day'),'day') ){
                    dateDescription = '前天'
                }else if( moment('20'+date).isSame(moment().subtract(1,'day'),'day') ){
                    dateDescription = '昨天'
                }else if( moment('20'+date).isSame(moment(),'day') ){
                    dateDescription = '今天'
                }else if( moment('20'+date).isSame(moment().add(1,'day'),'day') ){
                    dateDescription = '明天'
                }else if( moment('20'+date).isSame(moment().add(2,'day'),'day') ){
                    dateDescription = '后天'
                }else if( moment('20'+date).isAfter(moment(),'day') ){
                    dateDescription = '未来'
                }else{
                    dateDescription = ''
                }
            }else{
                dateDescription = '置顶'
            }
            return dateDescription
        },
        GoldChainSorted(){
            let chainSorted = []

            let clampOpened = {
                '-1': true
            }
            let clampMarkBook = {}
            let chain = this.GoldChain.filter( gold => {
                const inClamp = gold.inClamp
                if(inClamp !== -1){
                    clampOpened[inClamp] = clampOpened[inClamp] || false
                    clampMarkBook[inClamp] = clampMarkBook[inClamp] || []
                    clampMarkBook[inClamp].push(gold)
                }
                return inClamp === -1
            })
            this.clampOpened = clampOpened
            

            for(let gold of chain){
                chainSorted.push(gold)
                if(gold.itemType === 'clamp'){
                    const id = gold.id
                    let clampNotes = clampMarkBook[id]
                    for(let note of clampNotes){
                        chainSorted.push(note)
                    }
                    if(!this.rdd){
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
    components:{
        Gold, GoldEdit, Clamp
    },
    props:{
        GoldChain:{
            type: Array,
            default: ()=>{
                return []
            }
        },
        Sites: {
            type: Array,
            default: ()=>{
                return []
            }
        },
        Tags: {
            type: Array,
            default: []
        },
        showDate: {
            type: Boolean,
            default: true
        },
        insideClamp: {
            type: Boolean,
            default: false
        }
    }
}
</script>

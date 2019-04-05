<template>
    <div class="golds" :class="{ 
        tomorrow: dateDescription === '明天',
        theDayAfterTomorrow: dateDescription === '后天' || dateDescription === '未来',
    }">
        <div class="date" v-if="GoldenChainShow.length !== 0 && showDate">
            {{dateDescription}} {{ GoldenChainShow[0].date != '66-66-66' ? GoldenChainShow[0].date : '' }}
        </div>
        <template v-for="(i,idx) in GoldenChainShow">        
            <Gold 
            v-if="(!rdd || !i.edit) && i.itemType === 'note'"
            :noShell="i.date === '66-66-66'"
            :key="i.id + '_gold_' + idx" 
            :sqlId="i.id" :mainUrl='i.mainUrl' :date="i.date" :name="i.name" 
            :site="i.site" :up="i.up" :tag="i.tag"
            :ep="i.ep" :part="i.part" :index="i.index"
            :bakedTime="i.bakedTime" :isRaw="i.isRaw" :isCut="i.isCut"
            :members="i.members" />
            <Clamp 
            v-if="(!rdd || !i.edit) && i.itemType === 'clamp'"
            :noShell="i.date === '66-66-66'"
            :key="i.id + '_clamp_' + idx" 
            :sqlId="i.id" :mainUrl='i.mainUrl' :date="i.date" :name="i.name" 
            :site="i.site" :up="i.up" :tag="i.tag"
            :ep="i.ep" :part="i.part" :index="i.index"
            :bakedTime="i.bakedTime" :isRaw="i.isRaw" :isCut="i.isCut"
            :members="i.members" />
            <GoldEdit 
            v-if="rdd && i.edit"
            :sites="Sites" :tags="Tags"
            :key="i.id + '_goldEdit_' + idx" 
            :sqlId="i.id" :itemType='i.itemType' :mainUrl='i.mainUrl' :date="i.date" :name="i.name" 
            :site="i.site" :up="i.up" :tag="i.tag"
            :ep="i.ep" :part="i.part" :index="i.index"
            :isRaw="i.isRaw" :isCut="i.isCut"
            :members="i.members" 
            @finishEdit="$emit('finishEdit')"/>
            <button v-if="rdd && !i.edit" :key="`${i.id}_toEditBtn`" @click="toEdit(i)">编辑【{{i.id}}】</button>
        </template>
    </div>
</template>
<script>
import Vue from 'vue'
import Gold from './Gold.vue'
import Clamp from './Clamp.vue'
import GoldEdit from './GoldEdit.vue'
import moment from 'moment'


// 筛选
function isOneOf(itm, arr) {
  for (let i = 0; i < arr.length; i++) {
    if (itm === arr[i]) {
      return true
    }
  }
  return false
}
function sortIndex(a, b) {
  return b.index - a.index
}
function sortRaw(a, b) {
  return a.isRaw - b.isRaw
}

export default {
    name: 'golds',
    methods:{
        toEdit(gold) {
            this.$emit('edit',gold.goldNo)
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
        rdd() {
            return this.$store.state.rdd
        },
        GoldenChainShow() {
            // 预先添加日期为66-66-66的条目;
            let chain = this.GoldChain
            let date = chain[0].date
            if(date !== '66-66-66'){
                switch (this.filter) {
                    case 'GroupVariety':
                    // 团综：团综、小团综、团综花絮、SHOWCON
                    chain = chain.filter( i => ( isOneOf(i.tag, ['团综', '小团综', '团综花絮', 'SHOWCON']) ) )
                    break
                    case 'Stage':
                    // 舞台：练习室、舞台、典礼舞台
                    chain = chain.filter( i => ( isOneOf(i.tag, ['练习室', '舞台', '典礼舞台']) ) )
                    break
                    case 'Album':
                    // 专辑：MV披露、音源、MV、MV花絮、专辑花絮
                    chain = chain.filter( i => ( isOneOf(i.tag, ['MV披露', '音源', 'MV', 'MV花絮', '专辑花絮']) ) )
                    break
                    case 'Ceremony':
                    // 典礼：颁奖、典礼配料、红毯、受赏、典礼舞台、典礼花絮
                    chain = chain.filter( i => ( isOneOf(i.tag, ['颁奖', '典礼配料', '红毯', '受赏', '典礼舞台', '典礼花絮']) ) )
                    break
                    case 'Radio':
                    // 电台
                    chain = chain.filter( i => ( isOneOf(i.tag, ['电台']) ) )
                    break
                    case 'Variety':
                    // 综艺：采访、综艺、综艺花絮
                    chain = chain.filter( i => ( isOneOf(i.tag, ['采访', '综艺', '综艺花絮']) ) )
                    break
                    case 'Live':
                    // 直播：SHOWROOM、Vlive、直播
                    chain = chain.filter( i => ( isOneOf(i.tag, ['SHOWROOM', 'Vlive', '直播']) ) )
                    break
                }
            }

            chain = chain.sort(sortIndex)
            chain = chain.sort(sortRaw)
            if(!this.$props.insideClamp) chain = chain.filter(i => i.inClamp === -1)

            return chain
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
        filter: {
            type: String,
            required: true
        },
        insideClamp: {
            type: Boolean,
            default: false
        }
    }
}
</script>

<template>
    <div :class='"wechat "+randomMark'>
        <div class="content"
            v-for='(val,key) in gatherdata' 
            :key='key'
            >
            <div class="title-package" @click.stop = 'more_click( val)'>
                <span class="title">{{ val.name}}</span>
                <span class="more">更多</span>
            </div>
            <div class="cell-package">
                <div class="cell"
                    v-for='(cellval,cellkey) in val.items' 
                    :key='cellkey'
                    @click.stop = 'detail_click( cellval)'
                >
                    <div class="img">
                        <img :src="cellval.thumb">
                    </div>
                    <div class="title">
                        <span >{{ cellval.title}}</span>
                    </div>
                    <div class="other">
                        <span class="time">{{ getTimeFormatter( parseFloat(cellval.publish_at)*1000) }}</span>
                        <span class="read">{{ cellval.hits_fake+'阅'}}</span>
                    </div>
                </div>
            </div>
        </div>
        <div></div>
    </div>
</template>

<script type="text/javascript">

    export default {
        data () {
            return {  
                gatherdata:[],
                randomMark:(new Date()).getTime(),
            }
        },
        watch:{
            wwechatData:function (newVal,oldVal ) {
                let self = this
                
            }
        },
        created(){
            let self = this
            self.gatherdata = self._props.wwechatData
        },
        mounted(){
            let self = this
            
        },
        props: ['wwechatData'],
        components:{
        },
        methods:{
            //更多点击
            more_click( val_){
                let self = this
                val_.id_wchat = 'more'
                self.$emit( 'cell_wechat_click',val_)
            },

            //点击进入详情内容
            detail_click( val_){
                let self = this
                val_.id_wchat = 'detail'
                // $.click_news_into_particular( val_)
                self.$emit( 'cell_wechat_click',val_)
            },
            
            getRandomClassName(){
                let self = this
                return '.'+self.randomMark
            },

            getTimeFormatter( date_ ){
                let date = new Date( date_ )
                let M = date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1
                let D = date.getDate() < 10 ? '0'+date.getDate() : date.getDate()
                let H = date.getHours() < 10 ? '0'+date.getHours() : date.getHours()
                let m = date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes()
                let S = date.getSeconds() < 10 ? '0'+date.getSeconds() : date.getSeconds()
                return M+'-'+D+' '+H+':'+m
            },

            /**
            ********************************************************************************
            */
        }
    }
</script>

<style scoped lang="less">
    @bgColor:#fff;
    .margin(...){
        margin:@arguments;
    }
    .padding(...){
        padding:@arguments;
    }
    .any(@selec,@value,@selec1,@value1){
        @{selec}:@value;
        @{selec1}:@value1;
    }
    .border(...){
        border:@arguments;
    }
    .calc_lessthan_100(@selec,@total,@value){
        @{selec}:calc( @total - @value );
    } 
    .absolutel(@top,@right,@bottom,@left){
        position: absolute;
        left:@left;
        right:@right;
        top:@top;
        bottom:@bottom;
    }
    .color(@selec,@value){
        @{selec}:@value;
    }
    .font(@value){
       font-size: @value; 
    }
    .set_center{
        display: inline-block;
        vertical-align: middle;
    }

    //设置样式
    .wechat{
        background: @bgColor;
        .any(width,100%,min-height,100%);
        .padding(15px);
        .title-package{
            position: relative;
            .padding(10px,0);
            .title{
                .font(22px);
            }
            .more{
                position: absolute;
                right: 0;
                top: 50%;transform: translateY(-50%);
                .font(13px);
                font-weight: 300;
            }
        }
        .cell-package{
            position: relative;
            white-space: nowrap;
            overflow: scroll;
            .cell{
                .set_center;
                .border( 1px solid #ddd);
                white-space: normal;
                margin-right: 20px;
                width: 160px;
                .img{
                    width: 100%;
                    height: 90px;
                    img{
                        width: 100%;
                        height: 100%;
                    }
                }
                .title{
                    height: 50px;
                    .padding(10px 5px); 
                    .font(14px);
                    span{
                        text-overflow: ellipsis;
                        overflow: hidden;
                        display: -webkit-box;
                        -webkit-line-clamp: 2; 
                        -webkit-box-orient: vertical;
                    }  
                }
                .other{
                    .padding(10px 5px); 
                    .font(12px);
                    .color(color,#898989);
                    position: relative;
                    .read{
                        position: absolute;
                        right: 5px;
                        top: 50%;transform: translateY(-50%);
                    }
                }
            }
        }
    }

</style>
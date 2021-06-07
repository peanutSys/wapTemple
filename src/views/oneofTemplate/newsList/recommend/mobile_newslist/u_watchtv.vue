<template>
    <div class="tv-radio">
        <div class="live-replay">
            <!-- <div 
                v-for='(lval,lkey) in liveReplayinfo'
                :key='lkey'
                v-if= 'tv_radio_show == 0'
                class="live-type-btn" 
                @click.stop='live_playback_click( lkey)'>
                <span>{{lval}}</span>
            </div> -->
        </div>
        <div class="live-program" v-if=' live_replay_show == 0'>
            <div 
                v-for='(pval,pkey) in programList'
                :key='pkey'
                class="live-channel-btn" 
                v-if=' tv_radio_show == 0'
                @click.stop='live_channel_click( pkey)'>
                <span>{{pval.name}}</span>
            </div>
            <div class="video-div">
                <video id="live_video" class="video video-js vjs-default-skin vjs-big-play-centered" preload="meta" controls playsinline="true" controlslist="nodownload" poster="http://shixiantest.oss-cn-hangzhou.aliyuncs.com/48/posts/2021/01/18/7a7afb340b076d063abdfd5f53f0a729.png" disablePictureInPicture></video>
                <div class="radio-logo" v-if= 'tv_radio_show == 1'>
                    <img class="logo" :src="live_programCell.logo">
                    <span class="title">{{live_programCell.name_title}}</span>
                </div>                                   
                
            </div>
            <div class="date" v-loading='dateLoading' >
                <img :src="imgs[0]" @click.stop='live_program_data_click( 0)'> 
                <span >{{ live_programCell.station_date }}</span>
                <img :src="imgs[1]" @click.stop='live_program_data_click( 1)'>
            </div>
            <ul class="program-list">
                <li 
                    v-for='(plval,plkey) in live_programCell.list'
                    :key='plkey'
                    class="cell" 
                    @click.stop='live_program_click(plkey)'>   
                    <div class="load-up" v-if='plval.upload' @click.stop='load_up_program'>
                        <span>点击加载回放节目</span>
                    </div>
                    <span class="time" v-if='!plval.upload'>{{ getTimeFormatter( plval.play_time ,'time') }}</span>
                    <span class="title" v-if='!plval.upload'>{{ plval.program_title}}</span>
                    <span 
                        v-if='!plval.upload'
                        class="operator-button"
                        :key= 'live_programKey'
                        :style="function() {
                            let style_ = ''
                            if ( plval.program_status == 1 || plval.program_status == 2) {
                                style_ +='border-width:1px;'
                            }else{
                                style_ +='border-width:0px;'
                            }  

                            if ( plval.select_color) {
                                style_ += 'border-color:'+plval.select_color+';'+'color:'+plval.select_color+';'
                            }
                            return style_
                        }()">
                        {{ plval.program_status_text }}</span>
                </li>
            </ul>
        </div>
        <div class="replay-program" v-if=' live_replay_show == 1'>
            <div 
                v-for='(pval,pkey) in programList'
                :key='pkey'
                class="replay-cell" 
                @click.stop='replay_programlist_click( pval)'>
                <img :src=" pval.cover || pval.logo">
                <span class="name">{{pval.name}}</span>
            </div>
        </div>
        
    </div>
</template>

<script type="text/javascript">

    export default {
        data () {
            return {  
                pageWidth:375,
                //看电视、听广播切换
                tv_radio_show:0,
                //切换直播、点播
                live_replay_show:0,

                //日期相关参数
                imgs:[
                    require('static/img/backgo.png'),
                    require('static/img/forwardgo.png'),
                ],
                dateLoading:false,

                //点击的颜色
                select_color : '#3FB14F',

                //直播、点播
                liveReplayinfo:['直播','点播'],
                //直播、点播所有数据
                programList:[],
                //直播单元数据
                live_programCell:{},
                //直播单元中被选择的节目(不是频道)播放地址
                live_programUrl:'',
                //直播单元中被选择的节目(不是频道)刷新key
                live_programKey:'',
            }
        },
        watch:{
            mediaData:function(n){
                let self = this
                if ( n.type == 29) {
                    //看电视
                    self.tv_radio_show = 0
                    self.live_playback_click( 0)
                    
                }else if ( n.type == 30) {
                    //听广播
                    self.tv_radio_show = 1
                    self.get_media_data( 0,0)
                }
            },
            
        },components:{},
        props: ['mediaData'],
        created(){
            let self = this
            if ( self._props.mediaData.type == 29) {
                self.tv_radio_show = 0
                self.live_playback_click( 0)
            }
            else if ( self._props.mediaData.type == 30) {
                self.tv_radio_show = 1
                self.get_media_data( 0,0)
            }
        },
        mounted(){
            let self = this
            self.get_finger_print( (id_)=>{
                self.fingerpId = id_
            })
        },
        beforeDestroy(){
            let self = this
            self.videoplayer && self.videoplayer.dispose() 
            self.videoplayer = ''
        },
        methods:{
            //直播、点播点击; 已将直播、点播node节点注释，index_始终会是0
            live_playback_click( index_){
                let self = this
                self.$nextTick( ()=>{
                    $('.tv-radio').find('.live-type-btn').css({
                        color:'#000',
                    })
                    $('.tv-radio').find('.live-type-btn').eq(index_).css({
                        color:self.select_color,
                    })
                })
                self.live_replay_show = index_
                try{
                    if ( index_ !=0) {
                       self.videoplayer && self.videoplayer.dispose() 
                       self.videoplayer = ''
                    }
                }finally{
                    self.get_media_data( index_,0)
                } 
            },
            //获取直播、点播数据; index_:0是直播，1是点播，argms[0]频道索引，argms[1]节目单日期
            get_media_data( index_ ,...argms){
                let self = this 

                let url = $.ajaxGlobalUrl + ( self.tv_radio_show == 0 ? '/api/v1/wap/livesMul': '/api/v1/wap/lives'),
                type = self.tv_radio_show == 0 ? 'tv':'radio',
                timestamp = (new Date()).getTime()+'',
                date = argms[1] || self.getTimeFormatter( '','day'),
                paramJson = {
                    'appId':$.clinet_appid,
                    'clientId':$.clinet_clientid,
                    'date': date,
                    'version':$.clinet_appversion,
                    'type':type,
                    'ts':timestamp,
                    'md5': $.MD5($.clinet_appkey+timestamp+$.clinet_appid+$.clinet_clientid+date+type+$.clinet_appversion)
                }
                self.netWorking( url,'post',{'Content-Type':'application/json'},JSON.stringify( paramJson),(xhr)=>{
                    if ( xhr.responseJSON && xhr.responseJSON.code >=200 && xhr.responseJSON.code<400) {
                            let reponse_data = xhr.responseJSON.data
                            self.programList =  Array.isArray(reponse_data) ? reponse_data : [reponse_data]
                            if ( index_ == 0) 
                                self.$nextTick( ()=>{ self.live_channel_click( argms[0]) })
                            
                    }
                    self.dateLoading = false
                })
                
            },

            //直播频道点击
            live_channel_click( index_){
                let self = this 
                self.live_programCell = self.programList[index_]['program'] || {}
                self.live_programCell.logo = self.programList[index_]['logo'] || []
                self.live_programCell.name_title = self.programList[index_]['name'] || []
                self.live_programCell.epg = self.programList[index_]['epg'] || []
                //记录现在频道的索引
                self.current_channel_index = index_

                $('.tv-radio').find('.live-channel-btn').css({
                    color:'#000',
                })
                $('.tv-radio').find('.live-channel-btn').eq(index_).css({
                    color:self.select_color,
                })

                let all_list = self.live_programCell.list,
                segment_all = [],
                begin= 999999
                self.program_all_list = all_list

                all_list.forEach( (item,i)=>{
                    item.refreshKey = 'refresh'
                    if (item.program_status == 1  ) {
                        item.program_status_text ='回放'
                    }else if ( item.program_status == 2) {
                        item.program_status_text ='直播'
                        begin = i
                        segment_all.push( {upload:'1'})
                        segment_all.push( item)
                    }

                    if ( i > begin) 
                        segment_all.push( item)
                })
                self.live_programCell.list = segment_all.length == 0 ? all_list : segment_all

                self.live_program_click()
            },
            //点击节目单，切换播放的节目
            live_program_click( index_){
                let self = this,
                list = self.live_programCell.list
                list.forEach( (item,i)=>{
                    if ( (index_ == null && item.program_status == 2) || 
                         (index_ == i && (item.program_status == 1 || item.program_status == 2))
                        ) {
                        item.select_color = self.select_color
                        self.live_programKey = (new Date()).getTime()+''
                        
                        let url_f= self.live_programCell.epg[0],
                        url_p = (item.play_time) + ','+ (item.play_time+item.duration)
                        self.live_programUrl = item.program_status == 2 ? url_f : url_f+'/'+url_p

                        let timestamp_10 = Date.parse(new Date())/1000 +'', //十位时间戳
                        timestamp_md5_5 = $.MD5( timestamp_10.slice(5)), //时间戳后五位的md5
                        sourceid = 1014, //县融id
                        selfKey = '7ea5d67d5d703d7d5b981a26eaaa5e3e'
                        self.fingerpId ? play( item.program_status) :self.get_finger_print( (id_)=>{
                            self.fingerpId = id_
                            play( item.program_status)
                        }) //finger的标识符
                        //lOrR:1点播，lOrR:2直播
                        function play( lOrR){
                            let k_secret = $.MD5( timestamp_10+self.fingerpId+selfKey+timestamp_md5_5)
                            self.live_programUrl += '?'+'a='+sourceid+'&d='+self.fingerpId+'&k='+k_secret+'&t='+timestamp_10
                            
                            let ob_url = {
                                src: self.live_programUrl,
                                type :'application/x-mpegURL' 
                            } //hls的是mpeg ts流,type为'application/x-mpegURL'。rtmp的是type：'rtmp/flv'
                            !self.videoplayer ? self.videoplayer = videojs('live_video',{
                                playbackRates: [0.5,1,1.5,2,4],
                                fingerpId:self.fingerpId,
                                sourceid:sourceid,
                                selfKey:selfKey,
                            },function () {
                                this.src( ob_url)
                                this.play()
                            }) : (function(){
                                self.videoplayer.src( ob_url)
                                self.videoplayer.play()
                            }())
                            console.log( ob_url)
                        }
                        
                    }else{
                        item.select_color = ''
                    }
                })
            },
            //加载回放节目单
            load_up_program( ){
                let self = this
                self.live_programCell.list = self.program_all_list
            },
            //点击日期，切换不同日期节目单
            live_program_data_click( index_){
                let self = this,
                now_stamp = (new Date()).getTime(),
                day_timestamp = 1000*60*60*24,
                result_stamp = ''

                //记录显示的时间
                self.now_stamp = self.now_stamp || now_stamp
                if ( index_ == 0) 
                    //后退，减去一天
                    self.now_stamp -= day_timestamp
                else
                    //前进，加上一天
                    self.now_stamp += day_timestamp

                if ( self.now_stamp > now_stamp) {
                    //如果记录的时间比现在时间大，则归正成现在时间
                    self.now_stamp = now_stamp
                    return
                }
                self.dateLoading = true
                self.get_media_data(0, self.current_channel_index,self.getTimeFormatter(self.now_stamp,'day') )
            },

            //点播节目点击
            replay_programlist_click( val_){
                let self = this
            },
            //时间戳转换
            getTimeFormatter( date_,type ){
                let date = date_ ? new Date( date_) : new Date(),
                Y = date.getFullYear(),
                M = date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1 ,
                D = date.getDate() < 10 ? '0'+date.getDate() : date.getDate() ,
                H = date.getHours() < 10 ? '0'+date.getHours() : date.getHours() ,
                m = date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes() ,
                S = date.getSeconds() < 10 ? '0'+date.getSeconds() : date.getSeconds() 
                if ( type == 'day') {
                    return Y+'-'+M+'-'+D
                }else if ( type == 'time') {
                    return H+':'+m+':'+S
                } 
                return Y+'-'+M+'-'+D+' '+H+':'+m+':'+S
            },
            //加载手指打印标识符
            get_finger_print( cb){
                let self = this
                self.$fingerprint.load().then(fp => {
                    fp.get().then(result => {
                        const visitorId = result.visitorId
                        cb && cb( visitorId)
                    })
                })
            },
            netWorking( url ,method,header,dataParams,callback ){
                let self = this,
                operatorO = {
                    url:url,
                    type:method,
                    dataType:'json',
                    data:dataParams,
                    success:function (argument,message,xhr) {
                        callback(xhr)
                    },
                    error:function( xhr,error){ callback(xhr) }
                } 
                operatorO.headers = header
                $.ajax(operatorO)
            },
            /**
            ********************************************************************************
            */
        }
    }
</script>

<style scoped lang="less">
    .operator{
        .display(@v){
            display: @v;
        }
        .margin(...){
            margin:@arguments;
        }
        .width(@v){
            width: @v;
        }
        .height(@v){
            height: @v;
        }
        .borderbottom(...){
            border-bottom:@arguments;
        }
        .border(...){
            border:@arguments;
        }
        .calc(@selec,@total,@value){
            @{selec}:calc( @total - @value );
        }
    }
    .tv-radio{
        .live-replay{
            .live-type-btn{
                .operator > .display(inline-block);
                .operator > .width(50%);
                padding: 7px;
                text-align: center;
                font-size: 14px;
            }
            .operator > .borderbottom(1px,#eee,solid);
        }
        .live-program{
            overflow: scroll;
            .live-channel-btn{
                .live-replay .live-type-btn;
                .operator > .width(fit-content);
                font-size: 15px;
            }
            .video-div{
                .operator > .width(100%);
                .operator > .height(235px);
                position: relative;
                .video{
                    .operator > .width(100%);
                    .operator > .height(100%);
                }
                .radio-logo{
                    position: absolute;
                    left: 0;
                    top: 0;
                    // bottom: 0;
                    // right: 0;
                    // margin: auto;
                    .operator > .width(fit-content);
                    .operator > .height(fit-content);
                    .logo{
                        .operator > .width(50px);
                        vertical-align: middle;
                    }
                    .title{
                        .operator > .display(inline-block);
                        vertical-align: middle; 
                        font-size: 18px;
                        color:#fff;
                    }
                } 
            }
            
            .date{
                font-size: 0;
                .operator > .margin(0,10px,10px);
                padding: 10px 5px 0;
                span{
                    .operator > .display(inline-block);
                    font-size: 14px;
                    color:#4a4a4a;
                    font-weight: bold;
                    vertical-align: middle;
                    padding: 0 12px;
                } 
                img{
                    .operator > .display(inline-block);
                    width: 12px;
                    vertical-align: middle;
                }
            }
            .program-list{
                .cell{
                    list-style: none;
                    font-size: 15px;
                    &:active{
                        background:#ededed;
                    }
                    .operator > .margin(0,20px,20px);
                    span{
                       .operator > .display(inline-block); 
                       vertical-align: middle;
                    }
                    .load-up{
                        .operator > .display(inline-block);
                        .operator > .width(100%);
                        .operator > .border(1px,#ededed,solid);
                        border-radius: 5px;
                        padding: 5px;
                        font-size: 13px;
                        text-align: center;
                        &:hover{
                            background: #ddd;
                        }
                    }
                    .title{
                        margin-left: 30px;
                        .operator > .calc(width,100%,30px+20px+20px+110px); 
                    }
                    .operator-button{
                        padding: 2px 10px;
                        font-size: 13px;
                        .operator > .border(1px,#bbb,solid);
                        color:#bcbcbc;
                        float: right;
                        &:focus{
                            background:#fff;
                        }
                    }
                }
            }
        }
        .replay-program{
            .operator > .margin(10px,20px,0);
            .replay-cell{
                .operator > .display(inline-block);
                .operator > .calc(width,50%,8px); 
                text-align: center;
                margin-bottom: 10px;
                img{
                    .operator > .width(100%); 
                    .operator > .height(100px); 
                    object-fit: contain;
                }
                .name{
                    font-size: 15px;
                }
                &:nth-of-type(even){
                    margin-left: 16px;
                }
            }
        }


    }
    
</style>
<style lang="less">
    .date{
        .el-loading-spinner{
            margin-top: -11px !important;
            .circular{
                width: 22px !important; 
                height: 22px !important;
                margin-left: 70px;
                float: left;
            }
        }  
    }
</style>
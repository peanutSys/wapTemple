<template>
    <div class="tv-radio">
        <div class="video-div">
            <video id="live_video" class="video video-js vjs-default-skin vjs-big-play-centered" preload="meta" controls playsinline="true" poster="http://shixiantest.oss-cn-hangzhou.aliyuncs.com/48/posts/2021/01/18/7a7afb340b076d063abdfd5f53f0a729.png" controlslist="nodownload" disablePictureInPicture></video>
            
            <div class="title-logo" v-if= 'tv_radio_show == 1'>
                <img class="logo" :src="live_programCell.logo">
                <span class="title">{{live_programCell.name}}</span>
            </div>                                   
        </div>
        <div class="live-replay">
            <div 
                v-for='(lval,lkey) in liveReplayinfoArr'
                :key='lkey'
                class="live-type-btn" 
                @click.stop='live_playback_click( lval,lkey)'>
                <span>{{lval.name}}</span>
            </div>
        </div>
        <div class="live-program" >
            <!-- <div 
                v-for='(pval,pkey) in programList'
                :key='pkey'
                class="live-channel-btn" 
                v-if=' tv_radio_show == 0'
                @click.stop='live_channel_click( pkey)'>
                <span>{{pval.name}}</span>
            </div> -->
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
                    @click.stop='live_program_click(plval)'>   
                    <!-- <div class="load-up" v-if='plval.upload' @click.stop='load_up_program'>
                        <span>点击加载回放节目</span>
                    </div> -->
                    <span class="time" >{{ getTimeFormatter( plval.playTime ,'time') }}</span>
                    <span class="title" >{{ plval.name}}</span>
                    <span 
                        class="operator-button"
                        :key= 'live_programKey'
                        :style="function() {
                            let style_ = ''
                            if ( plval.replay == 1) {
                                style_ +='border-width:1px;'
                            }else if ( plval.replay == 2) {
                                style_ += ('border-width:0px;' +'color:'+select_color)
                            }else {
                                style_ +='border-width:0px;'
                            }    
                            return style_
                        }()">
                        {{ plval.replay == 2 ? '播放中' : plval.replay == 1 ? '播放' : '' }}</span>
                </li>
            </ul>
        </div>
        <!-- <div class="replay-program" >
            <div 
                v-for='(pval,pkey) in programList'
                :key='pkey'
                class="replay-cell" 
                @click.stop='replay_programlist_click( pval)'>
                <img :src=" pval.cover || pval.logo">
                <span class="name">{{pval.name}}</span>
            </div>
        </div> -->
        
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
                live_replay_show:0, //0:直播，1:颠簸

                //日期相关参数
                imgs:[
                    require('static/img/backgo.png'),
                    require('static/img/forwardgo.png'),
                ],
                dateLoading:false,

                //点击的颜色
                select_color : 'rgb(0, 147, 221)',

                //直播、点播
                liveReplayinfoArr:[],
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
            },
            
        },components:{},
        props: ['mediaData'],
        created(){
            let self = this
            if ( self._props.mediaData.link.type == 'tv') 
                self.tv_radio_show = 0
            else if ( self._props.mediaData.link.type == 'radio') 
                self.tv_radio_show = 1
            
            self.get_top_tabbar()
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
            //获取直播、点播tabbar顶部按钮
            get_top_tabbar(){
                let self = this
                let url = $.ajaxGlobalUrl + '/api/fusion/channels/getTVChannels',
                type = self.tv_radio_show == 0 ? 'tv':'radio',
                paramJson = {
                    'appId':$.clinet_appid,
                    'type':type
                }
                self.netWorking( url,'get',{'Content-Type':'application/json'},paramJson,(xhr)=>{
                    if ( xhr.responseJSON && xhr.responseJSON.code >=200 && xhr.responseJSON.code<400) {
                        self.liveReplayinfoArr = xhr.responseJSON.data || []
                        self.live_playback_click( self.liveReplayinfoArr[0],0)
                    }
                })
            },
            //顶部tabbar点击
            live_playback_click( lval,lkey){
                let self = this

                self.liveReplayinfoCurrent = lval
                self.live_replay_show = ( lval.hasLive == 1 ? 0 : 1)
                self.$nextTick( ()=>{
                    $('.tv-radio').find('.live-type-btn').css({
                        color:'#000',
                    })
                    $('.tv-radio').find('.live-type-btn').eq( lkey).css({
                        color:self.select_color,
                    })
                })
                try{
                    if ( self.live_replay_show !=0) {
                       self.videoplayer && self.videoplayer.dispose() 
                       self.videoplayer = ''
                    }
                }finally{
                    self.get_media_data( lval,0)
                } 
            },
            //获取直播、点播数据; lval:直播、点播顶部tabbar数据，argms[0]频道索引，argms[1]节目单日期
            get_media_data( lval ,...argms){
                let self = this 

                let url = $.ajaxGlobalUrl + '/api/fusion/programs/getProgramsInfo',
                type = self.tv_radio_show == 0 ? 'tv':'radio',
                date = argms[0] || self.getTimeFormatter( '','day'),
                paramJson = {
                    'appId':$.clinet_appid,
                    'channelId':lval.id,
                    'date': date,
                    'type':type,
                }
                self.netWorking( url,'get',{'Content-Type':'application/json'},paramJson,(xhr)=>{
                    if ( xhr.responseJSON && xhr.responseJSON.code >=200 && xhr.responseJSON.code<400) {
                            let reponse_data = xhr.responseJSON.data
                            self.programList =  reponse_data
                            // if ( index_ == 0) 
                            self.$nextTick( ()=>{ self.get_programlist() })
                            
                    }
                    self.dateLoading = false
                })
                
            },

            //获取节目单列表
            get_programlist(){
                let self = this 
                self.live_programCell = {
                    list: self.programList.list,
                    station_date: self.programList.date,
                    logo:self.liveReplayinfoCurrent.logo,
                    name:self.liveReplayinfoCurrent.name
                }

                let all_list = self.live_programCell.list,
                segment_all = [],
                current_live = { index:0}
                self.program_all_list = all_list

                all_list.forEach( (item,i)=>{
                    let currentdate = (new Date()).getTime()
                    if ( currentdate >item.playTime && 
                        currentdate < (item.playTime+self.get_millisecond( item.duration)) 
                    ) {
                        current_live.index =  i
                    }else if (currentdate >item.playTime) {
                        if (item.allowReplay == 1  ) {
                            item.replay = 1
                        }
                    }
                    segment_all.push( item)   
                })
                //设置当前直播的节目
                segment_all[ current_live.index].replay = 2 //当前正在播放


                self.live_programCell.list = segment_all.length == 0 ? all_list : segment_all
                self.live_program_click( segment_all[ current_live.index])
            },

            //点击节目单，切换播放的节目
            live_program_click( item){
                let self = this

                self.live_programCell.list.forEach( ( item_)=>{
                    item_.replay == 2 ? item_.replay = 1 : null
                })

                item.replay = 2 //当前正在播放
                self.live_programKey = (new Date()).getTime()+''
                
                let streamUrls = self.liveReplayinfoCurrent.streamUrls
                let url_f= streamUrls[0].url,
                url_p = (item.playTime) + ','+ (item.playTime+self.get_millisecond( item.duration))
                self.live_programUrl = url_f+'/'+url_p

                let timestamp_10 = Date.parse(new Date())/1000 +'', //十位时间戳
                timestamp_md5_5 = $.MD5( timestamp_10.slice(5)), //时间戳后五位的md5
                sourceid = 1028, //县融id
                selfKey = '7ea5d67d5d703d7d5b981a26eaaa5e3e'
                self.fingerpId ? play() :self.get_finger_print( (id_)=>{
                    self.fingerpId = id_
                    play()
                }) //finger的标识符
                //lOrR:1点播，lOrR:2直播
                function play( lOrR){
                    let k_secret = $.MD5( timestamp_10+self.fingerpId+selfKey+timestamp_md5_5)
                    self.live_programUrl += '?'+'a='+sourceid+'&d='+self.fingerpId+'&k='+k_secret+'&t='+timestamp_10
                    
                    let ob_url = {
                        src: self.live_programUrl,
                        type :'application/x-mpegURL' 
                    }, //hls的是mpeg ts流,type为'application/x-mpegURL'。rtmp的是type：'rtmp/flv'
                    hideVideoframe = ( )=>{
                        //播放广播时，隐藏视频帧
                        $('.video-div').find('.vjs-poster').css('display','block')
                    }
                    !self.videoplayer ? self.videoplayer = videojs('live_video',{
                        playbackRates: [0.5,1,1.5,2,4],
                        fingerpId:self.fingerpId,
                        sourceid:sourceid,
                        selfKey:selfKey,
                    },function () {
                        this.src( ob_url)
                        this.play()
                        self.tv_radio_show == 1 ? setTimeout(function() { hideVideoframe()}, 500) : null
                    }) : (function(){
                        self.videoplayer.src( ob_url)
                        self.videoplayer.play()
                        self.tv_radio_show == 1 ? setTimeout(function() { hideVideoframe()}, 500) : null
                    }())
                    console.log( ob_url)
                }
            },
            //获取毫秒
            get_millisecond( ms){
                let self = this,
                ms_arr = ms.split(':'),
                msarr_len = ms_arr.length,
                h = parseInt( ms_arr[0])*3600,
                m = parseInt( ms_arr[1])*60,
                s = parseInt( ms_arr[2])
                return (h+m+s)*1000
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
                self.get_media_data(self.liveReplayinfoCurrent,self.getTimeFormatter(self.now_stamp,'day') )
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
                    return H+':'+m
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
        .video-div{
            .operator > .width(100%);
            .operator > .height(235px);
            position: relative;
            .video{
                .operator > .width(100%);
                .operator > .height(100%);
            }
            .title-logo{
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%,-50%);
                .logo{
                    width: 50px;
                    vertical-align: middle;
                }
                .title{
                    .logo;
                    display: inline-block;
                    width: fit-content;
                    font-size: 18px;
                    color:#fff;
                }
            } 
        }
        .live-replay{
            margin: 12px auto;
            white-space: nowrap;
            overflow: scroll;
            .live-type-btn{
                .operator > .display(inline-block);
                // .operator > .width(50%);
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
                        .operator > .border(1px,black,solid);
                        border-radius: 10px;
                        color:black;
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
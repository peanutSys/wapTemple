<template>
    <div :class='"content-parti "+randomMark' >
        <!-- 播放视频/加载h5 -->
        <div class="content-detail" v-if='cptype == 0'>
            <iframe class="detail-iframe" v-if='framesrc' :src="framesrc" frameborder="0"></iframe>
            <video class="detail-iframe" v-if='videosrc' preload="meta" controls controlslist="nodownload" disablePictureInPicture>
                <source :src='videosrc'>
            </video>
        </div>
        <!-- 加载列表 -->
        <div class="content-detail" v-if='cptype == 1'>
            <NewsListRecommend @newsListRecommend='news_list_'></NewsListRecommend>
        </div>
        <!-- 加载天气 -->
        <div class="content-detail" v-if='cptype == 2'>
            <WeatherDetail :cdata='statusbar_detail_btn.weather'></WeatherDetail>
        </div>
        <!-- 加载领导集合 -->
        <div class="content-detail" v-if=' cptype == 3'>
            <LeaderGather class='cp-leader-gather' :leaderGaData='lg.contentData' @whichClick='leaderGatherClick'></LeaderGather>
            <NewsListRecommend class='cp-newslist' @newsListRecommend='news_list_'></NewsListRecommend>
        </div>
        <!-- 加载空中课堂集合 -->
        <div class="content-detail" v-if=' cptype == 4'>
            <Classroom class='cp-class-room' :classroomData='cr' @whichClick='classoRoomClick' @crImgLoaded='classoRoomImgLoaded'></Classroom>
            <NewsListRecommend class='cp-newslist' @newsListRecommend='news_list_'></NewsListRecommend>
        </div>
        <!-- 加载搜索界面 -->
        <div class="content-detail" v-show=' cptype == 5'>
            <SearchAllnews @cell_news_click='search_news_click'></SearchAllnews>
        </div>

        <!-- 加载看微信 -->
        <div class="content-detail" v-if='cptype == 6'>
            <Watchwechat :wwechatData='wwc' @cell_wechat_click='cell_wechat_click'></Watchwechat>      
        </div>

        <!-- 看微信更多 -->
        <div class="content-detail" v-if='cptype == 7'>
            <div class="we-chat-title">
                <span >{{ wwwc_more.name}}</span>
            </div>
            <NewsListRecommend v-if='wwwc_more' @newsListRecommend='news_list_'></NewsListRecommend>        
        </div>
    
        <!-- 底部返回 -->
        <div class="nav_top">
            <span class="back" @click='gotoBack'>
                <img class="back-logo" :src="imgsrc">
            </span>
        </div>
    </div>
</template>

<script type="text/javascript">
    import NewsListRecommend from '../oneofTemplate/newsList/recommend/news_list_recommend'
    import WeatherDetail from '../oneofTemplate/status_bar/detailBtnInfo/weatherDetail'
    import LeaderGather from '../oneofTemplate/newsList/recommend/mobile_newslist/u_leaderGather'
    import Classroom from '../oneofTemplate/newsList/recommend/mobile_newslist/u_classroom'
    import SearchAllnews from '../oneofTemplate/newsList/recommend/mobile_newslist/u_searchAllnews'
    import Watchwechat from '../oneofTemplate/newsList/recommend/mobile_newslist/u_watchwechat'

	export default {
		data () {
			return {  
                pageWidth:375,
                randomMark:(new Date()).getTime(),
                cptype:0, //0:分享页内容，1:列表页内容，2:状态栏中天气详细内容，3:领导集合列表，5：搜索页面，6:看微信，7:看微信更多

                //外链地址
                imgsrc:require('static/img/backtopre.png'),
                framesrc:"",
                videosrc:'',

                //状态栏按钮点击的详细数据
                statusbar_detail_btn:{
                    weather:{},
                },

                //领导集合列表
                lg:{
                    contentData:[]
                },

                //空中课堂
                cr:{},

                //看微信
                wwc:{},

                //看新闻“更多”
                wwwc_more:{}, 

			}
		},
        watch:{ },
        created(){
            let self = this
        },
        mounted(){
            let self = this
            self.setLayout()
            self.$emit('contentData_callback',( data_)=>{
                self.resolve_data( data_)
            })
        },
        props: [],
        components:{
            NewsListRecommend,
            WeatherDetail,
            LeaderGather,
            Classroom,
            SearchAllnews,
            Watchwechat,
        },
		methods:{
            setLayout( ){
                let self = this

                self.$nextTick( ()=>{
                    let $cp = $('.content-parti'+self.getRandomClassName() ),
                    cd_height = $(window).height() - $cp.find('.nav_top').height()

                    $cp.find('.content-detail').css({
                        height: cd_height + 'px'
                    })

                    if ( self.cptype == 3) {
                        let ldheader_header = $cp.find('.content-detail').find('.cp-leader-gather').height()
                        $cp.find('.content-detail').find('.cp-newslist').css({
                            marginTop: ldheader_header+'px',
                            height: cd_height - ldheader_header +'px'
                        })
                    }else if ( self.cptype == 4) {
                        let crheader_header = $cp.find('.content-detail').find('.cp-class-room').height(),
                        crheader_img = $cp.find('.content-detail').find('.cp-class-room').find('.cover-img').height()

                        $cp.find('.content-detail').find('.cp-newslist').css({
                            marginTop: crheader_header+'px',
                            height: cd_height - crheader_header +'px'
                        })
                    }

                })
            },
            resolve_data( data_){
                let self = this,
                d_type = $.global_availdata.navbarType
                
                if ( d_type == 'service' && data_.hserviefp == 1) {

                    self.cptype = 0
                    data_.link ? self.framesrc = data_.link : null
                }else if ( data_.type =='internallink' && data_.blocktype == '35') {
                    self.getNetData( '/api/v1/wap/columnsCommon',data_.id ,( reponse_data)=>{
                        self.cptype = 6
                        self.wwc = reponse_data.block
                    })
                }else if ( (d_type == 'service' && data_.blocktype == '84') || data_.type =='internallink' || data_.type =='topic' || data_.type =='combinLeader' || data_.type =='combinClassroom' || data_.id_wchat == 'more' ) {

                    if ( data_.type =='combinLeader' ) 
                        self.cptype = 3
                    else if ( data_.type =='combinClassroom' ) 
                        self.cptype = 4
                    else if ( data_.id_wchat =='more' ) {
                        self.cptype = 7
                        self.wwwc_more = data_
                    }else
                        self.cptype = 1
                    self.$nextTick( ()=>{
                        self.news_list_func && self.news_list_func( $.global_availdata.nlStyle , 'detail')
                        $.homelabelbarClick( data_)
                    })
                }else if ( data_.weatherC == 1) {

                    self.cptype = 2
                    self.statusbar_detail_btn.weather = data_
                }else if( data_.type == 'political_slide' ){

                    self.getNetData( '/api/v1/wap/columnsCommon',data_.id ,( reponse_data)=>{
                        self.cptype = 3
                        self.lg.contentData = reponse_data.block
                        self.setLayout()
                    })
                }else if( data_.type == 'town' ){

                    self.getNetData( '/api/v1/wap/columnsNew',data_.id ,( reponse_data)=>{
                        self.cptype = 4
                        self.cr = reponse_data
                    })
                }else if( data_.type == 'multilive'){
                    self.getNetData( '/api/v1/wap/livesDetail',data_.id ,( reponse_data)=>{
                        self.cptype = 0
                        self.framesrc = reponse_data.wap_url
                    })
                }else if ( data_.statusbar_searchbtn == 1) {
                    self.cptype = 5
                }else{
                    self.cptype = 0
                    data_.wap_url = data_.wap_url || data_.redirect_url
                    if ( data_.wap_url) {
                        let wap_url_fragment = data_.wap_url.split('.'),
                        wufl = wap_url_fragment.length,
                        reg = new RegExp("(\.m3u8|\.mp4)", "i")
                        
                        if ( wufl >0 && reg.test(data_.wap_url)) {
                            self.videosrc = data_.wap_url
                        }else{
                            let regwap = new RegExp("(\.com|\.com\/)$")
                            if ( regwap.test(data_.wap_url) ) {
                                self.framesrc = data_.wap_url+'/share/'+data_.id+'.html'
                            }else
                                self.framesrc = data_.wap_url
                        }
                    }
                } 
            },
            //新闻列表func
            news_list_( func){
                let self = this
                self.news_list_func = func
            },
            //领导集合列表点击
            leaderGatherClick( val){
                let self = this
                val.type = 'combinLeader'
                self.resolve_data( val)
            },
            //空中课堂列表点击
            classoRoomClick( val){
                let self = this
                val.type = 'combinClassroom'
                self.resolve_data( val)
            },
            //空中课堂头部图片加载完成
            classoRoomImgLoaded(){
                let self = this
                self.setLayout()
            },
            //搜索新闻，新闻点击
            search_news_click( val){
                let self = this
                self.is_search_cell = true //搜索新闻的查看详情
                self.resolve_data( val)
                self.setLayout()
            },
            //看微信，新闻点击
            cell_wechat_click( val_){
                let self = this
                self.is_watch_wechat_cell = true
                self.resolve_data( val_)
                self.setLayout()
            },
            getNetData( url,id,cb){
                let self = this,
                url_ = $.ajaxGlobalUrl + url,
                page = 1,
                timestamp = (new Date()).getTime()+'',
                paramJson = {
                    'appId':$.clinet_appid,
                    'clientId':$.clinet_clientid,
                    'code':id+'',
                    'version':$.clinet_appversion,
                    'page':page,
                    'ts':timestamp,
                    'md5': $.MD5($.clinet_appkey+timestamp+$.clinet_appid+$.clinet_clientid+id+page+$.clinet_appversion)
                }
                self.netWorking(url_,'post',{'Content-Type':'application/json'},JSON.stringify( paramJson),(xhr)=>{
                    if ( xhr.responseJSON && xhr.responseJSON.code >=200 && xhr.responseJSON.code<400) {
                        let reponse_data = xhr.responseJSON.data
                        cb && cb( reponse_data)
                    }
                })
            },
            getRandomClassName(){
                let self = this
                return '.'+self.randomMark
            },
            gotoBack(){
                let self = this
                self.videosrc = self.framesrc = ''
                self.cptype = 0
                //查看搜索的新闻详情，返回二级列表
                if ( self.is_search_cell || self.is_watch_wechat_cell) {
                    //新闻详情页面，返回搜索页面或看微信页面
                    self.is_search_cell ? self.cptype = 5 :
                    self.is_watch_wechat_cell ? self.cptype = 6 :
                    null
                    self.is_search_cell = self.is_watch_wechat_cell = false
                }else{
                    self.$emit('backto')
                }
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
    .content-parti{
        width: 100%;
        .nav_top{
            position: relative;
            height: 50px;
            background-color: #fff;
            box-shadow: 0px -2px #efefef;
            .back{
                display: inline-block;
                padding: 15px;
                .back-logo{
                    width: 20px;
                    height: 20px;
                }
            }  
        }
        .content-detail{
            width: 100%;
            overflow-y: scroll;
            // -webkit-overflow-scrolling:touch; 
            .detail-iframe{
                width: 100%;
                height: 100%;
            }
            .we-chat-title{
                background-color: #fff;
                padding: 10px;
                font-size: 22px;
            }
        }
        
    }





</style>
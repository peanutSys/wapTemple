<template>
    <div :class='"search-gather "+randomMark' v-loading='searchLoading'>
        <form action="javascript:return true" class="search-input-form">
            <el-input ref='searchInput' size='mini' type='search' placeholder='请输入搜索内容' class='search-input' v-model='searchWord' @keyup.enter.native='searchBtn_click( 1,true)'></el-input>
        </form>
        <button class='search-button' @click.stop='searchBtn_click( 1,!show_type)' @touchstart.stop='function(){}'>{{ !show_type ? '搜索' : '取消' }}</button>
        <div class="local-search" v-if='show_type == 0'>
            <div class="title">
                <span class="local">历史搜索</span>
                <img class="img" :src="local_search.crash" @click.stop='delete_click'>
            </div>
            <div class="words">
                <span 
                    v-for='(val,key) in local_search.data' 
                    :key='key' 
                    class="word" 
                    @touchstart.stop='function(){}'
                    @click.stop='word_click( val)'
                    >
                    {{ val}}
                </span> 
            </div>
        </div>
        <div class="hot-search" v-if='show_type == 0'>
            <div class="title">
                <span>热门搜索</span>
            </div>
            <div class="words">
                <span 
                    v-for='(val,key) in hot_search.data' 
                    :key='key' 
                    class="word" 
                    @touchstart.stop='function(){}'
                    @click.stop='word_click( val)'
                    >
                    {{ val}}
                </span> 
            </div>
        </div>
        <div class="lr-content" 
            v-if='show_type == 1'
            >
            <div v-for='(val,key) in lr_content.data' 
                :key='key' 
                class="cell" 
                @click.stop='cell_click( val)'
                >
                <div class="img-father" >
                    <img :src="val.thumb" class='image'>
                </div>
                <div class="text-father">
                    <div class='title'>
                        <span >{{ val.title }}</span>
                    </div>
                    <div class="tag-time">
                        <div style="display: inline-block;" >
                            <span class='tag'>{{ val.data_tags && val.data_tags.length >0 ? val.data_tags[0]["tag_name"] : '' }}</span>
                        </div>
                        <div style="display: inline-block;" >
                            <span class='time'>{{ getTimeFormatter(val.create_at*1000) }}</span>
                        </div>
                    </div>
                    <div class="read-btn" >
                        <div class="img">
                            <img :src="lr_content.readimg">
                        </div>
                        <span class='read'>{{ val.hits_fake }}</span>
                    </div>
                </div>
            </div>
            <div class="bottom-loading" v-if='lr_content.bloading_show' @click.stop='btmClick'>
                <span size='mini' v-loading='lr_content.bloading_begin'>点击加载更多</span>
            </div> 
        </div>

    </div>
</template>

<script type="text/javascript">

    export default {
        data () {
            return {  
                show_type:0, //0:搜索，1:搜索结果
                searchWord:'', //搜索关键字
                searchLoading:false, //搜索加载loading
                local_search:{
                    crash:require('static/img/deleteCrash.png'),
                    data:[],
                },
                hot_search:{
                    data:[],
                },
                lr_content:{
                    data:[],
                    readimg:require('static/img/look.png'),
                    bloading_show:false,
                    bloading_begin:false,
                },
                randomMark:(new Date()).getTime(),
            }
        },
        watch:{ },
        created(){
            let self = this
            self.putTogether = (...args)=>{
                let params = ''
                args.forEach( (item)=>{
                    params+= item.name + '=' +item.value+'&'
                })
                return params
            }
        },
        mounted(){
            let self = this
            self.get_search_data()
            self.set_getSearchCookie( false)
        },
        props: [],
        components:{},
        methods:{
            //本地、热门关键词点击
            word_click( val_){
                let self = this
                self.searchWord = val_
                self.searchBtn_click( 1,true)
            },
            //删除关键词
            delete_click(){
                let self = this
                self.delCookie('searchWords')
                self.set_getSearchCookie( false)
            },
            //搜索按钮点击，查询搜索结果
            searchBtn_click( page_,is_search){
                let self = this
                if ( !is_search || self.searchWord.length == 0) {
                    self.show_type = 0
                    self.searchWord = ''
                    return
                }
                self.$refs['searchInput'].blur()

                self.page_ = page_ || 1
                let search_url_ = $.ajaxGlobalUrl +'/api/v1/wap/search',
                timestamp = (new Date()).getTime()+'',
                paramJson = {
                    'appId':$.clinet_appid,
                    'clientId':$.clinet_clientid,
                    'version':$.clinet_appversion,
                    'p':self.page_,
                    'q':self.searchWord,
                    'size':10,
                    'ts':timestamp,
                    'md5': $.MD5($.clinet_appkey+timestamp+$.clinet_appid+$.clinet_clientid+self.page_+self.searchWord+'10'+$.clinet_appversion)
                }
                self.searchLoading = !self.lr_content.bloading_begin //搜索loading
                self.netWorking(search_url_,'post',{'Content-Type':'application/json'},JSON.stringify( paramJson), (xhr)=>{
                    if ( xhr.responseJSON && xhr.responseJSON.code >=200 && xhr.responseJSON.code<400) {
                        let rd = xhr.responseJSON.data || {} ,
                        lrcd = rd.rs || [] //展示的数据
                        self.show_type = 1 //展示搜索结果  
                        self.page_ > 1 ? self.lr_content.data = self.lr_content.data.concat(lrcd) : self.lr_content.data = lrcd 
                        
                        self.lr_content.bloading_show = (self.lr_content.data.length > 0) //“底部刷新”展示
                    }else
                        self.$message({ message:xhr.responseJSON.msg,type:"error", duration:3000 ,center:true }) //错误警告
                    self.lr_content.bloading_begin = self.searchLoading = false //刷新loading停止
                    self.set_getSearchCookie( true)
                })
            },
            //设置缓存
            set_getSearchCookie( isset){
                let self = this,
                lsw = JSON.parse( unescape( self.getCookie('searchWords') || "[]" ))
                if ( isset) {
                   let oldi =lsw.findIndex( (item)=>{
                        return item == self.searchWord
                    })
                    oldi > -1 ? lsw.splice(oldi,1) : null
                    lsw.push( self.searchWord) 
                    self.setCookie('searchWords',JSON.stringify(lsw))
                }
                self.local_search.data = lsw.reverse()
            },
            //底部刷新点击
            btmClick(){
                let self = this
                self.lr_content.bloading_begin = true
                self.page_++
                self.searchBtn_click( self.page_,true)
            },
            //整个新闻单元点击
            cell_click( val_){
                let self = this
                self.$emit('cell_news_click',val_)
                // http://khnews.cztv.com/share/8385970.html
            },
            get_search_data(){
                let self = this,
                hot_url_ = $.ajaxGlobalUrl +'/api/v1/wap/searchHot',
                timestamp = (new Date()).getTime()+'',
                paramJson = {
                    'appId':$.clinet_appid,
                    'clientId':$.clinet_clientid,
                    'version':$.clinet_appversion,
                    'ts':timestamp,
                    'md5': $.MD5($.clinet_appkey+timestamp+$.clinet_appid+$.clinet_clientid+$.clinet_appversion)
                }
                self.netWorking(hot_url_,'post',{'Content-Type':'application/json'},JSON.stringify( paramJson), (xhr)=>{
                    if ( xhr.responseJSON && xhr.responseJSON.code >=200 && xhr.responseJSON.code<400) {
                        self.hot_search.data = xhr.responseJSON.data || []
                    }
                })
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
                return date.getFullYear()+'-'+M+'-'+D
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
    @bgColor:#fff;
    .operator{
        .display(@v){
            display: @v;
        }
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
        .words{
            .word{
                .operator > .display(inline-block);
                .operator > .margin(10px 5px 0); 
                color:#cdcdcd;
                background-color: #efefef;
                font-size: 12px;
                .operator > .padding(5px 15px);
                border-radius: 20px;
                &:active{
                    background-color: #3FB14F;
                    color:#fff;
                }
            } 
        }
    }
    .search-gather{
        .operator > .any(width,100%,min-height,100%);
        .operator > .padding(15px);
        background: @bgColor;
        .search-input-form{
            .operator > .display(inline-block);
            .operator > .calc_lessthan_100(width,100%,50px);
            .search-input{
                .operator > .any(width,100%,height,auto);
            }
        }
        .search-button{
            width: 40px;
            .operator > .border(0px #fff);
            .operator > .any(outline,none,background-color,#fff);
            font-size: 15px;
            vertical-align: middle;
            color:#999;
            &:active{
                color:#fff;
                background-color: #3FB14F;
                border-radius: 10px;
                .operator > .padding(0 5px);
            }
        }
        .local-search{
            .operator > .margin(30px,0,0,0);
            .title{
                height: 20px;
                position: relative;
                .local{
                    .operator > .display(inline-block);
                }
                .img{
                    width: 15px;
                    float: right;
                    position: relative;
                    top: 50%;
                    transform: translateY(-50%);
                }
            }
            .words{
                .operator > .words()
            }
        }
        .hot-search{
            .operator > .margin(30px,0,100%,0);
            .words{
                .operator > .words()
            }
        }
        .lr-content{
            .cell{
                .operator > .margin(20px 0 0 0);
                &:active{
                    background-color: #efefef;
                }
                .img-father{
                    .operator > .display(inline-block);
                    .operator > .any(width,130px,height,76px);
                    .operator > .margin(auto 10px auto auto);
                    vertical-align: middle;
                    .image{
                        .operator > .any(width,100%,height,100%);
                        object-fit: cover; 
                    }
                }
                .text-father{
                    .operator > .display(inline-block);
                    .operator > .any(width,auto,height,76px);
                    .operator > .calc_lessthan_100(width,100%,150px);
                    position: relative;
                    vertical-align: middle;
                    .title{
                        color:#555;
                        overflow: hidden;text-overflow: ellipsis;display: -webkit-box;-webkit-line-clamp: 2;-webkit-box-orient: vertical;
                    }
                    .tag-time{
                        .operator > .absolutel(auto,auto,0,0);
                        font-size: 14px;
                        .time{
                            color:#cdcdcd;
                        }
                        .tag{
                            color:#CF1A14;
                        }
                    }
                    .read-btn{
                        .operator > .absolutel(auto,0,0,auto);
                        .img{
                            .operator > .any(width,auto,height,15px); 
                            .operator > .display(inline-block);
                            vertical-align: middle;
                            img{
                                .operator > .any(width,auto,height,100%); 
                            }
                        }
                        .read{
                            .operator > .display(inline-block);
                            vertical-align: middle;
                            font-size: 14px;
                            color:#cdcdcd;
                            .operator > .any(width,auto,height,15px);
                        }
                    }
                }

            }
            .bottom-loading{
                .operator > .margin(20px 0 0 0);
                text-align: center;
                padding: 10px 0;
                border: 1px solid #eee;
                span{
                    font-size: 13px;
                }
            }
        }


    }
</style>
<style lang="less">
    .search-gather{
        .search-input{
            .el-input__inner{
                border-radius: 30px;
            }
        }   
    }
</style>
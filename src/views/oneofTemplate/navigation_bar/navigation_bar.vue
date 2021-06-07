<template>
    <div :class='"navigation "+randomMark' @click.stop='edit_json_click'>
        <div 
            v-for='(val,key) in muti_str' 
            :key='key' 
            :class="'list content'+val.sort "
            @click='click_navigation_oneOfContent( key)'
        >
            <div>
                <ImageLayout class='image' :layout_data='function() {
                            if ( !geted_data[key]) {
                                return ;
                            }
                            let new_object = JSON.parse( JSON.stringify( geted_data[key].mainImage))
                            return new_object
                        }()'></ImageLayout>
            </div>
            <LabelLayout class='text' :layout_data='function() {
                        if ( !geted_data[key]) {
                            return ;
                        }
                        let new_object = JSON.parse( JSON.stringify( geted_data[key].title))
                        return new_object
                    }()'></LabelLayout>
        </div>
    </div>
</template>

<script type="text/javascript">
    import LabelLayout from '../../basicsModule/labelLayout';
    import ImageLayout from '../../basicsModule/imageLayout';

	export default {
		data () {
			return {  
                style__:'',
                pageWidth:375,

                geted_data:[],
                remote_data:{}, //要更改的json数据

                muti_str:[
                    {name:'新闻',sort:0,icon:require('static/img/newsBottom.png')},
                    {name:'服务',sort:1,icon:require('static/img/serives.png')},
                    {name:'视频',sort:2,icon:require('static/img/videoBottom.png')},
                    // {name:'商城',sort:3,icon:require('static/img/interaction.png')},
                    // {name:'我的',sort:4,icon:require('static/img/smile.png')},
                ],
                randomMark:(new Date()).getTime(),
			}
		},
        watch:{
        },
        created(){
            let self = this;
        },
        mounted(){
            let self = this
            self.$emit('navBarData',function( val_){
                let val__convert = val_
                self.convertToWeb( val__convert)

                if ( $.allowMachine == 1) {
                    self.pageWidth = $(window).width()
                    self.getContentData( ()=>{
                        self.setLayout( val__convert,0)
                    })
                }else if ( $.allowMachine == 0) {
                    self.setLayout( val__convert,0)
                }
            })

            self.$emit('editJson',function(val_){
                self.resolve_json_edit( val_)
            })
        },
        props: ['typeids'],
        components:{
            LabelLayout,
            ImageLayout
        },
		methods:{
            setLayout( nav_,selectOne){
                let self = this
                if ( !nav_) 
                    return

                self.remote_data = nav_
                self.geted_data = []

                self.muti_str.forEach( (item,i)=>{
                    let local_data = self.getData()
                    local_data.mainImage.imgMaskUrl = item.icon
                    local_data.title.text.font = nav_.textSize
                    local_data.title.text.familyName = nav_.familyName
                    local_data.title.textContent = item.name
                    local_data.title.color.textColor = i ==selectOne ? nav_.select_color : nav_.unSelect_color
                    self.geted_data.push( Object.assign({},local_data))
                })

                self.$nextTick( ()=>{
                    let $nav = $('.navigation'+self.getRandomClassName() ),
                    list_length = $nav.find('.list').length

                    $.each( $nav.find('.image'),(i)=>{
                        let $one = $nav.find('.image').eq(i)
                        i ==selectOne ? $one.css('backgroundColor',nav_.select_color) : $one.css('backgroundColor',nav_.unSelect_color)
                    })
                    $nav.css({
                        backgroundColor:nav_.bgColor
                    })
                    $nav.find('.list').css({
                        marginRight:(self.pageWidth - $nav.find('.list').width()*list_length -20 -20)/(list_length-1) +'px'
                    })
                    $nav.find('.list').eq( list_length-1).css('marginRight','20px')
                })
                if ( $.allowMachine == 1 && $.navBottombarClick) {
                    $.navBottombarClick.forEach( (sf)=>{
                        sf.func( self.muti_str[selectOne])
                    })
                }
            },

            //处理更改的json数据
            resolve_json_edit( val_){
                let self = this
                //防止其他模块修改影响到本模块
                if ( val_.name.indexOf('navBar') < 0 ) 
                    return
                
                if ( val_.name.indexOf('navBar.selectColor') > -1 ) {
                    self.remote_data.select_color = val_.data
                }else if ( val_.name.indexOf('navBar.unselectColor') > -1 ) {
                    self.remote_data.unSelect_color = val_.data
                }else if ( val_.name.indexOf('navBar.bgColor') > -1 ) {
                    self.remote_data.bgColor = val_.data
                }else if ( val_.name.indexOf('navBar.font') > -1 ) {
                    self.remote_data.textSize = val_.data
                }else if ( val_.name.indexOf('navBar.familyName') > -1 ) {
                    self.remote_data.familyName = val_.data
                }
                self.edit_json_click()
                self.setLayout( self.remote_data,0)

                let new_object = JSON.parse( JSON.stringify( self.remote_data))
                self.convertToClent( new_object)

                $.edit_json_remote_post('',self._props.typeids,'',new_object)
                
            },

            //点击编辑标签json
            edit_json_click(){
                let self = this
                if ( $.allowMachine == 1){
                    return
                } 
                $.cancel_glitter()
                let fn = $('.navigation'+self.getRandomClassName() )
                self.$nextTick( ()=>{
                    fn.addClass('border-style-0').addClass('boder-color-animation') 
                })

                let navrd = self.remote_data
                let new_object = { 
                    select_color:navrd.select_color,
                    unSelect_color:navrd.unSelect_color,
                    font:navrd.textSize,
                    familyName:navrd.familyName,
                    bgColor:navrd.bgColor
                }
                self.$emit('editJson','',new_object)
                
            },

            //将特殊的颜色数据，转换成能用的
            convertToWeb( data_){
                let self = this
                //颜色转换
                Object.keys(data_).forEach( (key)=>{
                    let key_ = key+''
                    if ( key_.indexOf('olor')>-1 && key_.indexOf('olor_') < 0 ) {
                        data_[key_].length != 9 ? null : function(){
                            var opacity = data_[key_].slice(1,3)
                            data_[key_+'_opacity'] = ( self.convertHexToDecimalism( opacity)/255).toFixed(2)
                            data_[key_+'_origin'] =data_[key_]
                            data_[key_] ="#"+data_[key_].slice(3)
                        }()
                    }else if ( (typeof data_[key_] == 'object') && !(typeof data_[key_] instanceof Array)  && data_[key_] != null ) {
                        self.convertToWeb( data_[key_])
                    }
                })
            },
            //将修改的颜色转换成特殊颜色
            convertToClent( data_){
                let self = this
                //颜色转换
                Object.keys(data_).forEach( (key)=>{
                    let key_ = key+''
                    if ( key_.indexOf('olor')>-1 && key_.indexOf('olor_origin') <0 && key_.indexOf('olor_opacity') <0 ) {
                        if ( data_[key_+'_origin']) {
                           var prefix = data_[key_+'_origin'].slice(1,3)
                            data_[key_] = '#'+prefix + data_[key_].replace('#','') 
                        }
                    }else if ( (typeof data_[key_] == 'object') && !(typeof data_[key_] instanceof Array)) {
                        self.convertToClent( data_[key_])
                    }
                })
            },

            //16hex到10
            convertHexToDecimalism( hex){
                let self = this
                hex += '';  hex =hex.toUpperCase();
                let deci = 0
                let hex_arr = hex.split('')
                hex_arr.reverse().forEach( (char_,i)=>{
                    let hc = ''
                    char_ == 'A' ? hc = 10 : null
                    char_ == 'B' ? hc = 11 : null
                    char_ == 'C' ? hc = 12 : null
                    char_ == 'D' ? hc = 13 : null
                    char_ == 'E' ? hc = 14 : null
                    char_ == 'F' ? hc = 15 : null
                    !hc ? hc = parseFloat( char_) : null
                    deci += Math.pow(16,i) * hc
                })
                return deci
            },

            getRandomClassName(){
                let self = this
                return '.'+self.randomMark
            },

            getStr(propName,propVal){
                return propName + ':' + propVal + ';'
            },

            getContentData( cb){
                let self = this,
                url = $.ajaxGlobalUrl+'/api/v1/wap/top',
                timestamp = (new Date()).getTime()+'',
                paramJson = {
                    'appId':$.clinet_appid,
                    'clientId':$.clinet_clientid,
                    'version':$.clinet_appversion,
                    'ts':timestamp,
                    'md5': $.MD5($.clinet_appkey+timestamp+$.clinet_appid+$.clinet_clientid+$.clinet_appversion)
                }
               
                self.netWorking(url,'post',{'Content-Type':'application/json' },JSON.stringify( paramJson),(xhr)=>{
                    if ( xhr.responseJSON && xhr.responseJSON.code >=200 && xhr.responseJSON.code<400) {
                        let reponse_data = xhr.responseJSON.data,
                        reponse_data_content = reponse_data[0],
                        promise_arr = []
                        if ( reponse_data_content && reponse_data_content.bottomicons.length >0) {
                            self.muti_str =  reponse_data_content.bottomicons
                            self.muti_str.forEach( (item)=>{
                                promise_arr.push( new Promise((resolve, reject) => {
                                    self.getImageBase64( item.icon ,( url)=>{
                                        item.icon = url
                                        resolve()
                                    })
                                }))  
                            })
                            Promise.all(promise_arr).then(()=>{
                                cb && cb()
                            })
                            
                        }else{
                            cb && cb()
                        }
                    }else{
                        cb && cb()
                    }
                    
                })
            },

            //获取图片base64
            getImageBase64(url,cb){
                let self = this 
                let getb64 = (img) =>{
                    var canvas = document.createElement("canvas");
                    canvas.width = img.width;
                    canvas.height = img.height;
                    var ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0, img.width, img.height);
                    var dataURL = canvas.toDataURL("image/png"); 
                    return dataURL;
                }
                let done64 = (src ) => {
                    var image = new Image();
                    image.src = src + '?v=' + Math.random(); // 处理缓存
                    image.crossOrigin = "*";  // 支持跨域图片
                    image.onload = function(){
                        cb && cb( getb64(image));
                    }
                }
                done64( url,cb)
            },

            //导航点击
            click_navigation_oneOfContent( n){
                let self = this
                if ( $.allowMachine == 0){ 
                    return
                } 
                self.setLayout( self.remote_data,n)
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

            getData(){
                return {
                    "mainImage":{
                        "imgMaskUrl":'',
                        "common":{
                            "size": {
                                "width": 25,
                                "height":23,
                            },
                        }
                    },
                    "title":{
                        "textContent":'',
                        "textContent_style":'none',
                        "color":{
                            "textColor":"#afafaf"
                        },
                        "text":{
                            "textAlignment":0,
                            "font":12,
                            "familyName":"",
                        },
                    },
                }
            },
            /**
            ********************************************************************************
            */
		}
	}
</script>

<style scoped lang="less">
    @import '../publicStyle';
    @pagebaWidth:375px;
    .navigation{
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        white-space: nowrap;
        overflow: hidden;
        background-color: #fff;  
        cursor: pointer;
        box-shadow: -3px -3px 10px #7f7f7f;
        z-index: 3;
        .list{
            display: inline-block;
            text-align: center;
            vertical-align: middle;
            margin-right: 54px;
            padding: 5px 0 0;
            .image{
                display: inline-block;
            }
            .text{
                margin-top: -2px;
            }
            
        }
        .list:nth-of-type(1){
            margin-left: 20px;            
        }
    }

</style>
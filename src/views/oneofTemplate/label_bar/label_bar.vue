<template>
    <div :style='style__' :class='"label "+randomMark' @click.stop='clicked_edit_fn'>
        <LabelLayout 
            v-for='(val,key) in muti_str' 
            :key='key' 
            :class=" 'content text'+val.id " 
            :layout_data='geted_data[key]'
            @click.native='click_tab_oneOfContent( key)'
            >
        </LabelLayout>
        <!-- <ViewLayout :class='"lineView "+randomMark' :layout_data='lineView_data'></ViewLayout> -->
    </div>
</template>

<script type="text/javascript">
    import LabelLayout from '../../basicsModule/labelLayout';
    import ViewLayout from '../../basicsModule/viewLayout';

	export default {
		data () {
			return {  
                pagebaWidth:375,
                style__:'',

                geted_data:[],
                lineView_data:{},

                remote_data:{}, //要更改的json数据

                muti_str:[
                    {name:'推荐',id:0},
                    {name:'快讯',id:1},
                    {name:'要闻',id:2},
                    {name:'综合',id:3},
                    {name:'社会',id:4},
                    {name:'财经',id:5},
                    {name:'专题',id:6},
                    {name:'读报纸',id:7},
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
            self.$emit('labelTabData',function( val_){
                let val__convert = val_
                self.convertToWeb( val__convert)

                if ( $.allowMachine == 1) {

                    self.pagebaWidth = $(window).width()
                    self.getContentData( ()=>{
                        self.setLayout( val__convert,0)
                    })

                    if ( $.allowMachine == 1 && $.navBottombarClick) {
                        $.navBottombarClick.forEach( (sf)=>{
                            sf.func( {sort:0})
                        })
                    }
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
            ViewLayout
        },
		methods:{
            setLayout( ltd,selectOne){
                let self = this
                if ( !ltd) 
                    return

                self.remote_data = ltd
                self.geted_data = []
                let lineView_data__ = self.get_line_data()
                self.muti_str.forEach( (item,i)=>{
                    let geted_data__ = self.getData()
                    geted_data__.color.textColor =  i == selectOne ? ltd.select_color : ltd.unSelect_color
                    geted_data__.text.font = ltd.textSize
                    geted_data__.text.familyName = ltd.familyName
                    self.geted_data.push( Object.assign({},geted_data__))
                })
                lineView_data__.color.bgColor = ltd.select_color
                self.lineView_data = lineView_data__
                
                self.style__ += self.getStr('height',self.geted_data[0].common.size.height+'px');
                self.$nextTick( ()=>{
                    let $fn = $('.label'+self.getRandomClassName() )

                    self.muti_str.forEach( (item)=>{
                        $fn.children('.text'+item.id).children('.content').text(item.name)
                    })
                    $fn.css({
                        backgroundColor:ltd.bgColor,
                        width:self.pagebaWidth+'px',
                    })
                    $fn.children('.content').css( 'borderBottom',0)
                    $fn.children('.content').eq(selectOne).css( 'borderBottom','2px solid '+ltd.select_color)
                })
                
                $.allowMachine == 1 && $.homelabelbarClick && $.homelabelbarClick( self.muti_str[selectOne])
            },

            //点击编辑标签json
            clicked_edit_fn( event){
                let self = this
                if ( $.allowMachine == 1){ 
                    return
                } 

                $.cancel_glitter()
                let fn = $('.label'+self.getRandomClassName() )
                self.$nextTick( ()=>{
                    fn.addClass('border-style-0').addClass('boder-color-animation') 
                })
                let rmo = self.remote_data
                let new_object = { 
                    select_color:rmo.select_color,
                    unSelect_color:rmo.unSelect_color,
                    font:rmo.textSize,
                    familyName:rmo.familyName,
                    androidFamilyName:rmo.androidFamilyName,
                    bgColor:rmo.bgColor 
                }
                self.$emit('editJson','',new_object)
                
            },

            //处理更改的json数据
            resolve_json_edit( val_){
                let self = this
                //防止其他模块修改影响到本模块
                if ( val_.name.indexOf('labelBar') < 0 ) 
                    return

                if ( val_.name.indexOf('labelBar.selectColor') > -1 ) {
                    self.remote_data.select_color = val_.data
                }else if ( val_.name.indexOf('labelBar.unselectColor') > -1 ) {
                    self.remote_data.unSelect_color = val_.data
                }else if ( val_.name.indexOf('labelBar.bgColor') > -1 ) {
                    self.remote_data.bgColor = val_.data
                }else if ( val_.name.indexOf('labelBar.font') > -1 ) {
                    self.remote_data.textSize = val_.data
                }else if ( val_.name.indexOf('labelBar.familyName') > -1 ) {
                    self.remote_data.familyName = val_.data
                }else if ( val_.name.indexOf('labelBar.androidFamilyName') > -1 ) {
                    self.remote_data.androidFamilyName = val_.data
                }
                self.clicked_edit_fn()
                self.setLayout( self.remote_data)

                let new_object = JSON.parse( JSON.stringify( self.remote_data))
                self.convertToClent( new_object)

                $.edit_json_remote_post('',self._props.typeids,'',new_object)
                
            },

            //将特殊的颜色数据，转换成能用的
            convertToWeb( data_){
                let self = this
                //颜色转换
                Object.keys(data_).forEach( (key)=>{
                    let key_ = key+''
                    if ( 
                        (key_.indexOf('olor')>-1 && key_.indexOf('olor_') < 0) ||
                        (key_.indexOf('olor_top')>-1 && key_.indexOf('olor_top_') < 0) ||
                        (key_.indexOf('olor_bottom')>-1 && key_.indexOf('olor_bottom_') < 0) 
                    ) {
                        data_[key_].length != 9 ? null : function(){
                            var opacity = data_[key_].slice(1,3)
                            data_[key_+'_opacity'] = ( self.convertHexToDecimalism( opacity)/255).toFixed(2)
                            data_[key_+'_origin'] =data_[key_]
                            data_[key_] ="#"+data_[key_].slice(3)
                        }()
                    }else if ( (typeof data_[key_] == 'object') && !(typeof data_[key_] instanceof Array) && data_[key_] != null ) {
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

            //获取tab标签内容数据
            getContentData( cb){
                let self = this,
                putTogether = (...args)=>{
                    let params = ''
                    args.forEach( (item)=>{
                        params+= item.name + '=' +item.value+'&'
                    })
                    return params
                },
                getD_func = ( url_,type_)=>{
                    let url = $.ajaxGlobalUrl+url_,
                    type = type_,
                    timestamp = (new Date()).getTime()+'',
                    paramJson = {
                        'appId':$.clinet_appid,
                        'clientId':$.clinet_clientid,
                        'version':$.clinet_appversion,
                        'type':type
                    }
                    // let contentUrl = '../../static/localData/tabContentData.json'//接口通了，要删除掉
                    self.netWorking(url,'get',{'Content-Type':'application/json'}, paramJson,(xhr)=>{
                        if ( xhr.responseJSON && xhr.responseJSON.code >=200 && xhr.responseJSON.code<400) {
                            let reponse_data = xhr.responseJSON.data
                            self.muti_str = reponse_data.sub || [''] 

                            {   
                                let abandon_indx1 = self.muti_str.findIndex( (item)=>{
                                    return item.type == 26 
                                })
                                abandon_indx1 > -1 ? self.muti_str.splice( abandon_indx1,1) : null

                                let abandon_indx2 = self.muti_str.findIndex( (item)=>{
                                    return item.type == 137 
                                })
                                abandon_indx2 > -1 ? self.muti_str.splice( abandon_indx2,1) : null

                                let abandon_indx3 = self.muti_str.findIndex( (item)=>{
                                    return item.type == 77 
                                })
                                abandon_indx3 > -1 ? self.muti_str.splice( abandon_indx3,1) : null
                            }
                        }
                        cb && cb()
                    })
                }
   
                if ( !$.navBottombarClick) {
                    $.navBottombarClick = []
                    let url_ = '/api/fusion/wap/getMenuInfo'
                    let homeNav = {
                        func:( item)=>{
                            if ( item.sort == 0) {
                                let url = url_,
                                type = 'home'
                                getD_func( url,type)
                                $.global_availdata.navbarType = type
                            }
                        }
                    },
                    serviceNav = {
                        func:( item)=>{
                            if ( item.sort == 1) {
                                let url = url_,
                                type = 'service'
                                getD_func( url,type)
                                $.global_availdata.navbarType = type
                            }
                        }
                    },
                    videoNav = {
                        func:( item)=>{
                            if ( item.sort == 2) {
                                let url = url_,
                                type = 'video'
                                getD_func( url,type)
                                $.global_availdata.navbarType = type
                            }
                        }
                    }
                    $.navBottombarClick.push( homeNav)
                    $.navBottombarClick.push( serviceNav)
                    $.navBottombarClick.push( videoNav)
                }  
            },

            //标签点击
            click_tab_oneOfContent( n){
                let self = this
                if ( $.allowMachine == 0){ 
                    return
                } 
                self.setLayout( self.remote_data,n)
            },

            getRandomClassName(){
                let self = this
                return '.'+self.randomMark
            },

            getStr(propName,propVal){
                return propName + ':' + propVal + ';'
            },

            getData(){
                return {
                    "color":{
                        "textColor":'#000',
                        "bgColor":''
                    },
                    "text":{
                        "font":'14',
                        'textAlignment':'1',
                        'familyName':''
                    },
                    "common": {
                        // "border": {
                        //     "borderColor": "#fff", 
                        //     "borderWidth": 1, 
                        //     "borderRadius": 3 
                        // },
                        // "shadow": {
                        //     "shadowColor": "#fff", 
                        //     "opacity": 1, 
                        //     "offsetWidth": 1, 
                        //     "offsetHeight": 1, 
                        // },
                        "size": {
                            "min-width": 26,
                            "height":28,
                        },
                    },
                }
            },

            get_line_data(){
                return {
                    "color":{
                        "textColor":'',
                        "bgColor":'#000'
                    },
                    "common": {
                        "size": {
                            "width": 20,
                            "height":4,
                        },
                    },
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
    @import '../publicStyle';
    @pagebaWidth:375px;
    .label{
        position: relative;
        width: @pagebaWidth;
        white-space: nowrap;
        overflow: scroll;
        padding-right: 10px;
        background-color: #fff;  
        cursor: pointer;
        .content{
            margin-right: 34px;
            &:nth-of-type(1){
                margin-left: 10px;
            }
        }
        &::-webkit-scrollbar { 
            width: 0 !important;
            height: 0 !important;
        } 
    }

</style>
<template>
    <div class="page_single" >
        <el-button @click='store_style' v-if = 'whichModule_text' class="store-module" size='mini' type="primary">保存</el-button>
        <div class="current-operation-section-text" v-if = 'whichModule_text'>
            <span >{{whichModule_text+': '}}</span>
            <el-button @click='cancel_all_glitter' size='mini'>取消选中</el-button>
        </div>
        <div class="module-content">
            <!-- 状态栏 -->
            <transition name="slide-fade-publish" mode = 'in-out' appear>
                <div class="phone-tab-bar" v-if='time_signal_status_show'>
                    <img style="width: 100%; height: 100%;object-fit: contain;" src="../../../static/img/phone_tab_bar.png">
                </div>
            </transition>
            <!-- android状态标签栏/ios导航栏 -->
            <transition name="slide-fade-publish" mode = 'in-out' appear>
                <StatusBar @click_one_of='statusBar_ele_click_oneOf' @feedback_data='statusBar_edit_json' @statusData= 'status_data' v-show='status_show' typeids='status'></StatusBar>
            </transition>

            <!-- 标签栏 -->
            <transition name="slide-fade-publish" mode = 'in-out' appear>
                <LabelBar @editJson='label_bar_edit_json' @labelTabData= 'label_tab_data' v-show='tab_show' typeids='tab'></LabelBar>
            </transition>

            <!-- 底部导航栏 -->
            <transition name="slide-fade-publish" mode = 'in-out' appear>
                <NavigationBar @editJson='navigation_bar_edit_json' @navBarData= 'navigation_data' v-show='nav_show && special_navShow' typeids='navigation'></NavigationBar>
            </transition>

            <!-- 列表 -->
            <transition name="slide-fade-publish" mode = 'in-out' appear>
                <NewsListRecommend @editJson='newsList_recommend_edit_json' @newsListRecommend='news_list_recommend' v-show='newslist_show' ></NewsListRecommend>
            </transition>

            <!-- 内容详情页 -->
            <transition name="slide-fade-publish" mode = 'in-out' appear>
                <ContentParticular v-show='cParticular_show' @backto='click_content_particular_back' @contentData_callback='get_concrete_data' ></ContentParticular>
            </transition> 
        </div>

        <div class="type-button">
            <transition-group name="slide-fade-publish" mode = 'in-out'>
            <div v-for='(val,key) in statusBar_moduleImg_pic.list_btn' :key='key' @click.stop='status_bar_oneOfElement_click(val)'>
                <img v-if='val.src' :src="val.src" style="vertical-align: middle;">
                <span v-if='val.src' style="vertical-align: middle;">{{val.explain}}</span>
                <span v-if='val.title'>{{val.title}}</span>
            </div>  
            </transition-group>          
        </div>

        <!-- ****某个模块的各种编辑输入框选项 
            id=1: 内边距/外边距输入框
            id=2: 颜色输入框
            id=3: 单行输入框
        -->
        <div class="editor-content">
            <div v-for='(val,key) in editor_content.ids' :key='key' >
                <transition name="slide-fade-publish" mode = 'in-out' appear>
                    <MarginPaddingEdit v-if='val.id == 1' :edit_data='val.content' @change='marginPaddingEdit_change'></MarginPaddingEdit>
                </transition>
                <transition name="slide-fade-publish" mode = 'in-out' appear>
                    <ColorEdit v-if='val.id == 2' :edit_data='val.content' @change='colorEdit_change'></ColorEdit>
                </transition>
                <transition name="slide-fade-publish" mode = 'in-out' appear>
                    <SingleCommonEdit v-if='val.id == 3' :edit_data='val.content' @change='singleEdit_change'></SingleCommonEdit>
                </transition>
                <transition name="slide-fade-publish" mode = 'in-out' appear>
                    <RadioEdit v-if='val.id == 4' :edit_data='val.content' @change='radioEdit_change'></RadioEdit>
                </transition>
            </div> 
        </div>
    </div>
</template>


<script type="text/javascript">
    import StatusBar from '../oneofTemplate/status_bar/status_bar';
    import LabelBar from '../oneofTemplate/label_bar/label_bar';
    import NavigationBar from '../oneofTemplate/navigation_bar/navigation_bar';
    import NewsListRecommend from '../oneofTemplate/newsList/recommend/news_list_recommend';
    import ContentParticular from './contentParticular';

    import MarginPaddingEdit from '../editContentBox/marginPaddingEdit';
    import ColorEdit from '../editContentBox/colorEdit';
    import SingleCommonEdit from '../editContentBox/singleCommonEdit';
    import RadioEdit from '../editContentBox/radioEdit';

	export default {
		data() {
			return {  
                trans_data:{},
                time_signal_status_show:true,
                status_show:false,
                tab_show:false,
                nav_show:false,
                newslist_show:false,
                cParticular_show:false,

                special_navShow:true, //针对类似兰溪隐藏底部导航栏

                whichModule:'', //当前是哪一个板块；推荐recommend、status状态栏、标签tab、轮播carousel等
                whichModule_text:'',
                pagebaWidth:375,

                //状态栏的侧边按钮
                statusBar_moduleImg_pic:{
                    list_btn:[],
                    all_list_btn:[
                        { src:require('static/img/user_content.png'),id:'user',explain:'用户中心' },
                        { src:require('static/img/user_content.png'),id:'textUser',explain:'用户中心纯文本' },
                        { src:require('static/img/search.png'),id:'search_button',explain:'搜索按钮' },
                        { src:require('static/img/input_text.png'),id:'search_input',explain:'搜索输入框' },
                        { src:require('static/img/title_img_view.png'),id:'title_img',explain:'图片标题' },
                        { title:'文字标题',id:'title_text' },
                        { src:require('static/img/telicon.png'),id:'tel',explain:'电话' },
                        { src:require('static/img/edit_pen.png'),id:'reveal',explain:'爆料' },
                        { src:require('static/img/weather.png'),id:'weather',explain:'天气' },
                        { src:require('static/img/input_text.png'),id:'searchInput_scan',explain:'带扫描的输入框' },

                        { title:'删除已添加的按钮',id:'delete_one_selected' }
                    ],
                },

                //各种编辑输入框选项 
                editor_content:{
                    ids:[ 
                        //id用于区分各个输入项，content代表某一个输入项的数据(name:编辑模块id、data:编辑模块数据、title::编辑模块自定义名称)
                        { id:'',content:{name:'',data:'',title:''} }
                    ]
                },
			}
		},
        created(){
            let self = this

            $.global_availdata = {}
            self.local_debug = 1 //网页调节样式: 0:本地数据,1:接口数据，
            $.allowMachine = 1//是否网页调节样式: 0是预览操作,1是wap数据展示

            touch.config.tap = false; //配置手势事件
            document.title = '样式配置'

            //可变配置项
            if ( $.allowMachine == 1) 
            {
               //设置标题；开花好地方、兰精灵、掌上松阳
                document.title = '掌上松阳'

                //全局访问地址
                $.ajaxGlobalUrl = 'https://proxy.cztvcloud.com' //http://10.30.10.158

                //allowMachine等于1时，天气配置
                $.clinet_host_weather = 'https://restapi.amap.com'
                //开化id:330824 ，兰溪:330781 ，松阳:331124
                $.clinet_CityKey = "331124" ; self.special_navShow = ($.clinet_CityKey != "330781" && $.clinet_CityKey != "331124") 
                //key固定
                $.clinet_GDWeatherKey = "22f5a259075e17d861ee8b04193e1d66" 

                /**
                    调整各县融appid
                    0:蓝TV、1:蓝新闻、2:喜欢听、3新蓝云、4青田、5温岭、6 余杭、7武义、8嵊州、9余姚、10龙游、11好易购、12兰溪、13普陀、14 开化、15 政务网、16微信、17 qq 、18微博 19 庆元、20 龙泉、21 云和、22莲都、23永嘉、24象山、25衢江、26遂昌、27缙云、28松阳、29武义村情通、30嵊泗、31青田第三方、32文成、33苍南、34缙云千城、35云和问政、36洞头、37交投、38兑吧、39萧山、40慈溪、41 西湖
                **/
                $.clinet_appid = '1028'
                $.clinet_appversion = '1.1.1'
                $.clinet_clientid = ''
                $.clinet_appkey = '65c360936cae4ca634666104788379224984a8c8' 
            }  
        },
        mounted(){
            let self = this
            
            self.getData()
            self.cancel_glitter()
            self.edit_json_remote_post()
            self.mobile_resolve()
        },
        components:{
           StatusBar,
           LabelBar,
           NavigationBar,
           NewsListRecommend,
           ContentParticular,

           MarginPaddingEdit,
           ColorEdit,
           SingleCommonEdit,
           RadioEdit,
        },
		methods:{
            getData(){
                let self = this

                $.allowMachine == 1 ? self.time_signal_status_show = false : self.time_signal_status_show = true 
                if ( !self.local_debug) {
                    self.trans_data = require('static/localData/mobileLayoutData.json')
                    self.newslist_show = self.status_show = self.tab_show = self.nav_show=true
                    self.convertAttributeOfOne( self.trans_data ,'margin')
                    self.news_list_recommend_func( self.trans_data.newsList)
                    self.status_data_func( self.trans_data.status)
                    self.label_tab_data_func( self.trans_data.tab)
                    self.navigation_data_func( self.trans_data.navigation)
                }else{
                    if ( $.allowMachine == 0) {
                        let reg = /\w*(id=\w)\w*/gi
                        let url_ = location.href
                        let matches = url_.match(reg)
                        if ( matches && matches.length > 0) {
                            let split__ = matches[0].split('id=')
                            let id_ = parseFloat( split__[1])
                            if ( id_ == NaN) {
                                self.$message({ message:'id为空或者不能解析',type:"error", duration:4000 ,center:true })
                            }
                            self.whichModule = id_
                        }else{
                            self.$message({ message:'id为空或者不能解析',type:"error", duration:4000 ,center:true })
                            return
                        }

                        self.netWorking( '/api/v1/style/info/'+self.whichModule,'get',{ 'Content-Type':'application/x-www-form-urlencoded' },{},(xhr)=>{
                            if ( xhr.responseJSON && xhr.responseJSON.code >=200 && xhr.responseJSON.code<400) {
                                let reponse_data = xhr.responseJSON.data
                                if ( reponse_data.catalogCode == "status") {
                                    self.trans_data.status = JSON.parse(reponse_data.styleJson)
                                    self.status_data_func( self.trans_data.status)
                                    self.status_show = true

                                }else if ( reponse_data.catalogCode == "tab") {
                                    self.trans_data.tab = JSON.parse(reponse_data.styleJson)
                                    self.label_tab_data_func( self.trans_data.tab)
                                    self.tab_show = true

                                }else if ( reponse_data.catalogCode == "navigation" && reponse_data.layout == "bottom") {
                                    self.trans_data.navigation = JSON.parse(reponse_data.styleJson)
                                    self.navigation_data_func( self.trans_data.navigation)
                                    self.nav_show = true

                                }else {
                                    self.trans_data.newsList ? null : self.trans_data.newsList = {}
                                    self.trans_data.newsList[reponse_data.catalogCode] = [JSON.parse(reponse_data.styleJson)]
                                    self.news_list_recommend_func( self.trans_data.newsList)
                                    self.newslist_show = true
                                }
                                self.convertAttributeOfOne( self.trans_data ,'margin')
                                self.convertAttributeOfOne( self.trans_data ,'padding')

                            }
                        })
                    }else if ( $.allowMachine == 1) {
                        let url = '/api/fusion/model/default',
                        timestamp = (new Date()).getTime()+'',
                        paramJson = {
                            'appId':$.clinet_appid,
                            'version':$.clinet_appversion,
                            'appType':'web'
                        },
                        styleUrl = $.ajaxGlobalUrl +url
                        // styleUrl = '../../static/localData/tmpStyleData.json'//接口通了，要删除掉
                        self.netWorking(styleUrl,'get',{},paramJson,(xhr)=>{
                            if ( xhr.responseJSON && xhr.responseJSON.code >=200 && xhr.responseJSON.code<400) {
                                let reponse_data = xhr.responseJSON.data
                                if ( reponse_data.status) {
                                    let homeStatus = reponse_data.status.home || reponse_data.status,
                                    videoStatus = reponse_data.status.video || reponse_data.status,
                                    serviceStatus = reponse_data.status.service || reponse_data.status

                                    self.trans_data.status = homeStatus
                                    self.status_data_func( self.trans_data.status)
                                    self.status_show = true

                                }
                                if ( reponse_data.tab) {
                                    let homeTab = reponse_data.tab

                                    self.trans_data.tab = homeTab
                                    self.label_tab_data_func( self.trans_data.tab)
                                    self.tab_show = true

                                }
                                if ( reponse_data.navigation) {
                                    let homeNavigation = reponse_data.navigation

                                    self.trans_data.navigation = homeNavigation
                                    self.navigation_data_func( self.trans_data.navigation)
                                    self.nav_show = true 
                                }
                                if ( reponse_data.newsList) {
                                    // 老数据结构
                                    // self.trans_data.newsList = self.adjustMobileDataInterface( reponse_data.newsList)

                                    //新数据结构
                                    self.trans_data.newsList = reponse_data.newsList

                                    self.news_list_recommend_func( self.trans_data.newsList)
                                    self.newslist_show = true
                                    reponse_data.groupHeader ? self.trans_data.newsList.groupHeader = reponse_data.groupHeader : null 
                                    $.global_availdata.nlStyle = self.trans_data.newsList
                                }
                                //调节样式数据
                                self.convertAttributeOfOne( self.trans_data ,'margin')
                                self.convertAttributeOfOne( self.trans_data ,'padding')
                            }
                        })
                    }
                    
                }
            },

            /**
            * 状态栏事件
            */
            //点击'状态栏'某个元素
            status_bar_oneOfElement_click( val){
                let self = this
                self.statusBar_ele_click_oneOf__callback(val) 
            },
            statusBar_ele_click_oneOf(callback){
                let self = this
                if ( typeof callback == 'function') {
                    self.statusBar_ele_click_oneOf__callback = callback 
                }else if ( callback == 'clickOne'){
                    //将输入框先全部置空，后添加
                    self.editor_content.ids = []
                    self.statusBar_moduleImg_pic.list_btn = self.statusBar_moduleImg_pic.all_list_btn
                }else if ( callback == 'clickOne_none'){
                    //将输入框全部置空
                    self.statusBar_moduleImg_pic.list_btn = []
                }
            },
            //点击要修改json
            statusBar_edit_json(data ,callback){
                let self = this

                self.resolve_statusBar_data( data)
                if ( callback) {
                    self.statusBar_click_editJson__callback = callback
                }
            },
            resolve_statusBar_data( data){
                let self = this
                if ( data) {
                    //设置状态栏上部(wifi、手机电量)背景颜色
                    if ( data.statusBarbgColor) {
                        $('.phone-tab-bar').css('background-color',data.statusBarbgColor)
                    }else{
                        self.whichModule_text = '状态栏'
                    }
                    
                    //设置状态栏属性
                    if ( data.statusBar) {
                        let item1 = { id:'1',content:{name:'statusBar.padding',data:data.statusBar.padding,title:'内边距'} }
                        let item2 = { id:'2',content:{name:'statusBar.bgColor',data:data.statusBar.bgColor,title:'背景颜色'} }
                        let item3 = { id:'3',content:{name:'statusBar.bgResource',data:data.statusBar.bgResource,isFileUpload:1,title:'背景图片地址'} }
                        self.editor_content.ids = [item1,item2,item3]
                    }

                    //设置状态栏按钮属性
                    if ( data['statusBar.button'] ) {
                        let val__ = data['statusBar.button']
                        if ( val__.id == 'search_input') {
                            let item1 ={ id:'3',content:{name:'statusBar.button.search_input.corner',data:val__.corner || '',title:'圆角'} } 
                            let item2 ={ id:'3',content:{name:'statusBar.button.search_input.size.width',data: val__.size ? val__.size.width : '' ,title:'宽度'} }
                            self.editor_content.ids = [item1,item2]
                        }else if ( val__.id == 'weather') {
                            let item1 ={ id:'3',content:{name:'statusBar.button.weather.textSize',data: val__.textSize || '' ,title:'字体大小'} }
                            let item2 ={ id:'2',content:{name:'statusBar.button.weather.textColor',data: val__.common.color || '' ,title:'字体颜色'} }
                            self.editor_content.ids = [item1,item2]
                        }else if ( val__.id == "search_button") {
                            let item1 ={ id:'2',content:{name:'statusBar.button.search_input.textColor',data: val__.common.color || '' ,title:'颜色'} }
                            self.editor_content.ids = [item1]
                        }else if ( val__.id == 'title_text') {
                            let item0 ={ id:'3',content:{name:'statusBar.button.title.text',data: val__.text || '' ,title:'标题内容'} }
                            let item1 ={ id:'3',content:{name:'statusBar.button.title.textSize',data: val__.textSize || '' ,title:'字体大小'} }
                            let item2 ={ id:'2',content:{name:'statusBar.button.title.common.color',data: val__.common ? val__.common.color : '' ,title:'字体颜色'} }
                            self.editor_content.ids = [item0,item1,item2]
                        }else if ( val__.id == 'title_img') {
                            let item1 ={ id:'3',content:{name:'statusBar.button.title.img.url',data: val__.imgUrl || '' ,isFileUpload:1,title:'图片标题地址'} },
                            item2 ={ id:'3',content:{name:'statusBar.button.title.img.width',data:val__.imageSize.width ,title:'图片标题宽度'} },
                            item3 ={ id:'3',content:{name:'statusBar.button.title.img.height',data:val__.imageSize.height ,title:'图片标题高度'} }
                            self.editor_content.ids = [item1,item2,item3]
                        }else if ( val__.id == 'searchInput_scan') {
                            let item1 ={ id:'3',content:{name:'statusBar.button.searchInput_scan.corner',data: val__.borderRadius || '' ,title:'圆角'} },
                            item2 ={ id:'2',content:{name:'statusBar.button.searchInput_scan.textColor',data: val__.color.textColor || '' ,title:'字体颜色'} },
                            item3 ={ id:'3',content:{name:'statusBar.button.searchInput_scan.width',data: val__.size.width || '' ,title:'宽度'} },
                            item4 ={ id:'3',content:{name:'statusBar.button.searchInput_scan.height',data: val__.size.height || '' ,title:'高度'} }
                            self.editor_content.ids = [item1,item2,item3,item4]
                        }else if ( val__.id == 'textUser') {
                            let item1 ={ id:'3',content:{name:'statusBar.button.textUser.textContent',data: val__.text || '' ,title:'文本'} },
                            item2 ={ id:'3',content:{name:'statusBar.button.textUser.textSize',data: val__.fontSize || '' ,title:'字体大小'} },
                            item3 ={ id:'2',content:{name:'statusBar.button.textUser.textColor',data: val__.color || '' ,title:'字体颜色'} }
                            self.editor_content.ids = [item1,item2,item3]
                        }else{
                            self.editor_content.ids = []
                        }
                    }
   
                }
            },
            clear_status_bar_list_btn(){
                let self = this
                //将状态栏中要填充元素组件清空
                self.statusBar_moduleImg_pic.list_btn = []
            },
            status_data( func){
                this.status_data_func = func
            },
            /**
            ********************************************************************************
            */

            /**
            * 标签栏事件
            */
            label_bar_edit_json( func,data){
                let self = this
                func ? self.labelBar_click_editJson__callback = func : null
                if ( data) {
                    self.whichModule_text = '标签栏'
                    let item1 = { id:'2',content:{name:'labelBar.selectColor',data:data.select_color ,title:'选中颜色'} }
                    let item2 = { id:'2',content:{name:'labelBar.unselectColor',data:data.unSelect_color,title:'未选中颜色'} }
                    let item3 = { id:'2',content:{name:'labelBar.bgColor',data:data.bgColor ,title:'背景颜色'} }
                    let item4 = { id:'3',content:{name:'labelBar.font',data:data.font ,title:'字体大小'} }
                    let item5 = { id:'3',content:{name:'labelBar.familyName',data:data.familyName ,title:'字体格式'} }
                    let item6 = { id:'3',content:{name:'labelBar.androidFamilyName',data:data.androidFamilyName ,title:'android字体格式'} }
                    self.editor_content.ids = [item1,item2,item3,item4,item5,item6]
                }
                self.clear_status_bar_list_btn()
                
            },
            label_tab_data( func){
                this.label_tab_data_func = func
            },
            /**
            ********************************************************************************
            */

            /**
            * 底部导航栏事件
            */
            navigation_bar_edit_json( func,data){
                let self = this
                func ? self.navigationBar_click_editJson__callback = func : null
                if ( data) {
                    self.whichModule_text = '底部导航栏'
                    let item1 = { id:'2',content:{name:'navBar.selectColor',data:data.select_color ,title:'选中颜色'} }
                    let item2 = { id:'2',content:{name:'navBar.unselectColor',data:data.unSelect_color,title:'未选中颜色'} }
                    let item3 = { id:'2',content:{name:'navBar.bgColor',data:data.bgColor ,title:'背景颜色'} }
                    let item4 = { id:'3',content:{name:'navBar.font',data:data.font ,title:'字体大小'} }
                    let item5 = { id:'3',content:{name:'navBar.familyName',data:data.familyName ,title:'字体格式'} }
                    self.editor_content.ids = [item1,item2,item3,item4,item5]
                }
                self.clear_status_bar_list_btn()
                
            },
            navigation_data( func){
                this.navigation_data_func = func
            },

            /**
            * 新闻详情内容
            */
            click_content_particular_back(){
                let self = this
                self.newslist_show = self.status_show = self.tab_show = self.nav_show= true
                self.cParticular_show = false
            },
            get_concrete_data( cb){
                let self = this
                self.get_concrete_data_cb = cb
            },

            /**
            * 新闻列表事件
            */
            newsList_recommend_edit_json( id_,difference,func,data){
                let self = this
                !self.newsList_click_editJson ? self.newsList_click_editJson = [] : null
                func ? self.newsList_click_editJson.push( func) : null
                if ( data) {
                    //左右图
                    if ( id_ == 'lri') {
                        if ( difference == 'bigImage_220') 
                            self.whichModule_text = '推荐-信息流(左图右标题)'
                        else if ( difference == 'bigImage_221') 
                            self.whichModule_text = '推荐-信息流(右图左标题)'
                        else if ( difference == 'bigImage_240') 
                            self.whichModule_text = '推荐-信息流(无图右标题)'

                        let item_arr = []
                        for (var i = 0; i < 50; i++) {
                            let item = '';item_arr.push(item)
                        }
                        //整体边距等
                        item_arr[0] = { id:'1',content:{name:'newsList.lri.entirety',data:data.margin_new ,title:'边距',difference:difference} }
                        item_arr[1] = { id:'4',content:{name:'newsList.lri.underline',data:{select:data.mpid,content:[{label:'1',text:'短线'},{label:'2',text:'长线'}] } ,title:'下分割线',difference:difference} }
                        item_arr[2] = { id:'3',content:{name:'newsList.lri.cell_height',data:data.cell_height ,title:'整体高度',difference:difference} }

                        //图片样式
                        if ( difference  != 'bigImage_240'
                        ) {
                            // item_arr[1] = { id:'3',content:{name:'newsList.lri.img.left',data:data.imgleft ,title:'(图片)左侧距离',difference:difference} }
                            // item_arr[2] = { id:'3',content:{name:'newsList.lri.img.right',data:data.imgright ,title:'(图片)右侧距离',difference:difference} }
                            // item_arr[3] = { id:'3',content:{name:'newsList.lri.img.top',data:data.imgtop ,title:'(图片)顶部距离',difference:difference} }
                            item_arr[3] = { id:'3',content:{name:'newsList.lri.img.width',data:data.imgwidth ,title:'(图片)宽度',difference:difference} }
                            item_arr[4] = { id:'3',content:{name:'newsList.lri.img.height',data:data.imgheight ,title:'(图片)高度',difference:difference} }
                            item_arr[5] = { id:'3',content:{name:'newsList.lri.img.radius',data:data.imgradius ,title:'(图片)圆角',difference:difference} }
                        }
                        
                        //标题样式
                        if ( difference  == 'bigImage_220' || 
                            difference  == 'bigImage_221' || 
                            difference  == 'bigImage_240'
                        ) {
                            item_arr[35] = { id:'2',content:{name:'newsList.lri.title.color',data:data.titlecolor ,title:'(标题)字体颜色',difference:difference} }
                            item_arr[36] = { id:'3',content:{name:'newsList.lri.title.font',data:data.titlefont ,title:'(标题)字体大小',difference:difference} }
                            item_arr[37] = { id:'3',content:{name:'newsList.lri.title.familyName',data:data.titlefamilyName ,title:'(标题)字体格式',difference:difference} }
                            item_arr[38] = { id:'3',content:{name:'newsList.lri.title.androidfamilyName',data:data.titleandroidFamilyName ,title:'(标题)安卓格式',difference:difference} }
                            // item_arr[39] = { id:'3',content:{name:'newsList.lri.title.top',data:data.titletop ,title:'(标题)顶部距离',difference:difference} }
                            // item_arr[40] = { id:'3',content:{name:'newsList.lri.title.left',data:data.titleleft ,title:'(标题)左侧距离',difference:difference} }
                        }
                        
                        //标签样式
                        if ( difference == 'bigImage_220' || 
                            difference  == 'bigImage_221' || 
                            difference  == 'bigImage_240'
                        ) {
                            item_arr[12] = { id:'2',content:{name:'newsList.lri.tag.color',data:data.tagcolor ,title:'(标签)字体颜色',difference:difference} }
                            item_arr[13] = { id:'3',content:{name:'newsList.lri.tag.font',data:data.tagfont ,title:'(标签)字体大小',difference:difference} }
                            item_arr[14] = { id:'3',content:{name:'newsList.lri.tag.familyName',data:data.tagfamilyName ,title:'(标签)字体格式',difference:difference} }
                            item_arr[15] = { id:'3',content:{name:'newsList.lri.tag.androidfamilyName',data:data.tagandroidFamilyName ,title:'(标签)安卓格式',difference:difference} }
                            // item_arr[17] = { id:'3',content:{name:'newsList.lri.tag.top',data:data.tagtop ,title:'(标签)顶部距离',difference:difference} }
                            // item_arr[18] = { id:'3',content:{name:'newsList.lri.tag.left',data:data.tagleft ,title:'(标签)左侧距离',difference:difference} }
                            // item_arr[19] = { id:'3',content:{name:'newsList.lri.tag.bottom',data:data.tagbottom ,title:'(标签)底部距离',difference:difference} }
                        }
                        

                        //时间样式
                        if ( difference == 'bigImage_220' || 
                            difference  == 'bigImage_221' || 
                            difference  == 'bigImage_240'
                        ) {
                            item_arr[20] = { id:'2',content:{name:'newsList.lri.time.color',data:data.timecolor ,title:'(时间)字体颜色',difference:difference} }
                            item_arr[21] = { id:'3',content:{name:'newsList.lri.time.font',data:data.timefont ,title:'(时间)字体大小',difference:difference} }
                            item_arr[22] = { id:'3',content:{name:'newsList.lri.time.familyName',data:data.timefamilyName ,title:'(时间)字体格式',difference:difference} }
                            item_arr[23] = { id:'3',content:{name:'newsList.lri.time.androidfamilyName',data:data.timeandroidFamilyName ,title:'(时间)安卓格式',difference:difference} }
                            // item_arr[24] = { id:'3',content:{name:'newsList.lri.time.top',data:data.timetop ,title:'(时间)顶部距离',difference:difference} }
                            // item_arr[25] = { id:'3',content:{name:'newsList.lri.time.left',data:data.timeleft ,title:'(时间)左侧距离',difference:difference} }
                            // item_arr[26] = { id:'3',content:{name:'newsList.lri.time.bottom',data:data.timebottom ,title:'(时间)底部距离',difference:difference} }
                        }

                        //阅读量样式
                        if ( difference == 'bigImage_220' || 
                            difference  == 'bigImage_221' || 
                            difference  == 'bigImage_240'
                        ) {
                            item_arr[27] = { id:'2',content:{name:'newsList.lri.read.color',data:data.readcolor ,title:'(阅读量)字体颜色',difference:difference} }
                            item_arr[28] = { id:'3',content:{name:'newsList.lri.read.font',data:data.readfont ,title:'(阅读量)字体大小',difference:difference} }
                            item_arr[29] = { id:'3',content:{name:'newsList.lri.read.familyName',data:data.readfamilyName ,title:'(阅读量)字体格式',difference:difference} }
                            item_arr[30] = { id:'3',content:{name:'newsList.lri.read.androidfamilyName',data:data.readandroidFamilyName ,title:'(阅读量)安卓格式',difference:difference} }
                            // item_arr[31] = { id:'3',content:{name:'newsList.lri.read.top',data:data.readtop ,title:'(阅读量)顶部距离',difference:difference} }
                            // item_arr[32] = { id:'3',content:{name:'newsList.lri.read.right',data:data.readright ,title:'(阅读量)左侧距离',difference:difference} }
                            // item_arr[33] = { id:'3',content:{name:'newsList.lri.read.bottom',data:data.readbottom ,title:'(阅读量)底部距离',difference:difference} }
                        }

                        self.editor_content.ids = item_arr
                    }

                    //三图
                    if ( id_ == 'mial') {
                        if ( difference == 'bigImage_230') 
                            self.whichModule_text = '推荐-信息流-三图(底部标题)'
                        else if ( difference == 'bigImage_231') 
                            self.whichModule_text = '推荐-信息流-三图(顶部标题)'

                        let item_arr = []
                        for (var i = 0; i < 50; i++) {
                            let item = '';item_arr.push(item)
                        }
                        //整体边距等
                        item_arr[0] = { id:'1',content:{name:'newsList.mial.entirety',data:data.margin_new ,title:'边距',difference:difference} }

                        //分割线类型
                        item_arr[1] = { id:'4',content:{name:'newsList.mial.underline',data:{select:data.mpid,content:[{label:'1',text:'短线'},{label:'2',text:'长线'}] } ,title:'下分割线',difference:difference} }

                        //整体高度
                        item_arr[2] = { id:'3',content:{name:'newsList.mial.cell_height',data:data.cell_height ,title:'整体高度',difference:difference} }

                        //图片样式
                        // item_arr[1] = { id:'3',content:{name:'newsList.mial.img.left',data:data.imgleft ,title:'(图片)左侧距离',difference:difference} }
                        // item_arr[2] = { id:'3',content:{name:'newsList.mial.img.right',data:data.imgright ,title:'(图片)右侧距离',difference:difference} }
                        // item_arr[3] = { id:'3',content:{name:'newsList.mial.img.top',data:data.imgtop ,title:'(图片)顶部距离',difference:difference} }
                        // item_arr[3] = { id:'3',content:{name:'newsList.mial.img.width',data:data.imgwidth ,title:'(图片)宽度',difference:difference} }
                        item_arr[4] = { id:'3',content:{name:'newsList.mial.img.height',data:data.imgheight ,title:'(图片)高度',difference:difference} }
                        item_arr[5] = { id:'3',content:{name:'newsList.mial.img.radius',data:data.imgradius ,title:'(图片)圆角',difference:difference} }
                        
                        //标题样式
                        if ( difference  == 'bigImage_230' || 
                            difference  == 'bigImage_231'
                        ) {
                            item_arr[6] = { id:'2',content:{name:'newsList.mial.title.color',data:data.titlecolor ,title:'(标题)字体颜色',difference:difference} }
                            item_arr[7] = { id:'3',content:{name:'newsList.mial.title.font',data:data.titlefont ,title:'(标题)字体大小',difference:difference} }
                            item_arr[8] = { id:'3',content:{name:'newsList.mial.title.familyName',data:data.titlefamilyName ,title:'(标题)字体格式',difference:difference} }
                            item_arr[9] = { id:'3',content:{name:'newsList.mial.title.androidFamilyName',data:data.titleandroidFamilyName ,title:'(标题)安卓格式',difference:difference} }
                            // item_arr[10] = { id:'3',content:{name:'newsList.mial.title.top',data:data.titletop ,title:'(标题)顶部距离',difference:difference} }
                            // item_arr[11] = { id:'3',content:{name:'newsList.mial.title.left',data:data.titleleft ,title:'(标题)左侧距离',difference:difference} }
                        }
                        
                        //标签样式
                        if ( difference == 'bigImage_230' || 
                            difference  == 'bigImage_231'
                        ) {
                            item_arr[12] = { id:'2',content:{name:'newsList.mial.tag.color',data:data.tagcolor ,title:'(标签)字体颜色',difference:difference} }
                            item_arr[13] = { id:'3',content:{name:'newsList.mial.tag.font',data:data.tagfont ,title:'(标签)字体大小',difference:difference} }
                            item_arr[14] = { id:'3',content:{name:'newsList.mial.tag.familyName',data:data.tagfamilyName ,title:'(标签)字体格式',difference:difference} }
                            item_arr[15] = { id:'3',content:{name:'newsList.mial.tag.androidFamilyName',data:data.tagandroidFamilyName ,title:'(标签)安卓格式',difference:difference} }
                            // item_arr[17] = { id:'3',content:{name:'newsList.mial.tag.top',data:data.tagtop ,title:'(标签)顶部距离',difference:difference} }
                            // item_arr[18] = { id:'3',content:{name:'newsList.mial.tag.left',data:data.tagleft ,title:'(标签)左侧距离',difference:difference} }
                            // item_arr[19] = { id:'3',content:{name:'newsList.mial.tag.bottom',data:data.tagbottom ,title:'(标签)底部距离',difference:difference} }
                        }
                        

                        //时间样式
                        if ( difference == 'bigImage_230' || 
                            difference  == 'bigImage_231'
                        ) {
                            item_arr[20] = { id:'2',content:{name:'newsList.mial.time.color',data:data.timecolor ,title:'(时间)字体颜色',difference:difference} }
                            item_arr[21] = { id:'3',content:{name:'newsList.mial.time.font',data:data.timefont ,title:'(时间)字体大小',difference:difference} }
                            item_arr[22] = { id:'3',content:{name:'newsList.mial.time.familyName',data:data.timefamilyName ,title:'(时间)字体格式',difference:difference} }
                            item_arr[23] = { id:'3',content:{name:'newsList.mial.time.androidFamilyName',data:data.timeandroidFamilyName ,title:'(时间)安卓格式',difference:difference} }
                            // item_arr[24] = { id:'3',content:{name:'newsList.mial.time.top',data:data.timetop ,title:'(时间)顶部距离',difference:difference} }
                            // item_arr[25] = { id:'3',content:{name:'newsList.mial.time.left',data:data.timeleft ,title:'(时间)左侧距离',difference:difference} }
                            // item_arr[26] = { id:'3',content:{name:'newsList.mial.time.bottom',data:data.timebottom ,title:'(时间)底部距离',difference:difference} }
                        }

                        //阅读量样式
                        if ( difference == 'bigImage_230' || 
                            difference  == 'bigImage_231'
                        ) {
                            item_arr[27] = { id:'2',content:{name:'newsList.mial.read.color',data:data.readcolor ,title:'(阅读量)字体颜色',difference:difference} }
                            item_arr[28] = { id:'3',content:{name:'newsList.mial.read.font',data:data.readfont ,title:'(阅读量)字体大小',difference:difference} }
                            item_arr[29] = { id:'3',content:{name:'newsList.mial.read.familyName',data:data.readfamilyName ,title:'(阅读量)字体格式',difference:difference} }
                            item_arr[30] = { id:'3',content:{name:'newsList.mial.read.androidFamilyName',data:data.readandroidFamilyName ,title:'(阅读量)安卓格式',difference:difference} }
                            // item_arr[31] = { id:'3',content:{name:'newsList.mial.read.top',data:data.readtop ,title:'(阅读量)顶部距离',difference:difference} }
                            // item_arr[32] = { id:'3',content:{name:'newsList.mial.read.right',data:data.readright ,title:'(阅读量)左侧距离',difference:difference} }
                            // item_arr[33] = { id:'3',content:{name:'newsList.mial.read.bottom',data:data.readbottom ,title:'(阅读量)底部距离',difference:difference} }
                        }
                        //状态样式
                        if ( difference == 'bigImage_230' || 
                            difference  == 'bigImage_231'
                        ) {
                            item_arr[34] = { id:'2',content:{name:'newsList.mial.status.color',data:data.statuscolor ,title:'(状态)字体颜色',difference:difference} }
                            item_arr[35] = { id:'3',content:{name:'newsList.mial.status.font',data:data.statusfont ,title:'(状态)字体大小',difference:difference} }
                            item_arr[36] = { id:'3',content:{name:'newsList.mial.status.familyName',data:data.statusfamilyName ,title:'(状态)字体格式',difference:difference} }
                            item_arr[37] = { id:'3',content:{name:'newsList.mial.status.androidFamilyName',data:data.status_androidfamilyName ,title:'(状态)安卓格式',difference:difference} }
                            item_arr[38] = { id:'3',content:{name:'newsList.mial.status.radius',data:data.statusradius ,title:'(状态)圆角',difference:difference} }
                        }

                        self.editor_content.ids = item_arr
                    }

                    //大图
                    if ( id_ == 'bpic') {
                        if ( difference == 'bigImage_200') 
                            self.whichModule_text = '推荐-大图(无标题无标签)'
                        else if ( difference == 'bigImage_201') 
                            self.whichModule_text = '推荐-大图(底部标题带标签)'
                        else if ( difference == 'bigImage_202') 
                            self.whichModule_text = '推荐-大图(顶部标题带标签)'
                        else if ( difference == 'bigImage_203') 
                            self.whichModule_text = '推荐-大图(中间标题带标签)'
                        else if ( difference == 'bigImage_204') 
                            self.whichModule_text = '推荐-活动(底部标题带报名)'
                        else if ( difference == 'bigImage_205') 
                            self.whichModule_text = '推荐-活动(中间标题无标签)'
                        else if ( difference == 'bigImage_206') 
                            self.whichModule_text = '推荐-大图(有标题)'
                        else if ( difference == 'bigImage_210') 
                            self.whichModule_text = '推荐-活动(中间标题带标签/点赞)'
                        else if ( difference == 'bigImage_211') 
                            self.whichModule_text = '推荐-活动(顶部标题带标签/点赞)'
                        else if ( difference == 'bigImage_212') 
                            self.whichModule_text = '推荐-活动(顶部标题带介绍/点赞)'

                        let item_arr = []
                        for (var i = 0; i < 60; i++) {
                            let item = '';item_arr.push(item)
                        }
                        //整体边距等
                        item_arr[0] = { id:'1',content:{name:'newsList.bpic.entirety',data:data.margin_new ,title:'边距',difference:difference} }

                        //下分割线类型
                        item_arr[1] = { id:'4',content:{name:'newsList.bpic.underline',data:{select:data.mpid,content:[{label:'1',text:'短线'},{label:'2',text:'长线'}] } ,title:'下分割线',difference:difference} }

                        //整体高度
                        item_arr[2] = { id:'3',content:{name:'newsList.bpic.cell_height',data:data.cell_height ,title:'整体高度',difference:difference} }
                        //图片样式
                        // item_arr[1] = { id:'3',content:{name:'newsList.bpic.img.left',data:data.imgleft ,title:'(图片)左侧距离',difference:difference} }
                        // item_arr[2] = { id:'3',content:{name:'newsList.bpic.img.right',data:data.imgright ,title:'(图片)右侧距离',difference:difference} }
                        // item_arr[3] = { id:'3',content:{name:'newsList.bpic.img.top',data:data.imgtop ,title:'(图片)顶部距离',difference:difference} }
                        item_arr[4] = { id:'3',content:{name:'newsList.bpic.img.height',data:data.imgheight ,title:'(图片)高度',difference:difference} }
                        item_arr[5] = { id:'3',content:{name:'newsList.bpic.img.radius',data:data.imgradius ,title:'(图片)圆角',difference:difference} }

                        //简介样式
                        if ( difference != 'bigImage_200' && 
                            difference != 'bigImage_201' && 
                            difference != 'bigImage_202' && 
                            difference != 'bigImage_203' && 
                            difference != 'bigImage_204' && 
                            difference != 'bigImage_205' && 
                            difference != 'bigImage_206' &&
                            difference != 'bigImage_210' && 
                            difference != 'bigImage_211'
                        ){
                            item_arr[6] = { id:'2',content:{name:'newsList.bpic.intro.color',data:data.introcolor ,title:'(简介)字体颜色',difference:difference} }
                            item_arr[7] = { id:'3',content:{name:'newsList.bpic.intro.font',data:data.introfont ,title:'(简介)字体大小',difference:difference} }
                            item_arr[8] = { id:'3',content:{name:'newsList.bpic.intro.familyName',data:data.introfamilyName ,title:'(简介)字体格式',difference:difference} }
                            item_arr[9] = { id:'3',content:{name:'newsList.bpic.intro.androidfamilyName',data:data.introandroidFamilyName ,title:'(简介)安卓格式',difference:difference} }
                            // item_arr[10] = { id:'3',content:{name:'newsList.bpic.intro.top',data:data.introtop ,title:'(简介)顶部距离',difference:difference} }
                            // item_arr[11] = { id:'3',content:{name:'newsList.bpic.intro.left',data:data.introleft ,title:'(简介)左侧距离',difference:difference} }
                        }
                        
                        //标题样式
                        if ( difference != 'bigImage_200') {
                            item_arr[35] = { id:'2',content:{name:'newsList.bpic.title.color',data:data.titlecolor ,title:'(标题)字体颜色',difference:difference} }
                            item_arr[36] = { id:'3',content:{name:'newsList.bpic.title.font',data:data.titlefont ,title:'(标题)字体大小',difference:difference} }
                            item_arr[37] = { id:'3',content:{name:'newsList.bpic.title.familyName',data:data.titlefamilyName ,title:'(标题)字体格式',difference:difference} }
                            item_arr[38] = { id:'3',content:{name:'newsList.bpic.title.androidfamilyName',data:data.titleandroidFamilyName ,title:'(标题)安卓格式',difference:difference} }
                            // item_arr[39] = { id:'3',content:{name:'newsList.bpic.title.top',data:data.titletop ,title:'(标题)顶部距离',difference:difference} }
                            // item_arr[40] = { id:'3',content:{name:'newsList.bpic.title.left',data:data.titleleft ,title:'(标题)左侧距离',difference:difference} }
                        }
                        
                        //标签样式
                        if ( difference != 'bigImage_200' && 
                            difference != 'bigImage_204' && 
                            difference != 'bigImage_205' &&
                            difference != 'bigImage_206' && 
                            difference != 'bigImage_212'
                        ) {
                            item_arr[12] = { id:'2',content:{name:'newsList.bpic.tag.color',data:data.tagcolor ,title:'(标签)字体颜色',difference:difference} }
                            item_arr[13] = { id:'3',content:{name:'newsList.bpic.tag.font',data:data.tagfont ,title:'(标签)字体大小',difference:difference} }
                            item_arr[14] = { id:'3',content:{name:'newsList.bpic.tag.familyName',data:data.tagfamilyName ,title:'(标签)字体格式',difference:difference} }
                            item_arr[15] = { id:'3',content:{name:'newsList.bpic.tag.androidfamilyName',data:data.tagandroidFamilyName ,title:'(标签)安卓格式',difference:difference} }
                            // item_arr[17] = { id:'3',content:{name:'newsList.bpic.tag.top',data:data.tagtop ,title:'(标签)顶部距离',difference:difference} }
                            // item_arr[18] = { id:'3',content:{name:'newsList.bpic.tag.left',data:data.tagleft ,title:'(标签)左侧距离',difference:difference} }
                            // item_arr[19] = { id:'3',content:{name:'newsList.bpic.tag.bottom',data:data.tagbottom ,title:'(标签)底部距离',difference:difference} }
                        }
                        

                        //时间样式
                        if ( difference != 'bigImage_200' && 
                            difference != 'bigImage_206' && 
                            difference != 'bigImage_212'
                        ) {
                            item_arr[20] = { id:'2',content:{name:'newsList.bpic.time.color',data:data.timecolor ,title:'(时间)字体颜色',difference:difference} }
                            item_arr[21] = { id:'3',content:{name:'newsList.bpic.time.font',data:data.timefont ,title:'(时间)字体大小',difference:difference} }
                            item_arr[22] = { id:'3',content:{name:'newsList.bpic.time.familyName',data:data.timefamilyName ,title:'(时间)字体格式',difference:difference} }
                            item_arr[23] = { id:'3',content:{name:'newsList.bpic.time.androidfamilyName',data:data.timeandroidFamilyName ,title:'(时间)安卓格式',difference:difference} }
                            // item_arr[24] = { id:'3',content:{name:'newsList.bpic.time.top',data:data.timetop ,title:'(时间)顶部距离',difference:difference} }
                            // item_arr[25] = { id:'3',content:{name:'newsList.bpic.time.left',data:data.timeleft ,title:'(时间)左侧距离',difference:difference} }
                            // item_arr[26] = { id:'3',content:{name:'newsList.bpic.time.bottom',data:data.timebottom ,title:'(时间)底部距离',difference:difference} }
                        }

                        //阅读量样式
                        if ( difference != 'bigImage_200' && 
                            difference != 'bigImage_204' && 
                            difference != 'bigImage_205' && 
                            difference != 'bigImage_205' &&
                            difference != 'bigImage_206' && 
                            difference != 'bigImage_212'
                        ) {
                            item_arr[27] = { id:'2',content:{name:'newsList.bpic.read.color',data:data.readcolor ,title:'(阅读量)字体颜色',difference:difference} }
                            item_arr[28] = { id:'3',content:{name:'newsList.bpic.read.font',data:data.readfont ,title:'(阅读量)字体大小',difference:difference} }
                            item_arr[29] = { id:'3',content:{name:'newsList.bpic.read.familyName',data:data.readfamilyName ,title:'(阅读量)字体格式',difference:difference} }
                            item_arr[30] = { id:'3',content:{name:'newsList.bpic.read.androidfamilyName',data:data.readandroidFamilyName ,title:'(阅读量)安卓格式',difference:difference} }
                            // item_arr[31] = { id:'3',content:{name:'newsList.bpic.read.top',data:data.readtop ,title:'(阅读量)顶部距离',difference:difference} }
                            // item_arr[32] = { id:'3',content:{name:'newsList.bpic.read.right',data:data.readright ,title:'(阅读量)左侧距离',difference:difference} }
                            // item_arr[33] = { id:'3',content:{name:'newsList.bpic.read.bottom',data:data.readbottom ,title:'(阅读量)底部距离',difference:difference} }
                        }

                        //状态样式
                        if ( difference != 'bigImage_200' && 
                            difference != 'bigImage_204' && 
                            difference != 'bigImage_210' && 
                            difference != 'bigImage_211' && 
                            difference != 'bigImage_212'
                        ) {
                            item_arr[40] = { id:'2',content:{name:'newsList.bpic.status.color',data:data.statuscolor ,title:'(状态)字体颜色',difference:difference} }
                            item_arr[41] = { id:'3',content:{name:'newsList.bpic.status.font',data:data.statusfont ,title:'(状态)字体大小',difference:difference} }
                            item_arr[42] = { id:'3',content:{name:'newsList.bpic.status.familyName',data:data.statusfamilyName ,title:'(状态)字体格式',difference:difference} }
                            item_arr[43] = { id:'3',content:{name:'newsList.bpic.status.androidfamilyName',data:data.status_androidFamilyName ,title:'(状态)安卓格式',difference:difference} }
                        }

                        //阴影
                        if ( difference == 'bigImage_205' || 
                            difference == 'bigImage_210'
                        ) {
                            item_arr[44] = { id:'2',content:{name:'newsList.bpic.shadow_top_Color',data:data.shadow_top_Color ,title:'(标题)阴影顶部颜色',difference:difference} }
                            item_arr[45] = { id:'3',content:{name:'newsList.bpic.shadow_top_opacity',data:data.shadow_top_opacity ,title:'(标题)阴影顶部透明度',difference:difference} }
                            item_arr[46] = { id:'2',content:{name:'newsList.bpic.shadow_bottom_Color',data:data.shadow_bottom_Color ,title:'(标题)阴影底部颜色',difference:difference} }
                            item_arr[47] = { id:'3',content:{name:'newsList.bpic.shadow_bottom_opacity',data:data.shadow_bottom_opacity ,title:'(标题)阴影底部透明度',difference:difference} }
                        }

                        //点赞样式
                        if ( difference == 'bigImage_210' ||
                             difference == 'bigImage_211' ||
                             difference == 'bigImage_212'
                        ) {
                            item_arr[48] = { id:'2',content:{name:'newsList.bpic.like.color',data:data.likecolor ,title:'(点赞)字体颜色',difference:difference} }
                            item_arr[49] = { id:'3',content:{name:'newsList.bpic.like.font',data:data.likefont ,title:'(点赞)字体大小',difference:difference} }
                            item_arr[50] = { id:'3',content:{name:'newsList.bpic.like.familyName',data:data.likefamilyName ,title:'(点赞)字体格式',difference:difference} }
                            item_arr[51] = { id:'3',content:{name:'newsList.bpic.like.androidfamilyName',data:data.likeandroidFamilyName ,title:'(点赞)安卓格式',difference:difference} }
                            // item_arr[31] = { id:'3',content:{name:'newsList.bpic.like.top',data:data.liketop ,title:'(点赞)顶部距离',difference:difference} }
                            // item_arr[32] = { id:'3',content:{name:'newsList.bpic.like.right',data:data.likeright ,title:'(点赞)左侧距离',difference:difference} }
                            // item_arr[33] = { id:'3',content:{name:'newsList.bpic.like.bottom',data:data.likebottom ,title:'(点赞)底部距离',difference:difference} }
                        }
                        
                        self.editor_content.ids = item_arr
                    }

                    //热点新闻
                    if ( id_ == 'hts') {
                        self.whichModule_text = '热点新闻'
                        if ( data.entirety) {
                            //整体边距等
                            let item1 = { id:'1',content:{name:'newsList.hts.entirety',data:data.margin_new ,title:'内边距',difference:difference} }
                            self.editor_content.ids = [item1]
                        }else if ( data.dot) {
                            //点样式
                            let item1 = { id:'3',content:{name:'newsList.hts.dot.left',data:data.left ,title:'左侧距离',difference:difference} }
                            let item2 = { id:'3',content:{name:'newsList.hts.dot.top',data:data.top ,title:'顶部距离',difference:difference} }
                            let item3 = { id:'2',content:{name:'newsList.hts.dot.bgColor',data:data.bgColor ,title:'背景颜色',difference:difference} }
                            let item4 = { id:'3',content:{name:'newsList.hts.dot.width',data:data.width ,title:'宽度',difference:difference} }
                            let item5 = { id:'3',content:{name:'newsList.hts.dot.radius',data:data.radius ,title:'圆角',difference:difference} }
                            self.editor_content.ids = [item1,item2,item3,item4,item5]
                        }else if ( data.title) {
                            //标题样式
                            let item1 = { id:'2',content:{name:'newsList.hts.title.color',data:data.color ,title:'字体颜色',difference:difference} }
                            let item2 = { id:'3',content:{name:'newsList.hts.title.font',data:data.font ,title:'字体大小',difference:difference} }
                            let item3 = { id:'3',content:{name:'newsList.hts.title.familyName',data:data.familyName ,title:'字体格式',difference:difference} }
                            let item4 = { id:'3',content:{name:'newsList.hts.title.left',data:data.left ,title:'左侧距离',difference:difference} }
                            self.editor_content.ids = [item1,item2,item3,item4]
                        }else if ( data.read) {
                            //阅读量样式
                            let item1 = { id:'2',content:{name:'newsList.hts.read.color',data:data.color ,title:'字体颜色',difference:difference} }
                            let item2 = { id:'3',content:{name:'newsList.hts.read.font',data:data.font ,title:'字体大小',difference:difference} }
                            let item3 = { id:'3',content:{name:'newsList.hts.read.familyName',data:data.familyName ,title:'字体格式',difference:difference} }
                            let item4 = { id:'3',content:{name:'newsList.hts.read.top',data:data.top ,title:'顶部距离',difference:difference} }
                            let item5 = { id:'3',content:{name:'newsList.hts.read.right',data:data.right ,title:'右侧距离',difference:difference} }
                            let item6 = { id:'3',content:{name:'newsList.hts.read.bottom',data:data.bottom ,title:'底部距离',difference:difference} }
                            self.editor_content.ids = [item1,item2,item3,item4,item5,item6]
                        }else if ( data.tag) {
                            //标签样式
                            let item1 = { id:'2',content:{name:'newsList.hts.tag.color',data:data.color ,title:'字体颜色',difference:difference} }
                            let item2 = { id:'3',content:{name:'newsList.hts.tag.font',data:data.font ,title:'字体大小',difference:difference} }
                            let item3 = { id:'3',content:{name:'newsList.hts.tag.familyName',data:data.familyName ,title:'字体格式',difference:difference} }
                            let item4 = { id:'3',content:{name:'newsList.hts.tag.left',data:data.left ,title:'左侧距离',difference:difference} }
                            let item5 = { id:'3',content:{name:'newsList.hts.tag.top',data:data.top ,title:'顶部距离',difference:difference} }
                            let item6 = { id:'3',content:{name:'newsList.hts.tag.bottom',data:data.bottom ,title:'底部距离',difference:difference} }
                            self.editor_content.ids = [item1,item2,item3,item4,item5,item6]
                        }else if ( data.time) {
                            //时间样式
                            let item1 = { id:'2',content:{name:'newsList.hts.time.color',data:data.color ,title:'字体颜色',difference:difference} }
                            let item2 = { id:'3',content:{name:'newsList.hts.time.font',data:data.font ,title:'字体大小',difference:difference} }
                            let item3 = { id:'3',content:{name:'newsList.hts.time.familyName',data:data.familyName ,title:'字体格式',difference:difference} }
                            let item4 = { id:'3',content:{name:'newsList.hts.time.left',data:data.left ,title:'左侧距离',difference:difference} }
                            let item5 = { id:'3',content:{name:'newsList.hts.time.top',data:data.top ,title:'顶部距离',difference:difference} }
                            let item6 = { id:'3',content:{name:'newsList.hts.time.bottom',data:data.bottom ,title:'底部距离',difference:difference} }
                            self.editor_content.ids = [item1,item2,item3,item4,item5,item6]
                        }
                    }

                    //广告轮播
                    if ( id_ == 'bc') {
                        self.whichModule_text = '广告轮播'
                        let item1 = { id:'3',content:{name:'newsList.bc.delay',data:data.delay ,title:'轮播时间(s)',difference:difference} }
                        let item2 = { id:'2',content:{name:'newsList.bc.select_color',data:data.select_color ,title:'选中颜色',difference:difference} }
                        let item3 = { id:'2',content:{name:'newsList.bc.unSelect_color',data:data.unSelect_color ,title:'未选中颜色',difference:difference} }

                        let item4 = { id:'2',content:{name:'newsList.bc.shadow_top_Color',data:data.shadow_top_Color ,title:'(标题)阴影顶部颜色',difference:difference} }
                        let item5 = { id:'3',content:{name:'newsList.bc.shadow_top_opacity',data:data.shadow_top_opacity ,title:'(标题)阴影顶部透明度',difference:difference} }
                        let item4_1 = { id:'2',content:{name:'newsList.bc.shadow_bottom_Color',data:data.shadow_bottom_Color ,title:'(标题)阴影底部颜色',difference:difference} }
                        let item5_1 = { id:'3',content:{name:'newsList.bc.shadow_bottom_opacity',data:data.shadow_bottom_opacity ,title:'(标题)阴影底部透明度',difference:difference} }

                        let item6 = { id:'3',content:{name:'newsList.bc.cell_height',data:data.cell_height ,title:'整体高度',difference:difference} }
                        // let item6 = { id:'3',content:{name:'newsList.bc.img_radius',data:data.img_radius ,title:'图片圆角',difference:difference} }
                        let item6_1 = { id:'3',content:{name:'newsList.bc.img_height',data:data.img_height ,title:'图片高度',difference:difference} }

                        let item7 = { id:'2',content:{name:'newsList.bc.title.color',data:data.color ,title:'(标题)字体颜色',difference:difference} }
                        let item8 = { id:'3',content:{name:'newsList.bc.title.font',data:data.font ,title:'(标题)字体大小',difference:difference} }
                        let item9 = { id:'3',content:{name:'newsList.bc.title.familyName',data:data.familyName ,title:'(标题)字体格式',difference:difference} }
                        let item9_1 = { id:'3',content:{name:'newsList.bc.title.androidfamilyName',data:data.android_familyName ,title:'(标题)安卓字体',difference:difference} }

                        let item10 = { id:'2',content:{name:'newsList.bc.status.color',data:data.status_color ,title:'(直播状态)字体颜色',difference:difference} }
                        let item11 = { id:'3',content:{name:'newsList.bc.status.font',data:data.status_font ,title:'(直播状态)字体大小',difference:difference} }
                        let item12 = { id:'3',content:{name:'newsList.bc.status.familyName',data:data.status_familyName ,title:'(直播状态)字体格式',difference:difference} }
                        let item13 = { id:'3',content:{name:'newsList.bc.status.androidfamilyName',data:data.status_android_familyName ,title:'(直播状态)安卓字体',difference:difference} }
                        let item14 = { id:'2',content:{name:'newsList.bc.status.bgColor',data:data.status_bgColor ,title:'(直播状态)背景颜色',difference:difference} }
                        let item15 = { id:'3',content:{name:'newsList.bc.status.radius',data:data.status_radius ,title:'(直播状态)圆角',difference:difference} }

                        self.editor_content.ids = [item1,item6,item6_1,item2,item3,item4,item5,item4_1,item5_1,item7,item8,item9,item9_1,item10,item11,item12,item13,item14,item15]
                    }

                    //快讯轮播
                    if ( id_ == 'blet') {
                        self.whichModule_text = '快讯新闻'
                        if ( difference == 'bigImage_1001') {
                            let item0 = { id:'3',content:{name:'newsList.blet.cell_height',data:data.cell_height ,title:'整体高度',difference:difference} }
                            let item1 = { id:'3',content:{name:'newsList.blet.tip.radius',data:data.radius ,title:'图片圆角',difference:difference} }
                            let item2 = { id:'3',content:{name:'newsList.blet.tip.width',data:data.width ,title:'图片宽度',difference:difference} }
                            let item3 = { id:'3',content:{name:'newsList.blet.tip.height',data:data.height ,title:'图片高度',difference:difference} }
                            let item4 = { id:'2',content:{name:'newsList.blet.title.color',data:data.title_color ,title:'标题字体颜色',difference:difference} }
                            let item5 = { id:'3',content:{name:'newsList.blet.title.font',data:data.title_font ,title:'标题字体大小',difference:difference} }
                            let item6 = { id:'3',content:{name:'newsList.blet.title.familyName',data:data.title_familyName ,title:'标题字体格式',difference:difference} }
                            let item7 = { id:'3',content:{name:'newsList.blet.title.androidFamilyName',data:data.title_androidFamilyName ,title:'标题安卓字体格式',difference:difference} }
                            self.editor_content.ids = [item0,item1,item2,item3,item4,item5,item6,item7]
                        }else if ( difference == 'bigImage_1002') {
                            //边距
                            let item1 = { id:'1',content:{name:'newsList.blet.entirety',data:data.margin_new ,title:'整体内边距',difference:difference} }
                            //整体高度
                            let item1_0 = { id:'3',content:{name:'newsList.blet.cell_height',data:data.cell_height ,title:'整体高度',difference:difference} }
                            //分割线类型
                            let item1_1 = { id:'4',content:{name:'newsList.blet.underline',data:{select:data.mpid,content:[{label:'1',text:'短线'},{label:'2',text:'长线'}] } ,title:'下分割线',difference:difference} }
                            //标题样式
                            let item2 = { id:'2',content:{name:'newsList.blet.title.color',data:data.title_color ,title:'标题字体颜色',difference:difference} }
                            let item3 = { id:'3',content:{name:'newsList.blet.title.font',data:data.title_font ,title:'标题字体大小',difference:difference} }
                            let item4 = { id:'3',content:{name:'newsList.blet.title.familyName',data:data.title_familyName ,title:'标题字体格式',difference:difference} }
                            let item4_1 = { id:'3',content:{name:'newsList.blet.title.androidFamilyName',data:data.title_androidFamilyName ,title:'标题安卓字体格式',difference:difference} }
                            //标签样式
                            let item5 = { id:'2',content:{name:'newsList.blet.tag.color',data:data.tag_color ,title:'标签字体颜色',difference:difference} }
                            let item6 = { id:'3',content:{name:'newsList.blet.tag.font',data:data.tag_font ,title:'标签字体大小',difference:difference} }
                            let item7 = { id:'3',content:{name:'newsList.blet.tag.familyName',data:data.tag_familyName ,title:'标签字体格式',difference:difference} }
                            let item7_1 = { id:'3',content:{name:'newsList.blet.tag.androidFamilyName',data:data.tag_androidFamilyName ,title:'标签安卓字体格式',difference:difference} }
                            //时间样式
                            let item8 = { id:'2',content:{name:'newsList.blet.time.color',data:data.time_color ,title:'时间字体颜色',difference:difference} }
                            let item9 = { id:'3',content:{name:'newsList.blet.time.font',data:data.time_font ,title:'时间字体大小',difference:difference} }
                            let item10 = { id:'3',content:{name:'newsList.blet.time.familyName',data:data.time_familyName ,title:'时间字体格式',difference:difference} }
                            let item10_1 = { id:'3',content:{name:'newsList.blet.time.androidFamilyName',data:data.time_androidFamilyName ,title:'时间安卓字体格式',difference:difference} }
                            //阅读量样式
                            let item11 = { id:'2',content:{name:'newsList.blet.read.color',data:data.read_color ,title:'阅读量字体颜色',difference:difference} }
                            let item12 = { id:'3',content:{name:'newsList.blet.read.font',data:data.read_font ,title:'阅读量字体大小',difference:difference} }
                            let item13 = { id:'3',content:{name:'newsList.blet.read.familyName',data:data.read_familyName ,title:'阅读量字体格式',difference:difference} }
                            let item13_1 = { id:'3',content:{name:'newsList.blet.read.androidFamilyName',data:data.read_androidFamilyName ,title:'阅读量安卓字体格式',difference:difference} }
                            self.editor_content.ids = [item1,item1_0,item1_1,item2,item3,item4,item4_1,item5,item6,item7,item7_1,item8,item9,item10,item10_1,item11,item12,item13,item13_1]
                        }
                        
                    }
                    //快捷按钮
                    if ( id_ == 'tsb') {
                        if ( difference == 'bigImage_1301') 
                            self.whichModule_text = '导航图标(单行)'
                        else if ( difference == 'bigImage_1302') 
                            self.whichModule_text = '导航图标(多行多列)'
                        else if ( difference == 'bigImage_1303') 
                            self.whichModule_text = '导航图标(多行两列)'
                        else if ( difference == 'bigImage_1304') 
                            self.whichModule_text = '导航图标(单行两列-右图)'
                        else if ( difference == 'bigImage_1305') 
                            self.whichModule_text = '导航图标(多行两列带标签)'
                        else if ( difference == 'bigImage_1306') 
                            self.whichModule_text = '导航图标(多行两列带关注)'
                        else if ( difference == 'bigImage_1307') 
                            self.whichModule_text = '导航图标(单行两列-左图)'
                        else if ( difference == 'bigImage_1308') 
                            self.whichModule_text = '导航图标(多行两列带详解介绍)'

                        let item_arr = []
                        for (var i = 0; i < 50; i++) {
                            let item = '';item_arr.push(item)
                        }

                        //边距
                        item_arr[1] = { id:'1',content:{name:'newsList.tsb.entirety',data:data.margin_entirety ,title:'整体边距',difference:difference} }

                        //分割线类型
                        item_arr[2] = { id:'4',content:{name:'newsList.tsb.underline',data:{select:data.mpid,content:[{label:'1',text:'短线'},{label:'2',text:'长线'}] } ,title:'下分割线',difference:difference} }
                        //整体高度
                        item_arr[3] = { id:'3',content:{name:'newsList.tsb.cell_height',data:data.cell_height ,title:'整体高度',difference:difference} }
                        
                        // item3 = { id:'3',content:{name:'newsList.tsb.imgtext_width',data:data.imgtext_width ,title:'(每个集合)宽度',difference:difference} }
                        
                        //图片
                        item_arr[4] = { id:'3',content:{name:'newsList.tsb.img.width',data:data.imgwidth ,title:'(图片)宽度',difference:difference} }
                        item_arr[5] = { id:'3',content:{name:'newsList.tsb.img.height',data:data.imgheight ,title:'(图片)高度',difference:difference} }
                        item_arr[6] = { id:'3',content:{name:'newsList.tsb.img.radius',data:data.imgradius ,title:'(图片)圆角',difference:difference} }
                        // let item4_1 = { id:'3',content:{name:'newsList.tsb.img.top',data:data.imgtop ,title:'(图片)顶部距离',difference:difference} }
                        // let item5_1 = { id:'3',content:{name:'newsList.tsb.img.right',data:data.imgright ,title:'(图片)右侧距离',difference:difference} }
                        // let item6_1 = { id:'3',content:{name:'newsList.tsb.img.bottom',data:data.imgbottom ,title:'(图片)底部距离',difference:difference} }
                        // let item7_1 = { id:'3',content:{name:'newsList.tsb.img.left',data:data.imgleft ,title:'(图片)左侧距离',difference:difference} }

                        //标题
                        if ( difference == 'bigImage_1305') {
                            item_arr[8] = { id:'2',content:{name:'newsList.tsb.title.bgcolor',data:data.titlebgcolor ,title:'(标题)字体背景颜色',difference:difference} }
                        }
                        item_arr[9] = { id:'2',content:{name:'newsList.tsb.title.color',data:data.titlecolor ,title:'(标题)字体颜色',difference:difference} }
                        item_arr[10] = { id:'3',content:{name:'newsList.tsb.title.font',data:data.titlefont ,title:'(标题)字体大小',difference:difference} }
                        item_arr[11] = { id:'3',content:{name:'newsList.tsb.title.familyName',data:data.titlefamilyName ,title:'(标题)字体格式',difference:difference} }
                        item_arr[12] = { id:'3',content:{name:'newsList.tsb.title.androidfamilyName',data:data.titleandroid_familyName ,title:'(标题)安卓格式',difference:difference} }
                        // let item11 = { id:'3',content:{name:'newsList.tsb.title.top',data:data.titletop ,title:'(标题)顶部距离',difference:difference} }
                        // let item12 = { id:'3',content:{name:'newsList.tsb.title.right',data:data.titleright ,title:'(标题)右侧距离',difference:difference} }
                        // let item13 = { id:'3',content:{name:'newsList.tsb.title.bottom',data:data.titlebottom ,title:'(标题)底部距离',difference:difference} }
                        // let item14 = { id:'3',content:{name:'newsList.tsb.title.left',data:data.titleleft ,title:'(标题)左侧距离',difference:difference} }
                        //子标题
                        if ( difference == 'bigImage_1304' ||
                             difference == 'bigImage_1307'
                        ) {
                            item_arr[13] = { id:'2',content:{name:'newsList.tsb.intro.color',data:data.introcolor ,title:'(子标题)字体颜色',difference:difference} }
                            item_arr[14] = { id:'3',content:{name:'newsList.tsb.intro.font',data:data.introfont ,title:'(子标题)字体大小',difference:difference} }
                            item_arr[15] = { id:'3',content:{name:'newsList.tsb.intro.familyName',data:data.introfamilyName ,title:'(子标题)字体格式',difference:difference} }
                            item_arr[16] = { id:'3',content:{name:'newsList.tsb.intro.androidfamilyName',data:data.introandroid_familyName ,title:'(子标题)安卓格式',difference:difference} }
                            // item19 = { id:'3',content:{name:'newsList.tsb.intro.top',data:data.introtop ,title:'(子标题)顶部距离',difference:difference} }
                            // item20 = { id:'3',content:{name:'newsList.tsb.intro.right',data:data.introright ,title:'(子标题)右侧距离',difference:difference} }
                            // item21 = { id:'3',content:{name:'newsList.tsb.intro.bottom',data:data.introbottom ,title:'(子标题)底部距离',difference:difference} }
                            // item22 = { id:'3',content:{name:'newsList.tsb.intro.left',data:data.introleft ,title:'(子标题)左侧距离',difference:difference} }
                        }
                        //关注
                        if ( difference == 'bigImage_1306') {
                            item_arr[20] = { id:'3',content:{name:'newsList.tsb.attention.radius',data:data.attentionradius ,title:'(关注)圆角',difference:difference} }
                            item_arr[21] = { id:'2',content:{name:'newsList.tsb.attention.color',data:data.attentioncolor ,title:'(关注)字体颜色',difference:difference} }
                            item_arr[22] = { id:'2',content:{name:'newsList.tsb.attention.bgcolor',data:data.attentionbgcolor ,title:'(关注)背景颜色',difference:difference} }
                            item_arr[23] = { id:'3',content:{name:'newsList.tsb.attention.font',data:data.attentionfont ,title:'(关注)字体大小',difference:difference} }
                            item_arr[24] = { id:'3',content:{name:'newsList.tsb.attention.familyName',data:data.attentionfamilyName ,title:'(关注)字体格式',difference:difference} }
                            item_arr[25] = { id:'3',content:{name:'newsList.tsb.attention.androidfamilyName',data:data.attentionandroid_familyName ,title:'(关注)安卓格式',difference:difference} }
                        }
                        //详解介绍
                        if ( difference == 'bigImage_1308') {
                            item_arr[26] = { id:'2',content:{name:'newsList.tsb.intro.color',data:data.introcolor ,title:'(详解介绍)字体颜色',difference:difference} }
                            item_arr[27] = { id:'3',content:{name:'newsList.tsb.intro.font',data:data.introfont ,title:'(详解介绍)字体大小',difference:difference} }
                            item_arr[28] = { id:'3',content:{name:'newsList.tsb.intro.familyName',data:data.introfamilyName ,title:'(详解介绍)字体格式',difference:difference} }
                            item_arr[29] = { id:'3',content:{name:'newsList.tsb.intro.androidfamilyName',data:data.introandroid_familyName ,title:'(详解介绍)安卓格式',difference:difference} }
                        }
                        self.editor_content.ids = item_arr
                    }
                    //水平滚动图片
                    if ( id_ == 'hsc') {
                        self.whichModule_text = '短视频 水平横向滑动'
                        //边距
                        let item1 = { id:'1',content:{name:'newsList.hsc.entirety',data:data.margin_entirety ,title:'整体边距',difference:difference} }

                        //整体高度
                        let item1_1 = { id:'3',content:{name:'newsList.hsc.cell_height',data:data.cell_height ,title:'整体高度',difference:difference} }
                        
                        //下划线
                        let item2 = { id:'4',content:{name:'newsList.hsc.underline',data:{select:data.mpid,content:[{label:'1',text:'短线'},{label:'2',text:'长线'}] } ,title:'下分割线',difference:difference} }
                        let item2_1 = ''
                        
                        //图片
                        let item3 = { id:'3',content:{name:'newsList.hsc.img.width',data:data.imgwidth ,title:'(图片)宽度',difference:difference} }
                        let item4 = { id:'3',content:{name:'newsList.hsc.img.height',data:data.imgheight ,title:'(图片)高度',difference:difference} }
                        let item5 = { id:'3',content:{name:'newsList.hsc.img.radius',data:data.imgradius ,title:'(图片)圆角',difference:difference} }
                        
                        let item6 = '',item7 = '',item8 = '',item9 = '',item14 = '',item15 = '',item17 = '',item18 = '',item19 = '',item20 = '',item21 = '',item22 = '',item23 = '',item24 = '',item25 = '',item26 = '',item27 = '',item28 = '',item29 = '',item30 = ''
                        if ( difference == 'bigImage_1202') {
                            //标题阴影
                            item6= { id:'2',content:{name:'newsList.hsc.shadow_top_Color',data:data.shadow_top_Color ,title:'(标题)阴影顶部颜色',difference:difference} }
                            item7 = { id:'3',content:{name:'newsList.hsc.shadow_top_opacity',data:data.shadow_top_opacity ,title:'(标题)阴影顶部透明度',difference:difference} }
                            item8 = { id:'2',content:{name:'newsList.hsc.shadow_bottom_Color',data:data.shadow_bottom_Color ,title:'(标题)阴影底部颜色',difference:difference} }
                            item9 = { id:'3',content:{name:'newsList.hsc.shadow_bottom_opacity',data:data.shadow_bottom_opacity ,title:'(标题)阴影底部透明度',difference:difference} }
                        }else if ( difference == 'bigImage_1204') {
                            //标签
                            item19 = { id:'2',content:{name:'newsList.hsc.tag.color',data:data.tagcolor ,title:'(标签)字体颜色',difference:difference} }
                            item20 = { id:'3',content:{name:'newsList.hsc.tag.font',data:data.tagfont ,title:'(标签)字体大小',difference:difference} }
                            item21 = { id:'3',content:{name:'newsList.hsc.tag.familyName',data:data.tagfamilyName ,title:'(标签)字体格式',difference:difference} }
                            item22 = { id:'3',content:{name:'newsList.hsc.tag.androidfamilyName',data:data.tagandroid_familyName ,title:'(标签)安卓格式',difference:difference} }
                            //时间
                            item14 = { id:'2',content:{name:'newsList.hsc.time.color',data:data.timecolor ,title:'(时间)字体颜色',difference:difference} }
                            item15 = { id:'3',content:{name:'newsList.hsc.time.font',data:data.timefont ,title:'(时间)字体大小',difference:difference} }
                            item17 = { id:'3',content:{name:'newsList.hsc.time.familyName',data:data.timefamilyName ,title:'(时间)字体格式',difference:difference} }
                            item18 = { id:'3',content:{name:'newsList.hsc.time.androidfamilyName',data:data.timeandroid_familyName ,title:'(时间)安卓格式',difference:difference} }
                            // item19 = { id:'3',content:{name:'newsList.hsc.time.top',data:data.timetop ,title:'(时间)顶部距离',difference:difference} }
                            // item20 = { id:'3',content:{name:'newsList.hsc.time.right',data:data.timeright ,title:'(时间)右侧距离',difference:difference} }
                            // item21 = { id:'3',content:{name:'newsList.hsc.time.bottom',data:data.timebottom ,title:'(时间)底部距离',difference:difference} }
                            // item22 = { id:'3',content:{name:'newsList.hsc.time.left',data:data.timeleft ,title:'(时间)左侧距离',difference:difference} }
                            //阅读量
                            item23 = { id:'2',content:{name:'newsList.hsc.review.color',data:data.reviewcolor ,title:'(阅读量)字体颜色',difference:difference} }
                            item24 = { id:'3',content:{name:'newsList.hsc.review.font',data:data.reviewfont ,title:'(阅读量)字体大小',difference:difference} }
                            item25 = { id:'3',content:{name:'newsList.hsc.review.familyName',data:data.reviewfamilyName ,title:'(阅读量)字体格式',difference:difference} }
                            item26 = { id:'3',content:{name:'newsList.hsc.review.androidfamilyName',data:data.reviewandroid_familyName ,title:'(阅读量)安卓格式',difference:difference} }
                            // item27 = { id:'3',content:{name:'newsList.hsc.review.top',data:data.reviewtop ,title:'(阅读量)顶部距离',difference:difference} }
                            // item28 = { id:'3',content:{name:'newsList.hsc.review.right',data:data.reviewright ,title:'(阅读量)右侧距离',difference:difference} }
                            // item29 = { id:'3',content:{name:'newsList.hsc.review.bottom',data:data.reviewbottom ,title:'(阅读量)底部距离',difference:difference} }
                            // item30 = { id:'3',content:{name:'newsList.hsc.review.left',data:data.reviewleft ,title:'(阅读量)左侧距离',difference:difference} }
                            //播放时间
                            item27 = { id:'2',content:{name:'newsList.hsc.duration.color',data:data.durationcolor ,title:'(播放时间)字体颜色',difference:difference} }
                            item28 = { id:'3',content:{name:'newsList.hsc.duration.font',data:data.durationfont ,title:'(播放时间)字体大小',difference:difference} }
                            item29 = { id:'3',content:{name:'newsList.hsc.duration.familyName',data:data.durationfamilyName ,title:'(播放时间)字体格式',difference:difference} }
                            item30 = { id:'3',content:{name:'newsList.hsc.duration.androidfamilyName',data:data.durationandroidFamilyName ,title:'(播放时间)安卓格式',difference:difference} }

                        }
                        let item10 = '',item11 = '',item12 = '',item13 = '',item31 = '',item32 = '',item33 = '',item34 = '',item35 = '',item36 = '',item37 = '',item38 = '',item39 = '',item40 = '',item41 = '',item42 = '',item43 = '',item44 = '',item45 = '',item46 = ''
                        if ( difference == 'bigImage_1203') {
                            //标题
                            item31 = { id:'2',content:{name:'newsList.hsc.title.color',data:data.titlecolor ,title:'(标题)字体颜色',difference:difference} }
                            item32 = { id:'3',content:{name:'newsList.hsc.title.font',data:data.titlefont ,title:'(标题)字体大小',difference:difference} }
                            item33 = { id:'3',content:{name:'newsList.hsc.title.familyName',data:data.titlefamilyName ,title:'(标题)字体格式',difference:difference} }
                            item34 = { id:'3',content:{name:'newsList.hsc.title.androidfamilyName',data:data.titleandroid_familyName ,title:'(标题)安卓格式',difference:difference} }
                            //子标题
                            item39 = { id:'2',content:{name:'newsList.hsc.intro.color',data:data.introcolor ,title:'(子标题)字体颜色',difference:difference} }
                            item40 = { id:'3',content:{name:'newsList.hsc.intro.font',data:data.introfont ,title:'(子标题)字体大小',difference:difference} }
                            item41 = { id:'3',content:{name:'newsList.hsc.intro.familyName',data:data.introfamilyName ,title:'(子标题)字体格式',difference:difference} }
                            item42 = { id:'3',content:{name:'newsList.hsc.intro.androidfamilyName',data:data.introandroid_familyName ,title:'(子标题)安卓格式',difference:difference} }

                            item43 = { id:'3',content:{name:'newsList.hsc.background.image',data:data.backgroundImage ,isFileUpload:1,title:'(单元)背景图片地址',difference:difference} }

                            // item43 = { id:'3',content:{name:'newsList.hsc.intro.top',data:data.introtop ,title:'(子标题)顶部距离',difference:difference} }
                            // item44 = { id:'3',content:{name:'newsList.hsc.intro.right',data:data.introright ,title:'(子标题)右侧距离',difference:difference} }
                            // item45 = { id:'3',content:{name:'newsList.hsc.intro.bottom',data:data.introbottom ,title:'(子标题)底部距离',difference:difference} }
                            // item46 = { id:'3',content:{name:'newsList.hsc.intro.left',data:data.introleft ,title:'(子标题)左侧距离',difference:difference} }
                        }else{
                            //标题
                            item10 = { id:'2',content:{name:'newsList.hsc.title.color',data:data.color ,title:'(标题)颜色',difference:difference} }
                            item11 = { id:'3',content:{name:'newsList.hsc.title.font',data:data.font ,title:'(标题)字体大小',difference:difference} }
                            item12 = { id:'3',content:{name:'newsList.hsc.title.familyName',data:data.familyName ,title:'(标题)字体格式',difference:difference} }
                            item13 = { id:'3',content:{name:'newsList.hsc.title.androidfamilyName',data:data.android_familyName ,title:'(标题)安卓字体',difference:difference} }
                        }
                        

                        self.editor_content.ids = [item1,item1_1,item2,item2_1,item3,item4,item5,item6,item7,item8,item9,item10,item11,item12,item13,item14,item15,item17,item18,item19,item20,item21,item22,item23,item24,item25,item26,item27,item28,item29,item30,item31,item32,item33,item34,item35,item36,item37,item38,item39,item40,item41,item42,item43,item44,item45,item46]
                    }
                    //卡片轮播(旋转木马) / 标题在下边的卡片轮播
                    if ( id_ == 'cardc') {
                        if ( difference == 'bigImage_1102') 
                            self.whichModule_text = '旋转木马（标题下）'
                        else if ( difference == 'bigImage_1103') 
                            self.whichModule_text = '旋转木马（标题内）'
                        else if ( difference == 'bigImage_1104') 
                            self.whichModule_text = '旋转木马（标题内）'
                        else if ( difference == 'bigImage_1105') 
                            self.whichModule_text = '轮播 通屏大图（标题内）'

                        let item_arr = []
                        for (var i = 0; i < 50; i++) {
                            let item = '';item_arr.push(item)
                        }
                        item_arr[0] = { id:'3',content:{name:'newsList.cardc.cell_height',data:data.cell_height ,title:'整体高度',difference:difference} }
                        if ( difference != 'bigImage_1105') {
                            item_arr[1] = { id:'3',content:{name:'newsList.cardc.img.radius',data:data.imgradius ,title:'图片圆角',difference:difference} } 
                        }
                        item_arr[3] = { id:'3',content:{name:'newsList.cardc.img.height',data:data.imgheight ,title:'图片高度',difference:difference} }

                        if ( difference != 'bigImage_1104') {
                            item_arr[2] = { id:'3',content:{name:'newsList.cardc.img.width',data:data.imgwidth ,title:'图片宽度',difference:difference} }
                        }
                        
                        if ( difference == 'bigImage_1103') {
                            item_arr[5]= { id:'2',content:{name:'newsList.cardc.shadow_top_Color',data:data.shadow_top_Color ,title:'(标题)阴影顶部颜色',difference:difference} }
                            item_arr[6] = { id:'3',content:{name:'newsList.cardc.shadow_top_opacity',data:data.shadow_top_opacity ,title:'(标题)阴影顶部透明度',difference:difference} }
                            item_arr[7] = { id:'2',content:{name:'newsList.cardc.shadow_bottom_Color',data:data.shadow_bottom_Color ,title:'(标题)阴影底部颜色',difference:difference} }
                            item_arr[8] = { id:'3',content:{name:'newsList.cardc.shadow_bottom_opacity',data:data.shadow_bottom_opacity ,title:'(标题)阴影底部透明度',difference:difference} }
                        }

                        item_arr[9] = { id:'2',content:{name:'newsList.cardc.title.color',data:data.color ,title:'(标题)字体颜色',difference:difference} }
                        item_arr[10] = { id:'3',content:{name:'newsList.cardc.title.font',data:data.font ,title:'(标题)字体大小',difference:difference} }
                        item_arr[11] = { id:'3',content:{name:'newsList.cardc.title.familyName',data:data.familyName ,title:'(标题)字体格式',difference:difference} }
                        item_arr[12] = { id:'3',content:{name:'newsList.cardc.title.androidfamilyName',data:data.android_familyName ,title:'(标题)安卓字体',difference:difference} }


                        if ( difference != 'bigImage_1104' && 
                             difference != 'bigImage_1105'
                            ) {
                            item_arr[13] = { id:'2',content:{name:'newsList.cardc.status.color',data:data.status_color ,title:'(直播状态)字体颜色',difference:difference} }
                            item_arr[14] = { id:'3',content:{name:'newsList.cardc.status.font',data:data.status_font ,title:'(直播状态)字体大小',difference:difference} }
                            item_arr[15] = { id:'3',content:{name:'newsList.cardc.status.familyName',data:data.status_familyName ,title:'(直播状态)字体格式',difference:difference} }
                            item_arr[16] = { id:'3',content:{name:'newsList.cardc.status.androidfamilyName',data:data.status_android_familyName ,title:'(直播状态)安卓字体',difference:difference} }
                            item_arr[17] = { id:'2',content:{name:'newsList.cardc.status.bgColor',data:data.status_bgColor ,title:'(直播状态)背景颜色',difference:difference} }
                            item_arr[18] = { id:'3',content:{name:'newsList.cardc.status.radius',data:data.status_radius ,title:'(直播状态)圆角',difference:difference} }
                        }

                        if ( difference == 'bigImage_1102' ||
                             difference == 'bigImage_1104' 
                            ) {
                            item_arr[19] = { id:'2',content:{name:'newsList.cardc.pageControl.color',data:data.pageControl_color ,title:'(索引)字体颜色',difference:difference} }
                            item_arr[20] = { id:'3',content:{name:'newsList.cardc.pageControl.font',data:data.pageControl_font ,title:'(索引)字体大小',difference:difference} }
                            item_arr[21] = { id:'3',content:{name:'newsList.cardc.pageControl.familyName',data:data.pageControl_familyName ,title:'(索引)字体格式',difference:difference} }
                            item_arr[22] = { id:'3',content:{name:'newsList.cardc.pageControl.androidfamilyName',data:data.pageControl_android_familyName ,title:'(索引)安卓字体',difference:difference} }
                        }

                        if ( difference != 'bigImage_1105') {
                            item_arr[23] = { id:'3',content:{name:'newsList.cardc.anim_durtion',data:data.anim_durtion ,title:'动画时间(s)',difference:difference} }
                            item_arr[24] = { id:'3',content:{name:'newsList.cardc.delay',data:data.delay ,title:'延迟时间(s)',difference:difference} }
                        }
                        
                        self.editor_content.ids = item_arr
                    }
                    //专题微矩阵(就是水平滚动图片带标签)
                    if ( id_ == 'tmatrix') {
                        self.whichModule_text = '微矩阵'
                        let item1 = { id:'1',content:{name:'newsList.tmatrix.entirety',data:data.margin ,title:'内边距',difference:difference} }
                        let item2 = { id:'1',content:{name:'newsList.tmatrix.img.margin',data:data.imgMargin ,title:'图片间距',difference:difference} }
                        let item4 = { id:'3',content:{name:'newsList.tmatrix.img.width',data:data.imgWidth ,title:'图片宽度',difference:difference} }
                        let item5 = { id:'3',content:{name:'newsList.tmatrix.img.height',data:data.imgHeight ,title:'图片高度',difference:difference} }
                        let item6 = { id:'3',content:{name:'newsList.tmatrix.img.radius',data:data.imgRadius ,title:'图片圆角',difference:difference} }

                        let item7 = { id:'2',content:{name:'newsList.tmatrix.title.color',data:data.titleColor ,title:'标题颜色',difference:difference} }
                        let item8 = { id:'3',content:{name:'newsList.tmatrix.title.font',data:data.titleFont ,title:'标题字体大小',difference:difference} }
                        let item9 = { id:'3',content:{name:'newsList.tmatrix.title.familyName',data:data.titleFamilyName ,title:'标题字体格式',difference:difference} }

                        let item10 = { id:'2',content:{name:'newsList.tmatrix.tag.color',data:data.tagColor ,title:'标签颜色',difference:difference} }
                        let item11 = { id:'3',content:{name:'newsList.tmatrix.tag.font',data:data.tagFont ,title:'标签字体大小',difference:difference} }
                        let item12 = { id:'3',content:{name:'newsList.tmatrix.tag.familyName',data:data.tagFamilyName ,title:'标签字体格式',difference:difference} }

                        let item13 = { id:'2',content:{name:'newsList.tmatrix.time.color',data:data.timeColor ,title:'时间颜色',difference:difference} }
                        let item14 = { id:'3',content:{name:'newsList.tmatrix.time.font',data:data.timeFont ,title:'时间字体大小',difference:difference} }
                        let item15 = { id:'3',content:{name:'newsList.tmatrix.time.familyName',data:data.timeFamilyName ,title:'时间字体格式',difference:difference} }

                        let item16 = { id:'2',content:{name:'newsList.tmatrix.read.color',data:data.readColor ,title:'阅读量颜色',difference:difference} }
                        let item17 = { id:'3',content:{name:'newsList.tmatrix.read.font',data:data.readFont ,title:'阅读量字体大小',difference:difference} }
                        let item18 = { id:'3',content:{name:'newsList.tmatrix.read.familyName',data:data.readFamilyName ,title:'阅读量字体格式',difference:difference} }

                        self.editor_content.ids = [item1,item2,item4,item5,item6,item7,item8,item9,item10,item11,item12,item13,item14,item15,item16,item17,item18]
                    }
                    //直播
                    if ( id_ == 'livec') {
                        if ( difference == 'bigImage_1501') 
                            self.whichModule_text = '这一刻直播'

                        let item_arr = []
                        for (var i = 0; i < 20; i++) {
                            let item = '';item_arr.push(item)
                        }
                        //边距
                        item_arr[0] = { id:'1',content:{name:'newsList.livec.entirety',data:data.margin ,title:'整体边距',difference:difference} }

                        //整体高度
                        item_arr[1] = { id:'3',content:{name:'newsList.livec.cell_height',data:data.cell_height ,title:'整体高度',difference:difference} }

                        //分割线类型
                        item_arr[2] = { id:'4',content:{name:'newsList.livec.underline',data:{select:data.mpid,content:[{label:'1',text:'短线'},{label:'2',text:'长线'}] } ,title:'下分割线',difference:difference} }
                        
                        //图片
                        item_arr[3] = { id:'3',content:{name:'newsList.livec.img.height',data:data.imgheight ,title:'(图片)高度',difference:difference} }
                        item_arr[4] = { id:'3',content:{name:'newsList.livec.img.radius',data:data.imgradius ,title:'(图片)圆角',difference:difference} }
                         // item_arr[3] = { id:'3',content:{name:'newsList.livec.img.top',data:data.imgtop ,title:'(图片)顶部距离',difference:difference} }
                         // item_arr[4] = { id:'3',content:{name:'newsList.livec.img.right',data:data.imgright ,title:'(图片)右侧距离',difference:difference} }
                         // item_arr[5] = { id:'3',content:{name:'newsList.livec.img.bottom',data:data.imgbottom ,title:'(图片)底部距离',difference:difference} }
                         // item_arr[6] = { id:'3',content:{name:'newsList.livec.img.left',data:data.imgleft ,title:'(图片)左侧距离',difference:difference} }
                        //子图片
                        item_arr[7] = { id:'3',content:{name:'newsList.livec.subimg.height',data:data.subimgheight ,title:'(小图片)高度',difference:difference} }
                        item_arr[8] = { id:'3',content:{name:'newsList.livec.subimg.radius',data:data.subimgradius ,title:'(小图片)圆角',difference:difference} }
                         // item_arr[9] = { id:'3',content:{name:'newsList.livec.subimg.top',data:data.subimgtop ,title:'(小图片)顶部距离',difference:difference} }
                         // item_arr[10] = { id:'3',content:{name:'newsList.livec.subimg.right',data:data.subimgright ,title:'(小图片)右侧距离',difference:difference} }
                         // item_arr[11] = { id:'3',content:{name:'newsList.livec.subimg.bottom',data:data.subimgbottom ,title:'(小图片)底部距离',difference:difference} }
                         // item_arr[12] = { id:'3',content:{name:'newsList.livec.subimg.left',data:data.subimgleft ,title:'(小图片)左侧距离',difference:difference} }

                        self.editor_content.ids = item_arr
                    }
                    //各模块头
                    if ( id_ == 'grouph') {
                        if ( difference == 'bigImage_groupHeader') 
                            self.whichModule_text = '分组头部'

                        let item_arr = []
                        for (var i = 0; i < 20; i++) {
                            let item = '';item_arr.push(item)
                        }
                        //边距
                        item_arr[0] = { id:'1',content:{name:'newsList.grouph.entirety',data:data.entirety ,title:'整体边距',difference:difference} }

                        //分割线类型
                        item_arr[1] = { id:'4',content:{name:'newsList.grouph.underline',data:{select:data.mpid,content:[{label:'1',text:'短线'},{label:'2',text:'长线'}] } ,title:'下分割线',difference:difference} }
                        //高度
                        item_arr[2] = { id:'3',content:{name:'newsList.grouph.cellheight',data:data.cell_height ,title:'(整体)高度',difference:difference} }
                        //标题
                        item_arr[3] = { id:'2',content:{name:'newsList.grouph.title.color',data:data.titlecolor ,title:'(标题)字体颜色',difference:difference} }
                        item_arr[4] = { id:'3',content:{name:'newsList.grouph.title.font',data:data.titlefont ,title:'(标题)字体大小',difference:difference} }
                        item_arr[5] = { id:'3',content:{name:'newsList.grouph.title.familyName',data:data.titlefamilyName ,title:'(标题)字体格式',difference:difference} }
                        item_arr[6] = { id:'3',content:{name:'newsList.grouph.title.androidfamilyName',data:data.titleandroid_familyName ,title:'(标题)安卓格式',difference:difference} }
                        //更多
                        item_arr[7] = { id:'2',content:{name:'newsList.grouph.more.color',data:data.morecolor ,title:'(更多)字体颜色',difference:difference} }
                        item_arr[8] = { id:'3',content:{name:'newsList.grouph.more.font',data:data.morefont ,title:'(更多)字体大小',difference:difference} }
                        item_arr[9] = { id:'3',content:{name:'newsList.grouph.more.familyName',data:data.morefamilyName ,title:'(更多)字体格式',difference:difference} }
                        item_arr[10] = { id:'3',content:{name:'newsList.grouph.more.androidfamilyName',data:data.moreandroid_familyName ,title:'(更多)安卓格式',difference:difference} }

                        self.editor_content.ids = item_arr
                    }
                    //信息流
                    if ( id_ == 'infoimage') {
                        self.whichModule_text = '信息流'
                        if ( difference == 'bigImage_1401') 
                            self.whichModule_text = '信息流--并排图像'
                        else if ( difference == 'bigImage_1403') 
                            self.whichModule_text = '信息流--瀑布流'

                        let item_arr = []
                        for (var i = 0; i < 70; i++) {
                            let item = '';item_arr.push(item)
                        }
                        //整体边距等
                        item_arr[0] = { id:'1',content:{name:'newsList.infoimage.entirety',data:data.margin_new ,title:'边距',difference:difference} }

                        //分割线类型
                        item_arr[1] = { id:'4',content:{name:'newsList.infoimage.underline',data:{select:data.mpid,content:[{label:'1',text:'短线'},{label:'2',text:'长线'}] } ,title:'下分割线',difference:difference} }

                        //整体高度
                        item_arr[2] = { id:'3',content:{name:'newsList.infoimage.cell_height',data:data.cell_height ,title:'整体高度',difference:difference} }

                        //图片样式
                        // item_arr[1] = { id:'3',content:{name:'newsList.infoimage.img.left',data:data.imgleft ,title:'(图片)左侧距离',difference:difference} }
                        // item_arr[3] = { id:'3',content:{name:'newsList.infoimage.img.top',data:data.imgtop ,title:'(图片)顶部距离',difference:difference} }
                        item_arr[4] = { id:'3',content:{name:'newsList.infoimage.img.height',data:data.imgheight ,title:'(图片)高度',difference:difference} }
                        item_arr[5] = { id:'3',content:{name:'newsList.infoimage.img.radius',data:data.imgradius ,title:'(图片)圆角',difference:difference} }

                        //标签样式
                        if ( difference == 'bigImage_1401') {
                            item_arr[12] = { id:'2',content:{name:'newsList.infoimage.tag.color',data:data.tagcolor ,title:'(标签)字体颜色',difference:difference} }
                            item_arr[13] = { id:'3',content:{name:'newsList.infoimage.tag.font',data:data.tagfont ,title:'(标签)字体大小',difference:difference} }
                            item_arr[14] = { id:'3',content:{name:'newsList.infoimage.tag.familyName',data:data.tagfamilyName ,title:'(标签)字体格式',difference:difference} }
                            item_arr[15] = { id:'3',content:{name:'newsList.infoimage.tag.androidfamilyName',data:data.tagandroidFamilyName ,title:'(标签)安卓格式',difference:difference} }
                            // item_arr[17] = { id:'3',content:{name:'newsList.infoimage.tag.top',data:data.tagtop ,title:'(标签)顶部距离',difference:difference} }
                            // item_arr[18] = { id:'3',content:{name:'newsList.infoimage.tag.left',data:data.tagleft ,title:'(标签)左侧距离',difference:difference} }
                            // item_arr[19] = { id:'3',content:{name:'newsList.infoimage.tag.bottom',data:data.tagbottom ,title:'(标签)底部距离',difference:difference} }
                        }
                        
                        //时间样式
                        if ( difference == 'bigImage_1401') {
                            item_arr[20] = { id:'2',content:{name:'newsList.infoimage.time.color',data:data.timecolor ,title:'(时间)字体颜色',difference:difference} }
                            item_arr[21] = { id:'3',content:{name:'newsList.infoimage.time.font',data:data.timefont ,title:'(时间)字体大小',difference:difference} }
                            item_arr[22] = { id:'3',content:{name:'newsList.infoimage.time.familyName',data:data.timefamilyName ,title:'(时间)字体格式',difference:difference} }
                            item_arr[23] = { id:'3',content:{name:'newsList.infoimage.time.androidfamilyName',data:data.timeandroidFamilyName ,title:'(时间)安卓格式',difference:difference} }
                            // item_arr[24] = { id:'3',content:{name:'newsList.infoimage.time.top',data:data.timetop ,title:'(时间)顶部距离',difference:difference} }
                            // item_arr[25] = { id:'3',content:{name:'newsList.infoimage.time.left',data:data.timeleft ,title:'(时间)左侧距离',difference:difference} }
                            // item_arr[26] = { id:'3',content:{name:'newsList.infoimage.time.bottom',data:data.timebottom ,title:'(时间)底部距离',difference:difference} }
                        }
                        
                        //阅读量样式
                        if ( difference == 'bigImage_1401') {
                            item_arr[27] = { id:'2',content:{name:'newsList.infoimage.read.color',data:data.readcolor ,title:'(阅读量)字体颜色',difference:difference} }
                            item_arr[28] = { id:'3',content:{name:'newsList.infoimage.read.font',data:data.readfont ,title:'(阅读量)字体大小',difference:difference} }
                            item_arr[29] = { id:'3',content:{name:'newsList.infoimage.read.familyName',data:data.readfamilyName ,title:'(阅读量)字体格式',difference:difference} }
                            item_arr[30] = { id:'3',content:{name:'newsList.infoimage.read.androidfamilyName',data:data.readandroidFamilyName ,title:'(阅读量)安卓格式',difference:difference} }
                            // item_arr[31] = { id:'3',content:{name:'newsList.infoimage.read.top',data:data.readtop ,title:'(阅读量)顶部距离',difference:difference} }
                            // item_arr[32] = { id:'3',content:{name:'newsList.infoimage.read.right',data:data.readright ,title:'(阅读量)左侧距离',difference:difference} }
                            // item_arr[33] = { id:'3',content:{name:'newsList.infoimage.read.bottom',data:data.readbottom ,title:'(阅读量)底部距离',difference:difference} }
                        }
                        
                        //标题样式
                        item_arr[35] = { id:'2',content:{name:'newsList.infoimage.title.color',data:data.titlecolor ,title:'(标题)字体颜色',difference:difference} }
                        item_arr[36] = { id:'3',content:{name:'newsList.infoimage.title.font',data:data.titlefont ,title:'(标题)字体大小',difference:difference} }
                        item_arr[37] = { id:'3',content:{name:'newsList.infoimage.title.familyName',data:data.titlefamilyName ,title:'(标题)字体格式',difference:difference} }
                        item_arr[38] = { id:'3',content:{name:'newsList.infoimage.title.androidfamilyName',data:data.titleandroidFamilyName ,title:'(标题)安卓格式',difference:difference} }
                        // item_arr[39] = { id:'3',content:{name:'newsList.infoimage.title.top',data:data.titletop ,title:'(标题)顶部距离',difference:difference} }
                        // item_arr[40] = { id:'3',content:{name:'newsList.infoimage.title.left',data:data.titleleft ,title:'(标题)左侧距离',difference:difference} }

                        //播放时间样式
                        if ( difference == 'bigImage_1401') {
                            item_arr[41] = { id:'2',content:{name:'newsList.infoimage.duration.color',data:data.durationcolor ,title:'(播放时间)字体颜色',difference:difference} }
                            item_arr[42] = { id:'3',content:{name:'newsList.infoimage.duration.font',data:data.durationfont ,title:'(播放时间)字体大小',difference:difference} }
                            item_arr[43] = { id:'3',content:{name:'newsList.infoimage.duration.familyName',data:data.durationfamilyName ,title:'(播放时间)字体格式',difference:difference} }
                            item_arr[44] = { id:'3',content:{name:'newsList.infoimage.duration.androidfamilyName',data:data.durationandroidFamilyName ,title:'(播放时间)安卓格式',difference:difference} }
                            // item_arr[45] = { id:'3',content:{name:'newsList.infoimage.duration.top',data:data.durationtop ,title:'(播放时间)顶部距离',difference:difference} }
                            // item_arr[46] = { id:'3',content:{name:'newsList.infoimage.duration.left',data:data.durationleft ,title:'(播放时间)左侧距离',difference:difference} }
                            // item_arr[47] = { id:'3',content:{name:'newsList.infoimage.duration.right',data:data.durationright ,title:'(播放时间)右侧距离',difference:difference} }
                            // item_arr[48] = { id:'3',content:{name:'newsList.infoimage.duration.bottom',data:data.durationbottom ,title:'(播放时间)底部距离',difference:difference} }
                        }

                        //顶部推荐
                        if ( difference == 'bigImage_1403'){
                            item_arr[49] = { id:'2',content:{name:'newsList.infoimage.source.color',data:data.sourcecolor ,title:'(顶部推荐)字体颜色',difference:difference} }
                            item_arr[50] = { id:'3',content:{name:'newsList.infoimage.source.font',data:data.sourcefont ,title:'(顶部推荐)字体大小',difference:difference} }
                            item_arr[51] = { id:'3',content:{name:'newsList.infoimage.source.familyName',data:data.sourcefamilyName ,title:'(顶部推荐)字体格式',difference:difference} }
                            item_arr[52] = { id:'3',content:{name:'newsList.infoimage.source.androidfamilyName',data:data.sourceandroidFamilyName ,title:'(顶部推荐)安卓格式',difference:difference} }
                            // item_arr[53] = { id:'3',content:{name:'newsList.infoimage.source.top',data:data.sourcetop ,title:'(顶部推荐)顶部距离',difference:difference} }
                            // item_arr[54] = { id:'3',content:{name:'newsList.infoimage.source.left',data:data.sourceleft ,title:'(顶部推荐)左侧距离',difference:difference} }
                        }
                        
                        //顶部在看人数
                        if ( difference == 'bigImage_1403'){
                            item_arr[55] = { id:'2',content:{name:'newsList.infoimage.readPerson.color',data:data.readPersoncolor ,title:'(在看人数)字体颜色',difference:difference} }
                            item_arr[56] = { id:'3',content:{name:'newsList.infoimage.readPerson.font',data:data.readPersonfont ,title:'(在看人数)字体大小',difference:difference} }
                            item_arr[57] = { id:'3',content:{name:'newsList.infoimage.readPerson.familyName',data:data.readPersonfamilyName ,title:'(在看人数)字体格式',difference:difference} }
                            item_arr[58] = { id:'3',content:{name:'newsList.infoimage.readPerson.androidfamilyName',data:data.readPersonandroidFamilyName ,title:'(在看人数)安卓格式',difference:difference} }
                            // item_arr[59] = { id:'3',content:{name:'newsList.infoimage.readPerson.top',data:data.readPersontop ,title:'(在看人数)顶部距离',difference:difference} }
                            // item_arr[60] = { id:'3',content:{name:'newsList.infoimage.readPerson.right',data:data.readPersonright ,title:'(在看人数)右侧距离',difference:difference} }
                        }

                        self.editor_content.ids = item_arr
                    }
                    /*92:73、、、*/
                }
                self.clear_status_bar_list_btn()
            },
            news_list_recommend( func){
                let self = this
                self.news_list_recommend_func = func

                //点击具体新闻进入详情页
                $.click_news_into_particular = function( item_){
                    self.newslist_show = self.status_show = self.tab_show = self.nav_show= false
                    self.cParticular_show = true
                    //发送数据
                    self.get_concrete_data_cb( item_)
                }
            },

            /**
            * 公共
            */
            //边距--数据更改响应方法
            marginPaddingEdit_change( val_){
                let self = this
                self.contentEdit_change( val_)
            },

            //颜色--数据更改响应方法
            colorEdit_change( val_){
                let self = this
                self.contentEdit_change( val_)
            },

            //单行输入框--数据更改响应方法
            singleEdit_change( val_){
                let self = this
                self.contentEdit_change( val_)
            },
            //单选框--数据更改响应方法
            radioEdit_change( val_){
                let self = this
                self.contentEdit_change( val_)
            },
            //各个数据更改响应方法
            contentEdit_change( val_){
                let self = this
                let arr_data = val_.name.split('.')
                if ( arr_data[0] == 'statusBar' && self.statusBar_click_editJson__callback) {
                    self.statusBar_click_editJson__callback( val_)
                }else if ( arr_data[0] == 'labelBar' && self.labelBar_click_editJson__callback) {
                    self.labelBar_click_editJson__callback( val_)
                }else if ( arr_data[0] == 'navBar' && self.labelBar_click_editJson__callback) {
                    self.navigationBar_click_editJson__callback( val_)
                }else if ( arr_data[0] == 'newsList' && self.newsList_click_editJson) {
                    self.newsList_click_editJson.forEach( (func)=>{
                        func( val_)
                    })
                }
            },

            //取消所有闪烁效果
            cancel_all_glitter(){
                let self = this
                self.whichModule_text = ''
                $.cancel_glitter()
                self.clear_status_bar_list_btn()
                self.editor_content.ids = []
            },

            //取消所有闪烁效果
            cancel_glitter(){
                let self = this
                $.cancel_glitter = function(){
                    $('.page_single').find('*').removeClass('border-style-0 border-style boder-color-animation')
                }
            },

            //保存修改的样式
            store_style(){
                let self = this
                self.netWorking( '/api/v1/style/updateJson','post',{'Content-Type':'application/json'},JSON.stringify( {
                    "id":self.whichModule,
                    "styleJson":JSON.stringify( self.moduleDataStoreToRemote)
                }),(xhr)=>{
                    if ( xhr.responseJSON && xhr.responseJSON.code >=200 && xhr.responseJSON.code<400) {
                        self.$message({ message:xhr.responseJSON.msg,type:"success", duration:3000 ,center:true })
                    }else{
                        self.$message({ message:'修改失败',type:"error", duration:3000 ,center:true })
                    }
                })
            },

            //请求接口传递数据
            edit_json_remote_post(){
                let self = this
                $.edit_json_remote_post = function( pre_,id_,subid_,data_){
                    //pre_用于判断是否是newsList，设置空;id_是一些特殊结构，例如1402等;subid_是bulletinImage、bulletinText、bannerCommon等 ;data_是具体数据
                    let post_remote_data = {}

                    if ( id_ == '1402') {
                        self.trans_data.newsList[id_][subid_] = data_
                    }
                    if ( pre_ == 'newsList' ) 
                        post_remote_data  = ( id_ == '1402' ? self.trans_data.newsList[id_][0] : data_[0] )
                    else
                        post_remote_data = self.trans_data[id_] = data_

                    post_remote_data = JSON.parse( JSON.stringify( post_remote_data))
                    self.reconvertAttributeOfOne( post_remote_data,'margin')
                    console.log(post_remote_data,id_)
                    self.moduleDataStoreToRemote = post_remote_data
                }
            },

            //恢复某个属性
            reconvertAttributeOfOne( data_ , attrName){
                let self = this
                Object.keys(data_).forEach( (key)=>{
                    let key_ = key+''
                    if ( attrName == 'margin' || attrName == 'padding') {
                        //因为json中margin是左上右下，web需要的上右下左
                        if ( key_.indexOf( attrName)>-1 && 
                            data_[key_] && 
                            data_[key_].length >0
                        ) {
                            let split_arr = data_[key_].split(',')
                            if ( split_arr.length >= 5) {
                                split_arr.splice(1,0,split_arr[4])
                                split_arr.pop()
                            }
                            data_[key_] = split_arr.join(',')
                        }else if ( typeof data_[key_] == 'object') {
                            self.reconvertAttributeOfOne( data_[key_],attrName)
                        }
                    }
                })
            },
            //转换某个属性
            convertAttributeOfOne( data_ , attrName){
                let self = this
                Object.keys(data_).forEach( (key)=>{
                    let key_ = key+''

                    if ( attrName == 'margin' || attrName == 'padding') {
                        //因为json中margin是左上右下，web需要的上右下左
                        if ( key_.indexOf( attrName)>-1 && 
                            data_[key_] && 
                            data_[key_].length >0
                        ) {
                            let split_arr = data_[key_].split(',')
                            if ( split_arr.length >= 4) {
                                split_arr.push( split_arr[1])
                                split_arr.splice(1,1)
                            }
                            data_[key_] = split_arr.join(',')
                        }else if ( typeof data_[key_] == 'object') {
                            if ( data_[key_] && data_[key_].length > 0 && data_[key_][0] ) {
                                self.convertAttributeOfOne( data_[key_][0],attrName)
                            }else if( data_[key_] ){
                                self.convertAttributeOfOne( data_[key_],attrName)
                            }
                        }
                    }

                })
            },

            //调整h5样式数据
            adjustMobileDataInterface( data_){
                let self = this,newData = {}
                Object.keys(data_).forEach( (key)=>{
                    let key_ = key+''
                    if ( isNaN( parseFloat( key_)) ) {
                        key_ == 'recommend' ? newData['1402'] = data_[key_] :
                        newData = Object.assign(newData,data_[key_])   
                    }
                })
                return newData
            },

            //移动端处理内容
            mobile_resolve(){
                let self = this
                if ( $.allowMachine == 1) {
                    $('.page_single').css({
                        left:0,
                        top:0,
                        width:$(window).width()+'px',
                        transform:'none',
                    })
                    $('.page_single .module-content').css({
                        // height:$(window).height()+'px',
                        minWidth:$(window).width()+'px',
                    })
                }else if ( $.allowMachine == 0) {
                    $('.page_single .module-content').css({
                        height:'700px',
                        overflowY: 'auto',
                    })
                }
            },

            /*********************************/
            netWorking( url ,method,header,dataParams,callback ){
                let self = this,
                paraO = {
                    url:url,
                    type:method,
                    dataType:'json',
                    data:dataParams,
                    success:function (argument,message,xhr) {
                        callback(xhr)
                    },
                    error:function( xhr,error){ callback(xhr) }
                }
                paraO.headers = header
                $.ajax(paraO)
            },
            /**
            *****
            */
		}
	}
</script>

<style scoped lang="less">
    .pageNow(){
        @pageBg: #aba;
        @pagebaWidth:375px;
        @pagebaHeight:700px; 
        @pagePadding:0px;
    }
    .page_single{
        .pageNow();
        display: flex;
        vertical-align: middle;
        align-items: center;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);

        .current-operation-section-text{
            position: absolute;
            top: 15px;
            left: @pagebaWidth+70;
            white-space: nowrap;
        }

        .store-module{
            position: absolute;
            bottom: 20px;
            left: @pagebaWidth+70;
        }

        .phone-tab-bar{
            width: @pagebaWidth;
            height: 20px;
        }

        .type-button{
            margin: auto auto auto 20px;

            div{
                width: 120px;
                box-shadow: 1px 2px 1px #999;
                margin-top: 7px;
                background-color: #ccc;
                text-align: center;
                cursor: pointer;
                &:hover{
                    background-color: #aaa;
                }
                img{
                    height: 17px;
                }
                span{
                    color:white;
                    font-size: 13px;
                }
            }

            div:nth-last-of-type(1){
                background-color: #AD331B;
                margin-top: 20px;
                padding: 5px;
            }
        }

        .editor-content{
            margin-left: 30px;
            max-height: 600px;
            overflow: scroll;
        }
    }
    .module-content{
        .pageNow();
        // display: table;
        position: relative;
        // background-color: @pageBg;
        width: fit-content;
        // height: @pagebaHeight;
        min-width: @pagebaWidth;
        padding: @pagePadding 0;
        // overflow-y: auto;
        box-shadow: 0px 2px 3px #afafaf;
    }

    .slide-fade-publish-leave-active{
        transition: all .3s ease;
    }

    .slide-fade-publish-enter-active {
        transition: all .3s ease;
        transition-delay: 0.3s;
    }
    .slide-fade-publish-enter, .slide-fade-publish-leave-to{
      transform: translateX(50px);
      opacity: 0;
    }


</style>
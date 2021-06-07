<template>
    <div :class='"container "+randomMark' @click.stop='modification_statusBar_attribute'>
        <div v-for='(val,key) in insert_element' :key='key' v-if=" !val.id" :class="val.name+'-element empty-element'"  @click.stop='clicked_insertedNode_or_emptyNode("empty",val)'>
            <span>选择元素填充</span>
        </div>
        <div v-else 
            @click.stop='clicked_insertedNode_or_emptyNode("container",val)'
            :class="val.name+'-ele-container empty-container'" 
            style="display: inline-block;vertical-align: top;top: 50%;
            transform: translateY(-50%);position: relative;cursor: pointer;">

            <SearchBtn 
                v-if=" val.id.indexOf('search_button') > -1 " 
                :layout_data='variable_attr.search_button' 
                @click.native='btn_detail_click("search_button")'></SearchBtn>
            <InputSearch 
                v-if=" val.id.indexOf('search_input') > -1 " 
                :layout_data='variable_attr.search_input'></InputSearch>
            <Tel 
                v-if=" val.id.indexOf('tel') > -1 " 
                :layout_data='variable_attr.tel'></Tel>
            <Reveal 
                v-if=" val.id.indexOf('reveal') > -1 " 
                :layout_data='variable_attr.reveal'></Reveal>
            <Weather 
                v-if=" val.id.indexOf('weather') > -1 " 
                :layout_data='variable_attr.weather' 
                :content_data = 'today_weather_data'
                @click.native='btn_detail_click("weather")'></Weather>
            <TitleText 
                v-if=" val.id.indexOf('title_text') > -1 " 
                :layout_data='variable_attr.title_text'></TitleText>
            <TitleImg 
                v-if=" val.id.indexOf('title_img') > -1 " 
                :layout_data='variable_attr.title_img'></TitleImg>
            <User 
                v-if=" val.id.indexOf('user') > -1 " 
                :layout_data='variable_attr.user'></User>
            <UserText 
                v-if=" val.id.indexOf('textUser') > -1 " 
                :layout_data='variable_attr.textUser'></UserText>
            <InputSearchScan 
                v-if=" val.id.indexOf('searchInput_scan') > -1 " 
                :layout_data='variable_attr.searchInput_scan'></InputSearchScan>
                

        </div>
        
    </div>
</template>

<script type="text/javascript">
    import User from './user';
    import UserText from './userText';
    import SearchBtn from './search_btn';
    import InputSearch from './Input_search';
    import Tel from './tel';
    import Reveal from './reveal';
    import Weather from './weather';
    import TitleImg from './title_img';
    import TitleText from './title_text';
    import InputSearchScan from './input_search_ scan';

	export default {
		data () {
			return {  
                pagebaWidth:375,
                pagebaPading:0,
                geted_data:{},
                randomMark:(new Date()).getTime(),

                insert_element:[ {name:'left',id:''},{name:'center',id:''},{name:'right',id:''} ],
                insert_click_name:'',
                left_center_right_json:[
                    {id:'user',value:'1'},
                    {id:'textUser',value:'1'},
                    {id:'search_button',value:'2'},
                    {id:'search_input',value:'3'},
                    {id:'tel',value:'4'},
                    {id:'reveal',value:'5'},
                    {id:'weather',value:'6'},
                    {id:'title_img',value:'7'},
                    {id:'title_text',value:'7'},
                    {id:'searchInput_scan',value:'8'},
                ],

                variable_attr:{
                    user:{},
                    textUser:{},
                    search_button:{},
                    search_input:{},
                    tel:{},
                    reveal:{},
                    weather:{},
                    title_img:{},
                    title_text:{},
                    searchInput_scan:{},
                },
                randomMark:(new Date()).getTime(),
                sd_data_:{}, //状态栏数据

                today_weather_data:{}, //天气信息
			}
		},
        watch:{ },
        created(){
            let self = this;
        },
        mounted(){
            let self = this

            self.get_network_data()

            self.$emit('statusData',function( val_){
                self.sd_data_ = val_
                if ( !val_) 
                    return
                self.convertToWeb( self.sd_data_)

                $.allowMachine == 1 ? self.pagebaWidth = $(window).width() : null
                self.setLayout( self.sd_data_)
            })

            //获取点击的模块id
            self.$emit('click_one_of',function(val){
                self.click_one_of_func( val)
            })

        },
        props: ['feedback_data','click_one_of','typeids'],
        components:{
            User,
            UserText,
            SearchBtn,
            InputSearch,
            Tel,
            Reveal,
            Weather,
            TitleImg,
            TitleText,
            InputSearchScan,
        },
		methods:{
            setLayout( sD_val_){
                let self = this
                if ( !sD_val_) 
                    return
                self.$nextTick( ()=>{
                    let father_ele = $('.container'+self.getRandomClassName() )

                    sD_val_.padding ? null : sD_val_.padding = '0,0,0,0'
                    let a__= sD_val_.padding.split(',')
                    //设置左中右三个元素的宽度
                    self.pagebaPading = parseFloat(a__[1])+parseFloat(a__[3])
                    self.setup_width_empty( self.pagebaPading)

                    //设置状态栏内边距和背景色
                    father_ele.css({
                        padding: a__[0]+'px '+a__[1]+'px '+a__[2]+'px '+a__[3]+'px ',
                        backgroundColor: sD_val_.bgColor || '#ffffff',
                        backgroundImage: 'url('+(sD_val_.bgResource || '')+') ',
                        width:self.pagebaWidth+'px',
                    })

                    //设置状态栏(wifi、电量颜色)
                    self.$emit('feedback_data',{statusBarbgColor:sD_val_.bgColor})

                    //设置状态栏中按钮元素的样式
                    self.variable_attr.textUser = { fontSize:sD_val_.user.textSize,text:sD_val_.user.text,color:sD_val_.user.common.color }

                    self.variable_attr.weather = sD_val_.weather ? { 
                        fontSize:sD_val_.weather.textSize,
                        color: sD_val_.weather.common ? sD_val_.weather.common.color : ''
                    } : {}  

                    self.variable_attr.search_input = sD_val_.bigSearch ? 
                    {borderRadius:sD_val_.bigSearch.corner+'',width:sD_val_.bigSearch.size.width } : 
                    {}

                    self.variable_attr.search_button = sD_val_.search ? 
                    { color:sD_val_.search.common ? sD_val_.search.common.color : '',} : 
                    {}

                    self.variable_attr.title_text = sD_val_.title ?
                    { fontSize:sD_val_.title.textSize,color:sD_val_.title.common.color,text:sD_val_.title.text || '',imgUrl:sD_val_.title.url||'' } : 
                    {}

                    self.variable_attr.title_img = !sD_val_.title ? {} :
                    (function(){
                        let ob = { imgUrl:sD_val_.title.url || '' ,color: sD_val_.title.common ? sD_val_.weather.common.color : '' },
                        whsplit = (sD_val_.title.imageSize || '').split(',')
                        ob.imageSize = { width:(whsplit[0] || 0),height:(whsplit[1] || 0) }
                        return ob
                    }())                    

                    self.variable_attr.searchInput_scan = sD_val_.bigSearchWithScan ? 
                    { borderRadius:sD_val_.bigSearchWithScan.corner , color:{ textColor:sD_val_.bigSearchWithScan.common.color }, size:sD_val_.bigSearchWithScan.size } : 
                    {}

                    //设置状态栏左中右元素json中的id
                    self.left_center_right_json.forEach( (item__)=>{
                        let item = Object.assign({},item__)
                        if ( item.value == 7 ) {
                            item.id = sD_val_.title.type == 'img' ? 'title_img' : 'title_text'
                        }else if ( item.value == 1 ) {
                            item.id = sD_val_.user.type == 'img' ? 'user' : 'textUser'
                        }

                        item.value += ''
                        if ( sD_val_.left.indexOf( item.value) > -1 ) { 
                            self.insert_click_name = 'left'
                            var new_item = Object.assign({},item)
                            new_item.value = sD_val_.left
                            self.click_one_of_func( new_item,true)
                        }else if ( sD_val_.center.indexOf( item.value) > -1 ) {
                            self.insert_click_name = 'center'
                            var new_item = Object.assign({},item)
                            new_item.value = sD_val_.center
                            self.click_one_of_func( new_item,true)
                        }else if ( sD_val_.right.indexOf( item.value) > -1 ) {
                            self.insert_click_name = 'right'
                            var new_item = Object.assign({},item)
                            new_item.value = sD_val_.right
                            self.click_one_of_func( new_item,true)
                        } 
                    })           
                    /**
                    ********************************************************************************
                    */
                })

            },
            //设置状态栏(轮廓)属性
            modification_statusBar_attribute(){
                let self = this
                if ( $.allowMachine == 1){
                    return
                } 
                let father_node = $('.container'+self.getRandomClassName() )
                //移除其他闪烁
                self.cancel_glitter() 
                //给状态栏增加闪烁
                father_node.addClass('border-style-0').addClass('boder-color-animation')

                //设置状态栏结构属性
                self.$emit('feedback_data',{
                    statusBar:{ bgColor:self.sd_data_.bgColor,bgResource:self.sd_data_.bgResource,padding:self.sd_data_.padding },
                },self.get_attribute_reponseData)
                //将显示的填充元素的按钮置空
                self.$emit('click_one_of',"clickOne_none")
            },
            

            //点击填充元素按钮或者修改某个已填充的元素
            clicked_insertedNode_or_emptyNode(idstr,val){
                let self = this
                if ( $.allowMachine == 1){
                    return
                } 
                self.insert_click_name = val.name;

                let father_ele = $('.container'+self.getRandomClassName() )
                self.cancel_glitter()

                self.$nextTick( ()=>{
                    if ( idstr == 'empty') {
                        father_ele.children('.'+self.insert_click_name+'-element').addClass('boder-color-animation')
                    }else if ( idstr == 'container') {
                        father_ele.children('.'+self.insert_click_name+'-ele-container').addClass('border-style').addClass('boder-color-animation')
                    }  
                })
                //设置要显示的填充元素的按钮
                self.$emit('click_one_of',"clickOne")
                //设置当前操作模块名称
                self.$emit('feedback_data','1')
                
            },

            //点击了要填充的某个元素; 设置状态栏(内部按钮)属性
            click_one_of_func( val,notDoneEdit){
                //notDoneEdit代表，初始化页面时不做组件元素编辑
                let self = this
                {   
                    //对于已经添加到状态栏的元素，不可再添加
                    let find_repeat_ = self.insert_element.findIndex(function(item){
                        return item.id.indexOf( val.id+'') >-1 
                    })
                    if ( find_repeat_ >-1) {
                        let orientation = ['left','center','right']
                        if ( orientation[find_repeat_] != self.insert_click_name) {
                            self.$message({ message:'该元素已被添加，不可重复添加',type:"error", duration:3000 ,center:true })
                            return
                        } 
                    }
                }
                {   

                    let index = self.insert_element.findIndex(function(item){
                        return item.name == self.insert_click_name
                    })

                    if ( index > -1) {
                        //置空一个元素位置
                        if ( val.id == 'delete_one_selected') {
                            self.insert_element[index].id = ''
                        }else if ( val.value) {
                            //将左中右三个元素位置填充元素
                            let arr_value = val.value.split(',')
                            arr_value.forEach( ( value_)=>{
                                let value_index = self.left_center_right_json.findIndex( (ele_id_value)=>{
                                    
                                    //如果是文字标题或者图片标题/文本用户和用户图标，要区分开
                                    if ( value_ == '7' || value_ == '1' ) {
                                        return ele_id_value.value == value_ && ele_id_value.id == val.id
                                    }
                                    return ele_id_value.value == value_
                                })
                                let find_object = self.left_center_right_json[value_index]
                                if ( value_index >-1 &&
                                    self.insert_element[index].id.indexOf(find_object.id) <0 &&
                                    self.insert_element[index].id != 'title_img' &&
                                    self.insert_element[index].id != 'title_text' 
                                ) {
                                    self.insert_element[index].id.length == 0 ? self.insert_element[index].id = find_object.id : self.insert_element[index].id += ','+find_object.id
                                }
                            })
                        }else{
                            //某个元素位置已有元素，继续添加元素
                            if ( self.insert_element[index].id == 'title_img' && val.id == 'title_text' || 
                                self.insert_element[index].id == 'title_text' && val.id == 'title_img' ||
                                self.insert_element[index].id == 'user' && val.id == 'textUser' || 
                                self.insert_element[index].id == 'textUser' && val.id == 'user'
                            )
                            {   
                                //图片标题和文本标题不能同时出现
                                self.insert_element[index].id = val.id
                            }else{
                                self.insert_element[index].id.length == 0 ? self.insert_element[index].id = val.id : self.insert_element[index].id += ','+val.id
                            }
                        }
                        
                        //将'左中右'空元素中已添加的组件元素写入json中
                        self.left_center_right_json.forEach( (item)=>{
                            //以下方法是 添加元素或清空元素注入json
                            if( (val.id == item.id && !notDoneEdit) || val.id == 'delete_one_selected' ){
                                if ( val.id == 'delete_one_selected') {
                                    //清空元素注入json
                                    self.sd_data_[self.insert_click_name] = ''
                                }else{

                                    self.sd_data_[self.insert_click_name].length == 0 ? 
                                    self.sd_data_[self.insert_click_name] = item.value : 
                                    self.sd_data_[self.insert_click_name] += ','+item.value
                                }
                                if ( val.id == 'title_img') 
                                    self.sd_data_.title.type ='img'
                                else if ( val.id == 'title_text') 
                                    self.sd_data_.title.type ='text'
                                else if ( val.id == 'user') 
                                    self.sd_data_.user.type ='img'
                                else if ( val.id == 'textUser') 
                                    self.sd_data_.user.type ='text'
                            }
                        })
                        !notDoneEdit ? self.clicked_insertedNode_or_emptyNode('container',{name:self.insert_click_name}) : null

                        $.edit_json_remote_post('','status','',self.sd_data_)
                    }
                    //设置左中右三个元素的宽度
                    self.$nextTick( ()=>{ self.setup_width_empty(self.pagebaPading) })
                }

                if ( !notDoneEdit) {
                    if ( self.sd_data_) {
                        let sd = self.sd_data_
                        if ( sd['bigSearch'] && val.id == 'search_input') {
                            val = Object.assign(val,sd['bigSearch'])
                        }else if ( sd['weather'] && val.id == 'weather') {
                            val = Object.assign(val,sd['weather'])
                        }else if ( sd['title'] && val.id == 'title_text') {
                            val = Object.assign(val,sd['title'])
                        }else if ( sd['title'] && val.id == 'title_img') {
                            val = Object.assign(val,self.variable_attr.title_img)
                        }else if ( sd['bigSearchWithScan'] && val.id == 'searchInput_scan') {
                            val = Object.assign(val,self.variable_attr.searchInput_scan)
                        }else if ( sd['search'] && val.id == 'search_button') {
                            val = Object.assign(val,sd['search'])
                        }else if ( sd['user'] && val.id == 'textUser') {
                            val = Object.assign(val,self.variable_attr.textUser)
                        }
                    }

                    //设置状态栏中按钮-属性
                    self.$emit('feedback_data',{
                        'statusBar.button':val,
                    },self.get_attribute_reponseData)
                }

            },

            //设置每个空元素和每个模块的宽度
            setup_width_empty( gap){
                let self = this
                let father_ele = $('.container'+self.getRandomClassName() ),
                clength = 3

                if ( $.allowMachine == 1) {
                    clength = father_ele.children('.empty-container').length
                    father_ele.children('.empty-element').css('display','none')
                }
                father_ele.children('.empty-element').css({width:(self.pagebaWidth-gap)/clength})
                father_ele.children('.empty-container').css({width:(self.pagebaWidth-gap)/clength })
            },

            //修改状态栏属性响应方法
            get_attribute_reponseData(data__){
                let self = this
                let father_ele = $('.container'+self.getRandomClassName() )

                if ( data__.name == 'statusBar.padding') {
                    /*
                    ***整体边距
                    */
                    self.sd_data_.padding = data__.data

                }else if ( data__.name == 'statusBar.bgColor') {
                    /*
                    ***整体背景颜色
                    */
                    self.sd_data_.bgColor = data__.data
                }else if ( data__.name == 'statusBar.bgResource') {
                    /*
                    ***整体背景图片
                    */
                    self.sd_data_.bgResource = data__.data
                }else if ( data__.name.indexOf('search_input.corner') > -1) {
                    /*
                    ***搜索输入框边角
                    */
                    self.sd_data_.bigSearch.corner = data__.data
                }else if ( data__.name.indexOf('search_input.size.width') > -1) {
                    /*
                    ***搜索输入框宽度
                    */
                    self.sd_data_.bigSearch.size.width = data__.data
                }else if ( data__.name.indexOf('weather.textSize') > -1) {
                    /*
                    ***天气文本大小
                    */
                    self.sd_data_.weather.textSize = data__.data
                }else if ( data__.name.indexOf('weather.textColor') > -1) {
                    /*
                    ***天气文本颜色
                    */
                    self.sd_data_.weather.common.color = data__.data
                }else if ( data__.name.indexOf('search_input.textColor') > -1) {
                    /*
                    ***天气文本颜色
                    */
                    self.sd_data_.search.common.color = data__.data
                }else if ( data__.name.indexOf('title.textSize') > -1) {
                    /*
                    ***标题文本大小
                    */
                    self.sd_data_.title.textSize = data__.data
                }else if ( data__.name.indexOf('title.text') > -1) {
                    /*
                    ***标题文本
                    */
                    self.sd_data_.title.text = data__.data
                }else if ( data__.name.indexOf('common.color') > -1) {
                    /*
                    ***标题文本颜色
                    */
                    self.sd_data_.title.common.color = data__.data
                }else if ( data__.name.indexOf('title.img.url') > -1) {
                    /*
                    ***标题图片地址
                    */
                    self.sd_data_.title.url = data__.data
                }else if ( data__.name.indexOf('title.img.url') > -1) {
                    /*
                    ***图片标题地址
                    */
                    self.sd_data_.title.url = data__.data
                }else if ( data__.name.indexOf('title.img.width') > -1 || data__.name.indexOf('title.img.height') > -1 ) {
                    /*
                    ***图片标题宽度、高度
                    */
                    !self.sd_data_.title.imageSize ? self.sd_data_.title.imageSize = '' : null
                    let size = self.sd_data_.title.imageSize.split(',')

                    data__.name.indexOf('img.width') > -1 ? size[0] = data__.data : size[1] = data__.data
                    self.sd_data_.title.imageSize = size.join(',')

                }else if ( data__.name.indexOf('searchInput_scan.corner') > -1) {
                    /*
                    ***带扫描的输入框
                    */
                    self.sd_data_.bigSearchWithScan.corner = data__.data
                }else if ( data__.name.indexOf('searchInput_scan.textColor') > -1) {
                    /*
                    ***带扫描的输入框
                    */
                    self.sd_data_.bigSearchWithScan.common.color = data__.data
                }else if ( data__.name.indexOf('searchInput_scan.width') > -1) {
                    /*
                    ***带扫描的输入框
                    */
                    self.sd_data_.bigSearchWithScan.size.width = data__.data
                }else if ( data__.name.indexOf('searchInput_scan.height') > -1) {
                    /*
                    ***我的（文本形式）
                    */
                    self.sd_data_.bigSearchWithScan.size.height = data__.data
                }else if ( data__.name.indexOf('textUser.textContent') > -1) {
                    /*
                    ***我的（文本形式）
                    */
                    self.sd_data_.user.text = data__.data
                }else if ( data__.name.indexOf('textUser.textSize') > -1) {
                    /*
                    ***我的（文本形式）
                    */
                    self.sd_data_.user.textSize = data__.data
                }else if ( data__.name.indexOf('textUser.textColor') > -1) {
                    /*
                    ***我的（文本形式）
                    */
                    self.sd_data_.user.common.color = data__.data
                }

                self.setLayout( self.sd_data_)
                let new_object = JSON.parse( JSON.stringify( self.sd_data_))
                self.convertToClent( new_object)

                $.edit_json_remote_post('','status','',new_object)

            },

            //天气等信息
            get_network_data(){
                if ( $.allowMachine != 1) 
                    return

                let self = this,
                putTogether = (...args)=>{
                    let params = ''
                    args.forEach( (item)=>{
                        params+= item.name + '=' +item.value+'&'
                    })
                    return params
                }

                let weather_url = $.clinet_host_weather+ '/v3/weather/weatherInfo?',
                url_params = putTogether( 
                    {name:'city',value:$.clinet_CityKey},
                    {name:'key',value:$.clinet_GDWeatherKey},
                )
                self.netWorking( weather_url+url_params,'get','',(xhr)=>{
                    if ( xhr.responseJSON && xhr.responseJSON.lives){       
                        self.today_weather_data = xhr.responseJSON.lives[0] || {}
                    }
                })
            },

            //各按钮详情点击
            btn_detail_click( val_){
                let self = this
                if ( $.allowMachine == 0) 
                    return

                if ( val_ == 'weather') {
                    self.today_weather_data.weatherC = 1
                    $.click_news_into_particular( self.today_weather_data)
                }else if ( val_ == 'search_button') {
                    $.click_news_into_particular( {statusbar_searchbtn:1})
                }
            },

            //将特殊的颜色数据，转换成能用的
            convertToWeb( data_){
                let self = this
                //颜色转换
                Object.keys(data_).forEach( (key)=>{
                    let key_ = key+''
                    if ( key_.indexOf('olor')>-1  && key_.indexOf('olor_') < 0 ) {
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

            //取消空元素和填充组件模块闪烁效果
            cancel_glitter(){
                $.cancel_glitter()
            },

            getRandomClassName(){
                let self = this
                return '.'+self.randomMark
            },

            netWorking( url ,method,dataParams,callback ){
                let self = this 
                $.ajax({
                    url:url,
                    type:method,
                    dataType:'json',
                    data:dataParams,
                    headers:{
                      'Content-Type':'application/x-www-form-urlencoded',
                    },
                    success:function (argument,message,xhr) {
                        callback(xhr)
                    },
                    error:function( xhr,error){ callback(xhr) }
                })
            },

		}
	}
</script>

<style scoped lang="less">
    @import '../publicStyle';

    @pagebaWidth:375px;
    @statusBarHeight:40px;
    @contentbg:#ccc;
    .container{
        // width: fit-content;
        position: relative;
        width: @pagebaWidth;
        height: @statusBarHeight;
        position: relative;
        white-space: nowrap;
        cursor: pointer;

        .element{
            display: inline-block;
            width: @pagebaWidth/3;
            position: relative;
            color:#fff;
            font-size: 12px;
            top: 50%;
            border: 1.5px dotted #fff;
            border-radius: 15px;
            transform: translateY(-50%);
            cursor: pointer;
            padding: 5px 10px;
            text-align: center;
            &:hover{
                border-color: #000;
            }
        }
        .empty-container div:nth-child(n){
            display: inline-block;
            vertical-align: middle;
            margin: 0 5px;
        }
        .left-element{
            .element;
        }
        .center-element{
            .element;
        }
        .right-element{
            .element;
        }

        .ele-container{
            width: @pagebaWidth/3;
        }
        .left-ele-container{
            .ele-container;
            text-align: left;
        }
        .center-ele-container{
            .ele-container;
            text-align: center;
        }
        .right-ele-container{
            .ele-container;
            text-align: right;
        }

    }

</style>
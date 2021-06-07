<template>
    <div :class=" 'banner-carouse '+randomMark" @click.stop='edit_json_style'>
        <RollViewLayout class='rollViewLayout' :layout_data='local_data'></RollViewLayout>
        <div class="logo-status">
            <ImageLayout class='logo':layout_data='local_data.images ? local_data.images.logo :"" '></ImageLayout>
            <LabelLayout class='status' :layout_data='local_data.images ? local_data.images.status :"" ' ></LabelLayout>
            <LabelLayout class='takePart' :layout_data='local_data.images ? local_data.images.takePart :"" ' ></LabelLayout>
        </div>
        <ViewLayout class='lineView'></ViewLayout>
    </div>
</template>

<script type="text/javascript">
    import RollViewLayout from '../../../basicsModule/rollViewLayout';
    import ViewLayout from '../../../basicsModule/viewLayout';
    import ImageLayout from '../../../basicsModule/imageLayout';
    import LabelLayout from '../../../basicsModule/labelLayout';

	export default {
		data () {
			return {  
                pageWidth:375,
                local_data:{},
                remote_data:{},
                type_element:'',
                randomMark:(new Date()).getTime(),
			}
		},
        watch:{
            bcData:function (newVal,oldVal ) {
               let self = this
               // self.setLayout(newVal['1101'])
            }
        },
        created(){
            let self = this;
        },
        mounted(){
            let self = this
            self.local_data = self.getlocalData()
            $.allowMachine == 1 ? self.pageWidth = $(window).width() : null

            let bc___ = self._props.bcData['1101']
            self.type_element = self._props.typeids

            self.convertSpecialToNormal( bc___,'shadowColor')
            self.convertToWeb( bc___)
            self.setLayout( bc___)
            self.getDataRedraw()

            self.$emit('edit_json_bc',function( val_){
                self.edit_json_reponse( val_)
            },'','') 
        },
        props: ['bcData','typeids'],
        components:{
            RollViewLayout,
            ViewLayout,
            ImageLayout,
            LabelLayout
        },
		methods:{
            setLayout( bc_,baseData_){
                let self = this
                if ( !bc_ ) 
                    return
                let $bc_style = $('.banner-carouse'+self.getRandomClassName() )
                let bc_common = bc_[0]
                let local_style_data = self.getlocalData()
                local_style_data.images.width = self.pageWidth

                //整体高度
                let cell_height = -1
                {
                    cell_height = bc_common.height
                }

                //设置轮播时间
                if ( bc_common.delay){
                    let pageControl = local_style_data.pageControl
                    pageControl.autoScrollInterval = parseFloat( bc_common.delay)/1000
                }
                //设置索引颜色
                if ( bc_common.select_color || bc_common.unSelect_color){
                    let pageControl = local_style_data.pageControl
                    bc_common.select_color ? pageControl.currentPageIndicatorTintColor = bc_common.select_color : null
                    bc_common.unSelect_color ? pageControl.pageIndicatorTintColor = bc_common.unSelect_color : null   
                }
                //设置图片
                if ( bc_common.img) {
                    let borderRadius = local_style_data.common.border.borderRadius
                    borderRadius = bc_common.img.child ?  bc_common.img.child.radius : 0

                    let size = bc_common.img.child && bc_common.img.child.size ? bc_common.img.child.size.split(',') : []
                    size[1] && parseFloat( size[1]) >= 0 ? local_style_data.common.size.height = size[1] :null

                    local_style_data.common.border.borderRadius = borderRadius
                }
                //标题、索引阴影部分
                if ( bc_common.view && bc_common.view.style) {
                    let color_ = local_style_data.color
                    color_.bgColorTop = bc_common.view.style.shadowColor_top
                    color_.bgAlphaTop = bc_common.view.style.shadowColor_top_opacity

                    color_.bgColorBottom = bc_common.view.style.shadowColor_bottom
                    color_.bgAlphaBottom = bc_common.view.style.shadowColor_bottom_opacity
                }
                //标题
                if ( bc_common.title && bc_common.title.style) {
                    local_style_data.color.textColor = bc_common.title.style.textColor
                    local_style_data.text.font = bc_common.title.style.textSize
                    local_style_data.text.familyName = bc_common.title.style.familyName
                }
                //状态
                let status_bgColor = '', status_radius = 0
                if ( bc_common.status && bc_common.status.style) {
                    local_style_data.images.status.color.textColor = bc_common.status.style.textColor
                    local_style_data.images.status.text.font = bc_common.status.style.textSize
                    local_style_data.images.status.text.familyName = bc_common.status.style.familyName
                    local_style_data.images.status.text.androidFamilyName = bc_common.status.style.androidFamilyName
                    local_style_data.images.takePart.color.textColor = bc_common.status.style.textColor
                    local_style_data.images.takePart.text.font = bc_common.status.style.textSize
                    status_radius = bc_common.status.style.radius
                    status_bgColor = bc_common.status.style.bgColor
                }
                //索引类型
                {   
                    local_style_data.whichControl = bc_common.isNumberPageControl ? 1 : 0
                }

                //设置基础内容数据
                // if ( baseData_) {
                //     local_style_data.images.urls = []
                //     local_style_data.text.content = []

                //     baseData_.items.forEach( (item)=>{
                //         local_style_data.images.urls.push( item.thumb)
                //         local_style_data.text.content.push( item.title)
                //     })     
                // }

                self.$nextTick( ()=>{
                    $bc_style.find('.logo-status').css({
                        backgroundColor:status_bgColor,
                        borderRadius:status_radius+'px',
                    })
                    $bc_style.css({
                        height: cell_height <0 ? 'auto' :cell_height+'px'
                    })
                })

                //持有外部json数据
                self.remote_data = bc_
                //本地样式数据
                self.local_data = local_style_data
            },

            //点击修改样式，编辑json
            edit_json_style( id_){
                let self = this
                if ( $.allowMachine == 1){
                    return
                } 
                $.cancel_glitter()
                let bc_ = $('.banner-carouse'+self.getRandomClassName() )
                let which_one = self.type_element

                self.$nextTick( ()=>{
                    bc_.addClass('border-style-0').addClass('boder-color-animation') 

                    let bCommon = self.remote_data[0]
                    let delay = bCommon.delay ? parseFloat( bCommon.delay)/1000 : ''
                    //整体高度
                    let cell_height = bCommon.height
                    //图片
                    let imgwidth = 0 ,imgheight = 0 , img_radius = bCommon.img && bCommon.img.child ? bCommon.img.child.radius : ''
                        if (bCommon.img.child.size ) {
                            let size = bCommon.img.child.size.split(',')
                            imgwidth = size[0] || 0
                            imgheight = size[1] || 0
                        }
                    //阴影
                    let shadow_top_Color = '' , shadow_top_opacity = '' , shadow_bottom_Color = '', shadow_bottom_opacity = ''
                    if ( bCommon.view && bCommon.view.style) {
                        shadow_top_Color = bCommon.view.style.shadowColor_top
                        shadow_top_opacity = bCommon.view.style.shadowColor_top_opacity

                        shadow_bottom_Color = bCommon.view.style.shadowColor_bottom
                        shadow_bottom_opacity = bCommon.view.style.shadowColor_bottom_opacity
                    }
                    //标题
                    let color = bCommon.title.style.textColor || ''
                    let font = bCommon.title.style.textSize || ''
                    let familyName = bCommon.title.style.familyName || ''
                    let android_familyName = bCommon.title.style.androidFamilyName || ''
                    //状态
                    let status_color = bCommon.status.style.textColor || ''
                    let status_font = bCommon.status.style.textSize || ''
                    let status_familyName = bCommon.status.style.familyName || ''
                    let status_android_familyName = bCommon.status.style.androidFamilyName || ''
                    let status_bgColor = bCommon.status.style.bgColor
                    let status_radius = bCommon.status.style.radius

                    //索引选中颜色
                    let select_color = bCommon.select_color || ''
                    let unSelect_color = bCommon.unSelect_color || ''

                    self.$emit('edit_json_bc','',{
                        //整体高度
                        cell_height:cell_height,
                        delay:delay,
                        img_radius:img_radius,
                        img_height:imgheight,
                        //标题阴影
                        shadow_top_Color:shadow_top_Color,
                        shadow_top_opacity:shadow_top_opacity,
                        shadow_bottom_Color:shadow_bottom_Color,
                        shadow_bottom_opacity:shadow_bottom_opacity,
                        //标题
                        color:color,
                        font:font,
                        familyName:familyName,
                        android_familyName:android_familyName,
                        //状态
                        status_color:status_color,
                        status_font:status_font,
                        status_familyName:status_familyName,
                        status_android_familyName:status_android_familyName,
                        status_bgColor:status_bgColor,
                        status_radius:status_radius,

                        select_color:select_color,
                        unSelect_color:unSelect_color,
                    }, which_one)
                }) 
                /*28:56、、、、*/ 
            },

            //响应修改的样式数据
            edit_json_reponse( val_){
                let self = this
                //防止其他模块修改影响到本模块
                if ( val_.name.indexOf('bc') < 0 ) 
                    return

                let bCommon = self.remote_data[0]
                //轮播时间
                if ( val_.name.indexOf('bc.delay') > -1) {
                    bCommon.delay =  parseFloat( val_.data)*1000
                }
                //整体高度
                else if ( val_.name.indexOf('bc.cell_height') > -1) {
                    bCommon.height =  val_.data
                }
                //索引
                else if ( val_.name.indexOf('bc.select_color') > -1) {
                    bCommon.select_color = val_.data
                }else if ( val_.name.indexOf('bc.unSelect_color') > -1) {
                    bCommon.unSelect_color = val_.data
                }
                //阴影
                else if ( val_.name.indexOf('bc.shadow_top_Color') > -1) {
                    if ( bCommon.view && bCommon.view.style) {
                        bCommon.view.style.shadowColor_top = val_.data
                        let topcolor_origin = bCommon.view.style.shadowColor_top_origin || ''
                        if ( topcolor_origin) {
                            let prefix = topcolor_origin.slice(0,3)
                            prefix += val_.data.slice(1)
                            bCommon.view.style.shadowColor_top_origin = prefix
                        }
                    }
                }else if ( val_.name.indexOf('bc.shadow_top_opacity') > -1) {
                    if ( bCommon.view && bCommon.view.style) {
                        bCommon.view.style.shadowColor_top_opacity = val_.data
                        var topcolor_origin = bCommon.view.style.shadowColor_top_origin || ''

                        if ( topcolor_origin) {
                            let op_ = Math.floor( parseFloat( val_.data)*255)
                            op_ =op_.toString(16).toUpperCase()
                            let suffix = topcolor_origin.slice(3)
                            op_.length == 1 ? op_ = '0'+op_ : null
                            bCommon.view.style.shadowColor_top_origin = '#'+op_+suffix
                        }
                    }
                }else if ( val_.name.indexOf('bc.shadow_bottom_Color') > -1) {
                    if ( bCommon.view && bCommon.view.style) {
                        bCommon.view.style.shadowColor_bottom = val_.data
                        let bottomcolor_origin = bCommon.view.style.shadowColor_bottom_origin || ''
                        if ( bottomcolor_origin) {
                            let prefix = bottomcolor_origin.slice(0,3)
                            prefix += val_.data.slice(1)
                            bCommon.view.style.shadowColor_bottom_origin = prefix
                        }
                    }
                }else if ( val_.name.indexOf('bc.shadow_bottom_opacity') > -1) {
                    if ( bCommon.view && bCommon.view.style) {
                        bCommon.view.style.shadowColor_bottom_opacity = val_.data
                        var bottomcolor_origin = bCommon.view.style.shadowColor_bottom_origin || ''

                        if ( bottomcolor_origin) {
                            let op_ = Math.floor( parseFloat( val_.data)*255)
                            op_ =op_.toString(16).toUpperCase()
                            let suffix = bottomcolor_origin.slice(3)
                            op_.length == 1 ? op_ = '0'+op_ : null
                            bCommon.view.style.shadowColor_bottom_origin = '#'+op_+suffix
                        }
                    }
                }
                //图片
                else if ( val_.name.indexOf('bc.img_radius') > -1) {
                    if ( bCommon && bCommon.img.child) {
                        bCommon.img.child.radius = val_.data
                    }
                }
                else if ( val_.name.indexOf('bc.img_height') > -1) {
                    if ( bCommon.img && bCommon.img.child) {
                        let size = bCommon.img.child.size ? bCommon.img.child.size.split(',') :['','']
                        size[1] = val_.data
                        bCommon.img.child.size = size.join(',')
                    }
                }
                //标题
                else if ( val_.name.indexOf('bc.title.color') > -1) {
                    if ( bCommon.title && bCommon.title.style) {
                        bCommon.title.style.textColor = val_.data
                    }
                }else if ( val_.name.indexOf('bc.title.font') > -1) {
                    if ( bCommon.title && bCommon.title.style) {
                        bCommon.title.style.textSize = val_.data
                    }
                }else if ( val_.name.indexOf('bc.title.familyName') > -1) {
                    if ( bCommon.title && bCommon.title.style) {
                        bCommon.title.style.familyName = val_.data
                    }
                }else if ( val_.name.indexOf('bc.title.androidfamilyName') > -1) {
                    if ( bCommon.title && bCommon.title.style) {
                        bCommon.title.style.androidFamilyName = val_.data
                    }
                }
                //直播状态
                else if ( val_.name.indexOf('bc.status.color') > -1) {
                    if ( bCommon.status && bCommon.status.style) {
                        bCommon.status.style.textColor = val_.data
                    }
                }else if ( val_.name.indexOf('bc.status.font') > -1) {
                    if ( bCommon.status && bCommon.status.style) {
                        bCommon.status.style.textSize = val_.data
                    }
                }else if ( val_.name.indexOf('bc.status.familyName') > -1) {
                    if ( bCommon.status && bCommon.status.style) {
                        bCommon.status.style.familyName = val_.data
                    }
                }else if ( val_.name.indexOf('bc.status.androidfamilyName') > -1) {
                    if ( bCommon.status && bCommon.status.style) {
                        bCommon.status.style.androidFamilyName = val_.data
                    }
                }else if ( val_.name.indexOf('bc.status.bgColor') > -1) {
                    if ( bCommon.status && bCommon.status.style) {
                        bCommon.status.style.bgColor = val_.data
                    }
                }else if ( val_.name.indexOf('bc.status.radius') > -1) {
                    if ( bCommon.status && bCommon.status.style) {
                        bCommon.status.style.radius = val_.data
                    }
                }

                self.setLayout( self.remote_data)
                let new_object = JSON.parse( JSON.stringify( self.remote_data))
                self.convertToClent(new_object)
                new_object[0].view.style.shadowColor = new_object[0].view.style.shadowColor_top+','+new_object[0].view.style.shadowColor_bottom

                let pt__ = val_.difference.split('_')[1]
                $.edit_json_remote_post('newsList','banner',pt__,new_object)
            },

            //将颜色特殊值转换成普通值
            convertSpecialToNormal( data_,key_l){
                let self = this
                Object.keys(data_).forEach( (key)=>{
                    let key_ = key+''
                    if ( key_ == key_l ) {
                        let data_value_arr = data_[key_].split(',')
                        data_[key_+'_top'] = data_value_arr[0]
                        data_[key_+'_bottom'] = data_value_arr[1]
                    }else if ( (typeof data_[key_] == 'object') ) {
                        self.convertSpecialToNormal( data_[key_],key_l)
                    }
                })
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
                    }else if ( (typeof data_[key_] == 'object') && !(typeof data_[key_] instanceof Array)) {
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
                    if ( key_.indexOf('olor')>-1 && key_.indexOf('olor_origin') <0 && key_.indexOf('olor_opacity') <0  ) {
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
            //将获取的数据再次渲染
            getDataRedraw(){
                let self = this
                if ( $.allowMachine == 1) {
                    let $bli = $('.banner-carouse'+self.getRandomClassName()+'.copy' )
                    setTimeout(function() {
                        if ( $bli.data('contentData') && $bli.data('refresData') ) {
                            $bli.data('refresData',false) 
                            let c_ = JSON.parse( $bli.data('contentData')),
                            j_ = c_['1101']

                            self.convertSpecialToNormal( j_,'shadowColor')
                            self.convertToWeb( j_)
                            self.setLayout( j_)
                            self.dom_operator_content()
                        }
                        self.getDataRedraw()
                    }, 200);
                }
            },
            //直接操作dom
            dom_operator_content(){
                let self = this,
                $bli = $('.banner-carouse'+self.getRandomClassName()+'.copy' ),
                inerval_rotate = ( $bli,i ,manual_loop)=>{
                    let rvl_ = $bli.find('.pic'),
                    $content_ = rvl_.find('.content-img-text'),
                    indexNumber = 0,
                    index = 0

                    $content_.children(".img-package.tmp").remove()
                    let first_node = $content_.children(".img-package").first(),
                    last_node = $content_.children(".img-package").last(),
                    cloneObject_frist = first_node.clone()
                    cloneObject_frist.data('concrete_data',first_node.data('concrete_data') )
                    cloneObject_frist.addClass('tmp')

                    let cloneObject_last = last_node.clone()
                    cloneObject_last.data('concrete_data',last_node.data('concrete_data') )
                    cloneObject_last.addClass('tmp')

                    $content_.append(cloneObject_frist)
                    $content_.prepend(cloneObject_last)

                    indexNumber = $content_.children(".img-package").not('.tmp').length+1
                    rvl_.find('.indexNumber').text( '1/'+(indexNumber-1) )
     
                    let picLoop = ( or_)=>{
                        or_>0 ? index++ : index--  
                        let tail = false, text_index = index
                        if( index == indexNumber){    
                            $content_.css("left","0px")    
                            index = 1
                            text_index = 1
                        }  
                        $content_.stop().animate({left:-index* self.pageWidth },500,function(){
                            if ( index == 0) {
                                index = indexNumber-1
                                $content_.css("left",-index* self.pageWidth +'px')
                            } 
                        })

                        index == 0 ? text_index = indexNumber-1 : null

                        rvl_.find('.index').children('li').eq( text_index).css("background-color",self.local_data.pageControl.currentPageIndicatorTintColor).siblings().css("background-color",self.local_data.pageControl.pageIndicatorTintColor)
                        //数字索引的移动
                        if (self.local_data.whichControl == 1 ) {
                            rvl_.find('.indexNumber').text( text_index+'/'+(indexNumber-1) )
                        } 
                    }
                    clearInterval( self['timer_roll'+i] )
                    let timerRoll = ()=>{
                        self['timer_roll'+i] = setInterval(picLoop,self.local_data.pageControl.autoScrollInterval*1000 ,1)
                    },
                    initialTimestamp = (new Date()).getTime()
                    timerRoll()
                    
                    picLoop( 1)
                    manual_loop( ( value,timestamp)=>{
                        picLoop( value)
                        //如果手动干预滑动，则取消定时器滑动
                        clearInterval( self['timer_roll'+i] )
                        initialTimestamp = timestamp
                        //手动滑动时间间隔大于5000毫秒，再执行自动轮播
                        if ( timestamp-initialTimestamp > 5000) {
                            setTimeout(function() {
                                timerRoll()
                            }, 5000)
                        }
                    })

                }

                $.each($bli,(i)=>{
                    let baseData = JSON.parse( $bli.eq(i).data('baseData')),
                    $ip = $bli.eq(i).find('.img-package').eq(0),
                    $ele_content = $bli.eq(i).find('.content-img-text'),
                    manualO_callback,
                    manualO = ( c) =>{
                        manualO_callback = c
                    }
                    $ele_content.empty()

                    baseData.items.forEach( (item,n)=>{
                        let $ip_copy= $ip.clone()
                        $ip_copy.find('img').attr('src',item.thumb)
                        $ip_copy.find('.title').text(item.title)
                        $ip_copy.data('concrete_data',item)
                        $ele_content.append( $ip_copy)

                    })
                    inerval_rotate( $bli.eq(i),i ,manualO)

                    touch.on($bli[0],'swipeleft',function(){
                        let ts = (new Date()).getTime()
                        manualO_callback( 1,ts)
                    })
                    touch.on($bli[0],'swiperight',function(){
                        let ts = (new Date()).getTime()
                        manualO_callback( -1,ts)
                    })

                    $ele_content.find('.img-package').on('click',function(){
                        $.click_news_into_particular( $(this).data('concrete_data'))
                    })
                })
                $bli.find('.logo-status').css('display','none') //将状态隐藏掉
                $bli.css('display','block')
            },
            getRandomClassName(){
                let self = this
                return '.'+self.randomMark
            },
            getlocalData(){
                return {
                        "images":{
                            "urls":[
                                "http://img01.cztv.com/archive/ZmlsZT1odHRwOi8vaW1nMDEuY3p0di5jb20vMjAyMDA4LzAzLzVmMWNjMmNiYmI5N2UwYmRkMWE3YjMzMGZhMTMwMDhmLmpwZyZheGlzPTAsMCZzaXplPTAsMCZ0c2l6ZT0zMDAsMTg2.jpg",
                                "http://img01.cztv.com/202008/19/602cdad7da0e7390972a158d189c3149.jpg",
                                "http://img01.cztv.com/archive/ZmlsZT1odHRwOi8vaW1nMDEuY3p0di5jb20vMjAyMDA2LzI0L2RjZmJlZGY2YTRiYjUzNzU1NGZkYjJkMjAyODQ0MDlmLmpwZyZheGlzPTAsMCZzaXplPTAsMCZ0c2l6ZT0zMDAsMTg2.jpg",
                                "http://img01.cztv.com/202008/19/19b2ed65c9d1b61f4963c50bf81ef420.jpg"
                            ],
                            "width":375,
                            "logo":{
                                "imgUrl":'http://shixiantest.oss-cn-hangzhou.aliyuncs.com/48/posts/2020/11/03/344b93fef7622f36d8ff2eaf88e92415.png',
                                "imgFill":'cover',
                                "common":{
                                    "size":{
                                        "width":10,
                                        "height":10
                                    },
                                }
                            },
                            "status":{
                                "textContent":'直播中',
                                "color":{
                                    "textColor":"#ffffff"
                                },
                                "text":{
                                    "textAlignment":0,
                                    "font":12,
                                    "familyName":"",
                                    "androidFamilyName":""
                                },
                                "common":{
                                    "size":{
                                        "height":18
                                    },
                                }
                            },
                            "takePart":{
                                "textContent":'85572人参与',
                                "color":{
                                    "textColor":"#ffffff",
                                    "bgColor":"#666",
                                    "bgAlpha":"1.0",
                                },
                                "text":{
                                    "textAlignment":0,
                                    "font":12,
                                    "familyName":"",
                                    "androidFamilyName":""
                                },
                                "common":{
                                    "size":{
                                        "height":21
                                    },
                                }
                            },
                            
                        },
                        "color": {
                            "textColor": "#ffffff",
                            "bgColorTop": "#000000",
                            "bgAlphaTop":'1.0',
                            "bgColorBottom": "#000000",
                            "bgAlphaBottom":'1.0'
                        },
                        "text": {
                            "textAlignment": 0,
                            "familyName": "PingFangSC-Regular",  
                            "font": 15,
                            "content":[
                                '大山深处的浙江人',
                                '《数字化破局》',
                                '光影•小康”网络摄影大赛入口',
                                '跨界合作是DNF新文创合作的开端'
                            ]
                        },
                        "common": {
                            "border": {
                                "borderColor": "#fff", // 边框颜色
                                "borderWidth": 0, // 边框宽度
                                "borderRadius": 0 // 边框圆角
                            },
                            "size":{
                                "height":178
                            },
                        },
                        "pageControl": { 
                            "autoScrollInterval": 3,
                            "currentPageIndicatorSize": "6", 
                            "contentHorizontalAlignment": 2, 
                            "currentPageIndicatorTintColor": "#fff", 
                            "pageIndicatorTintColor": "#aaa",
                        },
                        "whichControl":0, //0:索引，1:数字
                }
            },
            /**78.57**/

		}
	}
</script>

<style scoped lang="less">
    @import '../../publicStyle';
    @contentbg:#fff;
    .banner-carouse{
        width: 100%;
        position: relative;
        .logo-status{
            position: absolute;
            display: table-cell;
            vertical-align: middle;
            top: 10px;
            left: 10px;
            height: 21px;
            padding: 0 0 3px 5px;
            .logo{
                display: inline-block;
                vertical-align: middle;
            }
            .takePart{
                margin-top: 0px;
                padding: 0 5px;
            }
        }
    }

</style>
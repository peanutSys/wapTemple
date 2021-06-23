<template>
    <div :class='"hori-content "+randomMark' @click.stop='edit_json_style("1")'>
        
        <div class="img-father">
            <span class="img-text" v-for='(val,key) in (local_data.mainImage ? local_data.mainImage.imgUrlArr : [])' :key='key'>
                <div class="image-package">
                    <ImageLayout class='image' :layout_data='function() {
                        if ( !local_data.mainImage) {
                            return ;
                        }
                        let new_object = JSON.parse( JSON.stringify( local_data.mainImage))
                        new_object.imgUrl = new_object.imgUrlArr[key]
                        return new_object
                    }()'></ImageLayout>
                    <div class="duration-package" v-if=" type_element == 'bigImage_1204'">
                        <ImageLayout class='duration-img':layout_data='local_data.durationImg'></ImageLayout>
                        <LabelLayout class='duration-text' :layout_data='local_data.duration'></LabelLayout>
                    </div>
                </div>
                <div class="title-package">
                    <LabelLayout class='title' :layout_data='function() {
                        if ( !local_data.title) {
                            return ;
                        }
                        let new_object = JSON.parse( JSON.stringify( local_data.title))
                        new_object.textContent = new_object.textContentArr[key]
                        return new_object
                    }()' ></LabelLayout>
                    <div class="other-tag" v-if=" type_element == 'bigImage_1204' ">
                        <LabelLayout class='tag' :layout_data='function() {
                            if ( !local_data.tag) {
                                return ;
                            }
                            let new_object = JSON.parse( JSON.stringify( local_data.tag))
                            new_object.textContent = new_object.textContentArr[key]
                            return new_object
                        }()' ></LabelLayout>
                        <LabelLayout class='time' :layout_data='function() {
                            if ( !local_data.time) {
                                return ;
                            }
                            let new_object = JSON.parse( JSON.stringify( local_data.time))
                            new_object.textContent = new_object.textContentArr[key]
                            return new_object
                        }()' ></LabelLayout>
                        <div class='reviews'>
                            <div class="img">
                                <img src="../../../../../static/img/look.png">
                                <i class="iblock"></i>
                            </div>
                            <LabelLayout class='count' :layout_data='function() {
                                if ( !local_data.reviews) {
                                    return ;
                                }
                                let new_object = JSON.parse( JSON.stringify( local_data.reviews))
                                new_object.textContent = new_object.textContentArr[key]
                                return new_object
                            }()' ></LabelLayout>
                        </div>
                    </div>
                    
                </div>
            </span>
        </div>
        <!-- <ViewLayout class='line' :layout_data='local_data.line'></ViewLayout> -->
    </div>
</template>

<script type="text/javascript">
    import LabelLayout from '../../../basicsModule/labelLayout';
    import ImageLayout from '../../../basicsModule/imageLayout';
    import ViewLayout from '../../../basicsModule/viewLayout';

    export default {
        data () {
            return {  
                pageWidth:375,
                randomMark:(new Date()).getTime()+Math.floor(Math.random()*1000),

                local_data:{},//本地数据
                remote_data:{}, //要更改的远程json数据

                type_element:'',
            }
        },
        watch:{
            hscData:function (newVal,oldVal ) {
               let self = this
               // self.setLayout(newVal)
            }
        },
        created(){
            let self = this;
        },
        mounted(){
            let self = this
            self.type_element = self._props.typeids
            $.allowMachine == 1 ? self.pageWidth = $(window).width() : null

            let hsc_data_
            if ( self.type_element == 'bigImage_1201') {
                //标题在内水平滚动
                hsc_data_ = self._props.hscData['1201'] || ''
            }else if ( self.type_element == 'bigImage_1202') {
                //标题在内水平滚动
                hsc_data_ = self._props.hscData['1202'] || ''
            }else if ( self.type_element == 'bigImage_1204') {
                //标题在内水平滚动
                hsc_data_ = self._props.hscData['1204'] || ''
            }
            
            self.convertSpecialToNormal( hsc_data_,'shadowColor')
            self.convertToWeb( hsc_data_)
            self.setLayout( hsc_data_)
            self.getDataRedraw()
            self.$emit('edit_json_hsc',function( val_){
                self.edit_json_reponse( val_)
            },'','') 
        },
        props: ['hscData','typeids'],
        components:{
            LabelLayout,
            ImageLayout,
            ViewLayout,
        },
        methods:{
            setLayout( hsc_){
                let self = this 
                if ( !hsc_) 
                    return
                let hsc_one = hsc_[0] || hsc_
                if ( !hsc_one) 
                    return

                let local_style_data = self.getlocalData(),
                $hct_ = $('.hori-content'+self.getRandomClassName() )

                //设置边距
                let padding_ = '';
                {   
                    if ( hsc_one.margin) {
                        let margin_arr_ = hsc_one.margin.split(',')
                        if ( margin_arr_.length > 4) {
                            margin_arr_.shift() 
                        }
                        margin_arr_.forEach( (item,i)=>{
                            padding_+=item+'px '
                        })
                        
                    }
                }
                //整体高度
                let cell_height = -1
                {
                    cell_height = hsc_one.height
                }

                //设置图片
                let img_width = 0 , img_height = 0, img_radius = 0
                if ( hsc_one.img) {
                    let main_image = local_style_data.mainImage
                    
                    let size = hsc_one.img.child && hsc_one.img.child.size ? hsc_one.img.child.size.split(',') : []
                    size[0] ? main_image.common.size.width = size[0] :null
                    size[0] ? img_width = size[0] : img_width = main_image.common.size.width
                    size[1] && parseFloat( size[1]) >= 0 ? main_image.common.size.height = size[1] :null
                    size[1] && parseFloat( size[1]) >= 0 ? img_height = size[1] : img_height = main_image.common.size.height

                    main_image.common.border.borderRadius = img_radius = hsc_one.img.child.radius
                }
                //标题阴影
                let shadow_color = {}
                if ( hsc_one.view && hsc_one.view.style ) {
                    let color_ = local_style_data.shadowColor
                    color_.bgColorTop = hsc_one.view.style.shadowColor_top
                    color_.bgAlphaTop = hsc_one.view.style.shadowColor_top_opacity

                    color_.bgColorBottom = hsc_one.view.style.shadowColor_bottom
                    color_.bgAlphaBottom = hsc_one.view.style.shadowColor_bottom_opacity
                    shadow_color = color_
                }
                //设置标题
                let title_left = 0,title_top = 0 
                if ( hsc_one.title){
                    let title = local_style_data.title
                    title.color.textColor = hsc_one.title.style.textColor
                    title.text.font = hsc_one.title.style.textSize
                    title.text.familyName = hsc_one.title.style.familyName
                    title.text.androidFamilyName = hsc_one.title.style.androidFamilyName
                }
                //设置播放时间
                let duration_left = 0,duration_bottom = 0 
                if ( hsc_one.videoDuration){
                    let duration = local_style_data.duration
                    duration.color.textColor = hsc_one.videoDuration.style.textColor
                    duration.text.font = hsc_one.videoDuration.style.textSize
                    duration.text.familyName = hsc_one.videoDuration.style.familyName
                    duration.text.androidFamilyName = hsc_one.videoDuration.style.androidFamilyName
                }
                //设置标签
                let tag_left = 0,tag_top=0,tag_bottom=0
                if ( hsc_one.tag){    
                    let tag = local_style_data.tag
                    tag.color.textColor = hsc_one.tag.style.textColor
                    tag.text.font = hsc_one.tag.style.textSize
                    tag.text.familyName = hsc_one.tag.style.familyName
                    tag.text.androidFamilyName = hsc_one.tag.style.androidFamilyName

                }
                //时间
                let time_left = 0,time_top=0,time_bottom=0
                if ( hsc_one.time){    
                    let time = local_style_data.time
                    time.color.textColor = hsc_one.time.style.textColor
                    time.text.font = hsc_one.time.style.textSize
                    time.text.familyName = hsc_one.time.style.familyName
                    time.text.androidFamilyName = hsc_one.time.style.androidFamilyName

                }
                //设置阅读量
                let reviews_right = 0,reviews_top = 0 ,reviews_bottom = 0
                if ( hsc_one.read){
                    let reviews = local_style_data.reviews
                    reviews.color.textColor = hsc_one.read.style.textColor
                    reviews.text.font = hsc_one.read.style.textSize
                    reviews.text.familyName = hsc_one.read.style.familyName
                    reviews.text.androidFamilyName = hsc_one.read.style.androidFamilyName
                }
                
                self.$nextTick( ()=>{
                    //设置内边距
                    $hct_.css({
                        margin:padding_,
                        height:cell_height <0 ? 'auto' :cell_height+'px',
                    })

                    //设置标题阴影
                    if ( self.type_element == 'bigImage_1202') {
                        //标题在内 水平滚动
                        $hct_.find('.title-package').css( {
                            backgroundImage :'linear-gradient('+self.hexToRgb(shadow_color.bgColorTop,shadow_color.bgAlphaTop)+','+ self.hexToRgb(shadow_color.bgColorBottom,shadow_color.bgAlphaBottom) +')' ,
                            borderBottomRightRadius: img_radius,
                            borderBottomLeftRadius: img_radius,
                        })
                    }else if ( self.type_element == 'bigImage_1201' || self.type_element == 'bigImage_1204') {
                        //标题在外 水平滚动
                        $hct_.find('.title-package').addClass('title-package-reverse')
                        $hct_.find('.img-text').css('verticalAlign','top')
                        $hct_.find('.title-package').css('width',img_width+'px')
                        //标题在外带标签 水平滚动
                        if ( self.type_element == 'bigImage_1204') {
                            $hct_.find('.count').css('verticalAlign','top')

                            //设置时间
                            // $hct_.children('.img-father').find('.time').css({
                            //     margin: time_top+'px '+'0 '+time_bottom+'px ' +time_left+'px'
                            // })
                            //设置阅读量
                            // $hct_.children('.img-father').find('.reviews').css({
                            //     margin: reviews_top+'px '+reviews_right+'px '+reviews_bottom+'px ' +'0'
                            // })
                        }
                        
                    }

                })

                //持有外部json数据
                self.remote_data = hsc_
                //本地样式数据
                self.local_data = local_style_data
            },

            //点击修改某个样式，编辑json
            edit_json_style( id_){
                let self = this
                if ( $.allowMachine == 1){
                    
                    return
                } 
                $.cancel_glitter()
                let hct_ = $('.hori-content'+self.getRandomClassName() )
                let which_one = self.type_element
                self.$nextTick( ()=>{
                    if ( id_ == '1') {
                        //修改整体
                        hct_.addClass('border-style-0').addClass('boder-color-animation')  

                        let hscroll_common = self.remote_data[0]
                        //整体高度
                        let cell_height = hscroll_common.height
                        //整体边距
                        let margin_arr_ = hscroll_common.margin.split(','),
                        mpid = ''
                        if ( margin_arr_.length > 4) {
                            mpid = margin_arr_.shift() //删除第一个标识符
                        }
                        let margin_entirety = margin_arr_.join(',')

                        //修改图片样式
                        let imgwidth = 0 ,imgheight = 0 , imgradius = hscroll_common.img.child.radius
                        if (hscroll_common.img.child.size ) {
                            let size = hscroll_common.img.child.size.split(',')
                            imgwidth = size[0] || 0
                            imgheight = size[1] || 0
                        }
                        //标题阴影
                        let shadow_top_Color = '' , shadow_top_opacity = '' , shadow_bottom_Color = '', shadow_bottom_opacity = ''
                        if ( hscroll_common.view && hscroll_common.view.style) {
                            shadow_top_Color = hscroll_common.view.style.shadowColor_top
                            shadow_top_opacity = hscroll_common.view.style.shadowColor_top_opacity

                            shadow_bottom_Color = hscroll_common.view.style.shadowColor_bottom
                            shadow_bottom_opacity = hscroll_common.view.style.shadowColor_bottom_opacity
                        }
                        //修改标题样式
                        let color = hscroll_common.title.style.textColor || ''
                        let font = hscroll_common.title.style.textSize || ''
                        let familyName = hscroll_common.title.style.familyName || ''
                        let android_familyName = hscroll_common.title.style.androidFamilyName || ''

                        //修改标签
                        let tagcolor = '', tagfont = '' ,tagfamilyName = '', tagandroid_familyName = '',tagleft = '', tagbottom = '' ,tagtop ='' ,tagright = ''
                        if ( hscroll_common.tag) {
                            let tag_count = hscroll_common.tag
                            tagcolor = tag_count.style.textColor || ''
                            tagfont = tag_count.style.textSize || ''
                            tagfamilyName = tag_count.style.familyName || ''
                            tagandroid_familyName = tag_count.style.androidFamilyName || ''

                        }
                        //修改时间
                        let timecolor = '', timefont = '' ,timefamilyName = '', timeandroid_familyName = '',timeleft = '', timebottom = '' ,timetop ='' ,timeright = ''
                        if ( hscroll_common.time) {
                            let time_count = hscroll_common.time
                            timecolor = time_count.style.textColor || ''
                            timefont = time_count.style.textSize || ''
                            timefamilyName = time_count.style.familyName || ''
                            timeandroid_familyName = time_count.style.androidFamilyName || ''

                            // if ( time_count.layout.left) {
                            //     let arr_split = time_count.layout.left.split(',')
                            //     timeleft = arr_split[1]
                            // }
                            // if ( time_count.layout.bottom) {
                            //     let arr_split = time_count.layout.bottom.split(',')
                            //     timebottom = arr_split[1]
                            // }
                            // if ( time_count.layout.top) {
                            //     let arr_split = time_count.layout.top.split(',')
                            //     timetop = arr_split[1]
                            // }
                            // if ( time_count.layout.right) {
                            //     let arr_split = time_count.layout.right.split(',')
                            //     timeright = arr_split[1]
                            // }
                        }
                        //修改阅读量
                        let reviewcolor = '', reviewfont = '' ,reviewfamilyName = '', reviewandroid_familyName = '',reviewleft = '', reviewbottom = '' ,reviewtop ='' ,reviewright = ''
                        if ( hscroll_common.read) {
                            let review_count = hscroll_common.read
                            reviewcolor = review_count.style.textColor || ''
                            reviewfont = review_count.style.textSize || ''
                            reviewfamilyName = review_count.style.familyName || ''
                            reviewandroid_familyName = review_count.style.androidFamilyName || ''
                        }

                        //播放时间
                        let durationcolor = '',durationfont = '',durationfamilyName = '',durationandroidFamilyName = '',durationleft = 0,durationtop = 0, durationright = 0 ,durationbottom = 0
                        if ( hscroll_common.videoDuration) {
                            durationcolor = hscroll_common.videoDuration.style.textColor || ''
                            durationfont = hscroll_common.videoDuration.style.textSize || ''
                            durationfamilyName = hscroll_common.videoDuration.style.familyName || ''
                            durationandroidFamilyName = hscroll_common.videoDuration.style.androidFamilyName || ''
                        }
                        
                        let new_object = { 
                            //整体高度
                            cell_height:cell_height,
                            //整体边距
                            margin_entirety:margin_entirety,
                            //分割线类型
                            mpid:mpid,
                            //图片
                            imgradius:imgradius,
                            imgwidth:imgwidth,
                            imgheight:imgheight,
                            //标题
                            color:color,
                            font:font,
                            familyName:familyName,
                            android_familyName:android_familyName,
                            //标题阴影
                            shadow_top_Color:shadow_top_Color,
                            shadow_top_opacity:shadow_top_opacity,
                            shadow_bottom_Color:shadow_bottom_Color,
                            shadow_bottom_opacity:shadow_bottom_opacity,
                            //时间
                            timecolor:timecolor,
                            timefont:timefont,
                            timefamilyName:timefamilyName,
                            timeandroid_familyName:timeandroid_familyName,
                            //标签
                            tagcolor:tagcolor,
                            tagfont:tagfont,
                            tagfamilyName:tagfamilyName,
                            tagandroid_familyName:tagandroid_familyName,
                            //阅读量
                            reviewcolor:reviewcolor,
                            reviewfont:reviewfont,
                            reviewfamilyName:reviewfamilyName,
                            reviewandroid_familyName:reviewandroid_familyName,
                            //播放时间
                            durationcolor:durationcolor,
                            durationfont:durationfont,
                            durationfamilyName:durationfamilyName,
                            durationandroidFamilyName:durationandroidFamilyName,

                        } 
                        self.$emit('edit_json_hsc','',new_object,which_one )
                    }

                })  
                
            },
            //编辑json后，响应的数据
            edit_json_reponse( val_){
                let self = this
                //防止其他模块修改影响到本模块
                if ( val_.name.indexOf('hsc') < 0 || 
                    (val_.difference == 'bigImage_1202'&& self.type_element != 'bigImage_1202') || 
                    (val_.difference == 'bigImage_1201'&& self.type_element != 'bigImage_1201') || 
                    (val_.difference == 'bigImage_1203'&& self.type_element != 'bigImage_1203') || 
                    (val_.difference == 'bigImage_1204'&& self.type_element != 'bigImage_1204') 
                ) 
                    return

                let hscroll_common = self.remote_data[0]
                //整体内嵌
                if ( val_.name.indexOf('hsc.entirety') > -1 ) {
                    let margin_arr_ = hscroll_common.margin.split(',')
                    margin_arr_[0] = '2'
                    hscroll_common.margin = margin_arr_[0] +','+val_.data
                }
                //整体高度
                else if ( val_.name.indexOf('hsc.cell_height') > -1) {
                    hscroll_common.height =  val_.data
                }
                //分割线类型
                else if ( val_.name.indexOf('hsc.underline') > -1 ) {
                    let margin_arr_ = hscroll_common.margin.split(',')
                    margin_arr_[0] = val_.data.select
                    hscroll_common.margin = margin_arr_.join(',')
                }
                //图片文字边距
                else if ( val_.name.indexOf('hsc.imgtext_margin_entirety') > -1 ) {
                    let margin_arr_ = hscroll_common.itemMargin.split(',')
                    margin_arr_[0] = '2'
                    hscroll_common.itemMargin = margin_arr_[0] +','+val_.data
                }else if ( val_.name.indexOf('hsc.imgtext_width') > -1 ) {
                    hscroll_common.itemWidth = val_.data
                }
                //图片
                else if ( val_.name.indexOf('hsc.img.width') > -1 || val_.name.indexOf('hsc.img.height') > -1 ) {
                    if ( hscroll_common.img && hscroll_common.img.child) {
                        let size = hscroll_common.img.child.size ? hscroll_common.img.child.size.split(',') :['','']
                        val_.name.indexOf('hsc.img.width') > -1 ? size[0] = val_.data : size[1] = val_.data
                        hscroll_common.img.child.size = size.join(',')
                    }
                }else if ( val_.name.indexOf('hsc.img.radius') > -1) {
                    if ( hscroll_common.img && hscroll_common.img.child) {
                        hscroll_common.img.child.radius = val_.data
                    }
                }
                //标题阴影
                else if ( val_.name.indexOf('hsc.shadow_top_Color') > -1) {
                    if ( hscroll_common.view && hscroll_common.view.style) {
                        hscroll_common.view.style.shadowColor_top = val_.data
                        let topcolor_origin = hscroll_common.view.style.shadowColor_top_origin || ''
                        if ( topcolor_origin) {
                            let prefix = topcolor_origin.slice(0,3)
                            prefix += val_.data.slice(1)
                            hscroll_common.view.style.shadowColor_top_origin = prefix
                        }
                    }
                }else if ( val_.name.indexOf('hsc.shadow_top_opacity') > -1) {
                    if ( hscroll_common.view && hscroll_common.view.style) {
                        hscroll_common.view.style.shadowColor_top_opacity = val_.data
                        var topcolor_origin = hscroll_common.view.style.shadowColor_top_origin || ''

                        if ( topcolor_origin) {
                            let op_ = Math.floor( parseFloat( val_.data)*255)
                            op_ =op_.toString(16).toUpperCase()
                            let suffix = topcolor_origin.slice(3)
                            op_.length == 1 ? op_ = '0'+op_ : null
                            hscroll_common.view.style.shadowColor_top_origin = '#'+op_+suffix
                        }
                    }
                }else if ( val_.name.indexOf('hsc.shadow_bottom_Color') > -1) {
                    if ( hscroll_common.view && hscroll_common.view.style) {
                        hscroll_common.view.style.shadowColor_bottom = val_.data
                        let bottomcolor_origin = hscroll_common.view.style.shadowColor_bottom_origin || ''
                        if ( bottomcolor_origin) {
                            let prefix = bottomcolor_origin.slice(0,3)
                            prefix += val_.data.slice(1)
                            hscroll_common.view.style.shadowColor_bottom_origin = prefix
                        }
                    }
                }else if ( val_.name.indexOf('hsc.shadow_bottom_opacity') > -1) {
                    if ( hscroll_common.view && hscroll_common.view.style) {
                        hscroll_common.view.style.shadowColor_bottom_opacity = val_.data
                        var bottomcolor_origin = hscroll_common.view.style.shadowColor_bottom_origin || ''

                        if ( bottomcolor_origin) {
                            let op_ = Math.floor( parseFloat( val_.data)*255)
                            op_ =op_.toString(16).toUpperCase()
                            let suffix = bottomcolor_origin.slice(3)
                            op_.length == 1 ? op_ = '0'+op_ : null
                            hscroll_common.view.style.shadowColor_bottom_origin = '#'+op_+suffix
                        }
                    }
                }
                //标题
                else if ( val_.name.indexOf('hsc.title.color') > -1) {
                    if ( hscroll_common.title && hscroll_common.title.style) {
                        hscroll_common.title.style.textColor = val_.data
                    }
                }else if ( val_.name.indexOf('hsc.title.font') > -1) {
                    if ( hscroll_common.title && hscroll_common.title.style) {
                        hscroll_common.title.style.textSize = val_.data
                    }
                }else if ( val_.name.indexOf('hsc.title.familyName') > -1) {
                    if ( hscroll_common.title && hscroll_common.title.style) {
                        hscroll_common.title.style.familyName = val_.data
                    }
                }else if ( val_.name.indexOf('hsc.title.androidfamilyName') > -1) {
                    if ( hscroll_common.title && hscroll_common.title.style) {
                        hscroll_common.title.style.androidFamilyName = val_.data
                    }
                }
                //标签
                else if ( val_.name.indexOf('hsc.tag.color') > -1) {
                    if ( hscroll_common.tag && hscroll_common.tag.style) {
                        hscroll_common.tag.style.textColor = val_.data
                    }
                }else if ( val_.name.indexOf('hsc.tag.font') > -1) {
                    if ( hscroll_common.tag && hscroll_common.tag.style) {
                        hscroll_common.tag.style.textSize = val_.data
                    }
                }else if ( val_.name.indexOf('hsc.tag.familyName') > -1) {
                    if ( hscroll_common.tag && hscroll_common.tag.style) {
                        hscroll_common.tag.style.familyName = val_.data
                    }
                }else if ( val_.name.indexOf('hsc.tag.androidfamilyName') > -1) {
                    if ( hscroll_common.tag && hscroll_common.tag.style) {
                        hscroll_common.tag.style.androidFamilyName = val_.data
                    }
                }
                //时间
                else if ( val_.name.indexOf('hsc.time.color') > -1) {
                    if ( hscroll_common.time && hscroll_common.time.style) {
                        hscroll_common.time.style.textColor = val_.data
                    }
                }else if ( val_.name.indexOf('hsc.time.font') > -1) {
                    if ( hscroll_common.time && hscroll_common.time.style) {
                        hscroll_common.time.style.textSize = val_.data
                    }
                }else if ( val_.name.indexOf('hsc.time.familyName') > -1) {
                    if ( hscroll_common.time && hscroll_common.time.style) {
                        hscroll_common.time.style.familyName = val_.data
                    }
                }else if ( val_.name.indexOf('hsc.time.androidfamilyName') > -1) {
                    if ( hscroll_common.time && hscroll_common.time.style) {
                        hscroll_common.time.style.androidFamilyName = val_.data
                    }
                }else if ( val_.name.indexOf('hsc.time.left') > -1) {
                    if ( hscroll_common.time && hscroll_common.time.style) {
                        let left = hscroll_common.time.layout.left 
                        let left_arr = left.split(',') 
                        left_arr[1] = val_.data ; !left_arr[0] ? left_arr[0] = ' ' : null
                        hscroll_common.time.layout.left = left_arr.join(',')
                    }
                }else if ( val_.name.indexOf('hsc.time.top') > -1) {
                    if ( hscroll_common.time && hscroll_common.time.style) {
                        let top = hscroll_common.time.layout.top 
                        let top_arr = top.split(','); !top_arr[0] ? top_arr[0] = ' ' : null
                        top_arr[1] = val_.data
                        hscroll_common.time.layout.top = top_arr.join(',')
                    }
                }else if ( val_.name.indexOf('hsc.time.bottom') > -1) {
                    if ( hscroll_common.time && hscroll_common.time.style) {
                        let bottom = hscroll_common.time.layout.bottom 
                        let bottom_arr = bottom.split(','); !bottom_arr[0] ? bottom_arr[0] = ' ' : null
                        bottom_arr[1] = val_.data
                        hscroll_common.time.layout.bottom = bottom_arr.join(',')
                    }
                }else if ( val_.name.indexOf('hsc.time.right') > -1) {
                    if ( hscroll_common.time && hscroll_common.time.style) {
                        let right = hscroll_common.time.layout.right 
                        let right_arr = right.split(','); !right_arr[0] ? right_arr[0] = ' ' : null
                        right_arr[1] = val_.data
                        hscroll_common.time.layout.right = right_arr.join(',')
                    }
                }
                //阅读量
                else if ( val_.name.indexOf('hsc.review.color') > -1) {
                    if ( hscroll_common.read && hscroll_common.read.style) {
                        hscroll_common.read.style.textColor = val_.data
                    }
                }else if ( val_.name.indexOf('hsc.review.font') > -1) {
                    if ( hscroll_common.read && hscroll_common.read.style) {
                        hscroll_common.read.style.textSize = val_.data
                    }
                }else if ( val_.name.indexOf('hsc.review.familyName') > -1) {
                    if ( hscroll_common.read && hscroll_common.read.style) {
                        hscroll_common.read.style.familyName = val_.data
                    }
                }else if ( val_.name.indexOf('hsc.review.androidfamilyName') > -1) {
                    if ( hscroll_common.read && hscroll_common.read.style) {
                        hscroll_common.read.style.androidFamilyName = val_.data
                    }
                }else if ( val_.name.indexOf('hsc.review.left') > -1) {
                    if ( hscroll_common.read && hscroll_common.read.style) {
                        let left = hscroll_common.read.layout.left 
                        let left_arr = left.split(',') 
                        left_arr[1] = val_.data ; !left_arr[0] ? left_arr[0] = ' ' : null
                        hscroll_common.read.layout.left = left_arr.join(',')
                    }
                }else if ( val_.name.indexOf('hsc.review.top') > -1) {
                    if ( hscroll_common.read && hscroll_common.read.style) {
                        let top = hscroll_common.read.layout.top 
                        let top_arr = top.split(','); !top_arr[0] ? top_arr[0] = ' ' : null
                        top_arr[1] = val_.data
                        hscroll_common.read.layout.top = top_arr.join(',')
                    }
                }else if ( val_.name.indexOf('hsc.review.bottom') > -1) {
                    if ( hscroll_common.read && hscroll_common.read.style) {
                        let bottom = hscroll_common.read.layout.bottom 
                        let bottom_arr = bottom.split(','); !bottom_arr[0] ? bottom_arr[0] = ' ' : null
                        bottom_arr[1] = val_.data
                        hscroll_common.read.layout.bottom = bottom_arr.join(',')
                    }
                }else if ( val_.name.indexOf('hsc.review.right') > -1) {
                    if ( hscroll_common.read && hscroll_common.read.style) {
                        let right = hscroll_common.read.layout.right 
                        let right_arr = right.split(','); !right_arr[0] ? right_arr[0] = ' ' : null
                        right_arr[1] = val_.data
                        hscroll_common.read.layout.right = right_arr.join(',')
                    }
                }
                //播放时间
                else if ( val_.name.indexOf('hsc.duration.color') > -1) {
                    if ( hscroll_common.videoDuration && hscroll_common.videoDuration.style) {
                        hscroll_common.videoDuration.style.textColor = val_.data
                    }
                }else if ( val_.name.indexOf('hsc.duration.font') > -1) {
                    if ( hscroll_common.videoDuration && hscroll_common.videoDuration.style) {
                        hscroll_common.videoDuration.style.textSize = val_.data
                    }
                }else if ( val_.name.indexOf('hsc.duration.familyName') > -1) {
                    if ( hscroll_common.videoDuration && hscroll_common.videoDuration.style) {
                        hscroll_common.videoDuration.style.familyName = val_.data
                    }
                }else if ( val_.name.indexOf('hsc.duration.androidfamilyName') > -1) {
                    if ( hscroll_common.videoDuration && hscroll_common.videoDuration.style) {
                        hscroll_common.videoDuration.style.androidFamilyName = val_.data
                    }
                }
               
                self.setLayout( self.remote_data)
                let new_object = JSON.parse( JSON.stringify( self.remote_data))
                self.convertToClent( new_object)

                val_.difference == 'bigImage_1202' ? new_object[0].view.style.shadowColor = new_object[0].view.style.shadowColor_top+','+new_object[0].view.style.shadowColor_bottom : null

                let pt__ = val_.difference.split('_')[1]
                $.edit_json_remote_post('newsList','scrollComponent',pt__,new_object)
                
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
                    ){
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
            hexToRgb(hexstr,opacity){
                hexstr = hexstr || '#fff' ; opacity = opacity || 1
                var sColor = hexstr.toLowerCase();
                var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
                if (sColor && reg.test(sColor)) {
                    if (sColor.length === 4) {
                        var sColorNew = "#";
                        for (var i=1; i<4; i+=1) {
                            sColorNew += sColor.slice(i, i+1).concat(sColor.slice(i, i+1));    
                        }
                        sColor = sColorNew;
                    }
                    var sColorChange = [];
                    for (var i=1; i<7; i+=2) {
                        sColorChange.push(parseInt("0x"+sColor.slice(i, i+2)));    
                    }
                    opacity ? sColorChange.push(opacity) : null
                    return "RGB(" + sColorChange.join(",") + ")";
                }
                return sColor;
            },
            //将获取的数据再次渲染
            getDataRedraw(){
                let self = this
                if ( $.allowMachine == 1) {
                    let $bli = $('.hori-content'+self.getRandomClassName()+'.copy' )
                    setTimeout(function() {
                        if ( $bli.data('contentData')&& $bli.data('refresData') ) {
                            $bli.data('refresData',false)
                            let c_ = JSON.parse( $bli.data('contentData')),
                            j_ = ''
                            if ( self.type_element == 'bigImage_1201') {
                                j_ = c_['1201']
                            }else if ( self.type_element == 'bigImage_1202') {
                                j_ = c_['1202']
                            }else if ( self.type_element == 'bigImage_1204') {
                                j_ = c_['1204']
                            }
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
                $bli = $('.hori-content'+self.getRandomClassName()+'.copy' ),
                get_duration = ( duration)=>{
                    let time = parseFloat(duration)/1000
                    if (time > 60 && time < 60 * 60) {
                        let minute = parseInt(time / 60.0),
                        sencond = parseInt((parseFloat(time / 60.0) - parseInt(time / 60.0)) * 60)
                        time = ((minute+'').length < 2 ? minute = '0'+minute : minute) + ":" + ((sencond+'').length < 2 ? sencond = '0'+sencond : sencond) 
                    }else if (time >= 60 * 60 ) {
                        let hour = parseInt(time / 3600.0),
                        minute = parseInt((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60),
                        sencond = parseInt((parseFloat((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60) - parseInt((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60)) * 60)
                        time = ((hour+'').length < 2 ? hour = '0'+hour : hour) + ":" + ((minute+'').length < 2 ? minute = '0'+minute : minute) + ":" + ((sencond+'').length < 2 ? sencond = '0'+sencond : sencond) 
                    }else{
                        time = (time+'').length < 2 ? '00:0'+time : '00:'+time
                    }
                    return time
                }

                $.each($bli,(i)=>{
                    let baseData = JSON.parse( $bli.eq(i).data('baseData')),
                    $if = $bli.eq(i).find('.img-father').eq(0),
                    $it = $if.find('.img-text').eq(0)
                    $if.empty()
                    baseData.items.forEach( (item,n)=>{
                        let tagContent = item.tags+' '+item.source,
                        $it_copy= $it.clone(),
                        $img = $it_copy.find('.image').eq(0),
                        $title = $it_copy.find('.title').eq(0),
                        $read = $it_copy.find('.count').eq(0),
                        $time = $it_copy.find('.time').eq(0),
                        $tag = $it_copy.find('.tag').eq(0),
                        $durationPackage = $it_copy.find('.duration-package').eq(0),
                        $duration = $it_copy.find('.duration-text').eq(0)

                        $img.css('backgroundImage','url('+(item.cover && item.cover[0]['path'] || '')+')')
                        $title.text( item.title)
                        $read.text( item.viewBaseNum)
                        $time.text( self.getTimeFormatter(item.createdAt*1000))
                        $tag.text( tagContent)
                        if ( item.duration == 0) {
                            $durationPackage.css('display','none')
                        }else{
                            $durationPackage.css('display','inline-block')
                            $duration.text( get_duration(item.duration))
                        }
                        
                        $it_copy.data('concrete_data',item)
                        $if.append( $it_copy)
                    })
                    $if.find('.img-text').off('click').on('click',function(){
                        $.click_news_into_particular( $(this).data('concrete_data'))
                    })

                })
                $bli.find('.logo-status').css('display','none')
                $bli.css('display','block')
            },
            //时间戳--获取时间格式
            getTimeFormatter( date_ ){
                let date = new Date( date_ )
                let M = date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1
                let D = date.getDate() < 10 ? '0'+date.getDate() : date.getDate()
                let H = date.getHours() < 10 ? '0'+date.getHours() : date.getHours()
                let m = date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes()
                let S = date.getSeconds() < 10 ? '0'+date.getSeconds() : date.getSeconds()
                return date.getFullYear()+'-'+M+'-'+D
                // return date.getFullYear()+'-'+M+'-'+D+' '+H+':'+m+':'+S
            },
            getRandomClassName(){
                let self = this
                return '.'+self.randomMark
            },

            getlocalData(){
                return {
                    "mainImage":{
                        "imgUrl":'',
                        "imgUrlArr":[
                            'http://img01.cztv.com/202010/09/55e4408e17ba0209ba11155a3a087cfe.jpg',
                            'http://img01.cztv.com/202009/09/4ae286c719c06bd620321b1505205289.jpg',
                            'http://img01.cztv.com/201803/26/b0f702daa21587aaa67bfd37f4946575.jpg'
                        ],
                        "common":{
                            "border": {
                                "borderColor": "#fff", 
                                "borderWidth": 0, 
                                "borderRadius": 3 
                            },
                            "size":{
                                "width":200,
                                "height":128
                            },
                        }
                    },
                    "shadowColor": {
                        "bgColorTop": "#000000",
                        "bgAlphaTop":'1.0',
                        "bgColorBottom": "#000000",
                        "bgAlphaBottom":'1.0'
                    },
                    "title":{
                        "textContent":'',
                        "textContentArr":['秋季养生重养肺 应季水果可多吃点','发现“心灵的感冒”','Cabbeen 2018时装发布会'],
                        "textContent_style":'none',
                        "color":{
                            "textColor":"#000000"
                        },
                        "text":{
                            "textAlignment":0,
                            "font":15,
                            "familyName":"",
                        },
                    },
                    "tag":{
                        "textContent":'',
                        "textContentArr":['热点','推荐','爆料'],
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
                    "time":{
                        "textContent":'',
                        "textContentArr":['09:30','20分钟前','1-18'],
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
                    "reviews":{
                        "textContent":'',
                        "textContentArr":['12223','19111','25178'],
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
                    "durationImg":{
                        "imgUrl":'http://shixiantest.oss-cn-hangzhou.aliyuncs.com/48/posts/2020/11/14/5079f54ff56fe7ca5656ac2a57191ad5.png',
                        "imgFill":'cover',
                        "common":{
                            "border": {
                                "borderColor": "#fff", 
                                "borderWidth": 0, 
                                "borderRadius": 0 
                            },
                            "size":{
                                "width":11,
                                "height":11
                            },
                        }
                    },
                    "duration":{
                        "textContent":'08:30',
                        "textContent_style":'none',
                        "color":{
                            "textColor":"#ffffff"
                        },
                        "text":{
                            "textAlignment":1,
                            "font":13,
                            "familyName":"",
                        },
                    },
                    "line":{
                        "color":{
                            "bgColor":"#eee"
                        },
                        "common":{
                            "size":{
                                "height":2
                            },
                        }
                    }
                }
            },

            /**
            ********************************************************************************
            */

        }
    }
</script>

<style scoped lang="less">
    @import '../../publicStyle';
    @contentbg:#fff;
    .hori-content{
        // width: 100%;
        position: relative;
        overflow: scroll hidden;
        background-color: @contentbg;
        .img-father{
            white-space: nowrap;
            .img-text{
                display: inline-block;
                position: relative;
                text-align: center;
                vertical-align: middle;
                margin-right: 10px;
                .image{
                    display: inline-block;
                }
                .title-package{
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    .title{
                        min-height: 32px;
                        padding:0 10px;
                    }
                    .other-tag{
                        width: 100%;
                        .time{
                            float: left;
                            margin-left: 5px;
                        }
                        .tag{
                            float: left;
                        }
                        .reviews{
                            float: right;
                            .img{
                                display: inline-block;
                                width: 13px;
                                height: 13px;
                                img{
                                    width: 100%;
                                    vertical-align: top;
                                }
                                .iblock {
                                    display:inline-block;
                                    height:100%;
                                    width:0;
                                    vertical-align:middle
                                }
                            }
                        }
                    }
                }
                .image-package{
                    position: relative;
                    .duration-package{
                        position: absolute;
                        left: 10px;
                        bottom: 10px;
                        background-color: rgba(0,0,0,0.6);
                        font-size: 0;
                        padding: 2px 6px;
                        .duration-img{
                            display: inline-block;
                            vertical-align: middle;
                            margin-right: 5px;
                        }
                        .duration-text{
                            vertical-align: middle;
                        }
                    }
                }
                .title-package-reverse{
                    position: relative;
                    padding: 0px;
                }
            }
        }
        .line{
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
        }
        
    }

</style>
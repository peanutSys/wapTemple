<template>
    <div :class='"big-image "+randomMark' @click.stop='edit_json_style("1")'>
        <!-- 顶部标题 -->
        <div class="title-package 0" v-if = 'type_number !=0 && type_number !=1 && type_number !=3 && type_number !=4 && type_number !=5 && type_number !=6 && type_number !=10 && type_number !=12 '>
            <LabelLayout class='title' :layout_data='local_data.title' ></LabelLayout>
        </div>

        <!-- 中间图片部分 -->
        <div class="img-father" >
            <ImageLayout class='image':layout_data='local_data.mainImage'></ImageLayout>

            <!-- 有图片的状态-->
            <div class="logo-status-takePart first" v-if='type_number !=0 && type_number !=4 && type_number !=5 && type_number !=10 && type_number !=11 && type_number !=12 '>
                <div class="logo-status">
                    <ImageLayout class='logo':layout_data='local_data.mainImage ? local_data.mainImage.logo :"" '></ImageLayout>
                    <LabelLayout class='status' :layout_data='local_data.mainImage ? local_data.mainImage.status :"" ' ></LabelLayout>
                </div>
                
                <LabelLayout class='takePart' :layout_data='local_data.mainImage ? local_data.mainImage.takePart :"" ' ></LabelLayout>
            </div>
            <!-- 无图片的状态-->
            <div class="logo-status-takePart sencond" v-if=' type_number == 5 '>
                <div style="display: inline-block;" >
                    <LabelLayout class='status' :layout_data='local_data.status'></LabelLayout>
                </div>
                <div style="display: inline-block;" >
                    <LabelLayout class='time' :layout_data='function() {
                        if ( !local_data.time) 
                            return
                        local_data.time.textContent = "2018.7.18-2018.8.20"
                        return local_data.time
                    }()'></LabelLayout> 
                </div>
            </div>
            <!-- 标题在图片内(图片底部) -->
            <div class="img-bottom-title" v-if = 'type_number == 3 || type_number == 5 || type_number == 6 || type_number == 10 '>
                <LabelLayout class='title' :layout_data='local_data.title' ></LabelLayout>
            </div>
        </div>

        <!-- 底部标题 -->
        <div class="title-package 1" v-if = 'type_number !=0 && type_number !=2 && type_number !=3 && type_number !=5 && type_number !=6 && type_number !=10 && type_number !=11 '>
            <LabelLayout class='title' :layout_data='local_data.title' ></LabelLayout>
        </div>

        <div class="text-father" v-if = 'type_number !=0 && type_number !=5 && type_number !=6 '>

            <!-- 标签和时间 -->
            <div class="text-tag-time" v-if = 'type_number !=12 '>
                <div style="display: inline-block;" v-if = 'type_number !=4 '>
                    <LabelLayout class='tag' :layout_data='local_data.tag'></LabelLayout>
                </div>
                <div style="display: inline-block;" >
                    <LabelLayout class='time' :layout_data='local_data.time'></LabelLayout> 
                </div>
            </div>

            <!-- 简介 -->
            <LabelLayout 
                v-if = 'type_number !=1 && type_number !=2 && type_number !=3 && type_number !=4 && type_number !=10 && type_number !=11' 
                class='intro' 
                :layout_data='local_data.intro' 
                > 
            </LabelLayout>

            <!-- 阅读量和分享 -->
            <div class="read-btn" >
                <div class="like-package" v-if = 'type_number !=1 && type_number !=2 && type_number !=3 && type_number !=4 '>
                    <ImageLayout class='like-img':layout_data='local_data.likeImg'></ImageLayout>
                    <LabelLayout class='like-text' :layout_data='local_data.like'></LabelLayout>
                </div>
                <div class="share-package" v-if = 'type_number !=1 && type_number !=2 && type_number !=3 && type_number !=4 '>
                    <ImageLayout class='share':layout_data='local_data.shareImg'></ImageLayout>
                </div>
                <div class="read-package" v-if = 'type_number !=4 && type_number !=12'>
                    <!-- <ImageLayout class='read-img':layout_data='local_data.readImg'></ImageLayout> -->
                    <LabelLayout class='read-text' :layout_data='local_data.read'></LabelLayout>
                </div> 
                <div class="apply-package" v-if = 'type_number ==4 '>
                    <LabelLayout class='apply-text' :layout_data='local_data.apply'></LabelLayout>
                </div>
            </div>
        </div>
        <ViewLayout class='line' :layout_data='local_data.line'></ViewLayout>
    </div>
</template>

<script type="text/javascript">
    import LabelLayout from '../../../basicsModule/labelLayout';
    import ButtonLayout from '../../../basicsModule/buttonLayout';
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
                type_number:'',
            }
        },
        watch:{
            bpicData:function (newVal,oldVal ) {
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

            let bpic_data_
            if ( self.type_element == 'bigImage_200') {
                bpic_data_ = self._props.bpicData['200']
                self.type_number = 0
            }else if ( self.type_element == 'bigImage_201') {
                bpic_data_ = self._props.bpicData['201']
                self.type_number = 1
            }else if ( self.type_element == 'bigImage_202') {
                bpic_data_ = self._props.bpicData['202']
                self.type_number = 2
            }else if ( self.type_element == 'bigImage_203') {
                bpic_data_ = self._props.bpicData['203']
                self.type_number = 3
            }else if ( self.type_element == 'bigImage_204') {
                bpic_data_ = self._props.bpicData['204']
                self.type_number = 4
            }else if ( self.type_element == 'bigImage_205') {
                bpic_data_ = self._props.bpicData['205']
                self.type_number = 5
            }else if ( self.type_element == 'bigImage_206') {
                bpic_data_ = self._props.bpicData['206']
                self.type_number = 6
            }else if ( self.type_element == 'bigImage_210') {
                bpic_data_ = self._props.bpicData['210']
                self.type_number = 10
            }else if ( self.type_element == 'bigImage_211') {
                bpic_data_ = self._props.bpicData['211']
                self.type_number = 11
            }else if ( self.type_element == 'bigImage_212') {
                bpic_data_ = self._props.bpicData['212']
                self.type_number = 12
            }
            !bpic_data_ ? bpic_data_ = '' : null

            self.convertSpecialToNormal( bpic_data_,'shadowColor')
            self.convertToWeb( bpic_data_)
            self.setLayout( bpic_data_)
            self.getDataRedraw()
            self.$emit('edit_json_bpic',function( val_){
                self.edit_json_reponse( val_)
            },'','') 
        },
        props: ['bpicData','typeids'],
        components:{
            LabelLayout,
            ButtonLayout,
            ImageLayout,
            ViewLayout,
        },
        methods:{
            setLayout( bpic_){
                let self = this
                if ( !bpic_) 
                    return
                let local_style_data = self.getlocalData()
                let mi_ = $('.big-image'+self.getRandomClassName() )

                //整体高度
                let cell_height = -1
                {
                    cell_height = bpic_.height
                }

                //设置边距
                let padding_ = '';let padding_left = 0 ; let padding_right = 0 
                {
                    if ( bpic_.margin) {
                        let margin_arr_ = bpic_.margin.split(',')
                        if ( margin_arr_.length > 4) {
                            //始终是设置内边距
                            margin_arr_[0] = '2'
                            margin_arr_.shift() //删除第一个标识符
                        }
                        margin_arr_.forEach( (item,i)=>{
                            padding_+=item+'px '
                            i == 1 ? padding_left = parseFloat(item) : null
                            i == 3 ? padding_right = parseFloat(item) : null
                        })
                        
                    }
                }
                //设置图片
                let img_width = 0, img_top=0, img_left = 0
                if ( bpic_.img) {
                    let main_image = local_style_data.mainImage
                    let size =bpic_.img.child.size.split(',')
                    let img_right = 0
                    if ( bpic_.img.layout) {
                        if ( bpic_.img.layout.left) {
                            let img_left_arr = bpic_.img.layout.left.split(',')
                            img_left = img_left_arr[1]
                        }
                        if ( bpic_.img.layout.right) {
                            let img_right_arr = bpic_.img.layout.right.split(',')
                            img_right = img_right_arr[1]
                        }
                        if ( bpic_.img.layout.top) {
                            let img_top_arr = bpic_.img.layout.top.split(',')
                            img_top = img_top_arr[1]
                        }
                    }
                    

                    img_width = main_image.common.size.width = (self.pageWidth - padding_left - padding_right -img_left - img_right )

                    size[1] ? main_image.common.size.height = size[1] :null
                    main_image.common.border.borderRadius = bpic_.img.child.radius
                    local_style_data.mainImage = main_image
                }
                //设置标题
                let title_left = 5,title_top = 0 
                if ( bpic_.title){
                    let title = local_style_data.title
                    title.color.textColor = bpic_.title.style.textColor
                    title.text.font = bpic_.title.style.textSize
                    title.text.familyName = bpic_.title.style.familyName
                    title.text.androidFamilyName = bpic_.title.style.androidFamilyName

                    if ( bpic_.title.layout) {
                        if ( bpic_.title.layout.left) {
                            let title_left_arr = bpic_.title.layout.left.split(',')
                            title_left = title_left_arr[1]
                        }
                        if ( bpic_.title.layout.top) {
                            let title_top_arr = bpic_.title.layout.top.split(',')
                            title_top = title_top_arr[1]
                        }
                    }
                }
                //标题阴影部分
                let shadow_color = {}
                if ( bpic_.view && bpic_.view.style ) {
                    let color_ = local_style_data.shadowColor
                    color_.bgColorTop = bpic_.view.style.shadowColor_top
                    color_.bgAlphaTop = bpic_.view.style.shadowColor_top_opacity

                    color_.bgColorBottom = bpic_.view.style.shadowColor_bottom
                    color_.bgAlphaBottom = bpic_.view.style.shadowColor_bottom_opacity
                    shadow_color = color_
                }
                //设置简介
                let intro_left = 0,intro_top = 0 
                if ( bpic_.intro){
                    let intro = local_style_data.intro
                    intro.color.textColor = bpic_.intro.style.textColor
                    intro.text.font = bpic_.intro.style.textSize
                    intro.text.familyName = bpic_.intro.style.familyName
                    intro.text.androidFamilyName = bpic_.intro.style.androidFamilyName
                    intro.common.isHidden = !bpic_.intro.style.visible

                    if ( bpic_.intro.layout) {
                        if ( bpic_.intro.layout.left) {
                            let intro_left_arr = bpic_.intro.layout.left.split(',')
                            intro_left = intro_left_arr[1]
                        }
                        if ( bpic_.intro.layout.top) {
                            let intro_top_arr = bpic_.intro.layout.top.split(',')
                            intro_top = intro_top_arr[1]
                        }
                    }
                    
                }
                //设置标签
                let tag_left = 0,tag_bottom = 0 ,tag_top = 0
                if ( bpic_.tag){
                    let tag = local_style_data.tag
                    tag.color.textColor = bpic_.tag.style.textColor
                    tag.text.font = bpic_.tag.style.textSize
                    tag.text.familyName = bpic_.tag.style.familyName
                    tag.common.border.borderColor = bpic_.tag.style.textColor

                    if ( bpic_.tag.layout) {
                        if ( bpic_.tag.layout.left) {
                            let tag_left_arr = bpic_.tag.layout.left.split(',')
                            tag_left = tag_left_arr[1]
                        }
                        if ( bpic_.tag.layout.bottom) {
                            let tag_bottom_arr = bpic_.tag.layout.bottom.split(',')
                            tag_bottom = tag_bottom_arr[1]
                        }
                        if ( bpic_.tag.layout.top) {
                            let tag_top_arr = bpic_.tag.layout.top.split(',')
                            tag_top = tag_top_arr[1]
                        }
                    }
                    
                }
                //时间
                let time_left = 0,time_top=0,time_bottom=0
                if ( bpic_.time){    
                    let time = local_style_data.time
                    time.color.textColor = bpic_.time.style.textColor
                    time.text.font = bpic_.time.style.textSize
                    time.text.familyName = bpic_.time.style.familyName

                    if ( bpic_.time.layout) {
                        if ( bpic_.time.layout.left) {
                            let time_left_arr = bpic_.time.layout.left.split(',')
                            time_left = time_left_arr[1]
                        }
                        if ( bpic_.time.layout.bottom) {
                            let time_bottom_arr = bpic_.time.layout.bottom.split(',')
                            time_bottom = time_bottom_arr[1]
                        }
                        if ( bpic_.time.layout.top) {
                            let time_top_arr = bpic_.time.layout.top.split(',')
                            time_top = time_top_arr[1]
                        }
                    }
                    
                }
                //点赞
                let like_right = 0,like_top = 0 ,like_bottom = 0
                if ( bpic_.like){
                    let like = local_style_data.like
                    like.color.textColor = bpic_.like.style.textColor
                    like.text.font = bpic_.like.style.textSize
                    like.text.familyName = bpic_.like.style.familyName

                    if ( bpic_.like.layout) {
                        if ( bpic_.like.layout.right) {
                            let like_right_arr = bpic_.like.layout.right.split(',')
                            like_right = like_right_arr[1]
                        }
                        if ( bpic_.like.layout.top) {
                            let like_top_arr = bpic_.like.layout.top.split(',')
                            like_top = like_top_arr[1]
                        }
                        if ( bpic_.like.layout.bottom) {
                            let like_bottom_arr = bpic_.like.layout.bottom.split(',')
                            like_bottom = like_bottom_arr[1]
                        }
                    }  
                }
                //设置阅读量
                let read_right = 0,read_top = 0 ,read_bottom = 0
                if ( bpic_.read){
                    let read = local_style_data.read
                    read.color.textColor = bpic_.read.style.textColor
                    read.text.font = bpic_.read.style.textSize
                    read.text.familyName = bpic_.read.style.familyName

                    if ( bpic_.read.layout) {
                        if ( bpic_.read.layout.right) {
                            let read_right_arr = bpic_.read.layout.right.split(',')
                            read_right = read_right_arr[1]
                        }
                        if ( bpic_.read.layout.top) {
                            let read_top_arr = bpic_.read.layout.top.split(',')
                            read_top = read_top_arr[1]
                        }
                        if ( bpic_.read.layout.bottom) {
                            let read_bottom_arr = bpic_.read.layout.bottom.split(',')
                            read_bottom = read_bottom_arr[1]
                        }
                    }  
                }
                //直播状态
                let status_bgColor = '',status_radius = 0
                if ( bpic_.status && bpic_.status.style && self.type_number != 5) {
                    local_style_data.mainImage.status.color.textColor = bpic_.status.style.textColor
                    local_style_data.mainImage.status.text.font = bpic_.status.style.textSize
                    local_style_data.mainImage.status.text.familyName = bpic_.status.style.familyName
                    local_style_data.mainImage.status.text.androidFamilyName = bpic_.status.style.androidFamilyName
                    local_style_data.mainImage.takePart.color.textColor = bpic_.status.style.textColor
                    local_style_data.mainImage.takePart.text.font = bpic_.status.style.textSize
                    status_bgColor = bpic_.status.style.bgColor || '#C21319'
                }
                //报名状态
                if ( bpic_.status && bpic_.status.style && self.type_number == 5) {
                    local_style_data.status.color.textColor = bpic_.status.style.textColor
                    local_style_data.status.text.font = bpic_.status.style.textSize
                    local_style_data.status.text.familyName = bpic_.status.style.familyName
                    local_style_data.status.text.androidFamilyName = bpic_.status.style.androidFamilyName
                    status_bgColor = bpic_.status.style.bgColor || '#C21319'
                }
                
                self.$nextTick( ()=>{
                    //设置内边距
                    mi_.css({
                        padding:padding_,
                        height:cell_height <0 ? 'auto' :cell_height+'px',
                    })

                    //设置图片边距
                    mi_.children('.img-father').css({
                        marginTop: img_top+'px',
                        marginLeft: img_left+'px',
                    })

                    //设置状态
                    mi_.find('.logo-status').css({
                        backgroundColor:status_bgColor,
                    })
                    
                    //设置标题外边距
                    mi_.find('.title').css({
                        margin: title_top+'px 0 0 '+title_left+'px'
                    })

                    //设置活动标题阴影
                    if ( self.type_number == 5 || self.type_number == 10 ) {
                        mi_.find('.img-bottom-title').css('background-image','linear-gradient('+self.hexToRgb(shadow_color.bgColorTop,shadow_color.bgAlphaTop)+','+ self.hexToRgb(shadow_color.bgColorBottom,shadow_color.bgAlphaBottom) +')')
                    }
                    
                    //设置简介外边距
                    mi_.find('.intro').css({
                        margin: intro_top+'px 0 0 '+intro_left+'px'
                    })

                    //设置阅读量布局
                    mi_.children('.text-father').children('.read-btn').css({
                        right:read_right+'px',
                        marginTop:read_top+'px',
                        marginBottom:read_bottom+'px',
                    })

                    //设置标签
                    mi_.children('.text-father').children('.text-tag-time').find('.tag').css({
                        margin:tag_top+'px '+'0 '+tag_bottom+'px ' +tag_left+'px'
                    })

                    //设置时间
                    mi_.children('.text-father').children('.text-tag-time').find('.time').css({
                        margin: time_top+'px '+'0 '+time_bottom+'px ' +time_left+'px'
                    })
                    
                    mi_.find('.line').css({
                        position:'absolute',
                        bottom:'0',
                        left:'0',
                        right:'0'
                    }) 
                })

                //持有外部json数据
                self.remote_data = bpic_
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
                let mi_ = $('.big-image'+self.getRandomClassName() )
                let which_one = self.type_element
                self.$nextTick( ()=>{
                    mi_.addClass('border-style-0').addClass('boder-color-animation')  
                    if ( id_ == '1') {
                        //整体高度
                        let cell_height = self.remote_data.height
                        //修改整体边距
                        let margin_arr_ = self.remote_data.margin.split(','),
                        mpid = ''
                        if ( margin_arr_.length > 4) {
                            mpid = margin_arr_.shift() //删除第一个标识符
                        }
                        let margin_new = margin_arr_.join(',')

                        //修改图片
                        let imgheight = 0 , imgleft = 0, imgtop = 0 , imgright = 0 , imgradius = 0
                        if ( self.remote_data.img) {
                            if (self.remote_data.img.child.size ) {
                                let size = self.remote_data.img.child.size.split(',')
                                imgheight = size[1] || 0
                            }

                            if ( self.remote_data.img.layout) {
                                if (self.remote_data.img.layout.left ) {
                                    let left = self.remote_data.img.layout.left.split(',')
                                    imgleft = left[1] || 0
                                }
                                if (self.remote_data.img.layout.top ) {
                                    let top = self.remote_data.img.layout.top.split(',')
                                    imgtop = top[1] || 0
                                }
                                if (self.remote_data.img.layout.right ) {
                                    let right = self.remote_data.img.layout.right.split(',')
                                    imgright = right[1] || 0
                                }
                            }
                            
                            imgradius = self.remote_data.img.child.radius
                        }

                        //修改标题
                        let titlecolor = '',titlefont = '',titlefamilyName = '',titleandroidFamilyName = '',titleleft = 0,titletop = 0
                        if ( self.remote_data.title) {
                            titlecolor = self.remote_data.title.style.textColor || ''
                            titlefont = self.remote_data.title.style.textSize || ''
                            titlefamilyName = self.remote_data.title.style.familyName || ''
                            titleandroidFamilyName = self.remote_data.title.style.androidFamilyName || ''
                            if ( self.remote_data.title.layout) {
                                if ( self.remote_data.title.layout.left) {
                                    let arr_split = self.remote_data.title.layout.left.split(',')
                                    titleleft = arr_split[1]
                                }
                                if ( self.remote_data.title.layout.top) {
                                    let arr_split = self.remote_data.title.layout.top.split(',')
                                    titletop = arr_split[1]
                                }
                            }
                        }

                        //标题活动阴影
                        let shadow_top_Color = '' , shadow_top_opacity = '' , shadow_bottom_Color = '', shadow_bottom_opacity = ''
                        if ( self.remote_data.view && self.remote_data.view.style) {
                            shadow_top_Color = self.remote_data.view.style.shadowColor_top
                            shadow_top_opacity = self.remote_data.view.style.shadowColor_top_opacity

                            shadow_bottom_Color = self.remote_data.view.style.shadowColor_bottom
                            shadow_bottom_opacity = self.remote_data.view.style.shadowColor_bottom_opacity
                        }
                    
                        //修改简介
                        let introcolor = '',introfont = '',introfamilyName = '',introandroidFamilyName = '',introleft = 0,introtop = 0
                        if ( self.remote_data.intro) {
                            introcolor = self.remote_data.intro.style.textColor || ''
                            introfont = self.remote_data.intro.style.textSize || ''
                            introfamilyName = self.remote_data.intro.style.familyName || ''
                            introandroidFamilyName = self.remote_data.intro.style.androidFamilyName || ''
                            if ( self.remote_data.intro.layout) {
                                if ( self.remote_data.intro.layout.left) {
                                    let arr_split = self.remote_data.intro.layout.left.split(',')
                                    introleft = arr_split[1]
                                }
                                if ( self.remote_data.intro.layout.top) {
                                    let arr_split = self.remote_data.intro.layout.top.split(',')
                                    introtop = arr_split[1]
                                }
                            }
                        }
                    
                        //修改标签                        
                        let tagcolor = '',tagfont = '',tagfamilyName = '',tagandroidFamilyName = '',tagleft = 0,tagtop = 0,tagbottom = 0
                        if ( self.remote_data.tag) {
                            tagcolor = self.remote_data.tag.style.textColor || ''
                            tagfont = self.remote_data.tag.style.textSize || ''
                            tagfamilyName = self.remote_data.tag.style.familyName || ''
                            tagandroidFamilyName = self.remote_data.tag.style.androidFamilyName || ''

                            if ( self.remote_data.tag.layout) {
                                if ( self.remote_data.tag.layout.left) {
                                    let arr_split = self.remote_data.tag.layout.left.split(',')
                                    tagleft = arr_split[1]
                                }
                                if ( self.remote_data.tag.layout.top) {
                                    let arr_split = self.remote_data.tag.layout.top.split(',')
                                    tagtop = arr_split[1]
                                }
                                if ( self.remote_data.tag.layout.bottom) {
                                    let arr_split = self.remote_data.tag.layout.bottom.split(',')
                                    tagbottom = arr_split[1]
                                }
                            }
                            
                        }
                        
                        //修改时间
                        let timecolor = '',timefont = '',timefamilyName = '',timeandroidFamilyName = '',timeleft = 0,timetop = 0,timebottom = 0
                        if ( self.remote_data.time) {
                            timecolor = self.remote_data.time.style.textColor || ''
                            timefont = self.remote_data.time.style.textSize || ''
                            timefamilyName = self.remote_data.time.style.familyName || ''
                            timeandroidFamilyName = self.remote_data.time.style.androidFamilyName || ''
                            if ( self.remote_data.time.layout) {
                                if ( self.remote_data.time.layout.left) {
                                    let arr_split = self.remote_data.time.layout.left.split(',')
                                    timeleft = arr_split[1]
                                }
                                if ( self.remote_data.time.layout.top) {
                                    let arr_split = self.remote_data.time.layout.top.split(',')
                                    timetop = arr_split[1]
                                }
                                if ( self.remote_data.time.layout.bottom) {
                                    let arr_split = self.remote_data.time.layout.bottom.split(',')
                                    timebottom = arr_split[1]
                                }
                            }
                            
                        }
                        
                        //修改阅读量
                        let readcolor = '',readfont = '',readfamilyName = '',readandroidFamilyName = '',readright = 0,readtop = 0,readbottom = 0
                        if ( self.remote_data.read) {
                            readcolor = self.remote_data.read.style.textColor || ''
                            readfont = self.remote_data.read.style.textSize || ''
                            readfamilyName = self.remote_data.read.style.familyName || ''
                            readandroidFamilyName = self.remote_data.read.style.androidFamilyName || ''

                            if ( self.remote_data.read.layout) {
                                if ( self.remote_data.read.layout.right) {
                                    let arr_split = self.remote_data.read.layout.right.split(',')
                                    readright = arr_split[1]
                                }
                                if ( self.remote_data.read.layout.top) {
                                    let arr_split = self.remote_data.read.layout.top.split(',')
                                    readtop = arr_split[1]
                                }
                                if ( self.remote_data.read.layout.bottom) {
                                    let arr_split = self.remote_data.read.layout.bottom.split(',')
                                    readbottom = arr_split[1]
                                }
                            } 
                        }
                        //点赞
                        let likecolor = '',likefont = '',likefamilyName = '',likeandroidFamilyName = '',likeright = 0,liketop = 0,likebottom = 0
                        if ( self.remote_data.like) {
                            likecolor = self.remote_data.like.style.textColor || ''
                            likefont = self.remote_data.like.style.textSize || ''
                            likefamilyName = self.remote_data.like.style.familyName || ''
                            likeandroidFamilyName = self.remote_data.like.style.androidFamilyName || ''

                            if ( self.remote_data.like.layout) {
                                if ( self.remote_data.like.layout.right) {
                                    let arr_split = self.remote_data.like.layout.right.split(',')
                                    likeright = arr_split[1]
                                }
                                if ( self.remote_data.like.layout.top) {
                                    let arr_split = self.remote_data.like.layout.top.split(',')
                                    liketop = arr_split[1]
                                }
                                if ( self.remote_data.like.layout.bottom) {
                                    let arr_split = self.remote_data.like.layout.bottom.split(',')
                                    likebottom = arr_split[1]
                                }
                            } 
                        }

                        //状态
                        let statuscolor = '',statusfont = '',statusfamilyName = '',statusandroidfamilyName = '',statusbgColor = '',statusradius = ''
                        if ( self.remote_data.status) {
                            statuscolor = self.remote_data.status.style.textColor || ''
                            statusfont = self.remote_data.status.style.textSize || ''
                            statusfamilyName = self.remote_data.status.style.familyName || ''
                            statusandroidfamilyName = self.remote_data.status.style.androidFamilyName || ''
                            statusbgColor = self.remote_data.status.style.bgColor
                            statusradius = self.remote_data.status.style.radius
                        }
                        
                        let newObject = {
                            //整体边距
                            margin_new:margin_new,
                            //整体高度
                            cell_height:cell_height,
                            //分割线类型
                            mpid:mpid,
                            //图片
                            imgheight:imgheight,
                            imgleft:imgleft,
                            imgtop:imgtop,
                            imgright:imgright,
                            imgradius:imgradius,
                            //标题
                            titlecolor:titlecolor,
                            titlefont:titlefont,
                            titlefamilyName:titlefamilyName,
                            titleandroidFamilyName:titleandroidFamilyName,
                            titleleft:titleleft,
                            titletop:titletop,
                            //活动标题阴影
                            shadow_top_Color:shadow_top_Color,
                            shadow_top_opacity:shadow_top_opacity,
                            shadow_bottom_Color:shadow_bottom_Color,
                            shadow_bottom_opacity:shadow_bottom_opacity,
                            //简介
                            introcolor:introcolor,
                            introfont:introfont,
                            introfamilyName:introfamilyName,
                            introandroidFamilyName:introandroidFamilyName,
                            introleft:introleft,
                            introtop:introtop,
                            //标签
                            tagcolor:tagcolor,
                            tagfont:tagfont,
                            tagfamilyName:tagfamilyName,
                            tagandroidFamilyName:tagandroidFamilyName,
                            tagleft:tagleft,
                            tagtop:tagtop,
                            tagbottom:tagbottom,
                            //时间
                            timecolor:timecolor,
                            timefont:timefont,
                            timefamilyName:timefamilyName,
                            timeandroidFamilyName:timeandroidFamilyName,
                            timeleft:timeleft,
                            timetop:timetop,
                            timebottom:timebottom,
                            //点赞
                            likecolor:likecolor,
                            likefont:likefont,
                            likefamilyName:likefamilyName,
                            likeandroidFamilyName:likeandroidFamilyName,
                            likeright:likeright,
                            liketop:liketop,
                            likebottom:likebottom,
                            //阅读量
                            readcolor:readcolor,
                            readfont:readfont,
                            readfamilyName:readfamilyName,
                            readandroidFamilyName:readandroidFamilyName,
                            readright:readright,
                            readtop:readtop,
                            readbottom:readbottom,
                            //状态
                            statuscolor:statuscolor,
                            statusfont:statusfont,
                            statusfamilyName:statusfamilyName,
                            status_androidFamilyName:statusandroidfamilyName,
                            statusradius:statusradius,
                        }
                        self.$emit('edit_json_bpic','',newObject ,which_one )
                    }

                })  
                
            },
            //编辑json后，响应的数据
            edit_json_reponse( val_){
                let self = this
                //防止其他模块修改影响到本模块
                if ( val_.name.indexOf('bpic') < 0 || 
                    (val_.difference == 'bigImage_200' && self.type_element != 'bigImage_200') ||
                    (val_.difference == 'bigImage_201' && self.type_element != 'bigImage_201') ||
                    (val_.difference == 'bigImage_202' && self.type_element != 'bigImage_202') ||
                    (val_.difference == 'bigImage_203' && self.type_element != 'bigImage_203') ||
                    (val_.difference == 'bigImage_204' && self.type_element != 'bigImage_204') ||
                    (val_.difference == 'bigImage_205' && self.type_element != 'bigImage_205') ||
                    (val_.difference == 'bigImage_206' && self.type_element != 'bigImage_206') ||
                    (val_.difference == 'bigImage_210' && self.type_element != 'bigImage_210') ||
                    (val_.difference == 'bigImage_211' && self.type_element != 'bigImage_211') ||
                    (val_.difference == 'bigImage_212' && self.type_element != 'bigImage_212') 
                ) 
                    return
                //整体内嵌
                if ( val_.name.indexOf('bpic.entirety') > -1 ) {
                    let margin_arr_ = self.remote_data.margin.split(',')
                    self.remote_data.margin = margin_arr_[0] +','+val_.data
                }
                //整体修改
                else if ( val_.name.indexOf('bpic.cell_height') > -1) {
                    self.remote_data.height =  val_.data
                }
                //分割线
                else if ( val_.name.indexOf('bpic.underline') > -1 ) {
                    let margin_arr_ = self.remote_data.margin.split(',')
                    margin_arr_[0] = val_.data.select
                    self.remote_data.margin = margin_arr_.join(',')
                }
                //图片
                else if ( val_.name.indexOf('bpic.img.width') > -1 || val_.name.indexOf('bpic.img.height') > -1 ) {
                    if ( self.remote_data.img && self.remote_data.img.child) {
                        self.remote_data.img.child.size ? null : self.remote_data.img.child.size = ['','']
                        let size = self.remote_data.img.child.size.split(',')
                        val_.name.indexOf('bpic.img.width') > -1 ? size[0] = val_.data : size[1] = val_.data
                        self.remote_data.img.child.size = size.join(',')
                    }
                }else if ( val_.name.indexOf('bpic.img.radius') > -1) {
                    if ( self.remote_data.img && self.remote_data.img.child) {
                        self.remote_data.img.child.radius = val_.data
                    }
                }else if ( val_.name.indexOf('bpic.img.left') > -1) {
                    if ( self.remote_data.img && self.remote_data.img.layout) {
                        let left = self.remote_data.img.layout.left || 'parent,0'
                        let left_arr = left.split(',')
                        left_arr[1] = val_.data
                        self.remote_data.img.layout.left = left_arr.join(',')
                    }
                }else if ( val_.name.indexOf('bpic.img.right') > -1) {
                    if ( self.remote_data.img && self.remote_data.img.layout) {
                        let right = self.remote_data.img.layout.right || 'parent,0'
                        let right_arr = right.split(',')
                        right_arr[1] = val_.data
                        self.remote_data.img.layout.right = right_arr.join(',')
                    }
                }else if ( val_.name.indexOf('bpic.img.top') > -1) {
                    if ( self.remote_data.img && self.remote_data.img.layout) {
                        let top = self.remote_data.img.layout.top || 'parent,0'
                        let top_arr = top.split(',')
                        top_arr[1] = val_.data
                        self.remote_data.img.layout.top = top_arr.join(',')
                    }
                }
                //标题
                else if ( val_.name.indexOf('bpic.title.color') > -1) {
                    if ( self.remote_data.title && self.remote_data.title.style) {
                        self.remote_data.title.style.textColor = val_.data
                    }
                }else if ( val_.name.indexOf('bpic.title.font') > -1) {
                    if ( self.remote_data.title && self.remote_data.title.style) {
                        self.remote_data.title.style.textSize = val_.data
                    }
                }else if ( val_.name.indexOf('bpic.title.familyName') > -1) {
                    if ( self.remote_data.title && self.remote_data.title.style) {
                        self.remote_data.title.style.familyName = val_.data
                    }
                }else if ( val_.name.indexOf('bpic.title.androidfamilyName') > -1) {
                    if ( self.remote_data.title && self.remote_data.title.style) {
                        self.remote_data.title.style.androidFamilyName = val_.data
                    }
                }else if ( val_.name.indexOf('bpic.title.left') > -1) {
                    if ( self.remote_data.title && self.remote_data.title.layout) {
                        let left = self.remote_data.title.layout.left 
                        let left_arr = left.split(',');!left_arr[0] ? left_arr[0] = ' ' : null
                        left_arr[1] = val_.data
                        self.remote_data.title.layout.left = left_arr.join(',')
                    }
                }else if ( val_.name.indexOf('bpic.title.top') > -1) {
                    if ( self.remote_data.title && self.remote_data.title.layout) {
                        let top = self.remote_data.title.layout.top 
                        let top_arr = top.split(',');!top_arr[0] ? top_arr[0] = ' ' : null
                        top_arr[1] = val_.data
                        self.remote_data.title.layout.top = top_arr.join(',')
                    }
                }
                //阴影
                else if ( val_.name.indexOf('bpic.shadow_top_Color') > -1) {
                    if ( self.remote_data.view && self.remote_data.view.style) {
                        self.remote_data.view.style.shadowColor_top = val_.data
                        let topcolor_origin = self.remote_data.view.style.shadowColor_top_origin || ''
                        if ( topcolor_origin) {
                            let prefix = topcolor_origin.slice(0,3)
                            prefix += val_.data.slice(1)
                            self.remote_data.view.style.shadowColor_top_origin = prefix
                        }
                    }
                }else if ( val_.name.indexOf('bpic.shadow_top_opacity') > -1) {
                    if ( self.remote_data.view && self.remote_data.view.style) {
                        self.remote_data.view.style.shadowColor_top_opacity = val_.data
                        var topcolor_origin = self.remote_data.view.style.shadowColor_top_origin || ''

                        if ( topcolor_origin) {
                            let op_ = Math.floor( parseFloat( val_.data)*255)
                            op_ =op_.toString(16).toUpperCase()
                            let suffix = topcolor_origin.slice(3)
                            op_.length == 1 ? op_ = '0'+op_ : null
                            self.remote_data.view.style.shadowColor_top_origin = '#'+op_+suffix
                        }
                    }
                }else if ( val_.name.indexOf('bpic.shadow_bottom_Color') > -1) {
                    if ( self.remote_data.view && self.remote_data.view.style) {
                        self.remote_data.view.style.shadowColor_bottom = val_.data
                        let bottomcolor_origin = self.remote_data.view.style.shadowColor_bottom_origin || ''
                        if ( bottomcolor_origin) {
                            let prefix = bottomcolor_origin.slice(0,3)
                            prefix += val_.data.slice(1)
                            self.remote_data.view.style.shadowColor_bottom_origin = prefix
                        }
                    }
                }else if ( val_.name.indexOf('bpic.shadow_bottom_opacity') > -1) {
                    if ( self.remote_data.view && self.remote_data.view.style) {
                        self.remote_data.view.style.shadowColor_bottom_opacity = val_.data
                        var bottomcolor_origin = self.remote_data.view.style.shadowColor_bottom_origin || ''

                        if ( bottomcolor_origin) {
                            let op_ = Math.floor( parseFloat( val_.data)*255)
                            op_ =op_.toString(16).toUpperCase()
                            let suffix = bottomcolor_origin.slice(3)
                            op_.length == 1 ? op_ = '0'+op_ : null
                            self.remote_data.view.style.shadowColor_bottom_origin = '#'+op_+suffix
                        }
                    }
                }
                //简介
                else if ( val_.name.indexOf('bpic.intro.color') > -1) {
                    if ( self.remote_data.intro && self.remote_data.intro.style) {
                        self.remote_data.intro.style.textColor = val_.data
                    }
                }else if ( val_.name.indexOf('bpic.intro.font') > -1) {
                    if ( self.remote_data.intro && self.remote_data.intro.style) {
                        self.remote_data.intro.style.textSize = val_.data
                    }
                }else if ( val_.name.indexOf('bpic.intro.familyName') > -1) {
                    if ( self.remote_data.intro && self.remote_data.intro.style) {
                        self.remote_data.intro.style.familyName = val_.data
                    }
                }else if ( val_.name.indexOf('bpic.intro.androidfamilyName') > -1) {
                    if ( self.remote_data.intro && self.remote_data.intro.style) {
                        self.remote_data.intro.style.androidFamilyName = val_.data
                    }
                }else if ( val_.name.indexOf('bpic.intro.left') > -1) {
                    if ( self.remote_data.intro && self.remote_data.intro.layout) {
                        let left = self.remote_data.intro.layout.left 
                        let left_arr = left.split(',');!left_arr[0] ? left_arr[0] = ' ' : null
                        left_arr[1] = val_.data
                        self.remote_data.intro.layout.left = left_arr.join(',')
                    }
                }else if ( val_.name.indexOf('bpic.intro.top') > -1) {
                    if ( self.remote_data.intro && self.remote_data.intro.layout) {
                        let top = self.remote_data.intro.layout.top 
                        let top_arr = top.split(',');!top_arr[0] ? top_arr[0] = ' ' : null
                        top_arr[1] = val_.data
                        self.remote_data.intro.layout.top = top_arr.join(',')
                    }
                }
                //标签
                else if ( val_.name.indexOf('bpic.tag.color') > -1) {
                    if ( self.remote_data.tag && self.remote_data.tag.style) {
                        self.remote_data.tag.style.textColor = val_.data
                    }
                }else if ( val_.name.indexOf('bpic.tag.font') > -1) {
                    if ( self.remote_data.tag && self.remote_data.tag.style) {
                        self.remote_data.tag.style.textSize = val_.data
                    }
                }else if ( val_.name.indexOf('bpic.tag.familyName') > -1) {
                    if ( self.remote_data.tag && self.remote_data.tag.style) {
                        self.remote_data.tag.style.familyName = val_.data
                    }
                }else if ( val_.name.indexOf('bpic.tag.androidfamilyName') > -1) {
                    if ( self.remote_data.tag && self.remote_data.tag.style) {
                        self.remote_data.tag.style.androidFamilyName = val_.data
                    }
                }else if ( val_.name.indexOf('bpic.tag.left') > -1) {
                    if ( self.remote_data.tag && self.remote_data.tag.layout) {
                        let left = self.remote_data.tag.layout.left 
                        let left_arr = left.split(',');!left_arr[0] ? left_arr[0] = ' ' : null
                        left_arr[1] = val_.data
                        self.remote_data.tag.layout.left = left_arr.join(',')
                    }
                }else if ( val_.name.indexOf('bpic.tag.top') > -1) {
                    if ( self.remote_data.tag && self.remote_data.tag.layout) {
                        let top = self.remote_data.tag.layout.top 
                        let top_arr = top.split(',');!top_arr[0] ? top_arr[0] = ' ' : null
                        top_arr[1] = val_.data
                        self.remote_data.tag.layout.top = top_arr.join(',')
                    }
                }else if ( val_.name.indexOf('bpic.tag.bottom') > -1) {
                    if ( self.remote_data.tag && self.remote_data.tag.style) {
                        let bottom = self.remote_data.tag.layout.bottom 
                        let bottom_arr = bottom.split(',');!bottom_arr[0] ? bottom_arr[0] = ' ' : null
                        bottom_arr[1] = val_.data
                        self.remote_data.tag.layout.bottom = bottom_arr.join(',')
                    }
                }
                //时间
                else if ( val_.name.indexOf('bpic.time.color') > -1) {
                    if ( self.remote_data.time && self.remote_data.time.style) {
                        self.remote_data.time.style.textColor = val_.data
                    }
                }else if ( val_.name.indexOf('bpic.time.font') > -1) {
                    if ( self.remote_data.time && self.remote_data.time.style) {
                        self.remote_data.time.style.textSize = val_.data
                    }
                }else if ( val_.name.indexOf('bpic.time.familyName') > -1) {
                    if ( self.remote_data.time && self.remote_data.time.style) {
                        self.remote_data.time.style.familyName = val_.data
                    }
                }else if ( val_.name.indexOf('bpic.time.androidfamilyName') > -1) {
                    if ( self.remote_data.time && self.remote_data.time.style) {
                        self.remote_data.time.style.androidFamilyName = val_.data
                    }
                }else if ( val_.name.indexOf('bpic.time.left') > -1) {
                    if ( self.remote_data.time && self.remote_data.time.layout) {
                        let left = self.remote_data.time.layout.left 
                        let left_arr = left.split(',');!left_arr[0] ? left_arr[0] = ' ' : null
                        left_arr[1] = val_.data
                        self.remote_data.time.layout.left = left_arr.join(',')
                    }
                }else if ( val_.name.indexOf('bpic.time.top') > -1) {
                    if ( self.remote_data.time && self.remote_data.time.layout) {
                        let top = self.remote_data.time.layout.top 
                        let top_arr = top.split(',');!top_arr[0] ? top_arr[0] = ' ' : null
                        top_arr[1] = val_.data
                        self.remote_data.time.layout.top = top_arr.join(',')
                    }
                }else if ( val_.name.indexOf('bpic.time.bottom') > -1) {
                    if ( self.remote_data.time && self.remote_data.time.style) {
                        let bottom = self.remote_data.time.layout.bottom 
                        let bottom_arr = bottom.split(',');!bottom_arr[0] ? bottom_arr[0] = ' ' : null
                        bottom_arr[1] = val_.data
                        self.remote_data.time.layout.bottom = bottom_arr.join(',')
                    }
                }
                //点赞
                else if ( val_.name.indexOf('bpic.like.color') > -1) {
                    if ( self.remote_data.like && self.remote_data.like.style) {
                        self.remote_data.like.style.textColor = val_.data
                    }
                }else if ( val_.name.indexOf('bpic.like.font') > -1) {
                    if ( self.remote_data.like && self.remote_data.like.style) {
                        self.remote_data.like.style.textSize = val_.data
                    }
                }else if ( val_.name.indexOf('bpic.like.familyName') > -1) {
                    if ( self.remote_data.like && self.remote_data.like.style) {
                        self.remote_data.like.style.familyName = val_.data
                    }
                }else if ( val_.name.indexOf('bpic.like.androidfamilyName') > -1) {
                    if ( self.remote_data.like && self.remote_data.like.style) {
                        self.remote_data.like.style.androidFamilyName = val_.data
                    }
                }else if ( val_.name.indexOf('bpic.like.right') > -1) {
                    if ( self.remote_data.like && self.remote_data.like.style) {
                        let right = self.remote_data.like.layout.right
                        let right_arr = right.split(',');!right_arr[0] ? right_arr[0] = ' ' : null
                        right_arr[1] = val_.data
                        self.remote_data.like.layout.right = right_arr.join(',')
                    }
                }else if ( val_.name.indexOf('bpic.like.top') > -1) {
                    if ( self.remote_data.like && self.remote_data.like.style) {
                        let top = self.remote_data.like.layout.top
                        let top_arr = top.split(','); !top_arr[0] ? top_arr[0] = ' ' : null
                        top_arr[1] = val_.data
                        self.remote_data.like.layout.top = top_arr.join(',')
                    }
                }else if ( val_.name.indexOf('bpic.like.bottom') > -1) {
                    if ( self.remote_data.like && self.remote_data.like.style) {
                        let bottom = self.remote_data.like.layout.bottom
                        let bottom_arr = bottom.split(','); !bottom_arr[0] ? bottom_arr[0] = ' ' : null
                        bottom_arr[1] = val_.data
                        self.remote_data.like.layout.bottom = bottom_arr.join(',')
                    }
                }
                //阅读量
                else if ( val_.name.indexOf('bpic.read.color') > -1) {
                    if ( self.remote_data.read && self.remote_data.read.style) {
                        self.remote_data.read.style.textColor = val_.data
                    }
                }else if ( val_.name.indexOf('bpic.read.font') > -1) {
                    if ( self.remote_data.read && self.remote_data.read.style) {
                        self.remote_data.read.style.textSize = val_.data
                    }
                }else if ( val_.name.indexOf('bpic.read.familyName') > -1) {
                    if ( self.remote_data.read && self.remote_data.read.style) {
                        self.remote_data.read.style.familyName = val_.data
                    }
                }else if ( val_.name.indexOf('bpic.read.androidfamilyName') > -1) {
                    if ( self.remote_data.read && self.remote_data.read.style) {
                        self.remote_data.read.style.androidFamilyName = val_.data
                    }
                }else if ( val_.name.indexOf('bpic.read.right') > -1) {
                    if ( self.remote_data.read && self.remote_data.read.style) {
                        let right = self.remote_data.read.layout.right
                        let right_arr = right.split(',');!right_arr[0] ? right_arr[0] = ' ' : null
                        right_arr[1] = val_.data
                        self.remote_data.read.layout.right = right_arr.join(',')
                    }
                }else if ( val_.name.indexOf('bpic.read.top') > -1) {
                    if ( self.remote_data.read && self.remote_data.read.style) {
                        let top = self.remote_data.read.layout.top
                        let top_arr = top.split(','); !top_arr[0] ? top_arr[0] = ' ' : null
                        top_arr[1] = val_.data
                        self.remote_data.read.layout.top = top_arr.join(',')
                    }
                }else if ( val_.name.indexOf('bpic.read.bottom') > -1) {
                    if ( self.remote_data.read && self.remote_data.read.style) {
                        let bottom = self.remote_data.read.layout.bottom
                        let bottom_arr = bottom.split(','); !bottom_arr[0] ? bottom_arr[0] = ' ' : null
                        bottom_arr[1] = val_.data
                        self.remote_data.read.layout.bottom = bottom_arr.join(',')
                    }
                }
                //状态
                else if ( val_.name.indexOf('bpic.status.color') > -1) {
                    if ( self.remote_data.status && self.remote_data.status.style) {
                        self.remote_data.status.style.textColor = val_.data
                    }
                }else if ( val_.name.indexOf('bpic.status.font') > -1) {
                    if ( self.remote_data.status && self.remote_data.status.style) {
                        self.remote_data.status.style.textSize = val_.data
                    }
                }else if ( val_.name.indexOf('bpic.status.familyName') > -1) {
                    if ( self.remote_data.status && self.remote_data.status.style) {
                        self.remote_data.status.style.familyName = val_.data
                    }
                }else if ( val_.name.indexOf('bpic.status.androidfamilyName') > -1) {
                    if ( self.remote_data.status && self.remote_data.status.style) {
                        self.remote_data.status.style.androidFamilyName = val_.data
                    }
                }

                self.setLayout( self.remote_data)
                let new_object = JSON.parse( JSON.stringify( self.remote_data))
                self.convertToClent( new_object)

                val_.difference == 'bigImage_205' ? new_object.view.style.shadowColor = new_object.view.style.shadowColor_top+','+new_object.view.style.shadowColor_bottom : null

                let pt__ = val_.difference.split('_')[1]
                $.edit_json_remote_post('newsList','1402',pt__,new_object)
                
            },
            //将颜色特殊值转换成普通值
            convertSpecialToNormal( data_,key_l){
                let self = this
                Object.keys(data_).forEach( (key)=>{
                    let key_ = key+''
                    if (  key_ == key_l ) {
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
                    let $bli = $('.big-image'+self.getRandomClassName()+'.copy' )
                    setTimeout(function() {
                        if ( $bli.data('contentData')&& $bli.data('refresData') ) {
                            $bli.data('refresData',false) 
                            let c_ = JSON.parse( $bli.data('contentData')),
                            j_ = ''
                            if ( self.type_element == 'bigImage_200') {
                                j_ = c_['200']
                            }else if ( self.type_element == 'bigImage_201') {
                                j_ = c_['201']
                            }else if ( self.type_element == 'bigImage_202') {
                                j_ = c_['202']
                            }else if ( self.type_element == 'bigImage_203') {
                                j_ = c_['203']
                            }else if ( self.type_element == 'bigImage_204') {
                                j_ = c_['204']
                            }else if ( self.type_element == 'bigImage_205') {
                                j_ = c_['205']
                            }else if ( self.type_element == 'bigImage_206') {
                                j_ = c_['206']
                            }else if ( self.type_element == 'bigImage_210') {
                                j_ = c_['210']
                            }else if ( self.type_element == 'bigImage_211') {
                                j_ = c_['211']
                            }else if ( self.type_element == 'bigImage_212') {
                                j_ = c_['212']
                            }
                            self.convertSpecialToNormal( j_,'shadowColor')
                            self.convertToWeb( j_)
                            self.setLayout( j_)
                            self.dom_operator_content( j_)
                        }
                        self.getDataRedraw()
                    }, 200);
                }
            },
            //直接操作dom
            dom_operator_content( j_){
                let self = this,
                $bli = $('.big-image'+self.getRandomClassName()+'.copy' )

                $.each($bli,(i)=>{
                    let baseData = JSON.parse( $bli.eq(i).data('baseData')),
                    $bimg = $bli.eq(i),
                    $if = $bimg.children('.img-father'),
                    $tf = $bimg.children('.text-father'),
                    $tp_title0 = $bimg.children('.title-package.0').eq(0).clone(),
                    $tp_title1 = $bimg.children('.title-package.1').eq(0).clone()
                    $bimg.empty()
                    
                    let $if_copy= $if.clone(),
                    $if_img = $if_copy.find('.image'),
                    $if_first_father = $if_copy.find('.logo-status-takePart.first'),
                    $if_sencond_father = $if_copy.find('.logo-status-takePart.sencond'),
                    $if_first_status = $if_copy.find('.logo-status-takePart.first').find('.status'),
                    $if_first_logo = $if_copy.find('.logo-status-takePart.first').find('.logo'),
                    $if_first_takePart = $if_copy.find('.logo-status-takePart.first').find('.takePart'),
                    $if_sencond_status = $if_copy.find('.logo-status-takePart.sencond').find('.status'),
                    $if_sencond_time = $if_copy.find('.logo-status-takePart.sencond').find('.time'),
                    $if_title = $if_copy.find('.title'),

                    $tf_copy= $tf.clone(),
                    $tf_tag = $tf_copy.find('.text-tag-time').find('.tag'),
                    $tf_time = $tf_copy.find('.text-tag-time').find('.time'),
                    $tf_intro = $tf_copy.find('.intro'),
                    $tf_like = $tf_copy.find('.like-text'),
                    $tf_read = $tf_copy.find('.read-text'),
                    $tf_apply = $tf_copy.find('.apply-text')

                    $tp_title0.find('.title').text( baseData.title)
                    $tp_title1.find('.title').text( baseData.title)

                    $if_img.css('backgroundImage','url('+(baseData.cover && baseData.cover[0]['path'] || '')+')')
                    $if_title.text( baseData.title)
                    baseData.live == 0 ? $if_first_father.css('display','none') : (function(){
                        let liveStatus = baseData.live == 1 ? '预告' :
                                        baseData.live == 2 ? '直播中' :
                                        baseData.live == 3 ? '结束' :
                                        baseData.live == 4 ? '回放' : ''
                        $if_first_father.css('display','inline-block')
                        $if_first_status.find('span').text( liveStatus)

                        if ( baseData.live != 2) {
                            $if_first_takePart.css('display','none') //参加人数隐藏
                            $if_first_logo.css('display','none') //图标隐藏
                        }else
                            $if_first_takePart.find('span').text( baseData.viewBaseNum+'人参与')
                    })()
                    
                    if ( baseData.is_signup == 1) {
                        $if_sencond_status.find('span').text( '已报名')
                        $tf_apply.text( '已报名')
                    }else{
                        let now = (new Date()).getTime(),
                        statusText
                        if (now >= baseData.endTime* 1000 )
                            statusText = "活动结束"
                        else if (now >= baseData.startTime* 1000 )
                            statusText = "开始报名"
                        else 
                            statusText = "未开始"
                        $if_sencond_status.find('span').text( statusText)
                        $tf_apply.text( statusText)
                    }
                    $if_sencond_time.text( self.getTimeFormatter(baseData.startTime*1000)+'~'+self.getTimeFormatter(baseData.endTime*1000))

                    $tf_tag.text( '') //baseData.tags
                    
                    let publishSpace = ( (new Date()).getTime() - baseData.createdAt*1000 )/1000,
                    publishText = ''
                    publishSpace < 180 ? publishText = '刚刚' :
                    publishSpace >= 180 && publishSpace < 3600 ? publishText = ( parseInt( publishSpace/60)+'分钟前') :
                    publishSpace >= 3600 && publishSpace < 24*3600 ? publishText = self.getTimeFormatter(baseData.createdAt*1000,'day') :
                    publishSpace >= 24*3600 && publishSpace < 24*3600*365 ? publishText = self.getTimeFormatter(baseData.createdAt*1000,'month') :
                    publishSpace >= 24*3600*365 ? publishText = self.getTimeFormatter(baseData.createdAt*1000,'year') : ''

                    //来源、时间
                    $tf_time.text( ( j_.referer && j_.referer.style.visible == 0) || !baseData.source ? publishText : baseData.source+ '    '+ publishText )

                    $tf_read.find('span').text( (parseInt(baseData.viewBaseNum) >=10000 ? (parseInt(baseData.viewBaseNum)/10000).toFixed(2)+'万' : baseData.viewBaseNum)+'阅读'  )
                    //没有介绍，隐藏掉
                    $tf_intro.text( baseData.intro); !baseData.intro ? $tf_intro.hide():null;
                    //点赞和分享隐藏掉
                    $tf_like.text( baseData.viewBaseNum)
                    $tf_copy.find('.like-package').hide()
                    $tf_copy.find('.share-package').hide()

                    
                    $bimg.append( $tp_title0)
                    $bimg.append( $if_copy)
                    $bimg.append( $tp_title1)
                    $bimg.append( $tf_copy)

                    $bimg.off('click').on('click',function(){
                        $.click_news_into_particular( baseData)
                    })
                })
                // $bli.find('.logo-status-takePart').css('display','none') //将状态隐藏掉
                $bli.css('display','block')
            },
            //时间戳--获取时间格式
            getTimeFormatter( date_ ,type){
                let date = new Date( date_ )
                let M = date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1
                let D = date.getDate() < 10 ? '0'+date.getDate() : date.getDate()
                let H = date.getHours() < 10 ? '0'+date.getHours() : date.getHours()
                let m = date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes()
                let S = date.getSeconds() < 10 ? '0'+date.getSeconds() : date.getSeconds()
                if ( type == 'all') 
                    return date.getFullYear()+'-'+M+'-'+D+' '+H+':'+m+':'+S
                else if ( type == 'year') 
                    return date.getFullYear()+'-'+M+'-'+D
                else if ( type == 'month') 
                    return M+'-'+D
                else if ( type == 'day') 
                    return H+':'+m
                else
                    return date.getFullYear()+'-'+M+'-'+D
            },
            getRandomClassName(){
                let self = this
                return '.'+self.randomMark
            },
            
            getlocalData(){
                return {
                    "mainImage":{
                        "imgUrl":'http://img01.cztv.com/201606/20/1911554b9c17efcd0325f2a73566d552.jpg',
                        "imgFill":'cover',
                        //直播状态
                        "logo":{
                            "imgUrl":'http://shixiantest.oss-cn-hangzhou.aliyuncs.com/49/posts/2021/07/06/782571effb2cdcf5782162ed54e493c3.png',
                            "imgFill":'cover',
                            "common":{
                                "size":{
                                    "width":10,
                                    "height":9
                                },
                            }
                        },
                        //直播状态
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
                                    "height":15
                                },
                            }
                        },
                        //参与人数
                        "takePart":{
                            "textContent":'2331人参与',
                            "textContent_style":'none',
                            "color":{
                                "textColor":"#ffffff",
                                "bgColor":"#666",
                                "bgAlpha":"0.5",
                            },
                            "text":{
                                "textAlignment":0,
                                "font":12,
                                "familyName":"",
                                "androidFamilyName":""
                            },
                            "common":{
                                "size":{
                                    "height":'auto'
                                },
                            }
                        },
                        "common":{
                            "border": {
                                "borderColor": "#fff", 
                                "borderWidth": 0, 
                                "borderRadius": 3 
                            },
                            "size":{
                                "width":106,
                                "height":70
                            },
                        }
                    },
                    "title":{
                        "textContent":'秋季干燥 学会“科学喝水”',
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
                    "intro":{
                        "textContent":'多喝水对身体好',
                        "textContent_style":'none',
                        "color":{
                            "textColor":"#000000"
                        },
                        "text":{
                            "textAlignment":0,
                            "font":13,
                            "familyName":"",
                        },
                        "common":{
                            "isHidden":0
                        }
                    },
                    "tag":{
                        "textContent":'官宣',
                        "color":{
                            "textColor":"#FF6002"
                        },
                        "text":{
                            "textAlignment":0,
                            "font":12,
                            "familyName":"",
                        },
                        "common":{
                            "border":{
                                "borderColor":"#FF6002",
                                "borderWidth":0,
                                "border-radius":0,
                            },
                            "size":{
                                "height":18
                            },
                        }
                    },
                    "time":{
                        "textContent":'浙江在线 08:39',
                        "textContent_style":'none',
                        "color":{
                            "textColor":"#000000"
                        },
                        "text":{
                            "textAlignment":0,
                            "font":13,
                            "familyName":"",
                        },
                    },
                    "likeImg":{
                        "imgUrl":'http://shixiantest.oss-cn-hangzhou.aliyuncs.com/48/posts/2020/11/13/53c361cca6cea87a2ed14fd24a3540ca.png',
                        "imgFill":'cover',
                        "common":{
                            "border": {
                                "borderColor": "#fff", 
                                "borderWidth": 0, 
                                "borderRadius": 0 
                            },
                            "size":{
                                "width":15,
                                "height":15
                            },
                        }
                    },
                    "like":{
                        "textContent":'16778',
                        "textContent_style":'none',
                        "color":{
                            "textColor":"#000000"
                        },
                        "text":{
                            "textAlignment":1,
                            "font":13,
                            "familyName":"",
                        },
                    },
                    "readImg":{
                        "imgUrl":'http://shixiantest.oss-cn-hangzhou.aliyuncs.com/48/posts/2020/11/13/6ccaf2f0e9fad869ccbc1256b9a62b5a.png',
                        "imgFill":'cover',
                        "common":{
                            "border": {
                                "borderColor": "#fff", 
                                "borderWidth": 0, 
                                "borderRadius": 0 
                            },
                            "size":{
                                "width":15,
                                "height":15
                            },
                        }
                    },
                    "read":{
                        "textContent":'3232阅读',
                        "textContent_style":'none',
                        "color":{
                            "textColor":"#000000"
                        },
                        "text":{
                            "textAlignment":1,
                            "font":13,
                            "familyName":"",
                        },
                    },
                    "shareImg":{
                        "imgUrl":'http://shixiantest.oss-cn-hangzhou.aliyuncs.com/48/posts/2020/11/13/c4ec1b57d0b7e131032daa30f98976b6.png',
                        "imgFill":'cover',
                        "common":{
                            "border": {
                                "borderColor": "#fff", 
                                "borderWidth": 0, 
                                "borderRadius": 0 
                            },
                            "size":{
                                "width":15,
                                "height":15
                            },
                        }
                    },
                    "apply":{
                        "textContent":'报名',
                        "textContent_style":'none',
                        "color":{
                            "textColor":"#ffffff",
                            "bgColor":"#D21313"
                        },
                        "text":{
                            "textAlignment":1,
                            "font":13,
                            "familyName":"",
                        },
                        "common":{
                            "border": {
                                "borderColor": "#fff", 
                                "borderWidth": 0, 
                                "borderRadius": 10 
                            },
                            "padding":"3px 12px"
                        }
                    },
                    //活动状态
                    "status":{
                        "textContent":'报名开始',
                        "textContent_style":'none',
                        "color":{
                            "textColor":"#ffffff",
                            "bgColor":"#D21313"
                        },
                        "text":{
                            "textAlignment":1,
                            "font":12,
                            "familyName":"",
                        },
                        "common":{
                            "border": {
                                "borderColor": "#fff", 
                                "borderWidth": 0, 
                                "borderRadius": 10 
                            },
                            "padding":"2px 8px"
                        }
                    },
                    "shadowColor": {
                        "bgColorTop": "#000000",
                        "bgAlphaTop":'1.0',
                        "bgColorBottom": "#000000",
                        "bgAlphaBottom":'1.0'
                    },
                    "line":{
                        "color":{
                            "bgColor":"#efefef"
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
    .big-image{
        width: 100%;
        position: relative;
        overflow: hidden;
        // padding: 5px;
        background-color: @contentbg;
        .title-package{
            margin:5px 0;
        }
        .img-father{
            position: relative;
            white-space: nowrap;
            .image{
                display: inline-block;
            }
            .logo-status-takePart{
                position: absolute;
                display: table-cell;
                vertical-align: middle;
                font-size: 0;
                top: 15px;
                left: 10px;
                height: 21px;
                border-radius: 3px;
                overflow: hidden;
                .logo-status{
                    display: inline-block;
                    padding: 0 5px;
                    .logo{
                        display: inline-block;
                        vertical-align: middle;
                        margin-right: 5px;
                    }
                }   
                .takePart{
                    margin-top: 0px;
                    padding: 0 5px;
                }
                .status{
                    margin-right: 3px;
                }
            }
            .img-bottom-title{
                position: absolute;
                width: 100%;
                padding: 5px 0 5px 10px;
                bottom: 3px;
            }
        }
        .text-father{
            position: relative;
            width: 100%;
            .text-tag-time{
                position: relative;
                display: inline-block;
            }
            .read-btn{
                float: right;
                display: inline-block;
                position: relative;
                .read-package{
                    display: inline-block;
                    vertical-align: middle;
                    margin-left: 10px;
                    font-size: 0;
                    .read-img{
                        display: inline-block;
                        vertical-align: middle;
                        margin-right: 3px;
                    }
                    .read-text{
                        display: inline-block;
                        vertical-align: middle;
                    }
                }
                .share-package{
                    display: inline-block;
                    vertical-align: middle;
                    margin-left: 10px;
                }
                .like-package{
                    display: inline-block;
                    vertical-align: middle;
                    font-size: 0;
                    .like-img{
                        display: inline-block;
                        vertical-align: middle;
                        margin-right: 3px;
                    }
                    .like-text{
                        display: inline-block;
                        vertical-align: middle;
                    }
                }
                .apply-package{
                    display: inline-block;
                    vertical-align: middle;
                    margin-right: 10px;
                }


            }
        }
    }

</style>
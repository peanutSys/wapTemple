<template>
    <div :class='"muti-image "+randomMark' @click.stop='edit_json_style("1")'>
        <!--顶部标题-->
        <div class='title-package 0' v-if=' type_number == 31' >
            <LabelLayout class='title' :layout_data='local_data.title' ></LabelLayout>
        </div>
        <div class="img-father" >
            <!-- 活动 -->
            <LabelLayout class='status' :layout_data='local_data.status'></LabelLayout>
            <!-- 图片 -->
            <ImageLayout class='image':layout_data='local_data.mainImage'></ImageLayout>
            <ImageLayout class='image':layout_data='local_data.mainImage'></ImageLayout>
            <ImageLayout class='image':layout_data='local_data.mainImage'></ImageLayout>
        </div>
        <!-- 底部标题 -->
        <div class='title-package 1' v-if=' type_number == 30'>
            <LabelLayout class='title' :layout_data='local_data.title' ></LabelLayout>
        </div>

        <!-- 标签 -->
        <div class="text-father">
            <div class="text-tag-time">
                <div style="display: inline-block;" >
                    <LabelLayout class='tag' :layout_data='local_data.tag'></LabelLayout>
                </div>
                <div style="display: inline-block;" >
                    <LabelLayout class='time' :layout_data='local_data.time'></LabelLayout> 
                </div>
            </div>
            <div class="read-btn" >
                <div class="img">
                    <img src="../../../../../static/img/look.png">
                </div>
                <LabelLayout class='read' :layout_data='local_data.read'></LabelLayout>
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
                randomMark:(new Date()).getTime(),

                local_data:{},//本地数据
                remote_data:{}, //要更改的远程json数据

                type_element:'',
                type_number:'',
            }
        },
        watch:{
            mialData:function (newVal,oldVal ) {
               let self = this
               self.setLayout(newVal)
            }
        },
        created(){
            let self = this;
        },
        mounted(){
            let self = this

            let mial_data_
            self.type_element = self._props.typeids
            $.allowMachine == 1 ? self.pageWidth = $(window).width() : null

            if ( self.type_element == 'bigImage_230') {
                mial_data_ = self._props.mialData['230'] || ''
                self.type_number = 30
            }else if ( self.type_element == 'bigImage_231') {
                mial_data_ = self._props.mialData['231'] || ''
                self.type_number = 31
            }

            self.convertToWeb( mial_data_)
            self.setLayout( mial_data_)
            self.getDataRedraw()
            self.$emit('edit_json_mial',function( val_){
                self.edit_json_reponse( val_)
            },'','') 
        },
        props: ['mialData','typeids'],
        components:{
            LabelLayout,
            ButtonLayout,
            ImageLayout,
            ViewLayout,
        },
        methods:{
            setLayout( mial_){
                let self = this
                if ( !mial_) 
                    return
                let local_style_data = self.getlocalData()
                let mi_ = $('.muti-image'+self.getRandomClassName() )

                //设置内外边距
                let padding_ = '';let padding_left = 0 ; let padding_right = 0 
                {
                    if ( mial_.margin) {
                        let margin_arr_ = mial_.margin.split(',')
                        if ( margin_arr_.length > 4) {
                            //始终是设置内边距
                            margin_arr_[0] = '2'
                            margin_arr_.shift() //删除第一个标识符
                        }
                        margin_arr_.forEach( (item,i)=>{
                            padding_+=item+'px '
                            i == 1 ? padding_right = parseFloat(item) : null
                            i == 3 ? padding_left = parseFloat(item) : null
                        })
                        
                    }
                }
                //整体高度
                let cell_height = -1
                {
                    cell_height = mial_.height
                }
                //设置图片
                let img_width = 0
                {
                    let main_image = local_style_data.mainImage
                    let size = mial_.img.child ? mial_.img.child.size.split(',') : []
                    
                    size[0] && parseFloat( size[0]) > 0 ? main_image.common.size.width = size[0] :null
                    size[0] ? img_width = size[0] :null
                    size[1] && parseFloat( size[1]) >= 0 ? main_image.common.size.height = size[1] :null
                    main_image.common.border.borderRadius = mial_.img.child.radius
                    local_style_data.mainImage = main_image
                }
                //状态
                let status_radius = 0
                if ( mial_.status && mial_.status.style ) {
                    local_style_data.status.color.textColor = mial_.status.style.textColor
                    local_style_data.status.text.font = mial_.status.style.textSize
                    local_style_data.status.text.familyName = mial_.status.style.familyName
                    local_style_data.status.text.androidFamilyName = mial_.status.style.androidFamilyName
                    status_radius = mial_.status.style.radius
                    local_style_data.status.color.bgColor = mial_.status.style.bgColor || '#C21319'
                }
                //设置标题
                let title_left = 0,title_top = 0 ,title_right = 0
                {
                    let title = local_style_data.title
                    title.color.textColor = mial_.title.style.textColor
                    title.text.font = mial_.title.style.textSize
                    title.text.familyName = mial_.title.style.familyName
                    title.text.androidFamilyName = mial_.title.style.androidFamilyName

                    if ( mial_.title.layout) {
                        if ( mial_.title.layout.left) {
                            let title_left_arr = mial_.title.layout.left.split(',')
                            title_left = title_left_arr[1]
                        }
                        if ( mial_.title.layout.top) {
                            let title_top_arr = mial_.title.layout.top.split(',')
                            title_top = title_top_arr[1]
                        }
                        if ( mial_.title.layout.right) {
                            let title_right_arr = mial_.title.layout.right.split(',')
                            title_right = title_right_arr[1]
                        }
                    }
                }
                //设置阅读量
                let read_right = 0,read_bottom = 0 
                {
                    let read = local_style_data.read
                    read.color.textColor = mial_.read.style.textColor
                    read.text.font = mial_.read.style.textSize
                    read.text.familyName = mial_.read.style.familyName
                    read.text.androidFamilyName = mial_.read.style.androidFamilyName

                    if( mial_.read.layout){
                        if ( mial_.read.layout.right) {
                            let read_right_arr = mial_.read.layout.right.split(',')
                            read_right = read_right_arr[1]
                        }
                        if ( mial_.read.layout.bottom) {
                            let read_bottom_arr = mial_.read.layout.bottom.split(',')
                            read_bottom = read_bottom_arr[1]
                        }
                    }
                }
                //设置标签
                let tag_left = 0,tag_bottom = 0 
                {
                    let tag = local_style_data.tag
                    tag.color.textColor = mial_.tag.style.textColor
                    tag.text.font = mial_.tag.style.textSize
                    tag.text.familyName = mial_.tag.style.familyName
                    tag.text.androidFamilyName = mial_.tag.style.androidFamilyName

                    if ( mial_.tag.layout) {
                        if ( mial_.tag.layout.left) {
                            let tag_left_arr = mial_.tag.layout.left.split(',')
                            tag_left = tag_left_arr[1]
                        }
                        if ( mial_.tag.layout.bottom) {
                            let tag_bottom_arr = mial_.tag.layout.bottom.split(',')
                            tag_bottom = tag_bottom_arr[1]
                        }
                    }
                }
                //时间
                let time_left = 0
                {
                    let time = local_style_data.time
                    time.color.textColor = mial_.time.style.textColor
                    time.text.font = mial_.time.style.textSize
                    time.text.familyName = mial_.time.style.familyName
                    time.text.androidFamilyName = mial_.time.style.androidFamilyName

                    if ( mial_.time.layout) {
                        if ( mial_.time.layout.left) {
                            let time_left_arr = mial_.time.layout.left.split(',')
                            time_left = time_left_arr[1]
                        }
                    }
                }
                
                self.$nextTick( ()=>{
                    //设置内边距
                    mi_.css({
                        padding: padding_,
                        height:cell_height <0 ? 'auto' :cell_height+'px',
                    })

                    //设置图片宽度
                    mi_.children('.img-father').find('.image').css({
                        width: (self.pageWidth - padding_left - padding_right - 10)/3 + 'px'
                    })

                    //设置状态
                    mi_.children('.img-father').find('.status').css({
                        borderRadius: status_radius + 'px'
                    })

                    //设置标题外边距
                    mi_.children('.text-father').find('.title').css({
                        margin: title_top+'px ' +title_right+'px '+'0 '+title_left+'px'
                    })

                    //设置阅读量布局
                    mi_.children('.text-father').children('.read-btn').css({
                        right:read_right+'px',
                        bottom:read_bottom+'px',
                    })

                    //设置标签
                    mi_.children('.text-father').children('.text-tag-time').css({
                        bottom: parseFloat(tag_bottom)+1+'px'
                    })
                    mi_.children('.text-father').children('.text-tag-time').find('.tag').css({
                        margin: '0 0 0 ' +tag_left+'px'
                    })

                    //设置时间
                    mi_.children('.text-father').children('.text-tag-time').find('.time').css({
                        margin: '0 0 0 '+time_left+'px'
                    })
                    
                    $('.line').css({
                        position:'absolute',
                        bottom:'0',
                        left:'0',
                        right:'0'
                    }) 
                })

                //持有外部json数据
                self.remote_data = mial_
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
                let mi_ = $('.muti-image'+self.getRandomClassName() )
                let which_one = self.type_element 
                self.$nextTick( ()=>{
                    if ( id_ == '1') {
                        //修改整体边距
                        mi_.addClass('border-style-0').addClass('boder-color-animation')  
                        let margin_arr_ = self.remote_data.margin.split(','),
                        mpid = ''
                        if ( margin_arr_.length > 4) {
                            mpid = margin_arr_.shift() 
                        }
                        let margin_new = margin_arr_.join(',')

                        //整体高度
                        let cell_height = self.remote_data.height

                        //修改图片
                        let imgheight = 0 , imgwidth = 0, imgleft = 0, imgtop = 0 , imgright = 0 , imgradius = 0
                        if ( self.remote_data.img) {
                            if (self.remote_data.img.child.size ) {
                                let size = self.remote_data.img.child.size.split(',')
                                imgheight = size[1] || 0
                                imgwidth = size[0] || 0
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

                        let newObject = {
                            //整体边距
                            margin_new:margin_new,
                            //整体高度
                            cell_height:cell_height,
                            //分割线类型
                            mpid:mpid,
                            //图片
                            imgwidth:imgwidth,
                            imgheight:imgheight,
                            imgleft:imgleft,
                            imgtop:imgtop,
                            imgright:imgright,
                            imgradius:imgradius,
                            //状态
                            statuscolor:statuscolor,
                            statusfont:statusfont,
                            statusfamilyName:statusfamilyName,
                            status_androidfamilyName:statusandroidfamilyName,
                            statusradius:statusradius,
                            //标题
                            titlecolor:titlecolor,
                            titlefont:titlefont,
                            titlefamilyName:titlefamilyName,
                            titleandroidFamilyName:titleandroidFamilyName,
                            titleleft:titleleft,
                            titletop:titletop,
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
                            //阅读量
                            readcolor:readcolor,
                            readfont:readfont,
                            readfamilyName:readfamilyName,
                            readandroidFamilyName:readandroidFamilyName,
                            readright:readright,
                            readtop:readtop,
                            readbottom:readbottom,
                        }
                        self.$emit('edit_json_mial','',newObject,which_one )
                    }

                })  
                
            },
            //编辑json后，响应的数据
            edit_json_reponse( val_){
                let self = this
                //防止其他模块修改影响到本模块
                if ( val_.name.indexOf('mial') < 0 || 
                    (val_.difference == 'bigImage_230' && self.type_element != 'bigImage_230') ||
                    (val_.difference == 'bigImage_231' && self.type_element != 'bigImage_231') 
                )
                    return
                //整体内嵌
                if ( val_.name.indexOf('mial.entirety') > -1 ) {
                    let margin_arr_ = self.remote_data.margin.split(',')
                    self.remote_data.margin = margin_arr_[0] +','+val_.data
                }
                //整体高度
                else if ( val_.name.indexOf('mial.cell_height') > -1) {
                    self.remote_data.height =  val_.data
                }
                //分割线类型
                else if ( val_.name.indexOf('mial.underline') > -1 ) {
                    let margin_arr_ = self.remote_data.margin.split(',')
                    margin_arr_[0] = val_.data.select
                    self.remote_data.margin = margin_arr_.join(',')
                }
                //图片
                else if ( val_.name.indexOf('mial.img.width') > -1 || val_.name.indexOf('mial.img.height') > -1 ) {
                    if ( self.remote_data.img && self.remote_data.img.child) {
                        self.remote_data.img.child.size ? null : self.remote_data.img.child.size = ['','']
                        let size = self.remote_data.img.child.size.split(',')
                        val_.name.indexOf('mial.img.width') > -1 ? size[0] = val_.data : size[1] = val_.data
                        self.remote_data.img.child.size = size.join(',')
                    }
                }else if ( val_.name.indexOf('mial.img.radius') > -1) {
                    if ( self.remote_data.img && self.remote_data.img.child) {
                        self.remote_data.img.child.radius = val_.data
                    }
                }
                //标题
                else if ( val_.name.indexOf('mial.title.color') > -1) {
                    if ( self.remote_data.title && self.remote_data.title.style) {
                        self.remote_data.title.style.textColor = val_.data
                    }
                }else if ( val_.name.indexOf('mial.title.font') > -1) {
                    if ( self.remote_data.title && self.remote_data.title.style) {
                        self.remote_data.title.style.textSize = val_.data
                    }
                }else if ( val_.name.indexOf('mial.title.familyName') > -1) {
                    if ( self.remote_data.title && self.remote_data.title.style) {
                        self.remote_data.title.style.familyName = val_.data
                    }
                }else if ( val_.name.indexOf('mial.title.androidFamilyName') > -1) {
                    if ( self.remote_data.title && self.remote_data.title.style) {
                        self.remote_data.title.style.androidFamilyName = val_.data
                    }
                }else if ( val_.name.indexOf('mial.title.left') > -1) {
                    if ( self.remote_data.title && self.remote_data.title.layout) {
                        let left = self.remote_data.title.layout.left || 'img,0'//'img,0中img可以是任何字符串'
                        let left_arr = left.split(',')
                        left_arr[1] = val_.data
                        self.remote_data.title.layout.left = left_arr.join(',')
                    }
                }else if ( val_.name.indexOf('mial.title.top') > -1) {
                    if ( self.remote_data.title && self.remote_data.title.layout) {
                        let top = self.remote_data.title.layout.top || 'parent,0'
                        let top_arr = top.split(',')
                        top_arr[1] = val_.data
                        self.remote_data.title.layout.top = top_arr.join(',')
                    }
                }else if ( val_.name.indexOf('mial.title.right') > -1 && val_.difference == 'r') {
                    if ( self.remote_data.title && self.remote_data.title.layout) {
                        let right = self.remote_data.title.layout.right || 'parent,0'
                        let right_arr = right.split(',')
                        right_arr[1] = val_.data
                        self.remote_data.title.layout.right = right_arr.join(',')
                    }
                }
                //标签
                else if ( val_.name.indexOf('mial.tag.color') > -1) {
                    if ( self.remote_data.tag && self.remote_data.tag.style) {
                        self.remote_data.tag.style.textColor = val_.data
                    }
                }else if ( val_.name.indexOf('mial.tag.font') > -1) {
                    if ( self.remote_data.tag && self.remote_data.tag.style) {
                        self.remote_data.tag.style.textSize = val_.data
                    }
                }else if ( val_.name.indexOf('mial.tag.familyName') > -1) {
                    if ( self.remote_data.tag && self.remote_data.tag.style) {
                        self.remote_data.tag.style.familyName = val_.data
                    }
                }else if ( val_.name.indexOf('mial.tag.androidFamilyName') > -1) {
                    if ( self.remote_data.tag && self.remote_data.tag.style) {
                        self.remote_data.tag.style.androidFamilyName = val_.data
                    }
                }else if ( val_.name.indexOf('mial.tag.left') > -1) {
                    if ( self.remote_data.tag && self.remote_data.tag.style) {
                        let left = self.remote_data.tag.layout.left //'img,0中img可以是任何字符串'
                        let left_arr = left.split(',')
                        left_arr[1] = val_.data
                        self.remote_data.tag.layout.left = left_arr.join(',')
                    }
                }else if ( val_.name.indexOf('mial.tag.bottom') > -1) {
                    if ( self.remote_data.tag && self.remote_data.tag.style) {
                        let bottom = self.remote_data.tag.layout.bottom || 'parent,0'
                        let bottom_arr = bottom.split(',')
                        bottom_arr[1] = val_.data
                        self.remote_data.tag.layout.bottom = bottom_arr.join(',')
                    }
                }
                //时间
                else if ( val_.name.indexOf('mial.time.color') > -1) {
                    if ( self.remote_data.time && self.remote_data.time.style) {
                        self.remote_data.time.style.textColor = val_.data
                    }
                }else if ( val_.name.indexOf('mial.time.font') > -1) {
                    if ( self.remote_data.time && self.remote_data.time.style) {
                        self.remote_data.time.style.textSize = val_.data
                    }
                }else if ( val_.name.indexOf('mial.time.familyName') > -1) {
                    if ( self.remote_data.time && self.remote_data.time.style) {
                        self.remote_data.time.style.familyName = val_.data
                    }
                }else if ( val_.name.indexOf('mial.time.androidFamilyName') > -1) {
                    if ( self.remote_data.time && self.remote_data.time.style) {
                        self.remote_data.time.style.androidFamilyName = val_.data
                    }
                }else if ( val_.name.indexOf('mial.time.left') > -1) {
                    if ( self.remote_data.time && self.remote_data.time.style) {
                        let left = self.remote_data.time.layout.left //'img,0中img可以是任何字符串'
                        let left_arr = left.split(',')
                        left_arr[1] = val_.data
                        self.remote_data.time.layout.left = left_arr.join(',')
                    }
                }
                //阅读量
                else if ( val_.name.indexOf('mial.read.color') > -1) {
                    if ( self.remote_data.read && self.remote_data.read.style) {
                        self.remote_data.read.style.textColor = val_.data
                    }
                }else if ( val_.name.indexOf('mial.read.font') > -1) {
                    if ( self.remote_data.read && self.remote_data.read.style) {
                        self.remote_data.read.style.textSize = val_.data
                    }
                }else if ( val_.name.indexOf('mial.read.familyName') > -1) {
                    if ( self.remote_data.read && self.remote_data.read.style) {
                        self.remote_data.read.style.familyName = val_.data
                    }
                }else if ( val_.name.indexOf('mial.read.androidFamilyName') > -1) {
                    if ( self.remote_data.read && self.remote_data.read.style) {
                        self.remote_data.read.style.androidFamilyName = val_.data
                    }
                }else if ( val_.name.indexOf('mial.read.right') > -1) {
                    if ( self.remote_data.read && self.remote_data.read.style) {
                        let right = self.remote_data.read.layout.right || 'parent,0'//'leftImage,0中img可以是任何字符串'
                        let right_arr = right.split(',')
                        right_arr[1] = val_.data
                        self.remote_data.read.layout.right = right_arr.join(',')
                    }
                }else if ( val_.name.indexOf('mial.read.bottom') > -1) {
                    if ( self.remote_data.read && self.remote_data.read.style) {
                        let bottom = self.remote_data.read.layout.bottom || 'parent,0'//'leftImage,0中img可以是任何字符串'
                        let bottom_arr = bottom.split(',')
                        bottom_arr[1] = val_.data
                        self.remote_data.read.layout.bottom = bottom_arr.join(',')
                    }
                }
                //状态
                else if ( val_.name.indexOf('mial.status.color') > -1) {
                    if ( self.remote_data.status && self.remote_data.status.style) {
                        self.remote_data.status.style.textColor = val_.data
                    }
                }else if ( val_.name.indexOf('mial.status.font') > -1) {
                    if ( self.remote_data.status && self.remote_data.status.style) {
                        self.remote_data.status.style.textSize = val_.data
                    }
                }else if ( val_.name.indexOf('mial.status.familyName') > -1) {
                    if ( self.remote_data.status && self.remote_data.status.style) {
                        self.remote_data.status.style.familyName = val_.data
                    }
                }else if ( val_.name.indexOf('mial.status.androidFamilyName') > -1) {
                    if ( self.remote_data.status && self.remote_data.status.style) {
                        self.remote_data.status.style.androidFamilyName = val_.data
                    }
                }else if ( val_.name.indexOf('mial.status.radius') > -1) {
                    if ( self.remote_data.status && self.remote_data.status.style) {
                        self.remote_data.status.style.radius = val_.data
                    }
                }

                self.setLayout( self.remote_data)
                let new_object = JSON.parse( JSON.stringify( self.remote_data))
                self.convertToClent( new_object)

                let pt__ = val_.difference.split('_')[1]
                $.edit_json_remote_post('newsList','1402',pt__,new_object)
                
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
            //将获取的数据再次渲染
            getDataRedraw(){
                let self = this
                if ( $.allowMachine == 1) {
                    let $bli = $('.muti-image'+self.getRandomClassName()+'.copy' ),
                    count = 0
                    setTimeout(function() {
                        if ( $bli.data('contentData') && $bli.data('refresData') ) {
                            $bli.data('refresData',false) 
                            let c_ = JSON.parse( $bli.data('contentData')),
                            j_ = ''
                            if ( self.type_element == 'bigImage_230') {
                                j_ = c_['230']
                            }else if ( self.type_element == 'bigImage_231') {
                                j_ = c_['231']
                            }
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
                $bli = $('.muti-image'+self.getRandomClassName()+'.copy' )

                $.each($bli,(i)=>{
                    let baseData = JSON.parse( $bli.eq(i).data('baseData')),
                    $mimg = $bli.eq(i),
                    $if = $mimg.children('.img-father'),
                    $tf = $mimg.children('.text-father'),
                    $tp_title0 = $mimg.children('.title-package.0').eq(0).clone(),
                    $tp_title1 = $mimg.children('.title-package.1').eq(0).clone()
                    $mimg.empty()
                    
                    let $if_copy= $if.clone(),
                    $status = $if_copy.find('.status'),
                    $img = $if_copy.find('.image'),

                    $tf_copy= $tf.clone(),
                    $tag = $tf_copy.find('.tag'),
                    $time = $tf_copy.find('.time'),
                    $read = $tf_copy.find('.read')

                    $tp_title0.find('.title').text( baseData.title)
                    $tp_title1.find('.title').text( baseData.title)
                    $.each($img,(n)=>{
                        $img.eq(n).css('backgroundImage','url('+(baseData.cover && baseData.cover[0]['path'] || '')+')')
                    })
                    $tag.text( baseData.tags)
                    $time.text( self.getTimeFormatter(baseData.createdAt*1000))
                    $read.text( baseData.viewBaseNum)
                    baseData.live == 0 ? $status.css('display','none') : (function(){
                        let liveStatus = baseData.live == 1 ? '预告' :
                                        baseData.live == 2 ? '直播' :
                                        baseData.live == 3 ? '结束' :
                                        baseData.live == 4 ? '回放' : ''
                        $status.css('display','inline-block')
                        $status.text( liveStatus)
                    })()

                    $mimg.append( $tp_title0)
                    $mimg.append( $if_copy)
                    $mimg.append( $tp_title1)
                    $mimg.append( $tf_copy)

                    $mimg.off('click').on('click',function(){
                        $.click_news_into_particular( baseData)
                    }) 
                })
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
                        "imgUrl":'http://img01.cztv.com/202009/15/4a1b6ea7a22cfe5083d5005251a4e358.jpg',
                        "common":{
                            "border": {
                                "borderColor": "#fff", 
                                "borderWidth": 0, 
                                "borderRadius": 3 
                            },
                            "size":{
                                "width":113,
                                "height":70
                            },
                        }
                    },
                    "title":{
                        "textContent":'古城快拍 吸引游客',
                        "textContent_style":'none',
                        "color":{
                            "textColor":"#000000"
                        },
                        "text":{
                            "textAlignment":0,
                            "font":15,
                            "familyName":"",
                            "androidFamilyName":""
                        },
                    },
                    "tag":{
                        "textContent":'推荐',
                        "color":{
                            "textColor":"#FF6002"
                        },
                        "text":{
                            "textAlignment":0,
                            "font":12,
                            "familyName":"",
                            "androidFamilyName":""
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
                        "textContent":'新闻网 08:39:20',
                        "textContent_style":'none',
                        "color":{
                            "textColor":"#000000"
                        },
                        "text":{
                            "textAlignment":0,
                            "font":13,
                            "familyName":"",
                            "androidFamilyName":""
                        },
                    },
                    "read":{
                        "textContent":'3232',
                        "textContent_style":'none',
                        "color":{
                            "textColor":"#000000"
                        },
                        "text":{
                            "textAlignment":1,
                            "font":13,
                            "familyName":"",
                            "androidFamilyName":""
                        },
                    },
                    //活动状态
                    "status":{
                        "textContent":'预告',
                        "textContent_style":'none',
                        "color":{
                            "textColor":"#ffffff",
                            "bgColor":"#D21313"
                        },
                        "text":{
                            "textAlignment":1,
                            "font":12,
                            "familyName":"",
                            "androidFamilyName":""
                        },
                        "common":{
                            "border": {
                                "borderColor": "#fff", 
                                "borderWidth": 0, 
                                "borderRadius": 2 
                            },
                            "padding":"2px 8px"
                        }
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
    .muti-image{
        width: 100%;
        position: relative;
        overflow: hidden;
        // padding: 5px;
        background-color: @contentbg;
        .img-father{
            white-space: nowrap;
            margin-top: 5px;
            margin-bottom: 5px;
            position: relative;
            .image{
                display: inline-block;
            }
            .status{
                position: absolute;
                left: 5px;
                top: 5px;
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
                .read{
                    // margin-left: -3px;
                }
                .img{
                    display: inline-block;
                    vertical-align: middle;
                    width: 18px;
                    height: 18px;
                    img{
                        width: 100%;
                        height: 100%;
                    }
                }
            }
        }
    }

</style>
<template>
    <div :class='"card-carousel "+randomMark' @click.stop='edit_json_style("1")'>
        
        <div class="img-father">
            <span class="img-text" v-for='(val,key) in (local_data.mainImage ? local_data.mainImage.imgUrlArr : [])' :key='key'>
                <div v-if="type_number != 5 ">
                    <ImageLayout class='image' :layout_data='function() {
                        if ( !local_data.mainImage) {
                            return ;
                        }
                        let new_object = JSON.parse( JSON.stringify( local_data.mainImage))
                        new_object.imgUrl = new_object.imgUrlArr[key]
                        return new_object
                    }()'></ImageLayout>
                </div>
                <div v-if="type_number == 5 " >
                    <video 
                        :id=" 'replay_video'+key " 
                        :style=" function() {
                            let new_object = JSON.parse( JSON.stringify( local_data.mainImage)),
                            imgUrl = new_object.imgUrlArr[key]
                            return 'background-image:'+'url('+imgUrl+')'
                        }()"
                        class="play-video video-js vjs-default-skin " 
                        preload="meta" autoplay  playsinline="true" controlslist="nodownload" disablePictureInPicture
                        > 
                    </video>
                    <div class="volume-package">
                        <img class="img" :src="volumeStartUrl">
                    </div>
                </div>
                <div class="title-package" v-if="type_number == 3 ||type_number == 5">
                    <LabelLayout class='title' :layout_data='function() {
                        if ( !local_data.title) {
                            return ;
                        }
                        let new_object = JSON.parse( JSON.stringify( local_data.title))
                        new_object.textContent = new_object.textContentArr[key]
                        return new_object
                    }()' ></LabelLayout>
                </div>
                <div class="logo-status" v-if="type_number != 4 && type_number != 5 ">
                    <ImageLayout class='logo':layout_data='local_data.mainImage ? local_data.mainImage.logo :"" '></ImageLayout>
                    <LabelLayout class='status' :layout_data='local_data.mainImage ? local_data.mainImage.status :"" ' ></LabelLayout>
                    <LabelLayout class='takePart' :layout_data='local_data.mainImage ? local_data.mainImage.takePart :"" ' ></LabelLayout>
                </div>
            </span>
        </div>
        <div class="bottom-title-package" v-if=" type_number != 3 && type_number != 5 ">
            <LabelLayout class='title' :layout_data='local_data.title || "" ' ></LabelLayout>
            <LabelLayout class='reference' :layout_data='local_data.reference || "" ' ></LabelLayout>
        </div>
        <div  
            v-if="type_number == 5 "
            class="video-page-control" 
            :style=" function() {
                    let length_ = local_data.mainImage ? local_data.mainImage.imgUrlArr.length : 1
                    return 'width:'+ pageWidth/length_ + 'px'
                }() " 
            >        
        </div>
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

                type_module_:'',
                type_number:'',

                volumeMuteUrl:require('static/img/volume_mute.png'),
                volumeStartUrl:require('static/img/volume_start.png'),

                local_data:{},//本地数据
                remote_data:{}, //要更改的远程json数据
            }
        },
        watch:{
            cardcData:function (newVal,oldVal ) {
               let self = this
            }
        },
        created(){
            let self = this;
        },
        mounted(){
            let self = this
            self.type_module_ = self._props.typeids
            $.allowMachine == 1 ? self.pageWidth = $(window).width() : null

            let cardc_data_ = ''
            if ( self.type_module_ == 'bigImage_1102') {
                self.type_number = 2
                cardc_data_ = self._props.cardcData['1102'] || ''
            }else if ( self.type_module_ == 'bigImage_1103') {
                self.type_number = 3
                cardc_data_ = self._props.cardcData['1103'] || ''
            }else if ( self.type_module_ == 'bigImage_1104') {
                self.type_number = 4
                cardc_data_ = self._props.cardcData['1104'] || ''
            }else if ( self.type_module_ == 'bigImage_1105') {
                self.type_number = 5
                cardc_data_ = self._props.cardcData['1105'] || ''
            }
            self.convertSpecialToNormal( cardc_data_,'shadowColor')
            self.convertToWeb( cardc_data_)
            self.setLayout( cardc_data_)
            self.getDataRedraw()
            self.$emit('edit_json_cardc',function( val_){
                self.edit_json_reponse( val_)
            },'','') 
        },
        props: ['cardcData','typeids'],
        components:{
            LabelLayout,
            ImageLayout,
            ViewLayout,
        },
        methods:{
            setLayout( cardc_){
                let self = this 
                if ( !cardc_) 
                    return
                let cardc_common = cardc_[0]
                if ( !cardc_common) 
                    return

                let local_style_data = self.getlocalData(),
                remote_type = self.type_module_ == 'bigImage_1103' ? 1 : 0, //判断当前是哪一种卡片轮播
                $cc_ = $('.card-carousel'+self.getRandomClassName() )

                //整体高度
                let cell_height = -1
                {
                    cell_height = cardc_common.height
                }

                //设置图片
                let img_margin = [0,0,0,0],img_width = 0 , img_height = 0 , img_radius = 0 
                if ( cardc_common.img) {
                    let main_image = local_style_data.mainImage
                    
                    // let margin = !!cardc_common.img.child && !!cardc_common.img.child.margin ? cardc_common.img.child.margin.split(',') : []
                    // img_margin[0] = margin[0] || (remote_type ? 0 : 10)
                    // img_margin[1] = margin[1] || (remote_type ? 0 : 10)
                    // img_margin[2] = margin[2] || (remote_type ? 0 : 10)
                    // img_margin[3] = margin[3] || (remote_type ? 0 : 10)
                    // cardc_common.img.child.margin = img_margin.join(',')

                    let size = cardc_common.img.child && cardc_common.img.child.size ? cardc_common.img.child.size.split(',') : []
                    self.type_number == 4 || self.type_number == 5 ? size[0] = self.pageWidth : null
                    size[0] && parseFloat( size[0]) >= 0 ? main_image.common.size.width = img_width= size[0] : img_width= main_image.common.size.width 
                    size[1] && parseFloat( size[1]) >= 0 ? main_image.common.size.height = img_height = size[1] :null
 
                    main_image.common.border.borderRadius = img_radius= cardc_common.img.child.radius
                }
                //标题阴影部分
                let shadow_color = {}
                if ( cardc_common.view && cardc_common.view.style && remote_type ) {
                    let color_ = local_style_data.shadowColor
                    color_.bgColorTop = cardc_common.view.style.shadowColor_top
                    color_.bgAlphaTop = cardc_common.view.style.shadowColor_top_opacity

                    color_.bgColorBottom = cardc_common.view.style.shadowColor_bottom
                    color_.bgAlphaBottom = cardc_common.view.style.shadowColor_bottom_opacity
                    shadow_color = color_
                }
                //设置标题
                if ( cardc_common.title){
                    let title = local_style_data.title , reference = local_style_data.reference 
                    title.color.textColor = cardc_common.title.style.textColor
                    title.text.font = cardc_common.title.style.textSize
                    title.text.familyName = cardc_common.title.style.familyName
                    title.text.androidFamilyName = cardc_common.title.style.androidFamilyName
                    
                    reference.color.textColor = cardc_common.title.style.textColor
                    reference.text.font = cardc_common.title.style.textSize
                    reference.text.familyName = cardc_common.title.style.familyName
                }
                //状态
                let status_bgColor = '',status_radius = 0
                if ( cardc_common.status && cardc_common.status.style) {
                    // local_style_data.mainImage.status.color.textColor = cardc_common.status.style.textColor
                    // local_style_data.mainImage.status.text.font = cardc_common.status.style.textSize
                    // local_style_data.mainImage.status.text.familyName = cardc_common.status.style.familyName
                    // local_style_data.mainImage.status.text.androidFamilyName = cardc_common.status.style.androidFamilyName
                    local_style_data.mainImage.takePart.color.textColor = cardc_common.status.style.textColor
                    local_style_data.mainImage.takePart.text.font = cardc_common.status.style.textSize
                    status_radius = cardc_common.status.style.radius
                    status_bgColor = cardc_common.status.style.bgColor
                }
                //索引控制
                if ( cardc_common.pageControl){
                    let reference = local_style_data.reference 
                    reference.color.textColor = cardc_common.pageControl.style.textColor
                    reference.text.font = cardc_common.pageControl.style.textSize
                    reference.text.familyName = cardc_common.pageControl.style.familyName
                    reference.text.androidFamilyName = cardc_common.pageControl.style.androidFamilyName
                }
                //动画时间
                if ( cardc_common.delay) {
                    local_style_data.pageControl.interval = cardc_common.delay
                }
                
                self.$nextTick( ()=>{
                    $cc_.css({
                        height:cell_height <0 ? 'auto' :cell_height+'px',
                    })

                    //设置图片文字模块
                    $cc_.find('.img-text').eq(1).css({
                        // margin:img_margin[0]+'px '+img_margin[1]+'px '+img_margin[2]+'px '+img_margin[3]+'px'
                    })
                    $cc_.find('.img-text').eq(0).css({
                        // marginLeft:(-img_width+ (self.pageWidth - img_width)/2 - img_margin[3])+'px',
                        width:img_width+'px',
                    })
                    
                    //设置标题阴影
                    if ( remote_type) {
                        $cc_.find('.title-package').css({
                            backgroundImage :'linear-gradient('+self.hexToRgb(shadow_color.bgColorTop,shadow_color.bgAlphaTop)+','+ self.hexToRgb(shadow_color.bgColorBottom,shadow_color.bgAlphaBottom) +')' ,
                            borderBottomRightRadius: img_radius,
                            borderBottomLeftRadius: img_radius,
                        })
                    }else{
                        //设置标题
                        self.type_number == 4 ? img_width -= 30 : null
                        let btpReferenceWidth = $cc_.find('.bottom-title-package').find('.reference').width(),
                        btptitlewidth = img_width - btpReferenceWidth-10

                        $cc_.find('.bottom-title-package').css({
                            margin:'0 '+ (self.pageWidth - img_width)/2+'px',
                            width: img_width
                        })
                        $cc_.find('.bottom-title-package').find('.title').css('width',btptitlewidth+'px' )
                        //设置数字索引
                        $cc_.find('.bottom-title-package').find('.reference').css('width',btpReferenceWidth+'px')
                        
                    }

                    //设置状态
                    $cc_.find('.logo-status').css({
                        backgroundColor:status_bgColor,
                        borderRadius:status_radius+'px',
                    })

                    //设置视频高度
                    $cc_.find('.play-video').css({
                        height: img_height < 0 ? '100px' : img_height+'px',
                        width:self.pageWidth+'px',
                    })

                    if ( $.allowMachine != 1) {
                        self.interval_card( 0,self.local_data.title.textContentArr,'',self.type_number != 4 && self.type_number != 5 ) 
                    }
                })
                //持有外部json数据
                self.remote_data = cardc_
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
                let $cc_ = $('.card-carousel'+self.getRandomClassName() )
                let which_one = self.type_module_
                self.$nextTick( ()=>{
                    if ( id_ == '1') {
                        //修改整体边距
                        $cc_.addClass('border-style-0').addClass('boder-color-animation') 

                        let card_common = self.remote_data[0]

                        //整体高度
                        let cell_height = card_common.height
                        //修改图片样式
                        let imgMargin = card_common.img.child.margin , imgradius = card_common.img.child.radius ,imgwidth = 0 ,imgheight = 0 
                        if (card_common.img.child.size ) {
                            let size = card_common.img.child.size.split(',')
                            imgwidth = size[0] || 0
                            imgheight = size[1] || 0
                        }
                        
                        //标题阴影
                        let shadow_top_Color = '' , shadow_top_opacity = '' , shadow_bottom_Color = '', shadow_bottom_opacity = ''
                        if ( card_common.view && card_common.view.style) {
                            shadow_top_Color = card_common.view.style.shadowColor_top
                            shadow_top_opacity = card_common.view.style.shadowColor_top_opacity

                            shadow_bottom_Color = card_common.view.style.shadowColor_bottom
                            shadow_bottom_opacity = card_common.view.style.shadowColor_bottom_opacity
                        }
                        //修改标题样式
                        let color = '' ,font = '' ,familyName = '' ,android_familyName = '' 
                        if ( card_common.title && card_common.title.style) {
                            color = card_common.title.style.textColor || ''
                            font = card_common.title.style.textSize || ''
                            familyName = card_common.title.style.familyName || ''
                            android_familyName = card_common.title.style.androidFamilyName || ''
                        }

                        //修改索引样式
                        let pageControl_color = '' ,pageControl_font = '' ,pageControl_familyName = '' ,pageControl_android_familyName = '' 
                        if ( card_common.pageControl && card_common.pageControl.style) {
                            pageControl_color = card_common.pageControl.style.textColor || ''
                            pageControl_font = card_common.pageControl.style.textSize || ''
                            pageControl_familyName = card_common.pageControl.style.familyName || ''
                            pageControl_android_familyName = card_common.pageControl.style.androidFamilyName || ''
                        }
                        
                        //状态
                        let status_color = '' ,status_font = '' ,status_familyName = '' ,status_android_familyName = '' ,status_bgColor = '' ,status_radius = '' 
                        if ( card_common.status && card_common.status.style) {
                            status_color = card_common.status.style.textColor || ''
                            status_font = card_common.status.style.textSize || ''
                            status_familyName = card_common.status.style.familyName || ''
                            status_android_familyName = card_common.status.style.androidFamilyName || ''
                            status_bgColor = card_common.status.style.bgColor
                            status_radius = card_common.status.style.radius
                        }

                        //动画时间
                        let anim_durtion = '',delay = ''
                        if ( card_common.anim_durtion) {
                            anim_durtion = parseFloat( card_common.anim_durtion) / 1000
                        }
                        if ( card_common.delay) {
                            delay = parseFloat( card_common.delay) / 1000
                        }

                        let new_object = { 
                            //整体高度
                            cell_height:cell_height,
                            //图片
                            imgMargin:imgMargin,
                            imgradius:imgradius,
                            imgwidth:imgwidth,
                            imgheight:imgheight,
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
                            //索引
                            pageControl_color:pageControl_color,
                            pageControl_font:pageControl_font,
                            pageControl_familyName:pageControl_familyName,
                            pageControl_android_familyName:pageControl_android_familyName,
                            //状态
                            status_color:status_color,
                            status_font:status_font,
                            status_familyName:status_familyName,
                            status_android_familyName:status_android_familyName,
                            status_bgColor:status_bgColor,
                            status_radius:status_radius,
                            //动画时间
                            anim_durtion:anim_durtion,
                            delay:delay,
                        } 
                        self.$emit('edit_json_cardc','',new_object,which_one )
                    }

                })  
                
            },
            //编辑json后，响应的数据
            edit_json_reponse( val_){
                let self = this
                //防止其他模块修改影响到本模块
                if ( val_.name.indexOf('cardc') < 0 || 
                    (val_.difference == 'bigImage_1102'&& self.type_module_ != 'bigImage_1102') || 
                    (val_.difference == 'bigImage_1103'&& self.type_module_ != 'bigImage_1103') || 
                    (val_.difference == 'bigImage_1104'&& self.type_module_ != 'bigImage_1104') || 
                    (val_.difference == 'bigImage_1105'&& self.type_module_ != 'bigImage_1105')
                ) 
                    return

                let card_common = self.remote_data[0]
                //整体高度
                if ( val_.name.indexOf('cardc.cell_height') > -1) {
                    card_common.height =  val_.data
                }
                //图片
                else if ( val_.name.indexOf('cardc.img.margin') > -1 ) {
                    if ( card_common.img && card_common.img.child) {
                        card_common.img.child.margin = val_.data
                    }
                }else if ( val_.name.indexOf('cardc.img.radius') > -1) {
                    if ( card_common.img && card_common.img.child) {
                        card_common.img.child.radius = val_.data
                    }
                }else if ( val_.name.indexOf('cardc.img.width') > -1 || val_.name.indexOf('cardc.img.height') > -1 ) {
                    if ( card_common.img && card_common.img.child) {
                        let size = card_common.img.child.size ? card_common.img.child.size.split(',') :['','']
                        val_.name.indexOf('cardc.img.width') > -1 ? size[0] = val_.data : size[1] = val_.data
                        card_common.img.child.size = size.join(',')
                    }
                }
                //阴影
                else if ( val_.name.indexOf('cardc.shadow_top_Color') > -1) {
                    if ( card_common.view && card_common.view.style) {
                        card_common.view.style.shadowColor_top = val_.data
                        let topcolor_origin = card_common.view.style.shadowColor_top_origin || ''
                        if ( topcolor_origin) {
                            let prefix = topcolor_origin.slice(0,3)
                            prefix += val_.data.slice(1)
                            card_common.view.style.shadowColor_top_origin = prefix
                        }
                    }
                }else if ( val_.name.indexOf('cardc.shadow_top_opacity') > -1) {
                    if ( card_common.view && card_common.view.style) {
                        card_common.view.style.shadowColor_top_opacity = val_.data
                        var topcolor_origin = card_common.view.style.shadowColor_top_origin || ''

                        if ( topcolor_origin) {
                            let op_ = Math.floor( parseFloat( val_.data)*255)
                            op_ =op_.toString(16).toUpperCase()
                            let suffix = topcolor_origin.slice(3)
                            op_.length == 1 ? op_ = '0'+op_ : null
                            card_common.view.style.shadowColor_top_origin = '#'+op_+suffix
                        }
                    }
                }else if ( val_.name.indexOf('cardc.shadow_bottom_Color') > -1) {
                    if ( card_common.view && card_common.view.style) {
                        card_common.view.style.shadowColor_bottom = val_.data
                        let bottomcolor_origin = card_common.view.style.shadowColor_bottom_origin || ''
                        if ( bottomcolor_origin) {
                            let prefix = bottomcolor_origin.slice(0,3)
                            prefix += val_.data.slice(1)
                            card_common.view.style.shadowColor_bottom_origin = prefix
                        }
                    }
                }else if ( val_.name.indexOf('cardc.shadow_bottom_opacity') > -1) {
                    if ( card_common.view && card_common.view.style) {
                        card_common.view.style.shadowColor_bottom_opacity = val_.data
                        var bottomcolor_origin = card_common.view.style.shadowColor_bottom_origin || ''

                        if ( bottomcolor_origin) {
                            let op_ = Math.floor( parseFloat( val_.data)*255)
                            op_ =op_.toString(16).toUpperCase()
                            let suffix = bottomcolor_origin.slice(3)
                            op_.length == 1 ? op_ = '0'+op_ : null
                            card_common.view.style.shadowColor_bottom_origin = '#'+op_+suffix
                        }
                    }
                }
                //标题
                else if ( val_.name.indexOf('cardc.title.color') > -1) {
                    if ( card_common.title && card_common.title.style) {
                        card_common.title.style.textColor = val_.data
                    }
                }else if ( val_.name.indexOf('cardc.title.font') > -1) {
                    if ( card_common.title && card_common.title.style) {
                        card_common.title.style.textSize = val_.data
                    }
                }else if ( val_.name.indexOf('cardc.title.familyName') > -1) {
                    if ( card_common.title && card_common.title.style) {
                        card_common.title.style.familyName = val_.data
                    }
                }else if ( val_.name.indexOf('cardc.title.androidfamilyName') > -1) {
                    if ( card_common.title && card_common.title.style) {
                        card_common.title.style.androidFamilyName = val_.data
                    }
                }
                //直播状态
                else if ( val_.name.indexOf('cardc.status.color') > -1) {
                    if ( card_common.status && card_common.status.style) {
                        card_common.status.style.textColor = val_.data
                    }
                }else if ( val_.name.indexOf('cardc.status.font') > -1) {
                    if ( card_common.status && card_common.status.style) {
                        card_common.status.style.textSize = val_.data
                    }
                }else if ( val_.name.indexOf('cardc.status.familyName') > -1) {
                    if ( card_common.status && card_common.status.style) {
                        card_common.status.style.familyName = val_.data
                    }
                }else if ( val_.name.indexOf('cardc.status.androidfamilyName') > -1) {
                    if ( card_common.status && card_common.status.style) {
                        card_common.status.style.androidFamilyName = val_.data
                    }
                }else if ( val_.name.indexOf('cardc.status.bgColor') > -1) {
                    if ( card_common.status && card_common.status.style) {
                        card_common.status.style.bgColor = val_.data
                    }
                }else if ( val_.name.indexOf('cardc.status.radius') > -1) {
                    if ( card_common.status && card_common.status.style) {
                        card_common.status.style.radius = val_.data
                    }
                }
                //索引
                else if ( val_.name.indexOf('cardc.pageControl.color') > -1) {
                    if ( card_common.pageControl && card_common.pageControl.style) {
                        card_common.pageControl.style.textColor = val_.data
                    }
                }else if ( val_.name.indexOf('cardc.pageControl.font') > -1) {
                    if ( card_common.pageControl && card_common.pageControl.style) {
                        card_common.pageControl.style.textSize = val_.data
                    }
                }else if ( val_.name.indexOf('cardc.pageControl.familyName') > -1) {
                    if ( card_common.pageControl && card_common.pageControl.style) {
                        card_common.pageControl.style.familyName = val_.data
                    }
                }else if ( val_.name.indexOf('cardc.pageControl.androidfamilyName') > -1) {
                    if ( card_common.pageControl && card_common.pageControl.style) {
                        card_common.pageControl.style.androidFamilyName = val_.data
                    }
                }
                //动画时间
                else if ( val_.name.indexOf('cardc.anim_durtion') > -1) {
                    if ( card_common.anim_durtion) {
                        card_common.anim_durtion = parseFloat( val_.data) * 1000
                    }
                }else if ( val_.name.indexOf('cardc.delay') > -1) {
                    if ( card_common.delay) {
                        card_common.delay = parseFloat( val_.data) * 1000
                    }
                }

                self.setLayout( self.remote_data)
                let new_object = JSON.parse( JSON.stringify( self.remote_data))
                self.convertToClent( new_object)

                val_.difference == 'bigImage_1103' ? new_object[0].view.style.shadowColor = new_object[0].view.style.shadowColor_top+','+new_object[0].view.style.shadowColor_bottom : null
                let pt__ = val_.difference.split('_')[1]
                $.edit_json_remote_post('newsList','banner',pt__,new_object)
                
            },
            //轮动旋转卡片
            interval_card( interid,contentArr,idl_ ,isZoom){
                let self = this,
                $cc_ = $('.card-carousel'+self.getRandomClassName()+idl_ ).eq(interid),
                inerval_rotate = ( $ccl,i)=>{
                    let $content_if = $ccl.find('.img-father'),
                    $btp = $ccl.find('.bottom-title-package'),
                    indexNumber = 0, 
                    index = 0,
                    imgtArr = [],
                    initialPosition = 0,
                    move_width = $content_if.find(".img-text").width()

                    $content_if.find(".img-text.tmp").remove()
                    contentArr.forEach( (item,m)=>{
                        let imgt = $content_if.find(".img-text").eq(m),
                        title_ = imgt.find('.title')
                        title_.text( item)
                    })
                    indexNumber = $content_if.find(".img-text").length+1
                    $btp.find('.title').text( contentArr[index])
                    $btp.find('.reference').text( index+1+'/'+(indexNumber-1) )

                    $.each( $content_if.find(".img-text") ,(n)=>{
                        let imgt = $content_if.find(".img-text").eq(n),
                        imgtcl = imgt.clone()
                        imgtcl.addClass('tmp')
                        imgtArr.push( imgtcl)
                    })
                    initialPosition = -move_width*imgtArr.length +(self.pageWidth - move_width)/2
                    imgtArr.reverse()

                    let imgtFirst = $content_if.find(".img-text").first(),
                    imgtsecond = $content_if.find(".img-text").eq(1),
                    cloneFirst = imgtFirst.clone(),
                    cloneSecond = imgtsecond.clone()
                    cloneFirst.data('concrete_data',imgtFirst.data('concrete_data') )
                    cloneSecond.data('concrete_data',imgtsecond.data('concrete_data') )

                    cloneFirst.addClass('tmp')
                    cloneFirst.addClass('first')
                    cloneSecond.addClass('tmp')
                    $content_if.append(cloneFirst)
                    $content_if.append(cloneSecond)
                    
                    imgtArr.forEach( (item)=>{
                        $content_if.prepend( item)
                    })

                    $content_if.css("marginLeft",initialPosition+"px")
                    zoomimt( index)

                    clearInterval( self['timer_croll'+i] )
                    self['timer_croll'+i] = setInterval(cardLoop,self.local_data.pageControl.interval)

                    function cardLoop( vali){
                        index++; var tail = false , title_index = (index >= imgtArr.length ? index-imgtArr.length :index)
                        zoomimt( title_index)
                        $btp.find('.title').text( contentArr[title_index ])
                        $btp.find('.reference').text( title_index+1+'/'+(indexNumber-1) )
                        if(index == indexNumber){    
                            $content_if.css("marginLeft",initialPosition+"px")
                            index = 1;   
                        }    
                        $content_if.stop().animate({marginLeft:initialPosition+(-index* move_width) },500); 
                        index == indexNumber-1 ? tail = true : null
                    }
                    function zoomimt( im){
                        isZoom ? $content_if.find(".img-text").css('transform','scaleY(0.8)') : null
                        $content_if.find(".img-text").not('.tmp').eq(im).css('transform','scaleY(1.0)')
                        im == 0 ? $content_if.find(".img-text.tmp.first").css('transform','scaleY(1.0)') : null

                        //视频索引
                        let lmilength = self.local_data.mainImage.imgUrlArr.length
                        im != 0 ? $cc_.find(".video-page-control").animate({'left': im*self.pageWidth/lmilength+'px' },500) : $cc_.find(".video-page-control").css({left:0})
                    }
                }
                inerval_rotate( $cc_,interid )

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
                    }else if ( (typeof data_[key_] == 'object') && data_[key_] !=null ) {
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
                    let $bli = $('.card-carousel'+self.getRandomClassName()+'.copy')
                    setTimeout(function() {
                        if ( $bli.data('contentData') && $bli.data('refresData') ) {
                            $bli.data('refresData',false) 
                            let c_ = JSON.parse( $bli.data('contentData')),
                            j_ = ''
                            if ( self.type_module_ == 'bigImage_1102') {
                                j_ = c_['1102']
                            }else if ( self.type_module_ == 'bigImage_1103') {
                                j_ = c_['1103']
                            }else if ( self.type_module_ == 'bigImage_1104') {
                                j_ = c_['1104']
                            }else if ( self.type_module_ == 'bigImage_1105') {
                                j_ = c_['1105']
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
                $bli = $('.card-carousel'+self.getRandomClassName()+'.copy' )

                $.each($bli,(i)=>{
                    let baseData = JSON.parse( $bli.eq(i).data('baseData')),
                    $it = $bli.eq(i).find('.img-text').eq(0),
                    $if = $bli.eq(i).find('.img-father'),
                    title_arr = []
                    $if.empty()
                    baseData.items.forEach( (item,n)=>{
                        let $it_copy= $it.clone()
                        $it_copy.find('.image').css('backgroundImage','url('+item.thumb+')')
                        $it_copy.find('.title').find('span').text( item.title)
                        $it_copy.data('concrete_data',item)
                        title_arr.push( item.title)
                        $if.append( $it_copy)
                    })
                    self.interval_card(i,title_arr,'.copy')
                    $if.find('.img-text').on('click',function(){
                        $.click_news_into_particular( $(this).data('concrete_data'))
                    })
                })
                $bli.find('.logo-status').css('display','none')
                $bli.css('display','block')
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
                            'http://img01.cztv.com/archive/ZmlsZT1odHRwOi8vaW1nMDEuY3p0di5jb20vMjAxOTEyLzI0L2Y5OGY1NjljODkxMDMyZTRkMTZjMGQxZjE4ODVhN2E5LmpwZyZheGlzPTAsMCZzaXplPTE0MzYsMTA4MCZ0c2l6ZT0xNDM2LDEwODA=.jpg',
                            'http://img01.cztv.com/archive/ZmlsZT1odHRwOi8vaW1nMDEuY3p0di5jb20vMjAxOTEyLzE5L2FlM2JhY2NiMWMwM2UwYzc3MTQ5NGIzM2UzZGU1MzU3LmpwZyZheGlzPTAsMCZzaXplPTcxMCw1MzQmdHNpemU9NzEwLDUzNA==.jpg',
                            'http://img01.cztv.com/archive/ZmlsZT1odHRwOi8vaW1nMDEuY3p0di5jb20vMjAxOTEyLzIzL2MzYjUzMmExYTgwMjhjZDcxNTI3NTI2NzdmZmMzMDY2LmpwZyZheGlzPTAsMCZzaXplPTE0MzYsMTA4MCZ0c2l6ZT0xNDM2LDEwODA=.jpg'
                        ],
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
                                    "height":15
                                },
                            }
                        },
                        "takePart":{
                            "textContent":'2331人参与',
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
                        "common":{
                            "border": {
                                "borderColor": "#fff", 
                                "borderWidth": 0, 
                                "borderRadius": 3 
                            },
                            "size":{
                                "width":300,
                                "height":158
                            },
                        }
                    },
                    'pageControl':{
                        'interval':3000
                    },
                    "shadowColor": {
                        "bgColorTop": "#000000",
                        "bgAlphaTop":'1.0',
                        "bgColorBottom": "#000000",
                        "bgAlphaBottom":'1.0'
                    },
                    "title":{
                        "textContent":'',
                        "textContentArr":['红了枫林 杭城秋色浓','冰雪中的镜泊湖','安昌古镇酱味飘香'],
                        "textContent_style":'none',
                        "color":{
                            "textColor":"#000000"
                        },
                        "text":{
                            "textAlignment":0,
                            "font":15,
                            "familyName":"",
                            "androidFamilyName":"",
                        },
                    },
                    "reference":{
                        "textContent":'1/5',
                        "textContent_style":'none',
                        "color":{
                            "textColor":"#000000"
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
    @import '../../publicStyle';
    @contentbg:#fff;
    .card-carousel{
        width: 100%;
        position: relative;
        overflow: hidden;
        background-color: @contentbg;

        .img-father{
            white-space: nowrap;
            overflow: hidden;
            position: relative;
            .img-text{
                display: inline-block;
                position: relative;
                text-align: center;
                vertical-align: middle;
                .image{
                    display: inline-block;
                }
                .play-video{
                    background-size: cover;
                }
                .volume-package{
                    position: absolute;
                    right: 15px;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 38px;
                    .img{
                        width: 100%;
                    }
                }
                .title-package{
                    position: absolute;
                    bottom: 3px;
                    left: 0;
                    width: 100%;
                    padding: 5px 10px;
                    text-align: left;
                }
                .logo-status{
                    position: absolute;
                    display: table-cell;
                    vertical-align: middle;
                    top: 5px;
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
            // .img-text:nth-of-type(1) , .img-text:nth-of-type(3){
            //     transform: scaleY(0.8);     
            // }
            .bottom-title-package{
                .reference{
                    vertical-align: middle;
                }
            }
        }  
        .video-page-control{
            position: absolute;
            bottom: 0;
            width: 100%;
            height: 2px;
            background-color: rgb(200,110,34);
        }

    }

</style>
<template>
    <div :class='"muti-image-text "+randomMark' @click.stop='edit_json_style("1")'>

        <div class="img-father" 
            v-for="(fval,fkey) in 
                local_data.mainImage ? 
                (   type_number == 2 ? 
                    local_data.mainImage.imgUrlArr1302 : 
                    type_number == 8 ?
                        local_data.mainImage.imgUrlArr1308 :
                        local_data.mainImage.imgUrlArr1303 
                )  
                :[]"
            >
            <span class="img-text" v-for="(val,key) in fval" :key='key'>

                <div class="img-package">
                    <ImageLayout class='image' :layout_data='function() {
                        if ( !local_data.mainImage) {
                            return ;
                        }
                        let new_object = JSON.parse( JSON.stringify( local_data.mainImage))
                        new_object.imgUrl = val
                        return new_object
                    }()'></ImageLayout>
                    <LabelLayout 
                        class='inner-title' 
                        v-if = ' type_number ==5 ' 
                        :layout_data='function() {
                            if ( !local_data.title) {
                                return ;
                            }
                            let new_object = JSON.parse( JSON.stringify( local_data.title))           
                            if ( type_number == 2) {
                                new_object.textContent = new_object.textContentArr1302[fkey][key]
                            }
                            else{
                                new_object.textContent = new_object.textContentArr1303[fkey][key]
                            }
                            
                            return new_object}()' >  
                    </LabelLayout>
                </div>
                <div class="title-package" v-if = ' type_number != 5 '>
                    <LabelLayout class='title' :layout_data='function() {
                        if ( !local_data.title) {
                            return ;
                        }
                        let new_object = JSON.parse( JSON.stringify( local_data.title))           
                        if ( type_number == 2) {
                            new_object.textContent = new_object.textContentArr1302[fkey][key]
                        }
                        else{
                            new_object.textContent = new_object.textContentArr1303[fkey][key]
                        }
                        
                        return new_object
                    }()' ></LabelLayout>
                    <div v-if = 'type_number == 6 || type_number == 8 ' >
                        <LabelLayout class='attention' :layout_data='function() {
                            if ( !local_data.attention) {
                                return 
                            }
                            let new_object = type_number == 6 ? JSON.parse( JSON.stringify( local_data.attention)) : JSON.parse( JSON.stringify( local_data.intro)),
                            tcc =  type_number == 6 ? new_object.textContentArr1306 : new_object.textContentArr1308
                            new_object.textContent = tcc[fkey][key]
                            return new_object
                        }()' ></LabelLayout>
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
                type_number:'',
            }
        },
        watch:{
            tsbData:function (newVal,oldVal ) {
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

            let tsb_data_
            if ( self.type_element == 'bigImage_1302') {
                self.type_number = 2
                tsb_data_= self._props.tsbData['1302']
            }else if ( self.type_element == 'bigImage_1303') {
                self.type_number = 3
                tsb_data_= self._props.tsbData['1303']
            }else if ( self.type_element == 'bigImage_1305') {
                self.type_number = 5
                tsb_data_= self._props.tsbData['1305']
            }else if ( self.type_element == 'bigImage_1306') {
                self.type_number = 6
                tsb_data_= self._props.tsbData['1306']
            }else if ( self.type_element == 'bigImage_1308') {
                self.type_number = 8
                tsb_data_= self._props.tsbData['1308']
            }
            !tsb_data_ ? tsb_data_ = {} : null
            self.convertToWeb( tsb_data_)
            self.setLayout( tsb_data_)
            self.getDataRedraw()
            self.$emit('edit_json_tsb',function( val_){
                self.edit_json_reponse( val_)
            },'','') 
        },
        props: ['tsbData','typeids'],
        components:{
            LabelLayout,
            ImageLayout,
            ViewLayout,
        },
        methods:{
            setLayout( tsb_){
                let self = this 
                if ( !tsb_) 
                    return
                let remote_ = tsb_[0]
                if ( !remote_) 
                    return

                let local_style_data = self.getlocalData()
                let mit_ = $('.muti-image-text'+self.getRandomClassName() )

                //设置边距
                let padding_ = '';let padding_left = 0 ; let padding_right = 0 
                {   

                    if ( remote_.margin) {
                        let margin_arr_ = remote_.margin.split(',')
                        if ( margin_arr_.length > 4) {
                            margin_arr_.shift() 
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
                    cell_height = remote_.height
                }
                //设置图片
                let img_left = 0,img_top = 0 ,img_right = 0 ,img_bottom = 0,itemWidth = (self.pageWidth - padding_left - padding_right)/2 -20
                if ( remote_.img) {
                    let main_image = local_style_data.mainImage
                    let img_width = 0

                    let size = remote_.img.child && remote_.img.child.size ? remote_.img.child.size.split(',') : []
                    size[0] && parseFloat( size[0]) >= 0 ? main_image.common.size.width = size[0] :main_image.common.size.width = itemWidth
                    size[0] ? img_width = size[0] : img_width = main_image.common.size.width
                    size[1] && parseFloat( size[1]) >= 0 ? main_image.common.size.height = size[1] :null

                    main_image.common.border.borderRadius = remote_.img.child.radius

                }
                //设置文字
                let title_left = 0,title_top = 0 ,title_right = 0 ,title_bottom = 0
                if ( remote_.title){
                    let title = local_style_data.title
                    title.color.textColor = remote_.title.style.textColor
                    title.color.bgColor = remote_.title.style.bgColor
                    title.text.font = remote_.title.style.textSize
                    title.text.familyName = remote_.title.style.familyName
                    title.text.androidFamilyName = remote_.title.style.androidFamilyName
                }

                //设置关注
                if ( remote_.attention ){
                    let attention = local_style_data.attention
                    attention.color.bgColor = remote_.attention.style.bgColor
                    attention.color.textColor = remote_.attention.style.textColor
                    attention.text.font = remote_.attention.style.textSize
                    attention.text.familyName = remote_.attention.style.familyName
                    attention.text.androidFamilyName = remote_.attention.style.androidFamilyName
                    attention.common.border.borderRadius = remote_.attention.style.radius
                }

                //设置子标题(详解)
                if ( remote_.intro ){
                    let intro = local_style_data.intro
                    intro.color.textColor = remote_.intro.style.textColor
                    intro.text.font = remote_.intro.style.textSize
                    intro.text.familyName = remote_.intro.style.familyName
                    intro.text.androidFamilyName = remote_.intro.style.androidFamilyName
                }
                
                self.$nextTick( ()=>{
                    //设置内边距
                    mit_.css({
                        margin :padding_,
                        height:cell_height <0 ? 'auto' :cell_height+'px',
                    })

                    //设置集合
                    if ( self.type_element == 'bigImage_1302') {
                        let cellItemWidth = (self.pageWidth - padding_left - padding_right -20 -20 )/3,
                        imgTextLength = mit_.find('.img-text').length,
                        styled_bottom = {
                            marginBottom:'10px'
                        },
                        styled_lr = {
                            marginLeft:'20px',
                            marginRight:'20px',
                        }
                        local_style_data.mainImage.imgUrlArr1302.forEach( (item,i)=>{
                            mit_.find('.img-text').eq(i*3+1).css( styled_lr)
                        })
                        $.each( mit_.find('.img-text'),(i)=>{
                            i < imgTextLength-3 ? mit_.find('.img-text').eq(i).css( styled_bottom) : null
                        })
                        
                        mit_.find('.img-text').css({
                            width:cellItemWidth+'px'
                        })
                    }else if ( 
                        self.type_element == 'bigImage_1303' || 
                        self.type_element == 'bigImage_1305' || 
                        self.type_element == 'bigImage_1306' || 
                        self.type_element == 'bigImage_1308'
                        ) 
                    {
                        let cellItemWidth = (self.pageWidth - padding_left - padding_right)/2,
                        imgTextLength = mit_.find('.img-text').length,
                        styled_bottom = { marginBottom:'10px' }

                        $.each( mit_.find('.img-text'),(i)=>{
                            i < imgTextLength-2 ? mit_.find('.img-text').eq(i).css( styled_bottom) : null
                        })
                        mit_.find('.img-text').css({
                            width:cellItemWidth+'px'
                        })
                    }                
                    //设置标题
                    mit_.find('.title-package').css({
                        margin: title_top +'px '+title_right +'px '+title_bottom +'px '+title_left +'px '
                    })
                    //设置图片
                    mit_.find('.img-package').css({
                        margin: img_top +'px '+img_right +'px '+img_bottom +'px '+img_left +'px '
                    })

                    mit_.find('.line').css({
                        position:'absolute',
                        bottom:'0',
                        left:'0',
                        right:'0'
                    }) 
                })

                //持有外部json数据
                self.remote_data = tsb_
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
                let mit_ = $('.muti-image-text'+self.getRandomClassName() )
                let which_one = self.type_element
                self.$nextTick( ()=>{
                    if ( id_ == '1') {
                        //修改整体边距
                        mit_.addClass('border-style-0').addClass('boder-color-animation') 

                        let tspeed_remote = self.remote_data[0]
                        //修改整体边距 
                        let margin_arr_ = tspeed_remote.margin.split(','),
                        mpid = ''
                        if ( margin_arr_.length > 4) {
                            mpid = margin_arr_.shift() //删除第一个标识符
                        }
                        let margin_entirety = margin_arr_.join(',')

                        //整体高度
                        let cell_height = tspeed_remote.height

                        //每个集合边距
                        // let imgtext_margin_arr_ = tspeed_remote.itemMargin.split(',')
                        // if ( imgtext_margin_arr_.length > 4) {
                        //     imgtext_margin_arr_.shift() 
                        // }
                        // let imgtext_margin_entirety = imgtext_margin_arr_.join(',') , imgtext_width = tspeed_remote.itemWidth

                        //修改图片样式
                        let imgwidth = 0 ,imgheight = 0 , imgradius = tspeed_remote.img.child.radius,imgleft = '', imgbottom = '' ,imgtop ='' ,imgright = ''
                        if ( tspeed_remote.img) {
                            let img_count = tspeed_remote.img
                            if (img_count.child.size ) {
                                let size = img_count.child.size.split(',')
                                imgwidth = size[0] || 0
                                imgheight = size[1] || 0
                            }
                        }
                        
                        //修改标题
                        let titlecolor = '',titlebgcolor = '', titlefont = '' ,titlefamilyName = '', titleandroid_familyName = '',titleleft = '', titlebottom = '' ,titletop ='' ,titleright = ''
                        if ( tspeed_remote.title) {
                            let title_count = tspeed_remote.title
                            titlecolor = title_count.style.textColor || ''
                            titlebgcolor = title_count.style.bgColor || ''
                            titlefont = title_count.style.textSize || ''
                            titlefamilyName = title_count.style.familyName || ''
                            titleandroid_familyName = title_count.style.androidFamilyName || ''
                        }

                        //修改关注
                        let attentioncolor = '',attentionbgcolor = '', attentionfont = '' ,attentionfamilyName = '', attentionandroid_familyName = '',attentionradius = '',attentionleft = '', attentionbottom = '' ,attentiontop ='' ,attentionright = ''
                        if ( tspeed_remote.attention) {
                            let attention_ = tspeed_remote.attention
                            attentioncolor = attention_.style.textColor || ''
                            attentionbgcolor = attention_.style.bgColor || ''
                            attentionfont = attention_.style.textSize || ''
                            attentionfamilyName = attention_.style.familyName || ''
                            attentionandroid_familyName = attention_.style.androidFamilyName || ''
                            attentionradius = attention_.style.radius || 0
                        }

                        //修改子标题详情
                        let introcolor = '', introfont = '' ,introfamilyName = '', introandroid_familyName = '',introleft = '', introbottom = '' ,introtop ='' ,introright = ''
                        if ( tspeed_remote.intro) {
                            let intro_ = tspeed_remote.intro
                            introcolor = intro_.style.textColor || ''
                            introfont = intro_.style.textSize || ''
                            introfamilyName = intro_.style.familyName || ''
                            introandroid_familyName = intro_.style.androidFamilyName || ''
                        }

                        let new_object = { 
                            //整体边距
                            margin_entirety:margin_entirety,
                            //整体高度
                            cell_height:cell_height,
                            //分割线类型
                            mpid:mpid,
                            //每个集合边距
                            // imgtext_margin_entirety:imgtext_margin_entirety,
                            // imgtext_width:imgtext_width,
                            //图片
                            imgradius:imgradius,
                            imgwidth:imgwidth,
                            imgheight:imgheight,
                            //标题
                            titlecolor:titlecolor,
                            titlebgcolor:titlebgcolor,
                            titlefont:titlefont,
                            titlefamilyName:titlefamilyName,
                            titleandroid_familyName:titleandroid_familyName,
                            //关注
                            attentioncolor:attentioncolor,
                            attentionbgcolor:attentionbgcolor,
                            attentionfont:attentionfont,
                            attentionfamilyName:attentionfamilyName,
                            attentionandroid_familyName:attentionandroid_familyName,
                            attentionradius:attentionradius,
                            //子标题详解
                            introcolor:introcolor,
                            introfont:introfont,
                            introfamilyName:introfamilyName,
                            introandroid_familyName:introandroid_familyName,
                        } 
                        self.$emit('edit_json_tsb','',new_object,which_one )
                    }

                })  
                
            },
            //编辑json后，响应的数据
            edit_json_reponse( val_){
                let self = this
                //防止其他模块修改影响到本模块
                if ( val_.name.indexOf('tsb') < 0 || 
                    (val_.difference == 'bigImage_1301'&& self.type_element != 'bigImage_1301') ||
                    (val_.difference == 'bigImage_1302'&& self.type_element != 'bigImage_1302') || 
                    (val_.difference == 'bigImage_1303'&& self.type_element != 'bigImage_1303') ||
                    (val_.difference == 'bigImage_1304'&& self.type_element != 'bigImage_1304') ||
                    (val_.difference == 'bigImage_1305'&& self.type_element != 'bigImage_1305') ||
                    (val_.difference == 'bigImage_1306'&& self.type_element != 'bigImage_1306') ||
                    (val_.difference == 'bigImage_1308'&& self.type_element != 'bigImage_1308')
                ) 
                    return

                let tspeed_remote = self.remote_data[0]

                //整体内嵌
                if ( val_.name.indexOf('tsb.entirety') > -1 ) {
                    let margin_arr_ = tspeed_remote.margin.split(',')
                    tspeed_remote.margin = margin_arr_[0] +','+val_.data
                }
                //整体高度
                else if ( val_.name.indexOf('tsb.cell_height') > -1) {
                    tspeed_remote.height =  val_.data
                }
                //分割线类型
                else if ( val_.name.indexOf('tsb.underline') > -1 ) {
                    let margin_arr_ = tspeed_remote.margin.split(',')
                    margin_arr_[0] = val_.data.select
                    tspeed_remote.margin = margin_arr_.join(',')
                }
                //图片文字边距
                else if ( val_.name.indexOf('tsb.imgtext_margin_entirety') > -1 ) {

                    let margin_arr_ = tspeed_remote.itemMargin.split(',')
                    margin_arr_[0] = '2'
                    tspeed_remote.itemMargin = margin_arr_[0] +','+val_.data
                }else if ( val_.name.indexOf('tsb.imgtext_width') > -1 ) {
                    tspeed_remote.itemWidth = val_.data
                }
                //图片
                else if ( val_.name.indexOf('tsb.img.width') > -1 || val_.name.indexOf('tsb.img.height') > -1 ) {
                    if ( tspeed_remote.img && tspeed_remote.img.child) {
                        let size = tspeed_remote.img.child.size ? tspeed_remote.img.child.size.split(',') :['','']
                        val_.name.indexOf('tsb.img.width') > -1 ? size[0] = val_.data : size[1] = val_.data
                        tspeed_remote.img.child.size = size.join(',')
                    }
                }else if ( val_.name.indexOf('tsb.img.radius') > -1) {
                    if ( tspeed_remote.img && tspeed_remote.img.child) {
                        tspeed_remote.img.child.radius = val_.data
                    }
                }else if ( val_.name.indexOf('tsb.img.left') > -1) {
                    if ( tspeed_remote.img && tspeed_remote.img.layout) {
                        let left = tspeed_remote.img.layout.left 
                        let left_arr = left.split(',') 
                        left_arr[1] = val_.data ; !left_arr[0] ? left_arr[0] = ' ' : null
                        tspeed_remote.img.layout.left = left_arr.join(',')
                    }
                }else if ( val_.name.indexOf('tsb.img.top') > -1) {
                    if ( tspeed_remote.img && tspeed_remote.img.layout) {
                        let top = tspeed_remote.img.layout.top 
                        let top_arr = top.split(','); !top_arr[0] ? top_arr[0] = ' ' : null
                        top_arr[1] = val_.data
                        tspeed_remote.img.layout.top = top_arr.join(',')
                    }
                }else if ( val_.name.indexOf('tsb.img.bottom') > -1) {
                    if ( tspeed_remote.img && tspeed_remote.img.layout) {
                        let bottom = tspeed_remote.img.layout.bottom 
                        let bottom_arr = bottom.split(','); !bottom_arr[0] ? bottom_arr[0] = ' ' : null
                        bottom_arr[1] = val_.data
                        tspeed_remote.img.layout.bottom = bottom_arr.join(',')
                    }
                }else if ( val_.name.indexOf('tsb.img.right') > -1) {
                    if ( tspeed_remote.img && tspeed_remote.img.layout) {
                        let right = tspeed_remote.img.layout.right 
                        let right_arr = right.split(','); !right_arr[0] ? right_arr[0] = ' ' : null
                        right_arr[1] = val_.data
                        tspeed_remote.img.layout.right = right_arr.join(',')
                    }
                }
                //标题
                else if ( val_.name.indexOf('tsb.title.color') > -1) {
                    if ( tspeed_remote.title && tspeed_remote.title.style) {
                        tspeed_remote.title.style.textColor = val_.data
                    }
                }else if ( val_.name.indexOf('tsb.title.bgcolor') > -1) {
                    if ( tspeed_remote.title && tspeed_remote.title.style) {
                        tspeed_remote.title.style.bgColor = val_.data
                    }
                }else if ( val_.name.indexOf('tsb.title.font') > -1) {
                    if ( tspeed_remote.title && tspeed_remote.title.style) {
                        tspeed_remote.title.style.textSize = val_.data
                    }
                }else if ( val_.name.indexOf('tsb.title.familyName') > -1) {
                    if ( tspeed_remote.title && tspeed_remote.title.style) {
                        tspeed_remote.title.style.familyName = val_.data
                    }
                }else if ( val_.name.indexOf('tsb.title.androidfamilyName') > -1) {
                    if ( tspeed_remote.title && tspeed_remote.title.style) {
                        tspeed_remote.title.style.androidFamilyName = val_.data
                    }
                }else if ( val_.name.indexOf('tsb.title.left') > -1) {
                    if ( tspeed_remote.title && tspeed_remote.title.layout) {
                        let left = tspeed_remote.title.layout.left 
                        let left_arr = left.split(',') 
                        left_arr[1] = val_.data ; !left_arr[0] ? left_arr[0] = ' ' : null
                        tspeed_remote.title.layout.left = left_arr.join(',')
                    }
                }else if ( val_.name.indexOf('tsb.title.top') > -1) {
                    if ( tspeed_remote.title && tspeed_remote.title.layout) {
                        let top = tspeed_remote.title.layout.top 
                        let top_arr = top.split(','); !top_arr[0] ? top_arr[0] = ' ' : null
                        top_arr[1] = val_.data
                        tspeed_remote.title.layout.top = top_arr.join(',')
                    }
                }else if ( val_.name.indexOf('tsb.title.bottom') > -1) {
                    if ( tspeed_remote.title && tspeed_remote.title.layout) {
                        let bottom = tspeed_remote.title.layout.bottom 
                        let bottom_arr = bottom.split(','); !bottom_arr[0] ? bottom_arr[0] = ' ' : null
                        bottom_arr[1] = val_.data
                        tspeed_remote.title.layout.bottom = bottom_arr.join(',')
                    }
                }else if ( val_.name.indexOf('tsb.title.right') > -1) {
                    if ( tspeed_remote.title && tspeed_remote.title.layout) {
                        let right = tspeed_remote.title.layout.right 
                        let right_arr = right.split(','); !right_arr[0] ? right_arr[0] = ' ' : null
                        right_arr[1] = val_.data
                        tspeed_remote.title.layout.right = right_arr.join(',')
                    }
                }
                //关注
                else if ( val_.name.indexOf('tsb.attention.radius') > -1) {
                    if ( tspeed_remote.attention && tspeed_remote.attention.style) {
                        tspeed_remote.attention.style.radius = val_.data
                    }
                }else if ( val_.name.indexOf('tsb.attention.color') > -1) {
                    if ( tspeed_remote.attention && tspeed_remote.attention.style) {
                        tspeed_remote.attention.style.textColor = val_.data
                    }
                }else if ( val_.name.indexOf('tsb.attention.bgcolor') > -1) {
                    if ( tspeed_remote.attention && tspeed_remote.attention.style) {
                        tspeed_remote.attention.style.bgColor = val_.data
                    }
                }else if ( val_.name.indexOf('tsb.attention.font') > -1) {
                    if ( tspeed_remote.attention && tspeed_remote.attention.style) {
                        tspeed_remote.attention.style.textSize = val_.data
                    }
                }else if ( val_.name.indexOf('tsb.attention.familyName') > -1) {
                    if ( tspeed_remote.attention && tspeed_remote.attention.style) {
                        tspeed_remote.attention.style.familyName = val_.data
                    }
                }else if ( val_.name.indexOf('tsb.attention.androidfamilyName') > -1) {
                    if ( tspeed_remote.attention && tspeed_remote.attention.style) {
                        tspeed_remote.attention.style.androidFamilyName = val_.data
                    }
                }
                //详解介绍
                else if ( val_.name.indexOf('tsb.intro.color') > -1) {
                    if ( tspeed_remote.intro && tspeed_remote.intro.style) {
                        tspeed_remote.intro.style.textColor = val_.data
                    }
                }else if ( val_.name.indexOf('tsb.intro.font') > -1) {
                    if ( tspeed_remote.intro && tspeed_remote.intro.style) {
                        tspeed_remote.intro.style.textSize = val_.data
                    }
                }else if ( val_.name.indexOf('tsb.intro.familyName') > -1) {
                    if ( tspeed_remote.intro && tspeed_remote.intro.style) {
                        tspeed_remote.intro.style.familyName = val_.data
                    }
                }else if ( val_.name.indexOf('tsb.intro.androidfamilyName') > -1) {
                    if ( tspeed_remote.intro && tspeed_remote.intro.style) {
                        tspeed_remote.intro.style.androidFamilyName = val_.data
                    }
                }
               
                self.setLayout( self.remote_data)
                let new_object = JSON.parse( JSON.stringify( self.remote_data))
                self.convertToClent( new_object)

                let pt__ = val_.difference.split('_')[1]
                $.edit_json_remote_post('newsList','navigationIcon',pt__,new_object)
                
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
            //将获取的数据再次渲染
            getDataRedraw(){
                let self = this
                if ( $.allowMachine == 1) {
                    let $bli = $('.muti-image-text'+self.getRandomClassName()+'.copy' ),
                    count = 0
                    setTimeout(function() {
                        if ( $bli.data('contentData') && $bli.data('refresData') ) {
                            $bli.data('refresData',false) 
                            let c_ = JSON.parse( $bli.data('contentData')),
                            j_ = ''
                            if ( self.type_element == 'bigImage_1302') {
                                j_ = c_['1302']
                            }else if ( self.type_element == 'bigImage_1303') {
                                j_ = c_['1303']
                            }else if ( self.type_element == 'bigImage_1305') {
                                j_ = c_['1305']
                            }else if ( self.type_element == 'bigImage_1306') {
                                j_ = c_['1306']
                            }else if ( self.type_element == 'bigImage_1308') {
                                j_ = c_['1308']
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
                $bli = $('.muti-image-text'+self.getRandomClassName()+'.copy' )

                $.each($bli,(i)=>{
                    let baseData = JSON.parse( $bli.eq(i).data('baseData')),
                    $mit = $bli.eq(i),
                    $if = $mit.find('.img-father').eq(0),
                    $it = $if.find('.img-text').eq(0),
                    calc = $if.find('.img-text').length
                    $if.empty()
                    $mit.empty()

                    for (var m = 0; m < parseFloat( baseData.items.length/calc); m++) {
                        let $if_copy = $if.clone()
                        baseData.items.forEach( (item,n)=>{
                            if ( m*calc<=n && n<=m*calc+calc-1) {
                                let $it_copy= $it.clone(),
                                $img = $it_copy.find('.image').eq(0),
                                $title = $it_copy.find('.title').eq(0),
                                $inner_title = $it_copy.find('.inner-title').eq(0)

                                $img.css('backgroundImage','url('+(item.thumb || item.cover)+')')
                                $title.text( item.title || item.name)
                                $inner_title.text( item.title || item.name)

                                $it_copy.data('concrete_data',item)
                                $if_copy.append( $it_copy)
                            }
                        })
                        $mit.append( $if_copy)
                    }
                    $mit.find('.img-text').off('click').on('click',function(){
                        $.click_news_into_particular( $(this).data('concrete_data'))
                    })
                })
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
                        "imgUrlArr1302":[
                            [
                                'http://img01.cztv.com/201605/13/8ed9516a8a514ef6d968c8728770b76a.jpg',
                                'http://img01.cztv.com/201509/01/58316b0747628b3bd7d849b110edf93f.jpg',
                                'http://img01.cztv.com/201509/15/b36b045e7044642113ca4234b7e85935.jpg',
                            ],
                            [
                                'http://img01.cztv.com/201604/20/07eaf647f4f72c6df325f83914fc4581.jpg',
                                'http://img01.cztv.com/201510/22/b0bef7aaa95c62102003507c77244d76.jpg',
                                'http://img01.cztv.com/201511/04/ad9e88b2dc0bfc1f5e7caf9010a64462.jpg',
                            ],  
                        ],
                        "imgUrlArr1303":[
                            [
                                'http://img01.cztv.com/201605/13/8ed9516a8a514ef6d968c8728770b76a.jpg',
                                'http://img01.cztv.com/201509/01/58316b0747628b3bd7d849b110edf93f.jpg',
                            ],
                            [
                                'http://img01.cztv.com/201604/20/07eaf647f4f72c6df325f83914fc4581.jpg',
                                'http://img01.cztv.com/201510/22/b0bef7aaa95c62102003507c77244d76.jpg',
                            ],
                            [
                                'http://img01.cztv.com/201509/15/b36b045e7044642113ca4234b7e85935.jpg',
                                'http://img01.cztv.com/201511/04/ad9e88b2dc0bfc1f5e7caf9010a64462.jpg',
                            ],   
                        ],
                        "imgUrlArr1308":[
                            [
                                'http://img01.cztv.com/201605/13/8ed9516a8a514ef6d968c8728770b76a.jpg',
                                'http://img01.cztv.com/201509/01/58316b0747628b3bd7d849b110edf93f.jpg',
                            ],  
                        ],
                        "common":{
                            "border": {
                                "borderColor": "#fff", 
                                "borderWidth": 0, 
                                "borderRadius": 3 
                            },
                            "size":{
                                "width":30,
                                "height":88
                            },
                        }
                    },
                    "title":{
                        "textContent":'',
                        "textContentArr1302":[
                            ['蓝色花海','日出日落','人鱼欢舞'],
                            ['色彩艳遇','山脉怪云','美如仙境']
                        ],
                        "textContentArr1303":[
                            ['蓝色花海','日出日落'],
                            ['色彩艳遇','山脉怪云'],
                            ['人鱼欢舞','美如仙境']
                        ],
                        "textContent_style":'none',
                        "color":{
                            "textColor":"#000000",
                            "bgColor":''
                        },
                        "text":{
                            "textAlignment":0,
                            "font":15,
                            "familyName":"",
                        },
                        "common":{
                            "border": {
                                "borderColor": "#fff", 
                                "borderWidth": 0, 
                                "borderRadius": 5 
                            },
                        },
                    },
                    "attention":{
                        "textContent":'',
                        "textContentArr1306":[
                            ['关注+','关注+'],
                            ['关注+','关注+'],
                            ['关注+','关注+']
                        ],
                        "textContent_style":'none',
                        "color":{
                            "textColor":"#ffffff",
                            "bgColor":''
                        },
                        "text":{
                            "textAlignment":0,
                            "font":15,
                            "familyName":"",
                            "androidFamilyName":"",
                        },
                        "common":{
                            "border": {
                                "borderColor": "#fff", 
                                "borderWidth": 0, 
                                "borderRadius": 0 
                            },
                        },
                    },
                    "intro":{
                        "textContent":'',
                        "textContentArr1308":[
                            ['详细介绍','详细介绍'],
                        ],
                        "textContent_style":'none',
                        "color":{
                            "textColor":"#ffffff",
                            "bgColor":''
                        },
                        "text":{
                            "textAlignment":0,
                            "font":15,
                            "familyName":"",
                            "androidFamilyName":"",
                        },
                        "common":{
                            "border": {
                                "borderColor": "#fff", 
                                "borderWidth": 0, 
                                "borderRadius": 0 
                            },
                        },
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
    .muti-image-text{
        position: relative;
        overflow: scroll;
        white-space: nowrap;
        background-color: @contentbg;
        .img-father{
            .img-text{
                display: inline-block;
                text-align: center;
                vertical-align: top;
                .img-package{
                    display: table;
                    left: 50%;
                    position: relative;
                    transform: translateX(-50%);
                    .inner-title{
                        position: absolute;
                        left: 10px;
                        bottom: 5px;
                        padding: 2px 5px;
                    }
                }    
            }


        }
        
    }

</style>
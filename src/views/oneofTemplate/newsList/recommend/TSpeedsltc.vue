<template>
    <div :class='"single-image-text "+randomMark' @click.stop='edit_json_style("1")'>
        <span class="img-text" v-for="(i) in 2">
            <ImageLayout v-if='type_number == 7' class='left-image':layout_data='local_data.mainImage'></ImageLayout>
            <LabelLayout :class=' type_number == 7 ? "left-title":"title"' :layout_data='local_data.title' ></LabelLayout>
            <LabelLayout :class=' type_number == 7 ? "left-subtitle":"subtitle"' :layout_data='local_data.subtitle' ></LabelLayout>
            <ImageLayout v-if='type_number == 2'  class='image':layout_data='local_data.mainImage'></ImageLayout>
        </span>
        
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

                type_element : '',
                type_number:'',

                local_data:{},//本地数据
                remote_data:{}, //要更改的远程json数据
                
                randomMark:(new Date()).getTime(),
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

            let tsb_data_ = ''
            if ( self.type_element == 'bigImage_1304') {
                self.type_number = 2
                tsb_data_= self._props.tsbData['1304']
            }else if ( self.type_element == 'bigImage_1307') {
                self.type_number = 7
                tsb_data_= self._props.tsbData['1307']
            }
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
                let remote_ = tsb_[0] || tsb_
                if ( !remote_) 
                    return

                let local_style_data = self.getlocalData()
                let mit_ = $('.single-image-text'+self.getRandomClassName() )

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
                            i == 3 ? padding_left = parseFloat(item) : null
                            i == 1 ? padding_right = parseFloat(item) : null
                        }) 
                    }
                }
                //整体高度
                let cell_height = -1
                {
                    cell_height = remote_.height
                }
                //设置集合边距
                // let img_text_padding = '';
                // {   
                //     if ( remote_.itemMargin) {
                //         let margin_arr_ = remote_.itemMargin.split(',')
                //         if ( margin_arr_.length > 4) {
                //             margin_arr_.shift() 
                //         }
                //         margin_arr_.forEach( (item,i)=>{
                //             img_text_padding+= item+'px '
                            
                //         })
                        
                //     }
                // }
                //集合宽度 remote_.itemWidth
                // let img_text_width = remote_.itemWidth
                //设置图片
                let img_left = 0,img_top = 0 ,img_right = 0 ,img_bottom = 0,img_width = 0,img_height = 0
                if ( remote_.img) {
                    let main_image = local_style_data.mainImage
                    let size = remote_.img.child && remote_.img.child.size ? remote_.img.child.size.split(',') : []
                    size[0] ? main_image.common.size.width = size[0] :null
                    size[0] ? img_width = size[0] : img_width = main_image.common.size.width
                    size[1] && parseFloat( size[1]) >= 0 ? main_image.common.size.height = size[1] :null
                    size[1]? img_height = size[1] :null

                    main_image.common.border.borderRadius = remote_.img.child.radius

                    // if ( remote_.img.layout.top) {
                    //     let img_top_arr = remote_.img.layout.top.split(',')
                    //     img_top = img_top_arr[1]
                    // }
                    // if ( remote_.img.layout.right) {
                    //     let img_right_arr = remote_.img.layout.right.split(',')
                    //     img_right = img_right_arr[1]
                    // }
                    // if ( remote_.img.layout.bottom) {
                    //     let img_bottom_arr = remote_.img.layout.bottom.split(',')
                    //     img_bottom = img_bottom_arr[1]
                    // }
                    // if ( remote_.img.layout.left) {
                    //     let img_left_arr = remote_.img.layout.left.split(',')
                    //     img_left = img_left_arr[1]
                    // }
                }
                //设置标题
                let title_left = 0,title_top = 0 ,title_right = 0 ,title_bottom = 0
                if ( remote_.title){
                    let title = local_style_data.title
                    title.color.textColor = remote_.title.style.textColor
                    title.text.font = remote_.title.style.textSize
                    title.text.familyName = remote_.title.style.familyName
                    title.text.androidFamilyName = remote_.title.style.androidFamilyName

                }

                //设置子标题
                let intro_left = 0,intro_top = 0 ,intro_right = 0 ,intro_bottom = 0
                if ( remote_.intro){
                    let intro = local_style_data.subtitle
                    intro.color.textColor = remote_.intro.style.textColor
                    intro.text.font = remote_.intro.style.textSize
                    intro.text.familyName = remote_.intro.style.familyName
                    intro.text.androidFamilyName = remote_.intro.style.androidFamilyName
                }
                
                self.$nextTick( ()=>{
                    //设置边距
                    mit_.css({
                        margin :padding_,
                        height:cell_height <0 ? 'auto' :cell_height+'px',
                    })

                    //设置集合
                    mit_.find('.img-text').css({
                        marginTop:'8px',
                        width: self.type_number == 7 ? 'calc( 50% - 5px )' : 'auto',
                        marginLeft: self.type_number == 7 ? '0' : '-10px',
                    }) 
                    let title_width_ = (self.pageWidth -padding_right -padding_left - 20)/2 - parseFloat( img_width)+'px'
                    mit_.find('.left-title').css({
                        marginLeft:(parseFloat(img_width)+10)+'px',
                    })
                    mit_.find('.title').css({
                        width:title_width_,
                        // margin: title_top +'px '+title_right +'px '+title_bottom +'px '+title_left +'px '
                    })
                    //子标题
                    mit_.find('.subtitle').css({
                        width:title_width_,
                        // marginLeft: -(parseFloat(title_width_)+parseFloat(title_left)) +parseFloat(intro_left)+'px',
                        // marginBottom:intro_bottom+'px',
                        // marginTop:intro_top+'px',
                        // marginRight:intro_right+'px',
                    })
                    
                    //设置图片
                    // mit_.find('.image').css({
                    //     margin: img_top +'px '+img_right +'px '+img_bottom +'px '+img_left +'px '
                    // })
 
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
                let mit_ = $('.single-image-text'+self.getRandomClassName() )
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
                        let titlecolor = '', titlefont = '' ,titlefamilyName = '', titleandroid_familyName = '',titleleft = '', titlebottom = '' ,titletop ='' ,titleright = ''
                        if ( tspeed_remote.title) {
                            let title_count = tspeed_remote.title
                            titlecolor = title_count.style.textColor || ''
                            titlefont = title_count.style.textSize || ''
                            titlefamilyName = title_count.style.familyName || ''
                            titleandroid_familyName = title_count.style.androidFamilyName || ''
                        }

                        //修改子标题
                        let introcolor = '', introfont = '' ,introfamilyName = '', introandroid_familyName = '',introleft = '', introbottom = '' ,introtop ='' ,introright = ''
                        if ( tspeed_remote.intro) {
                            let intro_count = tspeed_remote.intro
                            introcolor = intro_count.style.textColor || ''
                            introfont = intro_count.style.textSize || ''
                            introfamilyName = intro_count.style.familyName || ''
                            introandroid_familyName = intro_count.style.androidFamilyName || ''

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
                            titlefont:titlefont,
                            titlefamilyName:titlefamilyName,
                            titleandroid_familyName:titleandroid_familyName,
                            //子标题
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
                    (val_.difference == 'bigImage_1305'&& self.type_element != 'bigImage_1305') 
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
                //子标题
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
                }else if ( val_.name.indexOf('tsb.intro.left') > -1) {
                    if ( tspeed_remote.intro && tspeed_remote.intro.style) {
                        let left = tspeed_remote.intro.layout.left 
                        let left_arr = left.split(',') 
                        left_arr[1] = val_.data ; !left_arr[0] ? left_arr[0] = ' ' : null
                        tspeed_remote.intro.layout.left = left_arr.join(',')
                    }
                }else if ( val_.name.indexOf('tsb.intro.top') > -1) {
                    if ( tspeed_remote.intro && tspeed_remote.intro.style) {
                        let top = tspeed_remote.intro.layout.top 
                        let top_arr = top.split(','); !top_arr[0] ? top_arr[0] = ' ' : null
                        top_arr[1] = val_.data
                        tspeed_remote.intro.layout.top = top_arr.join(',')
                    }
                }else if ( val_.name.indexOf('tsb.intro.bottom') > -1) {
                    if ( tspeed_remote.intro && tspeed_remote.intro.style) {
                        let bottom = tspeed_remote.intro.layout.bottom 
                        let bottom_arr = bottom.split(','); !bottom_arr[0] ? bottom_arr[0] = ' ' : null
                        bottom_arr[1] = val_.data
                        tspeed_remote.intro.layout.bottom = bottom_arr.join(',')
                    }
                }else if ( val_.name.indexOf('tsb.intro.right') > -1) {
                    if ( tspeed_remote.intro && tspeed_remote.intro.style) {
                        let right = tspeed_remote.intro.layout.right 
                        let right_arr = right.split(','); !right_arr[0] ? right_arr[0] = ' ' : null
                        right_arr[1] = val_.data
                        tspeed_remote.intro.layout.right = right_arr.join(',')
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
                if ( !data_) 
                    return
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
                    let $bli = $('.single-image-text'+self.getRandomClassName()+'.copy' ),
                    count = 0
                    setTimeout(function() {
                        if ( $bli.data('contentData') && $bli.data('refresData') ) {
                            $bli.data('refresData',false) 
                            let c_ = JSON.parse( $bli.data('contentData')),
                            j_ = ''
                            if ( self.type_element == 'bigImage_1304') {
                                j_ = c_['1304']
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
                $bli = $('.single-image-text'+self.getRandomClassName()+'.copy' )

                $.each($bli,(i)=>{
                    let baseData = JSON.parse( $bli.eq(i).data('baseData')),
                    $hri = $bli.eq(i),
                    $it = $hri.find('.img-text').eq(0)
                    $hri.empty()
                    baseData.items.forEach( (item,n)=>{
                        let $it_copy= $it.clone(),
                        $img = $it_copy.find('.image').eq(0),
                        $title = $it_copy.find('.title').eq(0),
                        $subtitle = $it_copy.find('.subtitle').eq(0)

                        $img.css('backgroundImage','url('+(item.cover && item.cover[0]['path'] || '')+')')
                        $title.text( item.title )
                        $subtitle.text( item.subTitle)
                        !item.subTitle ? $title.css('line-height',$img.height()-2+'px') : null

                        $it_copy.data('concrete_data',item)
                        $hri.append( $it_copy)
                    })
                    
                    $hri.find('.img-text').off('click').on('click',function(){
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
                        "imgUrl":'http://img01.cztv.com/201506/23/0927c95ef75d75d7bfa8ccee87b8a86d.jpg',
                        "imgFill":"cover",
                        "common":{
                            "border": {
                                "borderColor": "#fff", 
                                "borderWidth": 0, 
                                "borderRadius": 3 
                            },
                            "size":{
                                "width":75,
                                "height":75
                            },
                        }
                    },
                    "title":{
                        "textContent":'浙南风光',
                        "textContent_style":'none',
                        "color":{
                            "textColor":"#000000",
                        },
                        "text":{
                            "textAlignment":0,
                            "font":15,
                            "familyName":"",
                        },
                    },
                    "subtitle":{
                        "textContent":'浙南乡村 美丽风景',
                        "textContent_style":'none',
                        "color":{
                            "textColor":"#000000",
                        },
                        "text":{
                            "textAlignment":0,
                            "font":15,
                            "familyName":"",
                        },
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
    .single-image-text{
        // width: 100%;
        position: relative;
        white-space: nowrap;
        overflow: hidden;
        font-size: 0;
        background-color: @contentbg;

        .img-text{
            display: inline-block;
            position: relative;
            overflow: hidden;
            width: calc( 50% -2px);
            .left-image{
                display: inline-block;
                vertical-align: top;
                float: left;
            }
            .left-title{
                display: block !important;
                margin-top: 5px;
                margin-left: 10px;
                white-space: nowrap !important;
            }
            .left-subtitle{
                margin-left: 10px;
            }
            .image{
                display: inline-block;
                vertical-align: top;
                float: right;
            }
            .title{
                margin-top: 5px;
                margin-left: 10px;
                white-space: nowrap !important;
                text-align: center !important;
            }
            .subtitle{
                position: absolute;
                bottom: 5px; 
                left: 10px;
            }
        }
        .img-text:nth-of-type(1){
            margin-left: -10px;
            margin-right: 10px;
            // &:after{
            //     content: '';
            //     position: absolute;
            //     right: 0;
            //     width:2px;
            //     height: 30px;
            //     top:50%;
            //     margin-left: 5px;
            //     transform: translateY(-50%);
            //     background-color: #efefef;
            // }
        }

        .line{
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
        }
    }

</style>
<template>
    <div :class='"hscreport-image "+randomMark' @click.stop='edit_json_style("1")'>
        <span class="img-text" v-for="(i) in 2">
            <ImageLayout class='image':layout_data='local_data.mainImage'></ImageLayout>
            <LabelLayout class='title' :layout_data='local_data.title' ></LabelLayout>
            <LabelLayout class='subtitle' :layout_data='local_data.subtitle' ></LabelLayout>
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

                local_data:{},//本地数据
                remote_data:{}, //要更改的远程json数据
                
                randomMark:(new Date()).getTime(),
            }
        },
        watch:{
            hscreportData:function (newVal,oldVal ) {
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

            let hscreport_data_ = self._props.hscreportData['1203'] || ''

            self.convertToWeb( hscreport_data_)
            self.setLayout( hscreport_data_)
            self.getDataRedraw()
            self.$emit('edit_json_hscreport',function( val_){
                self.edit_json_reponse( val_)
            },'','') 
        },
        props: ['hscreportData','typeids'],
        components:{
            LabelLayout,
            ImageLayout,
            ViewLayout,
        },
        methods:{
            setLayout( hscreport_){
                let self = this
                if ( !hscreport_) 
                    return
                let remote_ = hscreport_[0]
                if ( !remote_) 
                    return

                let local_style_data = self.getlocalData()
                let $hscr = $('.hscreport-image'+self.getRandomClassName() )

                //设置边距
                let padding_ = '',padding_left = 0 ,padding_right = 0
                {   
                    if ( remote_.margin) {
                        let margin_arr_ = remote_.margin.split(',')
                        if ( margin_arr_.length > 4) {
                            margin_arr_.shift() 
                        }
                        margin_arr_.forEach( (item,i)=>{
                            padding_+=item+'px '
                            i == 1 ? padding_left = parseFloat(item) : null
                            i == 3 ? padding_right = parseFloat(item) : null
                        })
                        
                    }
                }
                //整体高度
                let cell_height = -1
                {
                    cell_height = remote_.height
                }
                //设置图片
                let img_width = 0 , img_height = 0
                if ( remote_.img) {
                    let main_image = local_style_data.mainImage
                    
                    let size = remote_.img.child && remote_.img.child.size ? remote_.img.child.size.split(',') : []
                    size[0] ? main_image.common.size.width = size[0] :null
                    size[0] ? img_width = size[0] : img_width = main_image.common.size.width
                    size[1] && parseFloat( size[1]) >= 0 ? main_image.common.size.height = size[1] :null
                    size[1] && parseFloat( size[1]) >= 0 ? img_height = size[1] : img_height = main_image.common.size.height

                    main_image.common.border.borderRadius = remote_.img.child.radius
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
                    $hscr.css({
                        margin :padding_,
                        height:cell_height <0 ? 'auto' :cell_height+'px',
                    })

                    //每个集合背景图片
                    $hscr.find('.img-text').css({
                        background:'url('+remote_.bgResource+')'
                    })

                    //标题宽度
                    let title_width_ = self.pageWidth/2 - parseFloat(img_width) -5
                    $hscr.find('.title').css({
                        width:title_width_+'px',
                    })
                    //子标题
                    $hscr.find('.subtitle').css({
                        width:title_width_+'px',
                        marginLeft: -(parseFloat(title_width_)+parseFloat(title_left)) +parseFloat(intro_left)+'px',
                        marginBottom:intro_bottom+'px'
                    })
                    
                })

                //持有外部json数据
                self.remote_data = hscreport_
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
                let $hscr = $('.hscreport-image'+self.getRandomClassName() )
                let which_one = self.type_element
                self.$nextTick( ()=>{
                    $hscr.addClass('border-style-0').addClass('boder-color-animation')  

                    let hscroll_common = self.remote_data[0]
                    //整体边距
                    let margin_arr_ = hscroll_common.margin.split(','),
                    mpid = ''
                    if ( margin_arr_.length > 4) {
                        mpid = margin_arr_.shift() //删除第一个标识符
                    }
                    let margin_entirety = margin_arr_.join(',')

                    //整体高度
                    let cell_height = hscroll_common.height

                    //单元背景颜色
                    let background_image = hscroll_common.bgResource || ''

                    //修改图片样式
                    let imgwidth = 0 ,imgheight = 0 , imgradius = hscroll_common.img.child.radius
                    if (hscroll_common.img.child.size ) {
                        let size = hscroll_common.img.child.size.split(',')
                        imgwidth = size[0] || 0
                        imgheight = size[1] || 0
                    }
                    //修改标题
                    let titlecolor = '', titlefont = '' ,titlefamilyName = '', titleandroid_familyName = '',titleleft = '', titlebottom = '' ,titletop ='' ,titleright = ''
                    if ( hscroll_common.title) {
                        let title_count = hscroll_common.title
                        titlecolor = title_count.style.textColor || ''
                        titlefont = title_count.style.textSize || ''
                        titlefamilyName = title_count.style.familyName || ''
                        titleandroid_familyName = title_count.style.androidFamilyName || ''

                    }
                    //修改子标题
                    let introcolor = '', introfont = '' ,introfamilyName = '', introandroid_familyName = '',introleft = '', introbottom = '' ,introtop ='' ,introright = ''
                    if ( hscroll_common.intro) {
                        let intro_count = hscroll_common.intro
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
                        //单元背景颜色
                        backgroundImage:background_image,
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
                    self.$emit('edit_json_hscreport','',new_object,which_one )

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
                    hscroll_common.margin = margin_arr_[0] +','+val_.data
                }
                //分割线
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
                }else if ( val_.name.indexOf('hsc.title.left') > -1) {
                    if ( hscroll_common.title && hscroll_common.title.style) {
                        let left = hscroll_common.title.layout.left 
                        let left_arr = left.split(',') 
                        left_arr[1] = val_.data ; !left_arr[0] ? left_arr[0] = ' ' : null
                        hscroll_common.title.layout.left = left_arr.join(',')
                    }
                }else if ( val_.name.indexOf('hsc.title.top') > -1) {
                    if ( hscroll_common.title && hscroll_common.title.style) {
                        let top = hscroll_common.title.layout.top 
                        let top_arr = top.split(','); !top_arr[0] ? top_arr[0] = ' ' : null
                        top_arr[1] = val_.data
                        hscroll_common.title.layout.top = top_arr.join(',')
                    }
                }else if ( val_.name.indexOf('hsc.title.bottom') > -1) {
                    if ( hscroll_common.title && hscroll_common.title.style) {
                        let bottom = hscroll_common.title.layout.bottom 
                        let bottom_arr = bottom.split(','); !bottom_arr[0] ? bottom_arr[0] = ' ' : null
                        bottom_arr[1] = val_.data
                        hscroll_common.title.layout.bottom = bottom_arr.join(',')
                    }
                }else if ( val_.name.indexOf('hsc.title.right') > -1) {
                    if ( hscroll_common.title && hscroll_common.title.style) {
                        let right = hscroll_common.title.layout.right 
                        let right_arr = right.split(','); !right_arr[0] ? right_arr[0] = ' ' : null
                        right_arr[1] = val_.data
                        hscroll_common.title.layout.right = right_arr.join(',')
                    }
                }
                //子标题
                else if ( val_.name.indexOf('hsc.intro.color') > -1) {
                    if ( hscroll_common.intro && hscroll_common.intro.style) {
                        hscroll_common.intro.style.textColor = val_.data
                    }
                }else if ( val_.name.indexOf('hsc.intro.font') > -1) {
                    if ( hscroll_common.intro && hscroll_common.intro.style) {
                        hscroll_common.intro.style.textSize = val_.data
                    }
                }else if ( val_.name.indexOf('hsc.intro.familyName') > -1) {
                    if ( hscroll_common.intro && hscroll_common.intro.style) {
                        hscroll_common.intro.style.familyName = val_.data
                    }
                }else if ( val_.name.indexOf('hsc.intro.androidfamilyName') > -1) {
                    if ( hscroll_common.intro && hscroll_common.intro.style) {
                        hscroll_common.intro.style.androidFamilyName = val_.data
                    }
                }else if ( val_.name.indexOf('hsc.intro.left') > -1) {
                    if ( hscroll_common.intro && hscroll_common.intro.style) {
                        let left = hscroll_common.intro.layout.left 
                        let left_arr = left.split(',') 
                        left_arr[1] = val_.data ; !left_arr[0] ? left_arr[0] = ' ' : null
                        hscroll_common.intro.layout.left = left_arr.join(',')
                    }
                }else if ( val_.name.indexOf('hsc.intro.top') > -1) {
                    if ( hscroll_common.intro && hscroll_common.intro.style) {
                        let top = hscroll_common.intro.layout.top 
                        let top_arr = top.split(','); !top_arr[0] ? top_arr[0] = ' ' : null
                        top_arr[1] = val_.data
                        hscroll_common.intro.layout.top = top_arr.join(',')
                    }
                }else if ( val_.name.indexOf('hsc.intro.bottom') > -1) {
                    if ( hscroll_common.intro && hscroll_common.intro.style) {
                        let bottom = hscroll_common.intro.layout.bottom 
                        let bottom_arr = bottom.split(','); !bottom_arr[0] ? bottom_arr[0] = ' ' : null
                        bottom_arr[1] = val_.data
                        hscroll_common.intro.layout.bottom = bottom_arr.join(',')
                    }
                }else if ( val_.name.indexOf('hsc.intro.right') > -1) {
                    if ( hscroll_common.intro && hscroll_common.intro.style) {
                        let right = hscroll_common.intro.layout.right 
                        let right_arr = right.split(','); !right_arr[0] ? right_arr[0] = ' ' : null
                        right_arr[1] = val_.data
                        hscroll_common.intro.layout.right = right_arr.join(',')
                    }
                }
                //单元背景图片地址
                else if ( val_.name.indexOf('hsc.background.image') > -1) {
                    hscroll_common.bgResource = val_.data
                }

                self.setLayout( self.remote_data);
                let new_object = JSON.parse( JSON.stringify( self.remote_data))
                self.convertToClent( new_object)

                let pt__ = val_.difference.split('_')[1]
                $.edit_json_remote_post('newsList','scrollComponent',pt__,new_object)
                
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
                    }else if ( typeof data_[key_] == 'object') {
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
                    let $bli = $('.hscreport-image'+self.getRandomClassName()+'.copy' ),
                    count = 0
                    setTimeout(function() {
                        if ( $bli.data('contentData') && $bli.data('refresData') ) {
                            $bli.data('refresData',false) 
                            let c_ = JSON.parse( $bli.data('contentData')),
                            j_ = c_['1203']
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
                $bli = $('.hscreport-image'+self.getRandomClassName()+'.copy' )

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

                        $img.css('backgroundImage','url('+item.thumb+')')
                        $title.text( item.title)
                        $subtitle.text( item.sub_title)

                        $it_copy.data('concrete_data',item)
                        $hri.append( $it_copy)
                    })
                    $hri.find('.img-text').off('click').on('click',function(){
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
                    "itemGatherWidth":100,
                    "mainImage":{
                        "imgUrl":'http://img01.cztv.com/201510/22/d414b74363b96690811d1aed948f90dd.jpg',
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
                        "textContent":'弗拉迪米尔',
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
                        "textContent":'景色气势磅礴绝顶',
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
    .hscreport-image{
        // width: 100%;
        position: relative;
        white-space: nowrap;
        overflow: scroll hidden;
        font-size: 0;
        background-color: @contentbg;

        .img-text{
            display: inline-block;
            position: relative;
            padding: 10px 5px;
            margin-right: 10px;
            .image{
                display: inline-block;
                vertical-align: top;
                margin-right: 10px;
            }
            .title{
                margin-top: 8px;
            }
            .subtitle{
                position: absolute;
                bottom: 8px; 
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
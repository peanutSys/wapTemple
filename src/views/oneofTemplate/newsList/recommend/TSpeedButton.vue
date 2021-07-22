<template>
    <div :class='"muti-image-text "+randomMark' @click.stop='edit_json_style("1")'>

        <div class="img-father">
            <span class="img-text" v-for='(val,key) in (local_data.mainImage ? local_data.mainImage.imgUrlArr : [])' :key='key'>
                <div class="img-package">
                    <ImageLayout class='image' :layout_data='function() {
                        if ( !local_data.mainImage) {
                            return ;
                        }
                        let new_object = JSON.parse( JSON.stringify( local_data.mainImage))
                        new_object.imgUrl = new_object.imgUrlArr[key]
                        return new_object
                    }()'></ImageLayout>
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
            let tsb_data_ = self._props.tsbData['1301'] || ''

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
                //设置集合边距
                let img_text_padding = '0 12px';
                // {   
                //     if ( remote_.itemMargin) {
                //         let margin_arr_ = remote_.itemMargin.split(',')
                //         if ( margin_arr_.length > 4) {
                //             margin_arr_.shift() 
                //         }
                //         margin_arr_.forEach( (item,i)=>{
                //             img_text_padding+=item+'px '
                //         })
                        
                //     }
                // }
                //集合宽度 
                // let img_text_width = remote_.itemWidth
                //设置图片
                if ( remote_.img) {
                    let main_image = local_style_data.mainImage
                    let img_width = 0

                    let size = remote_.img.child && remote_.img.child.size ? remote_.img.child.size.split(',') : []
                    size[0] ? main_image.common.size.width = size[0] :null
                    size[0] ? img_width = size[0] : img_width = main_image.common.size.width
                    size[1] && parseFloat( size[1]) >= 0 ? main_image.common.size.height = size[1] :null

                    main_image.common.border.borderRadius = remote_.img.child.radius
                }
                //设置文字
                let title_left = 0,title_top = 0 ,title_right = 0 ,title_bottom = 0
                if ( remote_.title){
                    let title = local_style_data.title
                    title.color.textColor = remote_.title.style.textColor
                    title.text.font = remote_.title.style.textSize
                    title.text.familyName = remote_.title.style.familyName
                    title.text.androidFamilyName = remote_.title.style.androidFamilyName
                }
                
                self.$nextTick( ()=>{
                    //设置内边距
                    mit_.css({
                        margin :padding_,
                        height:cell_height <0 ? 'auto' :cell_height+'px',
                    })

                    //设置集合
                    mit_.find('.img-text').css({
                        // width:img_text_width+'px',
                        margin:img_text_padding,
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
                        let imgwidth = 0 ,imgheight = 0 , imgradius = tspeed_remote.img.child.radius
                        if (tspeed_remote.img.child.size ) {
                            let size = tspeed_remote.img.child.size.split(',')
                            imgwidth = size[0] || 0
                            imgheight = size[1] || 0
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
                    if ( tspeed_remote.title && tspeed_remote.title.style) {
                        let left = tspeed_remote.title.layout.left 
                        let left_arr = left.split(',') 
                        left_arr[1] = val_.data ; !left_arr[0] ? left_arr[0] = ' ' : null
                        tspeed_remote.title.layout.left = left_arr.join(',')
                    }
                }else if ( val_.name.indexOf('tsb.title.top') > -1) {
                    if ( tspeed_remote.title && tspeed_remote.title.style) {
                        let top = tspeed_remote.title.layout.top 
                        let top_arr = top.split(','); !top_arr[0] ? top_arr[0] = ' ' : null
                        top_arr[1] = val_.data
                        tspeed_remote.title.layout.top = top_arr.join(',')
                    }
                }else if ( val_.name.indexOf('tsb.title.bottom') > -1) {
                    if ( tspeed_remote.title && tspeed_remote.title.style) {
                        let bottom = tspeed_remote.title.layout.bottom 
                        let bottom_arr = bottom.split(','); !bottom_arr[0] ? bottom_arr[0] = ' ' : null
                        bottom_arr[1] = val_.data
                        tspeed_remote.title.layout.bottom = bottom_arr.join(',')
                    }
                }else if ( val_.name.indexOf('tsb.title.right') > -1) {
                    if ( tspeed_remote.title && tspeed_remote.title.style) {
                        let right = tspeed_remote.title.layout.right 
                        let right_arr = right.split(','); !right_arr[0] ? right_arr[0] = ' ' : null
                        right_arr[1] = val_.data
                        tspeed_remote.title.layout.right = right_arr.join(',')
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
                    let $bli = $('.muti-image-text'+self.getRandomClassName()+'.copy' ),
                    count = 0
                    setTimeout(function() {
                        if ( $bli.data('contentData') && $bli.data('refresData') ) {
                            $bli.data('refresData',false) 
                            let c_ = JSON.parse( $bli.data('contentData')),
                            j_ = c_['1301']
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
                    $if = $bli.eq(i).find('.img-father').eq(0),
                    $it = $if.find('.img-text').eq(0)
                    $if.empty()
                    baseData.items.forEach( (item,n)=>{
                        let $it_copy= $it.clone(),
                        $img = $it_copy.find('.image').eq(0),
                        $title = $it_copy.find('.title').eq(0)

                        $img.css('backgroundImage','url('+item.thumb+')')
                        $title.text( item.title)

                        $it_copy.data('concrete_data',item)
                        $if.append( $it_copy)
                    })
                    $if.find('.img-text').off('click').on('click',function(){
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
                        "imgUrlArr":[
                            'http://shixiantest.oss-cn-hangzhou.aliyuncs.com/48/posts/2020/11/11/aed3faddcb74bd89fe9b9cddae461a5b.png',
                            'http://shixiantest.oss-cn-hangzhou.aliyuncs.com/48/posts/2020/11/11/3a138ee0bd65894ac8a731b25429d54a.png',
                            'http://shixiantest.oss-cn-hangzhou.aliyuncs.com/48/posts/2020/11/11/2a6c1cd63d54a685cc715cab40f9f1e3.png',
                            'http://shixiantest.oss-cn-hangzhou.aliyuncs.com/48/posts/2020/11/11/1d0ea8de07394d739275ae01d83279b4.png',
                            'http://shixiantest.oss-cn-hangzhou.aliyuncs.com/48/posts/2020/11/11/b43f29bcebd2c1f367e0f9871a99197f.png'
                        ],
                        "common":{
                            "border": {
                                "borderColor": "#fff", 
                                "borderWidth": 0, 
                                "borderRadius": 3 
                            },
                            "size":{
                                "width":30,
                                "height":28
                            },
                        }
                    },
                    "title":{
                        "textContent":'',
                        "textContentArr":['看电视','听广播','读报纸','口罩预约','快速停车'],
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
        background-color: @contentbg;
        .img-father{
            white-space: nowrap;
            .img-text{
                display: inline-block;
                text-align: center;
                .image{
                    display: inline-block;
                }
            }
        }
        
    }

</style>
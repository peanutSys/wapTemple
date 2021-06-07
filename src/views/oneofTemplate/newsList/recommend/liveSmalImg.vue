<template>
    <div :class='"live-content "+randomMark' @click.stop='edit_json_style("1")'>
        <div class="img-text" >
            <ImageLayout class='image':layout_data='local_data.mainImage'></ImageLayout>
            <div class="small-images">
                <span class="sub-img" v-for='(val,key) in (local_data.subImage ? local_data.subImage.imgUrlArr : [])' :key='key'>
                    <div >
                        <ImageLayout class='single-image' :layout_data='function() {
                            if ( !local_data.subImage) {
                                return ;
                            }
                            let new_object = JSON.parse( JSON.stringify( local_data.subImage))
                            new_object.imgUrl = new_object.imgUrlArr[key]
                            return new_object
                        }()'></ImageLayout>
                    </div>
                    <ImageLayout v-if='key != 0' class='live-tag' :layout_data='local_data.subImage ? local_data.subImage.liveTag : null'></ImageLayout>
                    <div :class="'mask '+key"></div>
                </span>
            </div>
            <ImageLayout class='playicon':layout_data='local_data.mainImage ? local_data.mainImage.playicon : null'></ImageLayout>
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
                randomMark:(new Date()).getTime(),

                local_data:{},//本地数据
                remote_data:{}, //要更改的远程json数据

                type_element:'',
            }
        },
        watch:{
            lcData:function (newVal,oldVal ) {
               let self = this
               self.setLayout(newVal)
            }
        },
        created(){
            let self = this;
        },
        mounted(){
            let self = this

            self.type_element = self._props.typeids
            $.allowMachine == 1 ? self.pageWidth = $(window).width() : null

            let livec_data_= self._props.lcData['1501'] || ''
            self.convertToWeb( livec_data_)
            self.setLayout( livec_data_)
            self.getDataRedraw()
            self.$emit('edit_json_lc',function( val_){
                self.edit_json_reponse( val_)
            },'','') 
        },
        props: ['lcData','typeids'],
        components:{
            LabelLayout,
            ImageLayout,
            ViewLayout,
        },
        methods:{
            setLayout( livec_){
                let self = this
                if ( !livec_) 
                    return
                let remote_ = livec_[0]
                if ( !remote_) 
                    return

                let local_style_data = self.getlocalData()
                let lc_ = $('.live-content'+self.getRandomClassName() )

                //设置边距
                let padding_ = '';let padding_left = 0 ; let padding_right = 0 
                {
                    if ( remote_.margin) {
                        let margin_arr_ = remote_.margin.split(',')
                        if ( margin_arr_.length > 4) {
                            //始终是设置内边距
                            margin_arr_[0] = '1'
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
                //设置图片
                let img_left = 0,img_top = 0 ,img_right = 0 ,img_bottom = 0,img_height = 0
                if ( remote_.img) {
                    let main_image = local_style_data.mainImage
                    let size = remote_.img.child && remote_.img.child.size ? remote_.img.child.size.split(',') : []
                    // size[0] ? main_image.common.size.width = size[0] :null
                    // size[0] ? img_width = size[0] : img_width = main_image.common.size.width
                    size[1] && parseFloat( size[1]) >= 0 ? main_image.common.size.height = size[1] :null
                    // main_image.common.size.width = self.pageWidth
                    img_height = main_image.common.size.height

                    main_image.common.border.borderRadius = remote_.img.child.radius

                    if ( remote_.img.layout) {
                        if ( remote_.img.layout.top) {
                            let img_top_arr = remote_.img.layout.top.split(',')
                            img_top = img_top_arr[1]
                        }
                        if ( remote_.img.layout.right) {
                            let img_right_arr = remote_.img.layout.right.split(',')
                            img_right = img_right_arr[1]
                        }
                        if ( remote_.img.layout.bottom) {
                            let img_bottom_arr = remote_.img.layout.bottom.split(',')
                            img_bottom = img_bottom_arr[1]
                        }
                        if ( remote_.img.layout.left) {
                            let img_left_arr = remote_.img.layout.left.split(',')
                            img_left = img_left_arr[1]
                        }
                    }  
                }

                //设置小图
                let subimg_left = 0,subimg_top = 5 ,subimg_right = 0 ,subimg_bottom = 0,subimg_width = 0,subimg_height = 0
                if ( remote_.detailImg) {
                    let sub_image = local_style_data.subImage

                    if ( remote_.detailImg.layout) {
                        if ( remote_.detailImg.layout.top) {
                            let img_top_arr = remote_.detailImg.layout.top.split(',')
                            subimg_top = img_top_arr[1]
                        }
                        if ( remote_.detailImg.layout.right) {
                            let img_right_arr = remote_.detailImg.layout.right.split(',')
                            subimg_right = img_right_arr[1]
                        }
                        if ( remote_.detailImg.layout.bottom) {
                            let img_bottom_arr = remote_.detailImg.layout.bottom.split(',')
                            subimg_bottom = img_bottom_arr[1]
                        }
                        if ( remote_.detailImg.layout.left) {
                            let img_left_arr = remote_.detailImg.layout.left.split(',')
                            subimg_left = img_left_arr[1]
                        }
                    }
                    
                    let size = remote_.detailImg.child && remote_.detailImg.child.size ? remote_.detailImg.child.size.split(',') : []
                    size[1] && parseFloat( size[1]) >= 0 ? sub_image.common.size.height = size[1] :null
                    sub_image.common.size.width = (self.pageWidth-10-10-padding_left-padding_right -subimg_left - subimg_right)/3 //整个宽度减去小图与小图之间空隙10*2，减去整体左右边距，减去小图的左右边距
                    subimg_width = sub_image.common.size.width
                    subimg_height = sub_image.common.size.height

                    sub_image.common.border.borderRadius = remote_.detailImg.child.radius 
                }
                
                self.$nextTick( ()=>{
                    //设置边距
                    lc_.css({
                        margin :padding_,
                        height:cell_height <0 ? 'auto' :cell_height+'px',
                    })

                    //设置图片边距
                    lc_.find('.image').css({
                        margin:img_top+'px '+img_right+'px '+img_bottom+'px '+img_left+'px',
                        width: (self.pageWidth-padding_left-padding_right-img_right-img_left) + 'px'
                    })

                    //设置小图片边距
                    lc_.find('.small-images').css({
                        margin:subimg_top+'px '+subimg_right+'px '+subimg_bottom+'px '+subimg_left+'px',
                    })
                    //设置小图mask
                    lc_.find('.mask').not('.0').css({
                        width:subimg_width,
                        height:subimg_height
                    })
                    //设置播放按钮
                    let playicon_height = lc_.find('.playicon').height()
                    lc_.find('.playicon').css({
                        left:'10px',
                        top: parseFloat(img_height) - playicon_height- 10 +'px'
                    })
                })

                //持有外部json数据
                self.remote_data = livec_
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
                let tm_ = $('.live-content'+self.getRandomClassName() )
                let which_one = self.type_element
                self.$nextTick( ()=>{
                    if ( id_ == '1') {
                        //修改整体边距
                        tm_.addClass('border-style-0').addClass('boder-color-animation') 

                        let liveSimg_remote = self.remote_data[0]
                        //修改整体边距 
                        let margin_arr_ = liveSimg_remote.margin.split(','),
                        mpid = ''
                        if ( margin_arr_.length > 4) {
                            mpid = margin_arr_.shift() //删除第一个标识符
                        }
                        let margin_entirety = margin_arr_.join(',')

                        //整体高度
                        let cell_height = liveSimg_remote.height

                        //修改图片样式
                        let imgwidth = 0 ,imgheight = 0 , imgradius = liveSimg_remote.img.child.radius,imgleft = '', imgbottom = '' ,imgtop ='' ,imgright = ''
                        if ( liveSimg_remote.img) {
                            let img_count = liveSimg_remote.img
                            if (img_count.child.size ) {
                                let size = img_count.child.size.split(',')
                                imgwidth = size[0] || 0
                                imgheight = size[1] || 0
                            }
                            if ( img_count.layout) {
                                if ( img_count.layout.left) {
                                    let arr_split = img_count.layout.left.split(',')
                                    imgleft = arr_split[1]
                                }
                                if ( img_count.layout.bottom) {
                                    let arr_split = img_count.layout.bottom.split(',')
                                    imgbottom = arr_split[1]
                                }
                                if ( img_count.layout.top) {
                                    let arr_split = img_count.layout.top.split(',')
                                    imgtop = arr_split[1]
                                }
                                if ( img_count.layout.right) {
                                    let arr_split = img_count.layout.right.split(',')
                                    imgright = arr_split[1]
                                }
                            }
                            
                        }
                        //修改子图片样式
                        let subimgwidth = 0 ,subimgheight = 0 , subimgradius = liveSimg_remote.detailImg.child.radius, subimgleft = '', subimgbottom = '' ,subimgtop ='' ,subimgright = ''
                        if ( liveSimg_remote.detailImg) {
                            let subimg_count = liveSimg_remote.detailImg
                            if (subimg_count.child.size ) {
                                let size = subimg_count.child.size.split(',')
                                subimgwidth = size[0] || 0
                                subimgheight = size[1] || 0
                            }
                            if ( subimg_count.layout) {
                                if ( subimg_count.layout.left) {
                                    let arr_split = subimg_count.layout.left.split(',')
                                    subimgleft = arr_split[1]
                                }
                                if ( subimg_count.layout.bottom) {
                                    let arr_split = subimg_count.layout.bottom.split(',')
                                    subimgbottom = arr_split[1]
                                }
                                if ( subimg_count.layout.top) {
                                    let arr_split = subimg_count.layout.top.split(',')
                                    subimgtop = arr_split[1]
                                }
                                if ( subimg_count.layout.right) {
                                    let arr_split = subimg_count.layout.right.split(',')
                                    subimgright = arr_split[1]
                                }
                            }
                        }

                        let new_object = {
                            margin:margin_entirety,
                            //整体高度
                            cell_height:cell_height,
                            //分割线类型
                            mpid:mpid,
                            //图片
                            imgradius:imgradius,
                            imgwidth:imgwidth,
                            imgheight:imgheight,
                            //小图片
                            subimgradius:subimgradius,
                            subimgheight:subimgheight,
                        }
                        self.$emit('edit_json_lc','',new_object,which_one ) 
                    }

                })  
                
            },
            //编辑json后，响应的数据
            edit_json_reponse( val_){
                let self = this
                //防止其他模块修改影响到本模块
                if ( val_.name.indexOf('livec') < 0 || val_.difference != 'bigImage_1501' ) 
                    return
                //整体内嵌
                let liveSimg_remote = self.remote_data[0]
                //整体内嵌
                if ( val_.name.indexOf('livec.entirety') > -1 ) {
                    let margin_arr_ = liveSimg_remote.margin.split(',')
                    liveSimg_remote.margin = margin_arr_[0] +','+val_.data
                }
                //整体高度
                else if ( val_.name.indexOf('livec.cell_height') > -1) {
                    liveSimg_remote.height =  val_.data
                }
                //分割线类型
                else if ( val_.name.indexOf('livec.underline') > -1 ) {
                    let margin_arr_ = liveSimg_remote.margin.split(',')
                    margin_arr_[0] = val_.data.select
                    liveSimg_remote.margin = margin_arr_.join(',')
                }
                //图片
                else if ( val_.name.indexOf('livec.img.width') > -1 || val_.name.indexOf('livec.img.height') > -1 ) {
                    if ( liveSimg_remote.img && liveSimg_remote.img.child) {
                        let size = liveSimg_remote.img.child.size ? liveSimg_remote.img.child.size.split(',') :['','']
                        val_.name.indexOf('livec.img.width') > -1 ? size[0] = val_.data : size[1] = val_.data
                        liveSimg_remote.img.child.size = size.join(',')
                    }
                }else if ( val_.name.indexOf('livec.img.radius') > -1) {
                    if ( liveSimg_remote.img && liveSimg_remote.img.child) {
                        liveSimg_remote.img.child.radius = val_.data
                    }
                }else if ( val_.name.indexOf('livec.img.left') > -1) {
                    if ( liveSimg_remote.img && liveSimg_remote.img.layout) {
                        let left = liveSimg_remote.img.layout.left 
                        let left_arr = left.split(',') 
                        left_arr[1] = val_.data ; !left_arr[0] ? left_arr[0] = ' ' : null
                        liveSimg_remote.img.layout.left = left_arr.join(',')
                    }
                }else if ( val_.name.indexOf('livec.img.top') > -1) {
                    if ( liveSimg_remote.img && liveSimg_remote.img.layout) {
                        let top = liveSimg_remote.img.layout.top 
                        let top_arr = top.split(','); !top_arr[0] ? top_arr[0] = ' ' : null
                        top_arr[1] = val_.data
                        liveSimg_remote.img.layout.top = top_arr.join(',')
                    }
                }else if ( val_.name.indexOf('livec.img.bottom') > -1) {
                    if ( liveSimg_remote.img && liveSimg_remote.img.layout) {
                        let bottom = liveSimg_remote.img.layout.bottom 
                        let bottom_arr = bottom.split(','); !bottom_arr[0] ? bottom_arr[0] = ' ' : null
                        bottom_arr[1] = val_.data
                        liveSimg_remote.img.layout.bottom = bottom_arr.join(',')
                    }
                }else if ( val_.name.indexOf('livec.img.right') > -1) {
                    if ( liveSimg_remote.img && liveSimg_remote.img.layout) {
                        let right = liveSimg_remote.img.layout.right 
                        let right_arr = right.split(','); !right_arr[0] ? right_arr[0] = ' ' : null
                        right_arr[1] = val_.data
                        liveSimg_remote.img.layout.right = right_arr.join(',')
                    }
                }
                //子图片
                else if ( val_.name.indexOf('livec.subimg.width') > -1 || val_.name.indexOf('livec.subimg.height') > -1 ) {
                    if ( liveSimg_remote.detailImg && liveSimg_remote.detailImg.child) {
                        let size = liveSimg_remote.detailImg.child.size ? liveSimg_remote.detailImg.child.size.split(',') :['','']
                        val_.name.indexOf('livec.subimg.width') > -1 ? size[0] = val_.data : size[1] = val_.data
                        liveSimg_remote.detailImg.child.size = size.join(',')
                    }
                }else if ( val_.name.indexOf('livec.subimg.radius') > -1) {
                    if ( liveSimg_remote.detailImg && liveSimg_remote.detailImg.child) {
                        liveSimg_remote.detailImg.child.radius = val_.data
                    }
                }else if ( val_.name.indexOf('livec.subimg.left') > -1) {
                    if ( liveSimg_remote.detailImg && liveSimg_remote.detailImg.layout) {
                        let left = liveSimg_remote.detailImg.layout.left 
                        let left_arr = left.split(',') 
                        left_arr[1] = val_.data ; !left_arr[0] ? left_arr[0] = ' ' : null
                        liveSimg_remote.detailImg.layout.left = left_arr.join(',')
                    }
                }else if ( val_.name.indexOf('livec.subimg.top') > -1) {
                    if ( liveSimg_remote.detailImg && liveSimg_remote.detailImg.layout) {
                        let top = liveSimg_remote.detailImg.layout.top 
                        let top_arr = top.split(','); !top_arr[0] ? top_arr[0] = ' ' : null
                        top_arr[1] = val_.data
                        liveSimg_remote.detailImg.layout.top = top_arr.join(',')
                    }
                }else if ( val_.name.indexOf('livec.subimg.bottom') > -1) {
                    if ( liveSimg_remote.detailImg && liveSimg_remote.detailImg.layout) {
                        let bottom = liveSimg_remote.detailImg.layout.bottom 
                        let bottom_arr = bottom.split(','); !bottom_arr[0] ? bottom_arr[0] = ' ' : null
                        bottom_arr[1] = val_.data
                        liveSimg_remote.detailImg.layout.bottom = bottom_arr.join(',')
                    }
                }else if ( val_.name.indexOf('livec.subimg.right') > -1) {
                    if ( liveSimg_remote.detailImg && liveSimg_remote.detailImg.layout) {
                        let right = liveSimg_remote.detailImg.layout.right 
                        let right_arr = right.split(','); !right_arr[0] ? right_arr[0] = ' ' : null
                        right_arr[1] = val_.data
                        liveSimg_remote.detailImg.layout.right = right_arr.join(',')
                    }
                }

                self.setLayout( self.remote_data)
                let new_object = JSON.parse( JSON.stringify( self.remote_data))
                self.convertToClent( new_object)

                let pt__ = val_.difference.split('_')[1]
                $.edit_json_remote_post('newsList','liveBroadcast',pt__,new_object)
                
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
                        var prefix = data_[key_+'_origin'].slice(1,3)
                        data_[key_] = '#'+prefix + data_[key_].replace('#','')
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
                    let $bli = $('.live-content'+self.getRandomClassName()+'.copy' ),
                    count = 0
                    setTimeout(function() {
                        if ( $bli.data('contentData') && $bli.data('refresData') ) {
                            $bli.data('refresData',false) 
                            let c_ = JSON.parse( $bli.data('contentData')),
                            j_ = ''
                            if ( self.type_element == 'bigImage_1501') {
                                j_ = c_['1501']
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
                $bli = $('.live-content'+self.getRandomClassName()+'.copy' )

                $.each($bli,(i)=>{
                    let baseData = JSON.parse( $bli.eq(i).data('baseData')),
                    $lct = $bli.eq(i),
                    $img = $lct.find('.image').eq(0),
                    $simgfather = $lct.find('.small-images').eq(0),
                    $simg = $simgfather.find('.sub-img').eq(1)

                    $simgfather.empty()
                    baseData.streams.forEach( (item,n)=>{
                        item.wap_url = item.live_urls[0]['url']
                        let $simg_copy= $simg.clone()
                        !item.image ? item.image = 'http://shixiantest.oss-cn-hangzhou.aliyuncs.com/48/posts/2020/12/15/0b09f85b0d6b7f73bbea9f6214b3b9c3.png' : null  
                        if ( n== 0) {
                            $img.css('backgroundImage','url('+item.image+')')
                            $img.data('concrete_data',item) 
                        }else{
                            $simg_copy.find('.single-image').eq(0).css('backgroundImage','url('+item.image+')')

                            $simg_copy.data('concrete_data',item)  
                            $simgfather.append( $simg_copy)
                        }
                    })
                    $lct.find('.image').off('click').on('click',function(){
                        $.click_news_into_particular( $(this).data('concrete_data'))
                    })
                    $lct.find('.sub-img').off('click').on('click',function(){
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
                        "imgUrl":'http://img01.cztv.com/201510/22/b0bef7aaa95c62102003507c77244d76.jpg',
                        "imgFill":'cover',
                        "common":{
                            "border": {
                                "borderColor": "#fff", 
                                "borderWidth": 0, 
                                "borderRadius": 5 
                            },
                            "size":{
                                "width":375,
                                "height":190
                            },
                        },
                        "playicon":{
                            "imgUrl":'http://shixiantest.oss-cn-hangzhou.aliyuncs.com/48/posts/2020/11/12/811259bef93b8cd849cb2f7fa9e30626.png',
                            "imgFill":'cover',
                            "common":{
                                "border": {
                                    "borderColor": "#fff", 
                                    "borderWidth": 0, 
                                    "borderRadius": 0 
                                },
                                "size":{
                                    "width":30,
                                    "height":30
                                },
                            }
                        }
                    },

                    "subImage":{
                        "imgUrl":'',
                        "imgUrlArr":[
                            'http://img01.cztv.com/201510/22/cdbf7d703356a4ef6eac21f02cbc1b7b.jpg',
                            'http://img01.cztv.com/201509/17/608c9dcbf0c747461526905548faf054.jpg',
                            'http://img01.cztv.com/201605/26/2591b5026fa4e5e006a766fe1af94c2a.jpg',
                            'http://img01.cztv.com/201604/20/07eaf647f4f72c6df325f83914fc4581.jpg'
                        ],
                        "imgFill":'cover',
                        "liveTag":{
                            "imgUrl":'http://shixiantest.oss-cn-hangzhou.aliyuncs.com/48/posts/2020/11/12/efa6ef4e8bcfc9008eab4fae81bfe1d1.png',
                            "imgFill":'cover',
                            "common":{
                                "border": {
                                    "borderColor": "#fff", 
                                    "borderWidth": 0, 
                                    "borderRadius": 0 
                                },
                                "size":{
                                    "width":30,
                                    "height":30
                                },
                            }
                        },
                        "common":{
                            "border": {
                                "borderColor": "#fff", 
                                "borderWidth": 0, 
                                "borderRadius": 5 
                            },
                            "size":{
                                "width":(375-20)/3,
                                "height":190/3
                            },
                        }
                    }, 
                    "line":{
                        "color":{
                            "bgColor":"#ccc"
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
    .live-content{
        // width: 100%;
        position: relative;
        overflow: hidden;
        background-color: @contentbg;
        .img-text{
            position: relative;
            font-size: 0;
            width: 100%;
            .image{
                display: inline-block;
            }
            .playicon{
                position: absolute;
            }
            .small-images{
                white-space: nowrap;
                overflow-x: scroll;
                position: relative;
                .sub-img{
                    display: inline-block;
                    position: relative;
                    margin-right: 10px;
                    .mask{
                        position: absolute;
                        top: 0;
                        z-index: 2;
                        background-color: rgba(255,255,255,0.6);
                    }
                    .live-tag{
                        position: absolute;
                        top: 0;
                        right: 0;
                        left: 0;
                        bottom: 0;
                        margin: auto;
                        z-index: 3;
                    }
                }
            }
            
        }
        //、、、、、、、、、、、、、、
    }

</style>
<template>
    <div :class='"blet-image "+randomMark' @click.stop='edit_json_style("1")'>
        <div class="img-father" v-if='type_module_ == "bigImage_1001"' >
            <ImageLayout class='image':layout_data='local_data.mainImage'></ImageLayout>
        </div>
        <div class="text-father">
            <div style="display: inline-block;" class="title-father">
                <LabelLayout class='title' :layout_data='local_data.title' ></LabelLayout>
            </div>
            <div class="text-tag-time" v-if='type_module_ == "bigImage_1002"'>
                <div style="display: inline-block;" >
                    <LabelLayout class='tag' :layout_data='local_data.tag'></LabelLayout>
                </div>
                <div style="display: inline-block;">
                    <LabelLayout class='time' :layout_data='local_data.time'></LabelLayout> 
                </div>
            </div>
            <div class="read-btn" v-if='type_module_ == "bigImage_1002"' >
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
                type_module_ : '',

                local_data:{},//本地数据
                remote_data:{}, //要更改的远程json数据
                
                randomMark:(new Date()).getTime()+Math.ceil( Math.random()*1000),
            }
        },
        watch:{
            bletData:function (newVal,oldVal ) {
               let self = this
               self.setLayout(newVal)
            }
        },
        created(){
            let self = this;
        },
        mounted(){
            let self = this

            self.type_module_ = self._props.typeids
            $.allowMachine == 1 ? self.pageWidth = $(window).width() : null

            let blet_data_ =  {}
            if ( self.type_module_ == 'bigImage_1001') {
                blet_data_['1001'] = self._props.bletData['1001']
           }else{
                blet_data_['1002'] = self._props.bletData['1002']
           }
            
            self.convertToWeb( blet_data_)
            self.setLayout( blet_data_)
            self.getDataRedraw()
            self.$emit('edit_json_blet',function( val_){
                self.edit_json_reponse( val_)
            },'','') 
        },
        beforeDestroy(){
            let self = this
            clearInterval(self.timer_roll)
        },
        props: ['bletData','typeids'],
        components:{
            LabelLayout,
            ButtonLayout,
            ImageLayout,
            ViewLayout,
        },
        methods:{
            setLayout( blet_){
                let self = this
                if ( !blet_['1001'] && !blet_['1002']) 
                    return
                let local_style_data = self.getlocalData(),
                si_ = $('.blet-image'+self.getRandomClassName() ),
                remote_ = self.type_module_ == 'bigImage_1001' ? blet_['1001'][0] : blet_['1002'][0]
 
                if ( !remote_) 
                    return
                //整体高度
                let cell_height = -1
                {
                    cell_height = remote_.height
                }

                //设置内外边距
                let padding_ = '',
                padding_left = 0,
                padding_right = 0 
                
                {   
                    if ( remote_.margin) {
                        let margin_arr_ = remote_.margin.split(',')
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
                let img_width = 0 
                {
                    let main_image = local_style_data.mainImage
                    let remote_tip = remote_.tip
                    if ( self.type_module_ == 'bigImage_1001') {
                        let size = remote_tip.child && remote_tip.child.size ? remote_tip.child.size.split(',') : []
                        size[0] ? main_image.common.size.width = size[0] :null
                        size[0] ? img_width = size[0] : img_width = main_image.common.size.width
                        size[1] && parseFloat( size[1]) >= 0 ? main_image.common.size.height = size[1] :null
                        main_image.common.border.borderRadius = remote_tip.child.radius
                    }
                    
                    local_style_data.mainImage = main_image
                }
                //设置标题
                let title_left = 0,title_top = 0 ,title_right = 0
                {   
                    let remote_title = remote_.title
                    let title = local_style_data.title
                    title.color.textColor = remote_title.style.textColor
                    title.text.font = remote_title.style.textSize
                    title.text.familyName = remote_title.style.familyName
                    title.text.androidFamilyName = remote_title.style.androidFamilyName

                    if ( remote_title.layout) {
                        if ( remote_title.layout.left) {
                            let title_left_arr = remote_title.layout.left.split(',')
                            title_left = title_left_arr[1]
                        }
                        if ( remote_title.layout.top) {
                            let title_top_arr = remote_title.layout.top.split(',')
                            title_top = title_top_arr[1]
                        }
                        if ( remote_title.layout.right) {
                            let title_right_arr = remote_title.layout.right.split(',')
                            title_right = title_right_arr[1]
                        }
                    }
                    local_style_data.title = title
                }
                //设置阅读量
                let read_right = 0,read_bottom = 0 
                {   
                    let remote_read = remote_.read
                    if ( self.type_module_ == 'bigImage_1002') {
                        let read = local_style_data.read
                        read.color.textColor = remote_read.style.textColor
                        read.text.font = remote_read.style.textSize
                        read.text.familyName = remote_read.style.familyName
                        read.text.androidFamilyName = remote_read.style.androidFamilyName

                        if ( remote_read.layout && remote_read.layout.right) {
                            let read_right_arr = remote_read.layout.right.split(',')
                            read_right = read_right_arr[1]
                        }
                        if ( remote_read.layout && remote_read.layout.bottom) {
                            let read_bottom_arr = remote_read.layout.bottom.split(',')
                            read_bottom = read_bottom_arr[1]
                        }
                        local_style_data.read = read
                    }
                    
                }
                //设置标签
                let tag_left = 0,tag_bottom = 0 
                {   
                    let remote_tag = remote_.tag
                    if ( self.type_module_ == 'bigImage_1002') {
                        let tag = local_style_data.tag
                        tag.color.textColor = remote_tag.style.textColor
                        tag.text.font = remote_tag.style.textSize
                        tag.text.familyName = remote_tag.style.familyName
                        tag.text.androidFamilyName = remote_tag.style.androidFamilyName
                        tag.common.border.borderColor = remote_tag.style.textColor

                        if ( remote_tag.layout && remote_tag.layout.left) {
                            let tag_left_arr = remote_tag.layout.left.split(',')
                            tag_left = tag_left_arr[1]
                        }
                        if ( remote_tag.layout && remote_tag.layout.bottom) {
                            let tag_bottom_arr = remote_tag.layout.bottom.split(',')
                            tag_bottom = tag_bottom_arr[1]
                        }
                        local_style_data.tag = tag
                    }
                    
                }
                //时间
                let time_left = 0
                {   
                    let remote_time = remote_.time
                    if ( self.type_module_ == 'bigImage_1002') {
                        let time = local_style_data.time
                        time.color.textColor = remote_time.style.textColor
                        time.text.font = remote_time.style.textSize
                        time.text.familyName = remote_time.style.familyName
                        time.text.androidFamilyName = remote_time.style.androidFamilyName

                        if ( remote_time.layout && remote_time.layout.left) {
                            let time_left_arr = remote_time.layout.left.split(',')
                            time_left = time_left_arr[1]
                        }
                        local_style_data.time = time
                    }
                    
                }
                
                self.$nextTick( ()=>{
                    //设置内边距
                    si_.css({
                        padding :padding_,
                        height:cell_height <0 ? 'auto' :cell_height+'px',
                    })

                    //设置标题、文本的box
                    si_.children('.text-father').css({
                        'height':parseFloat( local_style_data.mainImage.common.size.height)+ (self.type_module_ == 'bigImage_1001'?20 : 36),
                        'width':self.pageWidth-padding_left-padding_right-img_width-10+'px'
                    })

                    //设置标题
                    self.type_module_ == 'bigImage_1001' ? si_.children('.text-father').children('.title-father').css({
                        position:'relative',
                        top:'50%',
                        transform:'translateY(-50%)'
                    }) :null

                    //设置标题外边距
                    si_.children('.text-father').find('.title').css({
                        margin: title_top+'px ' +title_right+'px '+'0 '+title_left+'px'
                    })

                    //设置阅读量布局
                    si_.children('.text-father').children('.read-btn').css({
                        right:read_right+'px',
                        bottom:read_bottom+'px',
                    })

                    //设置标签
                    si_.children('.text-father').children('.text-tag-time').css({
                        bottom: parseFloat(tag_bottom)+1+'px'
                    })
                    si_.children('.text-father').children('.text-tag-time').find('.tag').css({
                        margin: '0 0 0 ' +tag_left+'px'
                    })

                    //设置时间
                    si_.children('.text-father').children('.text-tag-time').find('.time').css({
                        margin: '0 0 0 '+time_left+'px'
                    })
                    
                })

                //持有外部json数据
                self.remote_data = blet_
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
                let si_ = $('.blet-image'+self.getRandomClassName() )
                let which_one = self.type_module_
                self.$nextTick( ()=>{
                    let remote_data_which = self.type_module_ == 'bigImage_1001' ? self.remote_data['1001'][0] : self.remote_data['1002'][0]
                    si_.addClass('border-style-0').addClass('boder-color-animation') 

                    //整体高度
                    let cell_height = remote_data_which.height 
                    let new_object
                    if ( self.type_module_ == 'bigImage_1001') {
                        let width = 0 ,height = 0
                        //图片
                        if (remote_data_which.tip.child.size ) {
                            let size = remote_data_which.tip.child.size.split(',')
                            width = size[0]
                            height = size[1]
                        }
                        //标题
                        let title_color = remote_data_which.title.style.textColor || '',
                        title_font = remote_data_which.title.style.textSize || '',
                        title_familyName = remote_data_which.title.style.familyName || '',
                        title_androidFamilyName = remote_data_which.title.style.androidFamilyName || ''
                        new_object = { 
                            //整体高度
                            cell_height:cell_height,
                            radius:remote_data_which.tip.child.radius,
                            width:width,
                            height:height,
                            title_color:title_color,
                            title_font:title_font,
                            title_familyName:title_familyName,
                            title_androidFamilyName:title_androidFamilyName,
                        } 
                    }else{
                        //边距
                        let margin_arr_ = remote_data_which.margin.split(','),
                        mpid = ''
                        if ( margin_arr_.length > 4) {
                            mpid = margin_arr_.shift() 
                        }
                        let margin_new = margin_arr_.join(',')
                        //标题
                        let title_color = remote_data_which.title.style.textColor || '',
                        title_font = remote_data_which.title.style.textSize || '',
                        title_familyName = remote_data_which.title.style.familyName || '',
                        title_androidFamilyName = remote_data_which.title.style.androidFamilyName || ''
                        //标签
                        let tag_color = remote_data_which.tag.style.textColor || '',
                        tag_font = remote_data_which.tag.style.textSize || '',
                        tag_familyName = remote_data_which.tag.style.familyName || '',
                        tag_androidFamilyName = remote_data_which.tag.style.androidFamilyName || ''
                        //时间
                        let time_color = remote_data_which.time.style.textColor || '',
                        time_font = remote_data_which.time.style.textSize || '',
                        time_familyName = remote_data_which.time.style.familyName || '',
                        time_androidFamilyName = remote_data_which.time.style.androidFamilyName || ''
                        //阅读量
                        let read_color = remote_data_which.read.style.textColor || '',
                        read_font = remote_data_which.read.style.textSize || '',
                        read_familyName = remote_data_which.read.style.familyName || '',
                        read_androidFamilyName = remote_data_which.read.style.androidFamilyName || ''
                        new_object = { 
                            margin_new:margin_new,
                            //整体高度
                            cell_height:cell_height,
                            mpid:mpid,
                            title_color:title_color,
                            title_font:title_font,
                            title_familyName:title_familyName,
                            title_androidFamilyName:title_androidFamilyName,
                            tag_color:tag_color,
                            tag_font:tag_font,
                            tag_familyName:tag_familyName,
                            tag_androidFamilyName:tag_androidFamilyName,
                            time_color:time_color,
                            time_font:time_font,
                            time_familyName:time_familyName,
                            time_androidFamilyName:time_androidFamilyName,
                            read_color:read_color,
                            read_font:read_font,
                            read_familyName:read_familyName,
                            read_androidFamilyName:read_androidFamilyName
                        } 
                    }
                    self.$emit('edit_json_blet','',new_object,which_one )

                })  
                
            },
            //编辑json后，响应的数据
            edit_json_reponse( val_){
                let self = this
                //防止其他模块修改影响到本模块
                if ( val_.name.indexOf('blet') < 0 || 
                    (val_.difference == 'bigImage_1002' && self.type_module_ != 'bigImage_1002') ||
                    (val_.difference == 'bigImage_1001' && self.type_module_ != 'bigImage_1001') 
                ) 
                    return

                let remote_data_which = self.type_module_ == 'bigImage_1001' ? self.remote_data['1001'][0] : self.remote_data['1002'][0]
                //整体内嵌
                if ( val_.name.indexOf('blet.entirety') > -1 ) {
                    let margin_arr_ = remote_data_which.margin.split(',')
                    remote_data_which.margin = margin_arr_[0] +','+val_.data
                }
                //整体高度
                else if ( val_.name.indexOf('blet.cell_height') > -1) {
                    remote_data_which.height =  val_.data
                }
                //分割线
                else if ( val_.name.indexOf('blet.underline') > -1 ) {
                    let margin_arr_ = remote_data_which.margin.split(',')
                    margin_arr_[0] = val_.data.select
                    remote_data_which.margin = margin_arr_.join(',')
                }
                //图片
                else if ( val_.name.indexOf('blet.tip.width') > -1 || val_.name.indexOf('blet.tip.height') > -1 ) {
                    if ( remote_data_which.tip && remote_data_which.tip.child) {
                        remote_data_which.tip.child.size ? null : remote_data_which.tip.child.size = ['','']
                        let size = remote_data_which.tip.child.size.split(',')
                        val_.name.indexOf('blet.tip.width') > -1 ? size[0] = val_.data : size[1] = val_.data
                        remote_data_which.tip.child.size = size.join(',')
                    }
                }else if ( val_.name.indexOf('blet.tip.radius') > -1) {
                    if ( remote_data_which.tip && remote_data_which.tip.child) {
                        remote_data_which.tip.child.radius = val_.data
                    }
                }
                //标题
                else if ( val_.name.indexOf('blet.title.color') > -1) {
                    if ( remote_data_which.title && remote_data_which.title.style) {
                        remote_data_which.title.style.textColor = val_.data
                    }
                }else if ( val_.name.indexOf('blet.title.font') > -1) {
                    if ( remote_data_which.title && remote_data_which.title.style) {
                        remote_data_which.title.style.textSize = val_.data
                    }
                }else if ( val_.name.indexOf('blet.title.familyName') > -1) {
                    if ( remote_data_which.title && remote_data_which.title.style) {
                        remote_data_which.title.style.familyName = val_.data
                    }
                }else if ( val_.name.indexOf('blet.title.androidFamilyName') > -1) {
                    if ( remote_data_which.title && remote_data_which.title.style) {
                        remote_data_which.title.style.androidFamilyName = val_.data
                    }
                }else if ( val_.name.indexOf('blet.title.left') > -1) {
                    if ( remote_data_which.title && remote_data_which.title.layout) {
                        let left = remote_data_which.title.layout.left || 'img,0'//'img,0中img可以是任何字符串'
                        let left_arr = left.split(',')
                        left_arr[1] = val_.data
                        remote_data_which.title.layout.left = left_arr.join(',')
                    }
                }else if ( val_.name.indexOf('blet.title.top') > -1) {
                    if ( remote_data_which.title && remote_data_which.title.layout) {
                        let top = remote_data_which.title.layout.top || 'parent,0'
                        let top_arr = top.split(',')
                        top_arr[1] = val_.data
                        remote_data_which.title.layout.top = top_arr.join(',')
                    }
                }else if ( val_.name.indexOf('blet.title.right') > -1 && val_.difference == 'r') {
                    if ( remote_data_which.title && remote_data_which.title.layout) {
                        let right = remote_data_which.title.layout.right || 'parent,0'
                        let right_arr = right.split(',')
                        right_arr[1] = val_.data
                        remote_data_which.title.layout.right = right_arr.join(',')
                    }
                }
                //标签
                else if ( val_.name.indexOf('blet.tag.color') > -1) {
                    if ( remote_data_which.tag && remote_data_which.tag.style) {
                        remote_data_which.tag.style.textColor = val_.data
                    }
                }else if ( val_.name.indexOf('blet.tag.font') > -1) {
                    if ( remote_data_which.tag && remote_data_which.tag.style) {
                        remote_data_which.tag.style.textSize = val_.data
                    }
                }else if ( val_.name.indexOf('blet.tag.familyName') > -1) {
                    if ( remote_data_which.tag && remote_data_which.tag.style) {
                        remote_data_which.tag.style.familyName = val_.data
                    }
                }else if ( val_.name.indexOf('blet.tag.androidFamilyName') > -1) {
                    if ( remote_data_which.tag && remote_data_which.tag.style) {
                        remote_data_which.tag.style.androidFamilyName = val_.data
                    }
                }else if ( val_.name.indexOf('blet.tag.left') > -1) {
                    if ( remote_data_which.tag && remote_data_which.tag.style) {
                        let left = remote_data_which.tag.layout.left //'img,0中img可以是任何字符串'
                        let left_arr = left.split(',')
                        left_arr[1] = val_.data
                        remote_data_which.tag.layout.left = left_arr.join(',')
                    }
                }else if ( val_.name.indexOf('blet.tag.bottom') > -1) {
                    if ( remote_data_which.tag && remote_data_which.tag.style) {
                        let bottom = remote_data_which.tag.layout.bottom || 'parent,0'
                        let bottom_arr = bottom.split(',')
                        bottom_arr[1] = val_.data
                        remote_data_which.tag.layout.bottom = bottom_arr.join(',')
                    }
                }
                //时间
                else if ( val_.name.indexOf('blet.time.color') > -1) {
                    if ( remote_data_which.time && remote_data_which.time.style) {
                        remote_data_which.time.style.textColor = val_.data
                    }
                }else if ( val_.name.indexOf('blet.time.font') > -1) {
                    if ( remote_data_which.time && remote_data_which.time.style) {
                        remote_data_which.time.style.textSize = val_.data
                    }
                }else if ( val_.name.indexOf('blet.time.familyName') > -1) {
                    if ( remote_data_which.time && remote_data_which.time.style) {
                        remote_data_which.time.style.familyName = val_.data
                    }
                }else if ( val_.name.indexOf('blet.time.androidFamilyName') > -1) {
                    if ( remote_data_which.time && remote_data_which.time.style) {
                        remote_data_which.time.style.androidFamilyName = val_.data
                    }
                }else if ( val_.name.indexOf('blet.time.left') > -1) {
                    if ( remote_data_which.time && remote_data_which.time.style) {
                        let left = remote_data_which.time.layout.left //'img,0中img可以是任何字符串'
                        let left_arr = left.split(',')
                        left_arr[1] = val_.data
                        remote_data_which.time.layout.left = left_arr.join(',')
                    }
                }
                //阅读量
                else if ( val_.name.indexOf('blet.read.color') > -1) {
                    if ( remote_data_which.read && remote_data_which.read.style) {
                        remote_data_which.read.style.textColor = val_.data
                    }
                }else if ( val_.name.indexOf('blet.read.font') > -1) {
                    if ( remote_data_which.read && remote_data_which.read.style) {
                        remote_data_which.read.style.textSize = val_.data
                    }
                }else if ( val_.name.indexOf('blet.read.familyName') > -1) {
                    if ( remote_data_which.read && remote_data_which.read.style) {
                        remote_data_which.read.style.familyName = val_.data
                    }
                }else if ( val_.name.indexOf('blet.read.androidFamilyName') > -1) {
                    if ( remote_data_which.read && remote_data_which.read.style) {
                        remote_data_which.read.style.androidFamilyName = val_.data
                    }
                }else if ( val_.name.indexOf('blet.read.right') > -1) {
                    if ( remote_data_which.read && remote_data_which.read.style) {
                        let right = remote_data_which.read.layout.right || 'parent,0'//'leftImage,0中img可以是任何字符串'
                        let right_arr = right.split(',')
                        right_arr[1] = val_.data
                        remote_data_which.read.layout.right = right_arr.join(',')
                    }
                }else if ( val_.name.indexOf('blet.read.bottom') > -1) {
                    if ( remote_data_which.read && remote_data_which.read.style) {
                        let bottom = remote_data_which.read.layout.bottom || 'parent,0'//'leftImage,0中img可以是任何字符串'
                        let bottom_arr = bottom.split(',')
                        bottom_arr[1] = val_.data
                        remote_data_which.read.layout.bottom = bottom_arr.join(',')
                    }
                }
                self.setLayout( self.remote_data);
                let new_object = JSON.parse( JSON.stringify( self.remote_data))
                self.convertToClent( new_object)

                let pt__ = val_.difference.split('_')[1],
                post_new_object = self.type_module_ == 'bigImage_1001' ? new_object['1001'] : new_object['1002']
                $.edit_json_remote_post('newsList','bulletin',pt__,post_new_object)
                
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
                    }else if ( (typeof data_[key_] == 'object') ) {
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
                    }else if ( (typeof data_[key_] == 'object') ) {
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
                    let $bli = $('.blet-image'+self.getRandomClassName()+'.copy' )
                    setTimeout(function() {
                        if ( $bli.data('contentData')&& $bli.data('refresData')  ) {
                            $bli.data('refresData',false)
                            let j_ = JSON.parse( $bli.data('contentData'))
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
                $bli = $('.blet-image'+self.getRandomClassName()+'.copy' )

                $.each($bli,(i)=>{
                    let baseData = JSON.parse( $bli.eq(i).data('baseData')),
                    $blimg = $bli.eq(i),
                    $img = $bli.eq(i).find('.image').eq(0),
                    $title = $bli.eq(i).find('.title').eq(0),
                    $time = $bli.eq(i).find('.time').eq(0),
                    $read = $bli.eq(i).find('.read').eq(0),
                    $tag = $bli.eq(i).find('.tag').eq(0),
                    count = 0,
                    setItem = ( item)=>{
                        let tagContent = item.tags+' '+item.source
                        $img.css('backgroundImage','url('+(item.cover && item.cover[0]['path'] || '')+')')
                        $title.text( item.title)
                        $time.text( self.getTimeFormatter(item.createdAt*1000))
                        $read.text( item.viewBaseNum)
                        $blimg.data('concrete_data',item)
                        if ( tagContent) {
                            $tag.text( tagContent) 
                            $tag.css('display','inline-block')
                        }else{
                            $tag.css('display','none')
                        }
                    }
                    
                    clearInterval(self.timer_roll);
                    self.timer_roll = setInterval(function(){
                        let item = baseData.items[count]
                        count == baseData.items.length-1 ? count = 0 : ++count
                        setItem( item)
                    },3000)
                    setItem( baseData.items[count])

                    $bli.eq(i).off('click').on('click',function(){
                        $.click_news_into_particular( $(this).data('concrete_data'))
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
                return date.getFullYear()+'-'+M+'-'+D+' '+H+':'+m+':'+S
            },

            getRandomClassName(){
                let self = this
                return '.'+self.randomMark
            },

            getlocalData(){
                return {
                    "mainImage":{
                        "imgUrl":'http://shixiantest.oss-cn-hangzhou.aliyuncs.com/48/posts/2020/09/28/71d9d607cb8341bd4dc21590dfd45fc3.png',
                        "imgFill":"cover",
                        "common":{
                            "border": {
                                "borderColor": "#fff", 
                                "borderWidth": 0, 
                                "borderRadius": 3 
                            },
                            "size":{
                                "width":58,
                                "height":30
                            },
                        }
                    },
                    "title":{
                        "textContent":'国庆跑了3小时高速，要不要去服务区给发动机散热',
                        "textContent_style":'none',
                        "color":{
                            "textColor":"#000000",
                        },
                        "text":{
                            "textAlignment":0,
                            "font":15,
                            "familyName":"",
                            "androidFamilyName":"",
                        },
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
                            "androidFamilyName":"",
                        },
                        "common":{
                            "border":{
                                "borderColor":"#FF6002",
                                "borderWidth":1,
                                "border-radius":3,
                            },
                            "size":{
                                "height":18
                            },
                        }
                    },
                    "time":{
                        "textContent":'08:39:20',
                        "textContent_style":'none',
                        "color":{
                            "textColor":"#000000"
                        },
                        "text":{
                            "textAlignment":0,
                            "font":13,
                            "familyName":"",
                            "androidFamilyName":"",
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
                            "androidFamilyName":"",
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
    .blet-image{
        width: 100%;
        position: relative;
        white-space: pre-wrap;
        overflow: hidden;
        // padding: 5px;
        background-color: @contentbg;
        .img-father{
            display: inline-block;
            vertical-align: middle;
        }
        .text-father{
            display: inline-block;
            position: relative;
            vertical-align: middle;
            .text-tag-time{
                position: absolute;
                bottom: 1px;
            }
            .read-btn{
                position: absolute;
                right: 0;
                bottom: 0;
                .read{
                    margin-left: -3px;
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
        .line{
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
        }
    }

</style>
<template>
    <div :class='"info-image "+randomMark' @click.stop='edit_json_style("1")'>
        <div class="row" 
            v-for="(fval,fkey) in 
                local_data.mainImage ? ( ability_content == 0 ? 
                local_data.mainImage.imgUrlArr: local_data.mainImage.imgUrlArr2 )  
                :[]"
        >
            <div v-for="(val,key) in fval" :key='key' class="cell-one">
                <div class="img-father" >
                    <ImageLayout class='image' :layout_data='function() {
                        if ( !local_data.mainImage) {
                            return ;
                        }
                        let new_object = JSON.parse( JSON.stringify( local_data.mainImage))
                        new_object.imgUrl = val
                        return new_object
                    }()'></ImageLayout>
                    <div class="duration-package" v-if='ability_content == 0'>
                        <ImageLayout class='duration-img':layout_data='local_data.durationImg'></ImageLayout>
                        <LabelLayout class='duration-text' :layout_data='local_data.duration'></LabelLayout>
                    </div>
                    <div class="recommend-content" v-if='ability_content == 1'>
                        <div class="source-package">
                            <ImageLayout class='source-img':layout_data='local_data.sourceImg'></ImageLayout>
                            <LabelLayout class='source-text' :layout_data='local_data.source'></LabelLayout>
                        </div>
                        <LabelLayout class='read-person' :layout_data='local_data.readPerson'></LabelLayout>
                    </div>
                </div>
                <div >
                    <LabelLayout class='title' :layout_data='function() {
                        if ( !local_data.title) {
                            return ;
                        }
                        let new_object = JSON.parse( JSON.stringify( local_data.title))
                        if ( ability_content == 0 ) 
                            new_object.textContent = new_object.textContentArr[fkey][key]
                        else
                            new_object.textContent = new_object.textContentArr2[fkey][key]

                        return new_object
                    }()' ></LabelLayout>
                </div>
                <div class="text-father" v-if='ability_content == 0'>
                    <div class="text-tag-time">
                        <div style="display: inline-block;">
                            <LabelLayout class='tag' :layout_data='local_data.tag'></LabelLayout>
                        </div>
                        <div style="display: inline-block;" >
                            <LabelLayout class='time' :layout_data='local_data.time'></LabelLayout> 
                        </div>
                    </div>
                    <div class="read-btn" >
                        <div class="read-package">
                            <ImageLayout class='read-img':layout_data='local_data.readImg'></ImageLayout>
                            <LabelLayout class='read-text' :layout_data='local_data.read'></LabelLayout>
                        </div> 
                    </div>
                </div>
            </div>
        </div>
        
        <!-- <ViewLayout class='line' :layout_data='local_data.line'></ViewLayout> -->
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
                ability_content:0, //0:并排两队带标签，1:瀑布流不带标签
            }
        },
        watch:{
            infoimageData:function (newVal,oldVal ) {
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

            let infoimage_data_
            if ( self.type_element == 'bigImage_1401') {
                let ifdata = self._props.infoimageData['1401']
                infoimage_data_ = ifdata && ifdata[0] ? ifdata [0] : ( ifdata || '')
                self.ability_content = 0
            }else if ( self.type_element == 'bigImage_1403') {
                let ifdata = self._props.infoimageData['1403']
                infoimage_data_ = ifdata && ifdata[0] ? ifdata [0] : ( ifdata || '')
                self.ability_content = 1
            }

            self.convertToWeb( infoimage_data_)
            self.setLayout( infoimage_data_)
            self.getDataRedraw()
            self.$emit('edit_json_infoimage',function( val_){
                self.edit_json_reponse( val_)
            },'','') 
        },
        props: ['infoimageData','typeids'],
        components:{
            LabelLayout,
            ButtonLayout,
            ImageLayout,
            ViewLayout,
        },
        methods:{
            setLayout( infoimage_){
                let self = this
                if ( !infoimage_) 
                    return
                let local_style_data = self.getlocalData()
                let $ii_ = $('.info-image'+self.getRandomClassName() )

                //设置边距
                let padding_ = '';let padding_left = 0 ; let padding_right = 0 
                {
                    if ( infoimage_.margin) {
                        let margin_arr_ = infoimage_.margin.split(',')
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
                //整体高度
                let cell_height = -1
                {
                    cell_height = infoimage_.height
                }
                //设置图片
                let img_width = 0, img_top=0, img_left = 0
                if ( infoimage_.img) {
                    let main_image = local_style_data.mainImage
                    let size =infoimage_.img.child.size.split(',')
                    let img_right = 0
                    if ( infoimage_.img.layout) {
                        if ( infoimage_.img.layout.left) {
                            let img_left_arr = infoimage_.img.layout.left.split(',')
                            img_left = img_left_arr[1]
                        }
                        if ( infoimage_.img.layout.right) {
                            let img_right_arr = infoimage_.img.layout.right.split(',')
                            img_right = img_right_arr[1]
                        }
                        if ( infoimage_.img.layout.top) {
                            let img_top_arr = infoimage_.img.layout.top.split(',')
                            img_top = img_top_arr[1]
                        }
                    }
                    
                    img_width = main_image.common.size.width = (self.pageWidth - padding_left - padding_right -img_left - img_right )

                    size[1] ? main_image.common.size.height = size[1] :null
                    main_image.common.border.borderRadius = infoimage_.img.child.radius
                    local_style_data.mainImage = main_image
                }
                //设置播放时间
                let duration_left = 5,duration_bottom = 5 
                if ( infoimage_.videoDuration){
                    let duration = local_style_data.duration
                    duration.color.textColor = infoimage_.videoDuration.style.textColor
                    duration.text.font = infoimage_.videoDuration.style.textSize
                    duration.text.familyName = infoimage_.videoDuration.style.familyName
                    duration.text.androidFamilyName = infoimage_.videoDuration.style.androidFamilyName

                    if( infoimage_.videoDuration.layout){
                        if ( infoimage_.videoDuration.layout.left) {
                            let duration_left_arr = infoimage_.videoDuration.layout.left.split(',')
                            duration_left = duration_left_arr[1]
                        }
                        if ( infoimage_.videoDuration.layout.bottom) {
                            let duration_bottom_arr = infoimage_.videoDuration.layout.bottom.split(',')
                            duration_bottom = duration_bottom_arr[1]
                        }
                    }
                }
                //设置标题
                let title_left = 0,title_top = 0 
                if ( infoimage_.title){
                    let title = local_style_data.title
                    title.color.textColor = infoimage_.title.style.textColor
                    title.text.font = infoimage_.title.style.textSize
                    title.text.familyName = infoimage_.title.style.familyName
                    title.text.androidFamilyName = infoimage_.title.style.androidFamilyName

                    if( infoimage_.title.layout){
                        if ( infoimage_.title.layout.left) {
                            let title_left_arr = infoimage_.title.layout.left.split(',')
                            title_left = title_left_arr[1]
                        }
                        if ( infoimage_.title.layout.top) {
                            let title_top_arr = infoimage_.title.layout.top.split(',')
                            title_top = title_top_arr[1]
                        }
                    }
                    
                }
                //设置标签
                let tag_left = 0,tag_bottom = 0 ,tag_top = 0
                if ( infoimage_.tag && self.ability_content == 0){
                    let source = local_style_data.tag
                    source.color.textColor = infoimage_.tag.style.textColor
                    source.text.font = infoimage_.tag.style.textSize
                    source.text.familyName = infoimage_.tag.style.familyName

                    if( infoimage_.tag.layout){
                        if ( infoimage_.tag.layout.left) {
                            let tag_left_arr = infoimage_.tag.layout.left.split(',')
                            tag_left = tag_left_arr[1]
                        }
                        if ( infoimage_.tag.layout.bottom) {
                            let tag_bottom_arr = infoimage_.tag.layout.bottom.split(',')
                            tag_bottom = tag_bottom_arr[1]
                        }
                        if ( infoimage_.tag.layout.top) {
                            let tag_top_arr = infoimage_.tag.layout.top.split(',')
                            tag_top = tag_top_arr[1]
                        }
                    }
                    
                }
                //时间
                let time_left = 0,time_top=0,time_bottom=0
                if ( infoimage_.time){    
                    let time = local_style_data.time
                    time.color.textColor = infoimage_.time.style.textColor
                    time.text.font = infoimage_.time.style.textSize
                    time.text.familyName = infoimage_.time.style.familyName

                    if ( infoimage_.time.layout) {
                        if ( infoimage_.time.layout.left) {
                            let time_left_arr = infoimage_.time.layout.left.split(',')
                            time_left = time_left_arr[1]
                        }
                        if ( infoimage_.time.layout.bottom) {
                            let time_bottom_arr = infoimage_.time.layout.bottom.split(',')
                            time_bottom = time_bottom_arr[1]
                        }
                        if ( infoimage_.time.layout.top) {
                            let time_top_arr = infoimage_.time.layout.top.split(',')
                            time_top = time_top_arr[1]
                        }
                    }
                    
                }
                //设置阅读量
                let read_right = 0,read_top = 0 ,read_bottom = 0
                if ( infoimage_.read && self.ability_content == 0){
                    let read = local_style_data.read
                    read.color.textColor = infoimage_.read.style.textColor
                    read.text.font = infoimage_.read.style.textSize
                    read.text.familyName = infoimage_.read.style.familyName

                    if ( infoimage_.read.layout) {
                       if ( infoimage_.read.layout.right) {
                            let read_right_arr = infoimage_.read.layout.right.split(',')
                            read_right = read_right_arr[1]
                        }
                        if ( infoimage_.read.layout.top) {
                            let read_top_arr = infoimage_.read.layout.top.split(',')
                            read_top = read_top_arr[1]
                        }
                        if ( infoimage_.read.layout.bottom) {
                            let read_bottom_arr = infoimage_.read.layout.bottom.split(',')
                            read_bottom = read_bottom_arr[1]
                        } 
                    }
                }
                //设置顶部推荐
                let source_left = 5,source_top = 5
                if ( infoimage_.source && self.ability_content == 1){
                    let source = local_style_data.source
                    source.color.textColor = infoimage_.source.style.textColor
                    source.text.font = infoimage_.source.style.textSize
                    source.text.familyName = infoimage_.source.style.familyName

                    if ( infoimage_.source.layout) {
                        if ( infoimage_.source.layout.left) {
                            let source_left_arr = infoimage_.source.layout.left.split(',')
                            source_left = source_left_arr[1]
                        }
                        if ( infoimage_.source.layout.top) {
                            let source_top_arr = infoimage_.source.layout.top.split(',')
                            source_top = source_top_arr[1]
                        }
                    }
                }
                //顶部观看人数
                let readPersons_right = 5,readPersons_top = 5
                if ( infoimage_.read && self.ability_content == 1){
                    let read = local_style_data.readPerson
                    read.color.textColor = infoimage_.read.style.textColor
                    read.text.font = infoimage_.read.style.textSize
                    read.text.familyName = infoimage_.read.style.familyName

                    if ( infoimage_.read.layout) {
                        if ( infoimage_.read.layout.right) {
                            let read_right_arr = infoimage_.read.layout.right.split(',')
                            readPersons_right = read_right_arr[1]
                        }
                        if ( infoimage_.read.layout.top) {
                            let read_top_arr = infoimage_.read.layout.top.split(',')
                            readPersons_top = read_top_arr[1]
                        }
                    }  
                }

                self.$nextTick( ()=>{
                    //设置内边距
                    $ii_.css({
                        padding: padding_,
                        height:cell_height <0 ? 'auto' :cell_height+'px',
                    })

                    //设置每个图片文字单元
                    {
                       let imgTextLength = $ii_.find('.cell-one').length,
                        styled_bottom = { marginBottom:'10px' }

                        $.each( $ii_.find('.cell-one'),(i)=>{
                            i < imgTextLength-2 ? $ii_.find('.cell-one').eq(i).css( styled_bottom) : null
                        }) 
                    }

                    //设置图片边距
                    $ii_.find('.img-father').css({
                        marginTop: img_top+'px',
                        marginLeft: img_left+'px',
                    })

                    //设置播放时间边距
                    $ii_.find('.duration-package').css({
                        left:duration_left+'px',
                        bottom:parseFloat(duration_bottom)+3+'px',
                    })

                    //设置标题外边距
                    $ii_.find('.title').css({
                        margin: title_top+'px 0 0 '+title_left+'px'
                    })

                    //设置阅读量布局
                    $ii_.find('.text-father').find('.read-btn').css({
                        right:read_right+'px',
                        marginTop:read_top+'px',
                        marginBottom:read_bottom+'px',
                    })

                    //设置标签
                    $ii_.find('.text-father').find('.text-tag-time').find('.tag').css({
                        margin:tag_top+'px '+'0 '+tag_bottom+'px ' +tag_left+'px'
                    })

                    //设置时间
                    $ii_.find('.text-father').find('.text-tag-time').find('.time').css({
                        margin: time_top+'px '+'0 '+time_bottom+'px ' +time_left+'px'
                    })

                    //设置顶部推荐
                    $ii_.find('.img-father').find('.recommend-content').find('.source-package').css({
                        margin: source_top+'px '+'0 '+'0 ' +source_left+'px'
                    })

                    //设置顶部在看人数
                    $ii_.find('.img-father').find('.recommend-content').find('.read-person').css({
                        margin: readPersons_top+'px '+readPersons_right+'px '+'0 ' +'0'
                    })
                    
                    $ii_.find('.line').css({
                        position:'absolute',
                        bottom:'0',
                        left:'0',
                        right:'0'
                    }) 
                })

                //持有外部json数据
                self.remote_data = infoimage_
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
                let $ii_ = $('.info-image'+self.getRandomClassName() )
                let which_one = self.type_element
                self.$nextTick( ()=>{
                    $ii_.addClass('border-style-0').addClass('boder-color-animation')  
                    if ( id_ == '1') {
                        //修改整体边距
                        let margin_arr_ = self.remote_data.margin.split(','),
                        mpid = ''
                        if ( margin_arr_.length > 4) {
                            mpid = margin_arr_.shift() //删除第一个标识符
                        }
                        let margin_new = margin_arr_.join(',')

                        //整体高度
                        let cell_height = self.remote_data.height

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
                            }
                            imgradius = self.remote_data.img.child.radius
                        }

                        //播放时间
                        let durationcolor = '',durationfont = '',durationfamilyName = '',durationandroidFamilyName = '',durationleft = 0,durationtop = 0, durationright = 0 ,durationbottom = 0
                        if ( self.remote_data.videoDuration) {
                            durationcolor = self.remote_data.videoDuration.style.textColor || ''
                            durationfont = self.remote_data.videoDuration.style.textSize || ''
                            durationfamilyName = self.remote_data.videoDuration.style.familyName || ''
                            durationandroidFamilyName = self.remote_data.videoDuration.style.androidFamilyName || ''
                            if ( self.remote_data.videoDuration.layout) {
                                if ( self.remote_data.videoDuration.layout.left) {
                                    let arr_split = self.remote_data.videoDuration.layout.left.split(',')
                                    durationleft = arr_split[1]
                                }
                                if ( self.remote_data.videoDuration.layout.top) {
                                    let arr_split = self.remote_data.videoDuration.layout.top.split(',')
                                    durationtop = arr_split[1]
                                }
                                if ( self.remote_data.videoDuration.layout.right) {
                                    let arr_split = self.remote_data.videoDuration.layout.right.split(',')
                                    durationright = arr_split[1]
                                }
                                if ( self.remote_data.videoDuration.layout.bottom) {
                                    let arr_split = self.remote_data.videoDuration.layout.bottom.split(',')
                                    durationbottom = arr_split[1]
                                }
                            }
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
                        if ( self.remote_data.tag && self.ability_content == 0) {
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
                        if ( self.remote_data.read && self.ability_content == 0) {
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

                        //顶部推荐
                        let sourcecolor = '',sourcefont = '',sourcefamilyName = '',sourceandroidFamilyName = '',sourceleft = 0,sourcetop = 0
                        if ( self.remote_data.source && self.ability_content == 1) {
                            sourcecolor = self.remote_data.source.style.textColor || ''
                            sourcefont = self.remote_data.source.style.textSize || ''
                            sourcefamilyName = self.remote_data.source.style.familyName || ''
                            sourceandroidFamilyName = self.remote_data.source.style.androidFamilyName || ''

                            if ( self.remote_data.source.layout) {
                                if ( self.remote_data.source.layout.left) {
                                    let arr_split = self.remote_data.source.layout.left.split(',')
                                    sourceleft = arr_split[1]
                                }
                                if ( self.remote_data.source.layout.top) {
                                    let arr_split = self.remote_data.source.layout.top.split(',')
                                    sourcetop = arr_split[1]
                                }
                            }
                        }

                        //顶部在看人数
                        let readPersoncolor = '',readPersonfont = '',readPersonfamilyName = '',readPersonandroidFamilyName = '',readPersonright = 0,readPersontop = 0
                        if ( self.remote_data.read && self.ability_content == 1) {
                            readPersoncolor = self.remote_data.read.style.textColor || ''
                            readPersonfont = self.remote_data.read.style.textSize || ''
                            readPersonfamilyName = self.remote_data.read.style.familyName || ''
                            readPersonandroidFamilyName = self.remote_data.read.style.androidFamilyName || ''

                            if ( self.remote_data.read.layout) {
                                if ( self.remote_data.read.layout.right) {
                                    let arr_split = self.remote_data.read.layout.right.split(',')
                                    readPersonright = arr_split[1]
                                }
                                if ( self.remote_data.read.layout.top) {
                                    let arr_split = self.remote_data.read.layout.top.split(',')
                                    readPersontop = arr_split[1]
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
                            imgheight:imgheight,
                            imgleft:imgleft,
                            imgtop:imgtop,
                            imgradius:imgradius,
                            //播放时间
                            durationcolor:durationcolor,
                            durationfont:durationfont,
                            durationfamilyName:durationfamilyName,
                            durationandroidFamilyName:durationandroidFamilyName,
                            durationleft:durationleft,
                            durationtop:durationtop,
                            durationright:durationright,
                            durationbottom:durationbottom,
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
                            //顶部推荐
                            sourcecolor:sourcecolor,
                            sourcefont:sourcefont,
                            sourcefamilyName:sourcefamilyName,
                            sourceandroidFamilyName:sourceandroidFamilyName,
                            sourceleft:sourceleft,
                            sourcetop:sourcetop,
                            //顶部在看人数
                            readPersoncolor:readPersoncolor,
                            readPersonfont:readPersonfont,
                            readPersonfamilyName:readPersonfamilyName,
                            readPersonandroidFamilyName:readPersonandroidFamilyName,
                            readPersonright:readPersonright,
                            readPersontop:readPersontop,

                        }
                        self.$emit('edit_json_infoimage','',newObject ,which_one )
                    }

                })  
                
            },
            //编辑json后，响应的数据
            edit_json_reponse( val_){
                let self = this
                //防止其他模块修改影响到本模块
                if ( val_.name.indexOf('infoimage') < 0 || 
                    (val_.difference == 'bigImage_1401'&& self.type_element  != 'bigImage_1401' ) || 
                    (val_.difference == 'bigImage_1403'&& self.type_element  != 'bigImage_1403' )
                ) 
                    return
                //整体内嵌
                if ( val_.name.indexOf('infoimage.entirety') > -1 ) {
                    let margin_arr_ = self.remote_data.margin.split(',')
                    self.remote_data.margin = margin_arr_[0] +','+val_.data
                }
                //整体高度
                else if ( val_.name.indexOf('infoimage.cell_height') > -1) {
                    self.remote_data.height =  val_.data
                }
                //分割线类型
                else if ( val_.name.indexOf('infoimage.underline') > -1 ) {
                    let margin_arr_ = self.remote_data.margin.split(',')
                    margin_arr_[0] = val_.data.select
                    self.remote_data.margin = margin_arr_.join(',')
                }
                //图片
                else if ( val_.name.indexOf('infoimage.img.width') > -1 || val_.name.indexOf('infoimage.img.height') > -1 ) {
                    if ( self.remote_data.img && self.remote_data.img.child) {
                        self.remote_data.img.child.size ? null : self.remote_data.img.child.size = ['','']
                        let size = self.remote_data.img.child.size.split(',')
                        val_.name.indexOf('infoimage.img.width') > -1 ? size[0] = val_.data : size[1] = val_.data
                        self.remote_data.img.child.size = size.join(',')
                    }
                }else if ( val_.name.indexOf('infoimage.img.radius') > -1) {
                    if ( self.remote_data.img && self.remote_data.img.child) {
                        self.remote_data.img.child.radius = val_.data
                    }
                }else if ( val_.name.indexOf('infoimage.img.left') > -1) {
                    if ( self.remote_data.img && self.remote_data.img.layout) {
                        let left = self.remote_data.img.layout.left || 'parent,0'
                        let left_arr = left.split(',')
                        left_arr[1] = val_.data
                        self.remote_data.img.layout.left = left_arr.join(',')
                    }
                }else if ( val_.name.indexOf('infoimage.img.right') > -1) {
                    if ( self.remote_data.img && self.remote_data.img.layout) {
                        let right = self.remote_data.img.layout.right || 'parent,0'
                        let right_arr = right.split(',')
                        right_arr[1] = val_.data
                        self.remote_data.img.layout.right = right_arr.join(',')
                    }
                }else if ( val_.name.indexOf('infoimage.img.top') > -1) {
                    if ( self.remote_data.img && self.remote_data.img.layout) {
                        let top = self.remote_data.img.layout.top || 'parent,0'
                        let top_arr = top.split(',')
                        top_arr[1] = val_.data
                        self.remote_data.img.layout.top = top_arr.join(',')
                    }
                }
                //播放时间
                else if ( val_.name.indexOf('infoimage.duration.color') > -1) {
                    if ( self.remote_data.videoDuration && self.remote_data.videoDuration.style) {
                        self.remote_data.videoDuration.style.textColor = val_.data
                    }
                }else if ( val_.name.indexOf('infoimage.duration.font') > -1) {
                    if ( self.remote_data.videoDuration && self.remote_data.videoDuration.style) {
                        self.remote_data.videoDuration.style.textSize = val_.data
                    }
                }else if ( val_.name.indexOf('infoimage.duration.familyName') > -1) {
                    if ( self.remote_data.videoDuration && self.remote_data.videoDuration.style) {
                        self.remote_data.videoDuration.style.familyName = val_.data
                    }
                }else if ( val_.name.indexOf('infoimage.duration.androidfamilyName') > -1) {
                    if ( self.remote_data.videoDuration && self.remote_data.videoDuration.style) {
                        self.remote_data.videoDuration.style.androidFamilyName = val_.data
                    }
                }else if ( val_.name.indexOf('infoimage.duration.left') > -1) {
                    if ( self.remote_data.videoDuration && self.remote_data.videoDuration.layout) {
                        let left = self.remote_data.videoDuration.layout.left 
                        let left_arr = left.split(',');!left_arr[0] ? left_arr[0] = ' ' : null
                        left_arr[1] = val_.data
                        self.remote_data.videoDuration.layout.left = left_arr.join(',')
                    }
                }else if ( val_.name.indexOf('infoimage.duration.bottom') > -1) {
                    if ( self.remote_data.videoDuration && self.remote_data.videoDuration.layout) {
                        let bottom = self.remote_data.videoDuration.layout.bottom 
                        let bottom_arr = bottom.split(',');!bottom_arr[0] ? bottom_arr[0] = ' ' : null
                        bottom_arr[1] = val_.data
                        self.remote_data.videoDuration.layout.bottom = bottom_arr.join(',')
                    }
                }
                //标题
                else if ( val_.name.indexOf('infoimage.title.color') > -1) {
                    if ( self.remote_data.title && self.remote_data.title.style) {
                        self.remote_data.title.style.textColor = val_.data
                    }
                }else if ( val_.name.indexOf('infoimage.title.font') > -1) {
                    if ( self.remote_data.title && self.remote_data.title.style) {
                        self.remote_data.title.style.textSize = val_.data
                    }
                }else if ( val_.name.indexOf('infoimage.title.familyName') > -1) {
                    if ( self.remote_data.title && self.remote_data.title.style) {
                        self.remote_data.title.style.familyName = val_.data
                    }
                }else if ( val_.name.indexOf('infoimage.title.androidfamilyName') > -1) {
                    if ( self.remote_data.title && self.remote_data.title.style) {
                        self.remote_data.title.style.androidFamilyName = val_.data
                    }
                }else if ( val_.name.indexOf('infoimage.title.left') > -1) {
                    if ( self.remote_data.title && self.remote_data.title.layout) {
                        let left = self.remote_data.title.layout.left 
                        let left_arr = left.split(',');!left_arr[0] ? left_arr[0] = ' ' : null
                        left_arr[1] = val_.data
                        self.remote_data.title.layout.left = left_arr.join(',')
                    }
                }else if ( val_.name.indexOf('infoimage.title.top') > -1) {
                    if ( self.remote_data.title && self.remote_data.title.layout) {
                        let top = self.remote_data.title.layout.top 
                        let top_arr = top.split(',');!top_arr[0] ? top_arr[0] = ' ' : null
                        top_arr[1] = val_.data
                        self.remote_data.title.layout.top = top_arr.join(',')
                    }
                }
                //标签
                else if ( val_.name.indexOf('infoimage.tag.color') > -1) {
                    if ( self.remote_data.tag && self.remote_data.tag.style) {
                        self.remote_data.tag.style.textColor = val_.data
                    }
                }else if ( val_.name.indexOf('infoimage.tag.font') > -1) {
                    if ( self.remote_data.tag && self.remote_data.tag.style) {
                        self.remote_data.tag.style.textSize = val_.data
                    }
                }else if ( val_.name.indexOf('infoimage.tag.familyName') > -1) {
                    if ( self.remote_data.tag && self.remote_data.tag.style) {
                        self.remote_data.tag.style.familyName = val_.data
                    }
                }else if ( val_.name.indexOf('infoimage.tag.androidfamilyName') > -1) {
                    if ( self.remote_data.tag && self.remote_data.tag.style) {
                        self.remote_data.tag.style.androidFamilyName = val_.data
                    }
                }else if ( val_.name.indexOf('infoimage.tag.left') > -1) {
                    if ( self.remote_data.tag && self.remote_data.tag.layout) {
                        let left = self.remote_data.tag.layout.left 
                        let left_arr = left.split(',');!left_arr[0] ? left_arr[0] = ' ' : null
                        left_arr[1] = val_.data
                        self.remote_data.tag.layout.left = left_arr.join(',')
                    }
                }else if ( val_.name.indexOf('infoimage.tag.top') > -1) {
                    if ( self.remote_data.tag && self.remote_data.tag.layout) {
                        let top = self.remote_data.tag.layout.top 
                        let top_arr = top.split(',');!top_arr[0] ? top_arr[0] = ' ' : null
                        top_arr[1] = val_.data
                        self.remote_data.tag.layout.top = top_arr.join(',')
                    }
                }else if ( val_.name.indexOf('infoimage.tag.bottom') > -1) {
                    if ( self.remote_data.tag && self.remote_data.tag.style) {
                        let bottom = self.remote_data.tag.layout.bottom 
                        let bottom_arr = bottom.split(',');!bottom_arr[0] ? bottom_arr[0] = ' ' : null
                        bottom_arr[1] = val_.data
                        self.remote_data.tag.layout.bottom = bottom_arr.join(',')
                    }
                }
                //时间
                else if ( val_.name.indexOf('infoimage.time.color') > -1) {
                    if ( self.remote_data.time && self.remote_data.time.style) {
                        self.remote_data.time.style.textColor = val_.data
                    }
                }else if ( val_.name.indexOf('infoimage.time.font') > -1) {
                    if ( self.remote_data.time && self.remote_data.time.style) {
                        self.remote_data.time.style.textSize = val_.data
                    }
                }else if ( val_.name.indexOf('infoimage.time.familyName') > -1) {
                    if ( self.remote_data.time && self.remote_data.time.style) {
                        self.remote_data.time.style.familyName = val_.data
                    }
                }else if ( val_.name.indexOf('infoimage.time.androidfamilyName') > -1) {
                    if ( self.remote_data.time && self.remote_data.time.style) {
                        self.remote_data.time.style.androidFamilyName = val_.data
                    }
                }else if ( val_.name.indexOf('infoimage.time.left') > -1) {
                    if ( self.remote_data.time && self.remote_data.time.layout) {
                        let left = self.remote_data.time.layout.left 
                        let left_arr = left.split(',');!left_arr[0] ? left_arr[0] = ' ' : null
                        left_arr[1] = val_.data
                        self.remote_data.time.layout.left = left_arr.join(',')
                    }
                }else if ( val_.name.indexOf('infoimage.time.top') > -1) {
                    if ( self.remote_data.time && self.remote_data.time.layout) {
                        let top = self.remote_data.time.layout.top 
                        let top_arr = top.split(',');!top_arr[0] ? top_arr[0] = ' ' : null
                        top_arr[1] = val_.data
                        self.remote_data.time.layout.top = top_arr.join(',')
                    }
                }else if ( val_.name.indexOf('infoimage.time.bottom') > -1) {
                    if ( self.remote_data.time && self.remote_data.time.style) {
                        let bottom = self.remote_data.time.layout.bottom 
                        let bottom_arr = bottom.split(',');!bottom_arr[0] ? bottom_arr[0] = ' ' : null
                        bottom_arr[1] = val_.data
                        self.remote_data.time.layout.bottom = bottom_arr.join(',')
                    }
                }
                //阅读量
                else if ( val_.name.indexOf('infoimage.read.color') > -1) {
                    if ( self.remote_data.read && self.remote_data.read.style) {
                        self.remote_data.read.style.textColor = val_.data
                    }
                }else if ( val_.name.indexOf('infoimage.read.font') > -1) {
                    if ( self.remote_data.read && self.remote_data.read.style) {
                        self.remote_data.read.style.textSize = val_.data
                    }
                }else if ( val_.name.indexOf('infoimage.read.familyName') > -1) {
                    if ( self.remote_data.read && self.remote_data.read.style) {
                        self.remote_data.read.style.familyName = val_.data
                    }
                }else if ( val_.name.indexOf('infoimage.read.androidfamilyName') > -1) {
                    if ( self.remote_data.read && self.remote_data.read.style) {
                        self.remote_data.read.style.androidFamilyName = val_.data
                    }
                }else if ( val_.name.indexOf('infoimage.read.right') > -1) {
                    if ( self.remote_data.read && self.remote_data.read.style) {
                        let right = self.remote_data.read.layout.right
                        let right_arr = right.split(',');!right_arr[0] ? right_arr[0] = ' ' : null
                        right_arr[1] = val_.data
                        self.remote_data.read.layout.right = right_arr.join(',')
                    }
                }else if ( val_.name.indexOf('infoimage.read.top') > -1) {
                    if ( self.remote_data.read && self.remote_data.read.style) {
                        let top = self.remote_data.read.layout.top
                        let top_arr = top.split(','); !top_arr[0] ? top_arr[0] = ' ' : null
                        top_arr[1] = val_.data
                        self.remote_data.read.layout.top = top_arr.join(',')
                    }
                }else if ( val_.name.indexOf('infoimage.read.bottom') > -1) {
                    if ( self.remote_data.read && self.remote_data.read.style) {
                        let bottom = self.remote_data.read.layout.bottom
                        let bottom_arr = bottom.split(','); !bottom_arr[0] ? bottom_arr[0] = ' ' : null
                        bottom_arr[1] = val_.data
                        self.remote_data.read.layout.bottom = bottom_arr.join(',')
                    }
                }
                //顶部推荐
                else if ( val_.name.indexOf('infoimage.source.color') > -1) {
                    if ( self.remote_data.source && self.remote_data.source.style) {
                        self.remote_data.source.style.textColor = val_.data
                    }
                }else if ( val_.name.indexOf('infoimage.source.font') > -1) {
                    if ( self.remote_data.source && self.remote_data.source.style) {
                        self.remote_data.source.style.textSize = val_.data
                    }
                }else if ( val_.name.indexOf('infoimage.source.familyName') > -1) {
                    if ( self.remote_data.source && self.remote_data.source.style) {
                        self.remote_data.source.style.familyName = val_.data
                    }
                }else if ( val_.name.indexOf('infoimage.source.androidfamilyName') > -1) {
                    if ( self.remote_data.source && self.remote_data.source.style) {
                        self.remote_data.source.style.androidFamilyName = val_.data
                    }
                }else if ( val_.name.indexOf('infoimage.source.left') > -1) {
                    if ( self.remote_data.source && self.remote_data.source.style) {
                        let left = self.remote_data.source.layout.left
                        let left_arr = left.split(',');!left_arr[0] ? left_arr[0] = ' ' : null
                        left_arr[1] = val_.data
                        self.remote_data.source.layout.left = left_arr.join(',')
                    }
                }else if ( val_.name.indexOf('infoimage.source.top') > -1) {
                    if ( self.remote_data.source && self.remote_data.source.style) {
                        let top = self.remote_data.source.layout.top
                        let top_arr = top.split(','); !top_arr[0] ? top_arr[0] = ' ' : null
                        top_arr[1] = val_.data
                        self.remote_data.source.layout.top = top_arr.join(',')
                    }
                }else if ( val_.name.indexOf('infoimage.source.bottom') > -1) {
                    if ( self.remote_data.source && self.remote_data.source.style) {
                        let bottom = self.remote_data.source.layout.bottom
                        let bottom_arr = bottom.split(','); !bottom_arr[0] ? bottom_arr[0] = ' ' : null
                        bottom_arr[1] = val_.data
                        self.remote_data.source.layout.bottom = bottom_arr.join(',')
                    }
                }
                //顶部在看人数
                else if ( val_.name.indexOf('infoimage.readPerson.color') > -1) {
                    if ( self.remote_data.read && self.remote_data.read.style) {
                        self.remote_data.read.style.textColor = val_.data
                    }
                }else if ( val_.name.indexOf('infoimage.readPerson.font') > -1) {
                    if ( self.remote_data.read && self.remote_data.read.style) {
                        self.remote_data.read.style.textSize = val_.data
                    }
                }else if ( val_.name.indexOf('infoimage.readPerson.familyName') > -1) {
                    if ( self.remote_data.read && self.remote_data.read.style) {
                        self.remote_data.read.style.familyName = val_.data
                    }
                }else if ( val_.name.indexOf('infoimage.readPerson.androidfamilyName') > -1) {
                    if ( self.remote_data.read && self.remote_data.read.style) {
                        self.remote_data.read.style.androidFamilyName = val_.data
                    }
                }else if ( val_.name.indexOf('infoimage.readPerson.right') > -1) {
                    if ( self.remote_data.read && self.remote_data.read.style) {
                        let right = self.remote_data.read.layout.right
                        let right_arr = right.split(',');!right_arr[0] ? right_arr[0] = ' ' : null
                        right_arr[1] = val_.data
                        self.remote_data.read.layout.right = right_arr.join(',')
                    }
                }else if ( val_.name.indexOf('infoimage.readPerson.top') > -1) {
                    if ( self.remote_data.read && self.remote_data.read.style) {
                        let top = self.remote_data.read.layout.top
                        let top_arr = top.split(','); !top_arr[0] ? top_arr[0] = ' ' : null
                        top_arr[1] = val_.data
                        self.remote_data.read.layout.top = top_arr.join(',')
                    }
                }else if ( val_.name.indexOf('infoimage.readPerson.bottom') > -1) {
                    if ( self.remote_data.read && self.remote_data.read.style) {
                        let bottom = self.remote_data.read.layout.bottom
                        let bottom_arr = bottom.split(','); !bottom_arr[0] ? bottom_arr[0] = ' ' : null
                        bottom_arr[1] = val_.data
                        self.remote_data.read.layout.bottom = bottom_arr.join(',')
                    }
                }

                self.setLayout( self.remote_data)
                let new_object = JSON.parse( JSON.stringify( self.remote_data))
                self.convertToClent( new_object)

                let pt__ = val_.difference.split('_')[1]
                $.edit_json_remote_post('newsList','informationFlow',pt__,[new_object])
                
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
                    let $bli = $('.info-image'+self.getRandomClassName()+'.copy' )
                    setTimeout(function() {
                        if ( $bli.data('contentData')&& $bli.data('refresData') ) {
                            $bli.data('refresData',false) 
                            let c_ = JSON.parse( $bli.data('contentData')),
                            j_ = ''
                            if ( self.type_element == 'bigImage_1401') {
                                j_ = c_['1401'][0]
                            }else if ( self.type_element == 'bigImage_1403') {
                                j_ = c_['1403'][0]
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
                $bli = $('.info-image'+self.getRandomClassName()+'.copy' ),
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
                    $ifi = $bli.eq(i),
                    $row = $ifi.find('.row').eq(0),
                    $cell = $row.find('.cell-one').eq(0),
                    calc = $row.find('.cell-one').length
                    $row.empty()
                    $ifi.empty()

                    for (var m = 0; m < parseFloat( baseData.items.length/calc); m++) {
                        let $row_copy = $row.clone()
                        baseData.items.forEach( (item,n)=>{
                            if ( m*calc<=n && n<=m*calc+calc-1) {
                                let $cell_copy= $cell.clone(),
                                $img = $cell_copy.find('.image').eq(0),
                                $title = $cell_copy.find('.title').eq(0).find('.content'),
                                $read = $cell_copy.find('.read-text').eq(0),
                                $readbtn = $cell_copy.find('.read-btn').eq(0),
                                $time = $cell_copy.find('.time').eq(0),
                                $tag = $cell_copy.find('.tag').eq(0),
                                $durationPackage = $cell_copy.find('.duration-package').eq(0),
                                $duration = $durationPackage.find('.duration-text').eq(0),
                                $toptag = $cell_copy.find('.source-text').eq(0),
                                $topread = $cell_copy.find('.read-person').eq(0)

                                $img.css('backgroundImage','url('+(item.cover && item.cover[0]['path'] || '')+')')
                                $title.text( item.title)
                                $read.text( item.viewBaseNum)
                                $time.text( self.getTimeFormatter(item.createdAt*1000))
                                $tag.text( item.tags)
                                $toptag.text( item.tags)
                                $topread.text( item.viewBaseNum)
                                if ( item.duration == 0) {
                                    $durationPackage.css('display','none')
                                }else{
                                    $durationPackage.css('display','inline-block')
                                    $duration.text( get_duration(item.duration))
                                }

                                $cell_copy.data('concrete_data',item)
                                $row_copy.append( $cell_copy)
                            }
                        })
                        $ifi.append( $row_copy)
                    }
                    $ifi.find('.cell-one').off('click').on('click',function(){
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
                return M+'-'+D
                // return date.getFullYear()+'-'+M+'-'+D
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
                            [
                                'http://img01.cztv.com/201610/21/6bad51c9a0e6ce35926bf4629feec5a4.jpg',
                                'http://img01.cztv.com/201608/16/e52820cf6fadcf552225280ea3b4a300.jpg',
                            ],
                            [
                                'http://img01.cztv.com/201410/09/17ceadd531b34a1998f4774357796f73.jpg',
                                'http://img01.cztv.com/201604/20/07eaf647f4f72c6df325f83914fc4581.jpg',
                            ]    
                        ],
                        "imgUrlArr2":[
                            [
                                'http://img01.cztv.com/201708/11/cab3ce5da0d3a0ddbd7f8e9f9fc029ee.jpg',
                                'http://img01.cztv.com/201709/14/a90daff3a379b73bad97b42479d7d7c8.jpg',
                            ],
                            [
                                'http://img01.cztv.com/201708/11/c36ea53ec2edf74598b0cfb966d066e2.jpg',
                                 'http://img01.cztv.com/201710/12/4de0ed68052b2d71a570808776e3af53.jpg',
                            ],
                        ],
                        "imgFill":'cover',
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
                        "textContent":'',
                        "textContentArr":[
                            [
                                '四川黑水 天然彩色画卷',
                                '美到窒息！海底火山绚丽图'
                            ],
                            [
                                '风光摄影：美轮美奂星空',
                                '色彩美艳 慢门风光大片'
                            ],
                        ],
                        "textContentArr2":[
                            [
                                '北欧风格的极简背景下，更烘托出陈妍希闪亮魅力',
                                '超模亚历山大·安布罗休登芭莎'
                            ],
                            [
                                '98后人气小花旦宋祖儿一组夏日大片曝光',
                                '人气女演员张天爱一组初秋写真曝光'
                            ],
                        ],
                        "textContent_style":'overflow: hidden;text-overflow: ellipsis;display: -webkit-box;-webkit-line-clamp: 2;-webkit-box-orient: vertical;',
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
                        "textContent":'推荐',
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
                        "textContent":'来源 08:39:20',
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
                    "sourceImg":{
                        "imgUrl":'http://shixiantest.oss-cn-hangzhou.aliyuncs.com/48/posts/2020/11/14/9261eef20ac140b977fb4eca28dc90bb.png',
                        "imgFill":'cover',
                        "common":{
                            "border": {
                                "borderColor": "#fff", 
                                "borderWidth": 0, 
                                "borderRadius": 0 
                            },
                            "size":{
                                "width":20,
                                "height":20
                            },
                        }
                    },
                    "source":{
                        "textContent":'推荐',
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
                                "width":14,
                                "height":14
                            },
                        }
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
                        },
                    },
                    "readPerson":{
                        "textContent":'7789再看',
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
                                "width":20,
                                "height":20
                            },
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
    .info-image{
        // width: 100%;
        position: relative;
        overflow: hidden;
        background-color: @contentbg;
        //每个单元
        .cell-one{
            display: inline-block;
            vertical-align: top;
            max-width: calc( 50% - 5px );
            overflow: hidden;
            &:nth-of-type(2n){
                margin-left: 10px;
            }
            .image{
                max-width: 100%;
            }
        }
        .img-father{
            white-space: nowrap;
            position: relative;
            .image{
                display: inline-block;
            }
            .duration-package{
                position: absolute;
                left: 0;
                bottom: 0;
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
            .recommend-content{
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                .source-package{
                    float: left;
                    font-size: 0;
                    .source-img{
                        display: inline-block;
                        vertical-align: middle;
                        margin-right: 4px;
                    }
                    .source-text{
                        vertical-align: middle;
                    }
                }
                .read-person{
                    float: right;
                }
            }
        }
        .text-father{
            position: relative;
            width: 100%;
            white-space: nowrap;
            font-size: 0;
            .text-tag-time{
                position: relative;
                display: inline-block;
            }
            .read-btn{
                // float: right;
                display: inline-block;
                position: relative;
                .read-package{
                    display: inline-block;
                    vertical-align: middle;
                    margin-left: 10px;
                    .read-img{
                        display: inline-block;
                        vertical-align: middle;
                        margin-right: 4px;
                    }
                    .read-text{
                        display: inline-block;
                        vertical-align: middle;
                    }
                }



            }
        }
    }

</style>
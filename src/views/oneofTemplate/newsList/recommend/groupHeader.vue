<template>
    <div :class='"grouph-header "+randomMark' @click.stop='edit_json_style("1")'>
        <div class="text-father">
            <div class="title-father">
                <LabelLayout class='title' :layout_data='local_data.title' ></LabelLayout>
            </div>
            <div class="more-btn" >
                <LabelLayout class='more' :layout_data='local_data.more'></LabelLayout>
                <div class="img">
                    <img src="../../../../../static/img/nextone.png">
                </div>
            </div>
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
                type_element : '',

                local_data:{},//本地数据
                remote_data:{}, //要更改的远程json数据
                
                randomMark:(new Date()).getTime()+Math.ceil( Math.random()*1000),
            }
        },
        watch:{
            ghData:function (newVal,oldVal ) {
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

            let gh_data_ =  self._props.ghData['groupHeader'] || {}
            
            self.convertToWeb( gh_data_)
            self.setLayout( gh_data_)
            self.getDataRedraw()

            self.$emit('edit_json_grouph',function( val_){
                self.edit_json_reponse( val_)
            },'','') 
        },
        beforeDestroy(){
            let self = this
        },
        props: ['ghData','typeids'],
        components:{
            LabelLayout,
            ImageLayout,
            ViewLayout,
        },
        methods:{
            setLayout( ghdata_){
                let self = this
                if ( !ghdata_) {
                    return
                }

                let local_style_data = self.getlocalData()
                let gh_ = $('.grouph-header'+self.getRandomClassName() )
                //设置内外边距
                let padding_ = '';let padding_left = 0 ; let padding_right = 0 

                let remote_ = ghdata_[0] || ghdata_
                {   
                    if ( remote_.margin) {
                        let padding_arr_ = remote_.margin.split(',')
                        if ( padding_arr_.length > 4) {
                            padding_arr_.shift() 
                        }
                        padding_arr_.forEach( (item,i)=>{
                            padding_+=item+'px '
                            i == 1 ? padding_left = parseFloat(item) : null
                            i == 3 ? padding_right = parseFloat(item) : null
                        })
                        
                    }
                }
                //设置高度
                let cell_height = 30
                {   
                    cell_height = remote_.height
                }
                //设置标题
                let title_left = 0,title_top = 0 ,title_right = 0
                {   
                    let remote_title = remote_.title
                    let title = local_style_data.title
                    title.color.textColor = remote_title.style.textColor
                    title.text.font = remote_title.style.textSize
                    title.text.familyName = remote_title.style.familyName

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
                }
                //设置“更多”
                {   
                    let remote_more = remote_.more
                    let more = local_style_data.more
                    more.color.textColor = remote_more.style.textColor
                    more.text.font = remote_more.style.textSize
                    more.text.familyName = remote_more.style.familyName

                    local_style_data.more = more
                }

                self.$nextTick( ()=>{
                    //设置内边距
                    gh_.css({
                        padding:padding_,
                        height:cell_height+'px',
                    })                    
                })

                //持有外部json数据
                self.remote_data = ghdata_
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
                let mit_ = $('.grouph-header'+self.getRandomClassName() )
                let which_one = self.type_element
                self.$nextTick( ()=>{
                    if ( id_ == '1') {
                        //修改整体边距
                        mit_.addClass('border-style-0').addClass('boder-color-animation') 

                        let gh_remote = self.remote_data[0]
                        //修改整体边距 
                        let padding_arr_ = gh_remote.margin.split(','),
                        mpid = ''
                        if ( padding_arr_.length > 4) {
                            mpid = padding_arr_.shift() //删除第一个标识符
                        }
                        let padding_entirety = padding_arr_.join(',')
                        //高度
                        let cell_height = gh_remote.height
                        
                        //修改标题
                        let titlecolor = '', titlefont = '' ,titlefamilyName = '', titleandroid_familyName = '',titleleft = '', titlebottom = '' ,titletop ='' ,titleright = ''
                        if ( gh_remote.title) {
                            let title_count = gh_remote.title
                            titlecolor = title_count.style.textColor || ''
                            titlefont = title_count.style.textSize || ''
                            titlefamilyName = title_count.style.familyName || ''
                            titleandroid_familyName = title_count.style.androidFamilyName || ''
                        }

                        //修改更多
                        let morecolor = '', morefont = '' ,morefamilyName = '', moreandroid_familyName = '',moreleft = '', morebottom = '' ,moretop ='' ,moreright = ''
                        if ( gh_remote.more) {
                            let more_count = gh_remote.more
                            morecolor = more_count.style.textColor || ''
                            morefont = more_count.style.textSize || ''
                            morefamilyName = more_count.style.familyName || ''
                            moreandroid_familyName = more_count.style.androidFamilyName || ''
                        }
                        
                        let new_object = { 
                            //整体边距
                            entirety:padding_entirety,
                            //分割线类型
                            mpid:mpid,
                            //整体高度
                            cell_height:cell_height,
                            //标题
                            titlecolor:titlecolor,
                            titlefont:titlefont,
                            titlefamilyName:titlefamilyName,
                            titleandroid_familyName:titleandroid_familyName,
                            //更多
                            morecolor:morecolor,
                            morefont:morefont,
                            morefamilyName:morefamilyName,
                            moreandroid_familyName:moreandroid_familyName,
                        } 
                        self.$emit('edit_json_grouph','',new_object,which_one )
                    }

                })  
                
            },
            //编辑json后，响应的数据
            edit_json_reponse( val_){
                let self = this
                //防止其他模块修改影响到本模块
                if ( val_.name.indexOf('grouph') < 0 ) 
                    return

                let gh_remote = self.remote_data[0]
                //整体内嵌
                if ( val_.name.indexOf('grouph.entirety') > -1 ) {
                    let padding_arr_ = gh_remote.margin.split(',')
                    gh_remote.margin = padding_arr_[0] +','+val_.data
                }
                //分割线类型
                else if ( val_.name.indexOf('grouph.underline') > -1 ) {
                    let padding_arr_ = gh_remote.margin.split(',')
                    padding_arr_[0] = val_.data.select
                    gh_remote.margin = padding_arr_.join(',')
                }
                //整体高度
                else if ( val_.name.indexOf('grouph.cellheight') > -1) {
                    gh_remote.height = val_.data
                }
                //标题
                else if ( val_.name.indexOf('grouph.title.color') > -1) {
                    if ( gh_remote.title && gh_remote.title.style) {
                        gh_remote.title.style.textColor = val_.data
                    }
                }else if ( val_.name.indexOf('grouph.title.font') > -1) {
                    if ( gh_remote.title && gh_remote.title.style) {
                        gh_remote.title.style.textSize = val_.data
                    }
                }else if ( val_.name.indexOf('grouph.title.familyName') > -1) {
                    if ( gh_remote.title && gh_remote.title.style) {
                        gh_remote.title.style.familyName = val_.data
                    }
                }else if ( val_.name.indexOf('grouph.title.androidfamilyName') > -1) {
                    if ( gh_remote.title && gh_remote.title.style) {
                        gh_remote.title.style.androidFamilyName = val_.data
                    }
                }
                //更多
                else if ( val_.name.indexOf('grouph.more.color') > -1) {
                    if ( gh_remote.more && gh_remote.more.style) {
                        gh_remote.more.style.textColor = val_.data
                    }
                }else if ( val_.name.indexOf('grouph.more.font') > -1) {
                    if ( gh_remote.more && gh_remote.more.style) {
                        gh_remote.more.style.textSize = val_.data
                    }
                }else if ( val_.name.indexOf('grouph.more.familyName') > -1) {
                    if ( gh_remote.more && gh_remote.more.style) {
                        gh_remote.more.style.familyName = val_.data
                    }
                }else if ( val_.name.indexOf('grouph.more.androidfamilyName') > -1) {
                    if ( gh_remote.more && gh_remote.more.style) {
                        gh_remote.more.style.androidFamilyName = val_.data
                    }
                }
               
                self.setLayout( self.remote_data)
                let new_object = JSON.parse( JSON.stringify( self.remote_data))
                self.convertToClent( new_object)

                let pt__ = val_.difference.split('_')[1]
                $.edit_json_remote_post('newsList','',pt__,new_object)
                
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
                    let $bli = $('.grouph-header'+self.getRandomClassName()+'.copy' )
                    setTimeout(function() {
                        if ( $bli.data('contentData')&& $bli.data('refresData')  ) {
                            $bli.data('refresData',false)
                            let j_ = JSON.parse( $bli.data('contentData'))
                            j_ = j_['groupHeader']
                            // self.convertToWeb( j_)
                            // self.setLayout( j_)
                            self.dom_operator_content()
                        }
                        self.getDataRedraw()
                    }, 200);
                }
            },

            //直接操作dom
            dom_operator_content(){
                let self = this,
                $bli = $('.grouph-header'+self.getRandomClassName()+'.copy' )

                $.each($bli,(i)=>{
                    let baseData = JSON.parse( $bli.eq(i).data('baseData')),
                    $ghimg = $bli.eq(i),
                    $title = $bli.eq(i).find('.title').eq(0),
                    $moreBtn = $bli.eq(i).find('.more-btn').eq(0)

                    $title.text( baseData.name)
                    $moreBtn.css('display','none')
                    
                    // $bli.eq(i).off('click').on('click',function(){
                    //     $.click_news_into_particular( $(this).data('concrete_data'))
                    // })
                })
                $bli.css('display','block')
            },

            getRandomClassName(){
                let self = this
                return '.'+self.randomMark
            },

            getlocalData(){
                return {
                    "title":{
                        "textContent":'推荐内容',
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
                    "more":{
                        "textContent":'更多',
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
    .grouph-header{
        width: 100%;
        height: 30px;
        position: relative;
        white-space: pre-wrap;
        overflow: hidden;
        background-color: @contentbg;
        .text-father{
            position: relative;
            top: 50%;
            transform: translateY(-50%);
            padding: 5px 0;
            .title-father{
                display: inline-block;
                vertical-align: middle;
            }
            .more-btn{
                display: inline-block;
                position: absolute;
                right: 0;
                font-size: 0;
                top: 50%;
                transform: translateY(-50%);
                .more{
                    vertical-align: middle;
                }
                .img{
                    display: inline-block;
                    vertical-align: middle;
                    width: 18px;
                    vertical-align: middle;
                    img{
                        width: 100%;
                        height: 100%;
                    }
                }
            }
        }

    }

</style>
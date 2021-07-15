<template>
    <div :style='style__' :class='"news-list "+randomMark' >
        <!-- 下拉刷新  -->
        <div class="loading-warp" v-if='extra_module.toploading'>
            <img class="load-img" src="http://shixiantest.oss-cn-hangzhou.aliyuncs.com/48/posts/2020/12/02/a9a5c0d99af99a2263bd6b3d5f130822.gif" />
            <span class="load-text"></span>
        </div>
        <!-- 轮播 -->
        <BannerCarouse @edit_json_bc='bc_edit' :bcData='nlr' v-if='show_module.bigImage_1101' typeids='bigImage_1101' class='1101'></BannerCarouse>
        <CardCarousel @edit_json_cardc='cardc_edit' :cardcData='nlr' v-if='show_module.bigImage_1102' typeids='bigImage_1102' class='1102'></CardCarousel>
        <CardCarousel @edit_json_cardc='cardc_edit' :cardcData='nlr' v-if='show_module.bigImage_1103' typeids='bigImage_1103' class='1103'></CardCarousel>
        <CardCarousel @edit_json_cardc='cardc_edit' :cardcData='nlr' v-if='show_module.bigImage_1104' typeids='bigImage_1104' class='1104'></CardCarousel>
        <CardCarousel @edit_json_cardc='cardc_edit' :cardcData='nlr' v-if='show_module.bigImage_1105' typeids='bigImage_1105' class='1105'></CardCarousel>

        <!-- 图标-->
        <TSpeedButton @edit_json_tsb='tsb_edit' :tsbData='nlr' v-if='show_module.bigImage_1301' typeids='bigImage_1301' class='1301'></TSpeedButton>
        <TSpeedmlmc @edit_json_tsb='tsb_edit' :tsbData='nlr' v-if='show_module.bigImage_1302' typeids='bigImage_1302' class='1302'></TSpeedmlmc>
        <TSpeedmlmc @edit_json_tsb='tsb_edit' :tsbData='nlr' v-if='show_module.bigImage_1303' typeids='bigImage_1303' class='1303'></TSpeedmlmc>
        <TSpeedmlmc @edit_json_tsb='tsb_edit' :tsbData='nlr' v-if='show_module.bigImage_1305' typeids='bigImage_1305' class='1305'></TSpeedmlmc>
        <TSpeedmlmc @edit_json_tsb='tsb_edit' :tsbData='nlr' v-if='show_module.bigImage_1306' typeids='bigImage_1306' class='1306'></TSpeedmlmc>
        <TSpeedsltc @edit_json_tsb='tsb_edit' :tsbData='nlr' v-if='show_module.bigImage_1304' typeids='bigImage_1304' class='1304'></TSpeedsltc>
        <TSpeedsltc @edit_json_tsb='tsb_edit' :tsbData='nlr' v-if='show_module.bigImage_1307' typeids='bigImage_1307' class='1307'></TSpeedsltc>
        <TSpeedmlmc @edit_json_tsb='tsb_edit' :tsbData='nlr' v-if='show_module.bigImage_1308' typeids='bigImage_1308' class='1308'></TSpeedmlmc>

        <!-- 快讯 -->
        <Bulletin @edit_json_blet='blet_edit' :bletData='nlr' 
        v-if='show_module.bigImage_1001' typeids='bigImage_1001' class='1001'></Bulletin>

        <Bulletin @edit_json_blet='blet_edit' :bletData='nlr' 
        v-if='show_module.bigImage_1002' typeids='bigImage_1002' class='1002'></Bulletin>

        <!-- 图和标题左右对其 -->
        <LeftRightImage @edit_json_lri='lri_edit' :lrsingleData='nlr_1402' 
        v-if='show_module.bigImage_220' typeids='bigImage_220' class='220'></LeftRightImage>
        <LeftRightImage @edit_json_lri='lri_edit' :lrsingleData='nlr_1402' 
        v-if='show_module.bigImage_221' typeids='bigImage_221' class='221'></LeftRightImage>
        <LeftRightImage @edit_json_lri='lri_edit' :lrsingleData='nlr_1402' 
        v-if='show_module.bigImage_240' typeids='bigImage_240' class='240'></LeftRightImage>

        <!-- 多图 -->
        <MutiImageALine @edit_json_mial='mial_edit' :mialData='nlr_1402' 
        v-if='show_module.bigImage_230' typeids='bigImage_230' class='230'></MutiImageALine>
        <MutiImageALine @edit_json_mial='mial_edit' :mialData='nlr_1402' 
        v-if='show_module.bigImage_231' typeids='bigImage_231' class='231'></MutiImageALine>

        <!-- 大图、单图(图和标题上下对其)-->
        <BigPicture @edit_json_bpic='bpic_edit' :bpicData='nlr_1402' v-if='show_module.bigImage_200' typeids='bigImage_200' class='200'></BigPicture>
        <BigPicture @edit_json_bpic='bpic_edit' :bpicData='nlr_1402' v-if='show_module.bigImage_201' typeids='bigImage_201' class='201'></BigPicture>
        <BigPicture @edit_json_bpic='bpic_edit' :bpicData='nlr_1402' v-if='show_module.bigImage_202' typeids='bigImage_202' class='202'></BigPicture>
        <BigPicture @edit_json_bpic='bpic_edit' :bpicData='nlr_1402' v-if='show_module.bigImage_203' typeids='bigImage_203' class='203'></BigPicture>
        <BigPicture @edit_json_bpic='bpic_edit' :bpicData='nlr_1402' v-if='show_module.bigImage_204' typeids='bigImage_204' class='204'></BigPicture>
        <BigPicture @edit_json_bpic='bpic_edit' :bpicData='nlr_1402' v-if='show_module.bigImage_205' typeids='bigImage_205' class='205'></BigPicture>
        <BigPicture @edit_json_bpic='bpic_edit' :bpicData='nlr_1402' v-if='show_module.bigImage_206' typeids='bigImage_206' class='206'></BigPicture>
        <BigPicture @edit_json_bpic='bpic_edit' :bpicData='nlr_1402' v-if='show_module.bigImage_210' typeids='bigImage_210' class='210'></BigPicture>
        <BigPicture @edit_json_bpic='bpic_edit' :bpicData='nlr_1402' v-if='show_module.bigImage_211' typeids='bigImage_211' class='211'></BigPicture>
        <BigPicture @edit_json_bpic='bpic_edit' :bpicData='nlr_1402' v-if='show_module.bigImage_212' typeids='bigImage_212' class='212'></BigPicture>

        <!-- 滚动图片 -->
        <HoriScroll @edit_json_hsc='hsc_edit' :hscData='nlr' v-if='show_module.bigImage_1201' typeids='bigImage_1201' class='1201'></HoriScroll>
        <HoriScroll @edit_json_hsc='hsc_edit' :hscData='nlr' v-if='show_module.bigImage_1202' typeids='bigImage_1202' class='1202'></HoriScroll>
        <HoriScrollReport @edit_json_hscreport='hsc_edit' :hscreportData='nlr' v-if='show_module.bigImage_1203' typeids='bigImage_1203' class='1203'></HoriScrollReport>
        <HoriScroll @edit_json_hsc='hsc_edit' :hscData='nlr' v-if='show_module.bigImage_1204' typeids='bigImage_1204' class='1204'></HoriScroll>
        <!-- ==== -->

        <!-- 信息流 -->
        <IFsBsImage @edit_json_infoimage='infoimage_edit' :infoimageData='nlr' v-if='show_module.bigImage_1401' typeids='bigImage_1401' class='1401'></IFsBsImage>

        <IFsBsImage @edit_json_infoimage='infoimage_edit' :infoimageData='nlr' v-if='show_module.bigImage_1403' typeids='bigImage_1403' class='1403'></IFsBsImage>

        <!-- 直播 -->
        <liveSmalImg @edit_json_lc='livec_edit' :lcData='nlr' v-if='show_module.bigImage_1501' typeids='bigImage_1501' class='1501'></liveSmalImg>

         <!-- 组头 -->
        <GroupHeader @edit_json_grouph='grouph_edit' :ghData='nlr' v-if='show_module.bigImage_groupHeader' typeids='bigImage_groupHeader' class='groupHeader'></GroupHeader>

        <!-- 看电视、听广播-->
        <Watchtv v-if='extra_module.watchtv.show' :mediaData='extra_module.watchtv.data' class='watch-tv'></Watchtv>

        <!-- 外链 -->
        <OutUrlIframe v-if='extra_module.outUrlFrame.show' :fData='extra_module.outUrlFrame.data' class='outurl-iframe'></OutUrlIframe>

        <!-- 便民服务 -->
        <Hserviefp v-if='extra_module.hserviefp.show' :hfpData='extra_module.hserviefp.data' class='hservie-fp'></Hserviefp>
        <!-- h5页面:底部刷新 -->
        <div class="bottom-loading" v-if='extra_module.bottomloading.show' @click.stop='btmClick'>
            <span size='mini' v-loading='extra_module.bottomloading.loading'>点击加载更多</span>
        </div>

    </div>
</template>

<script type="text/javascript">
    import LeftRightImage from './leftRightCompositeImage';
    import MutiImageALine from './mutiImageALine';
    import BigPicture from './bigPicture';
    import BannerCarouse from './bannerCarouse';
    import Bulletin from './bulletin';
    import TSpeedButton from './TSpeedButton';
    import HoriScroll from './horiScroll';
    import HoriScrollReport from './horiScrollReport';
    import CardCarousel from './cardCarousel';
    import LiveSmalImg from './liveSmalImg';
    import TSpeedmlmc from './TSpeedmlmc';
    import TSpeedsltc from './TSpeedsltc';
    import IFsBsImage from './infFlowsideBysideImage';
    import GroupHeader from './groupHeader';
    import Hserviefp from './mobile_newslist/u_hserviefp';
    import Watchtv from './mobile_newslist/u_watchtv';
    import OutUrlIframe from './mobile_newslist/u_iframeOuturl';

	export default {
		data () {
			return {  
                nlr:'',
                nlr_1402:'',
                show_module:{
                    bigImage_200:false,
                    bigImage_201:false,
                    bigImage_202:false,
                    bigImage_203:false,
                    bigImage_204:false,
                    bigImage_205:false,
                    bigImage_206:false,
                    bigImage_210:false,
                    bigImage_211:false,
                    bigImage_212:false,
                    bigImage_220:false,
                    bigImage_221:false,
                    bigImage_230:false,
                    bigImage_231:false,
                    bigImage_240:false,

                    bigImage_1101:false,
                    bigImage_1102:false,
                    bigImage_1103:false,
                    bigImage_1104:false,
                    bigImage_1105:false,

                    bigImage_1001:false,
                    bigImage_1002:false,

                    bigImage_1301:false,
                    bigImage_1302:false,
                    bigImage_1303:false,
                    bigImage_1304:false,
                    bigImage_1305:false,
                    bigImage_1306:false,
                    bigImage_1307:false,
                    bigImage_1308:false,

                    bigImage_1202:false,
                    bigImage_1201:false,
                    bigImage_1204:false,
                    bigImage_1203:false,

                    bigImage_1501:false,

                    bigImage_1401:false,
                    bigImage_1403:false,

                    bigImage_groupHeader:false,
                },
                extra_module:{
                    toploading:false,
                    bottomloading:{
                        show:false,
                        loading:false,
                    },
                    hserviefp:{
                        show:false,
                        data:''
                    },
                    watchtv:{
                        show:false,
                        data:''
                    },
                    outUrlFrame:{
                        show:false,
                        data:''
                    }
                    
                },
                style__:'',
                randomMark:(new Date()).getTime()+Math.floor(Math.random()*1000),
			}
		},
        watch:{},
        created(){
            let self = this
            if ( $.allowMachine == 1) {
                self.extra_module.toploading = true
                self.extra_module.bottomloading.show = true
            }
        },
        mounted(){
            let self = this
            
            self.$emit('newsListRecommend',function( val_,type__){
                self.sumup_method( val_,type__)
            }) 
        },
        props: [],
        components:{
           LeftRightImage,
           MutiImageALine,
           BigPicture,
           BannerCarouse,
           Bulletin,
           TSpeedButton,
           HoriScroll,
           TSpeedmlmc,
           CardCarousel,
           HoriScrollReport,
           TSpeedsltc,
           LiveSmalImg,
           IFsBsImage,
           Hserviefp,
           Watchtv,
           GroupHeader,
           OutUrlIframe,
        },
		methods:{
            sumup_method( val_,type__){
                let self = this
                self.setLayout( val_)
                self.downPullrefresh( type__)
                // type__? null: self.getContentData()
                self.getContentData()
            },
            setLayout( nlr){
                let self = this
                if ( nlr) {
                    self.nlr = nlr

                    if ( nlr['1402']) {
                        let nlr_1402 = nlr['1402'][0] || nlr['1402']
                        self.nlr_1402 = nlr_1402
                        self.show_module.bigImage_200 = $.allowMachine == 1 ? true : !!nlr_1402['200']
                        self.show_module.bigImage_201 = $.allowMachine == 1 ? true : !!nlr_1402['201']
                        self.show_module.bigImage_202 = $.allowMachine == 1 ? true : !!nlr_1402['202']
                        self.show_module.bigImage_203 = $.allowMachine == 1 ? true : !!nlr_1402['203']
                        self.show_module.bigImage_204 = $.allowMachine == 1 ? true : !!nlr_1402['204']
                        self.show_module.bigImage_205 = $.allowMachine == 1 ? true : !!nlr_1402['205']
                        self.show_module.bigImage_206 = $.allowMachine == 1 ? true : !!nlr_1402['206']
                        self.show_module.bigImage_210 = $.allowMachine == 1 ? true : !!nlr_1402['210']
                        self.show_module.bigImage_211 = $.allowMachine == 1 ? true : !!nlr_1402['211']
                        self.show_module.bigImage_212 = $.allowMachine == 1 ? true : !!nlr_1402['212']
                        self.show_module.bigImage_220 = $.allowMachine == 1 ? true : !!nlr_1402['220']
                        self.show_module.bigImage_221 = $.allowMachine == 1 ? true : !!nlr_1402['221']
                        self.show_module.bigImage_230 = $.allowMachine == 1 ? true : !!nlr_1402['230']
                        self.show_module.bigImage_231 = $.allowMachine == 1 ? true : !!nlr_1402['231']
                        self.show_module.bigImage_240 = $.allowMachine == 1 ? true : !!nlr_1402['240']
                    }else
                        nlr['1402'] = []

                    self.show_module.bigImage_1101 = $.allowMachine == 1 ? true : !!nlr['1101']
                    self.show_module.bigImage_1102 = $.allowMachine == 1 ? true : !!nlr['1102']
                    self.show_module.bigImage_1103 = $.allowMachine == 1 ? true : !!nlr['1103']
                    self.show_module.bigImage_1104 = $.allowMachine == 1 ? true : !!nlr['1104']
                    self.show_module.bigImage_1105 = $.allowMachine == 1 ? true : !!nlr['1105']

                    self.show_module.bigImage_1001 = $.allowMachine == 1 ? true : !!nlr['1001']
                    self.show_module.bigImage_1002 = $.allowMachine == 1 ? true : !!nlr['1002']

                    self.show_module.bigImage_1301 = $.allowMachine == 1 ? true : !!nlr['1301']
                    self.show_module.bigImage_1302 = $.allowMachine == 1 ? true : !!nlr['1302']
                    self.show_module.bigImage_1303 = $.allowMachine == 1 ? true : !!nlr['1303']
                    self.show_module.bigImage_1304 = $.allowMachine == 1 ? true : !!nlr['1304']
                    self.show_module.bigImage_1305 = $.allowMachine == 1 ? true : !!nlr['1305']
                    self.show_module.bigImage_1306 = $.allowMachine == 1 ? true : !!nlr['1306']
                    self.show_module.bigImage_1307 = $.allowMachine == 1 ? true : !!nlr['1307']
                    self.show_module.bigImage_1308 = $.allowMachine == 1 ? true : !!nlr['1308']

                    self.show_module.bigImage_1201 = $.allowMachine == 1 ? true : !!nlr['1201']
                    self.show_module.bigImage_1202 = $.allowMachine == 1 ? true : !!nlr['1202']
                    self.show_module.bigImage_1203 = $.allowMachine == 1 ? true : !!nlr['1203']
                    self.show_module.bigImage_1204 = $.allowMachine == 1 ? true : !!nlr['1204']

                    self.show_module.bigImage_1501 = $.allowMachine == 1 ? true : !!nlr['1501'] 

                    self.show_module.bigImage_1401 = $.allowMachine == 1 ? true : !!nlr['1401']
                    self.show_module.bigImage_1403 = $.allowMachine == 1 ? true : !!nlr['1403']

                    self.show_module.bigImage_groupHeader = $.allowMachine == 1 ? true : !!nlr['groupHeader']
                }
            },

            //广告轮播
            bc_edit( func,data,difference){
                let self = this
                self.$emit('editJson','bc',difference,func,data)
            },

            //快讯
            blet_edit( func,data,difference){
                let self = this
                self.$emit('editJson','blet',difference,func,data)
            },

            //快捷按钮(看电视、听广播、读报纸等；图上文字下)
            tsb_edit( func,data,difference){
                let self = this
                self.$emit('editJson','tsb',difference,func,data)
            },

            //左右图修改json(左图、右图)
            lri_edit( func,data,difference){
                let self = this
                self.$emit('editJson','lri',difference,func,data)
            },

            //一行多图修改json(三图、三图带底部)
            mial_edit( func,data,difference){
                let self = this
                self.$emit('editJson','mial',difference,func,data)
            },

            //大图
            bpic_edit( func,data,difference){
                let self = this
                self.$emit('editJson','bpic',difference,func,data)
            },

            //热点新闻
            hts_edit( func,data,difference){
                let self = this
                self.$emit('editJson','hts',difference,func,data)
            },

            //水平滚动视频、图片
            hsc_edit( func,data,difference){
                let self = this
                self.$emit('editJson','hsc',difference,func,data)
            },

            //卡片轮播(旋转木马) / 卡片轮播标题在下边
            cardc_edit( func,data,difference){
                let self = this
                self.$emit('editJson','cardc',difference,func,data)
            },

            //专题微矩阵(就是水平滚动图片带标签)
            tmatrix_edit( func,data,difference){
                let self = this
                self.$emit('editJson','tmatrix',difference,func,data)
            },

            //直播
            livec_edit( func,data,difference){
                let self = this
                self.$emit('editJson','livec',difference,func,data)
            },

            //信息流并排显示图片带标签
            infoimage_edit( func,data,difference){
                let self = this
                self.$emit('editJson','infoimage',difference,func,data)
            },

            //每个组的头部
            grouph_edit( func,data,difference){
                let self = this
                self.$emit('editJson','grouph',difference,func,data)
            },

            //数据填充调整
            getContentData( ){
                let self = this
                if ( $.allowMachine != 1)
                    return

                let putTogether = (...args)=>{
                    let params = ''
                    args.forEach( (item)=>{
                        params+= item.name + '=' +item.value+'&'
                    })
                    return params
                }
                $.homelabelbarClick =( item,page_)=>{
                    self.tabItemClicked = item
                    self.refreshListpage = page_ || 1

                    //列表数据
                    let url = $.ajaxGlobalUrl+ '/api/fusion/wap/getChannelsInfo',
                    page = self.refreshListpage,
                    codeid = item.id,
                    timestamp = (new Date()).getTime()+'',
                    paramJson = {
                        'appId':$.clinet_appid,
                        'clientId':$.clinet_clientid,
                        'channelId':codeid+'',
                        'version':$.clinet_appversion,
                        'page':page,
                        'type': page == 1 ? 'menu' : ''
                    }

                    item.link && ( item.link.type == 'topic') || item.clickMore ? paramJson.type = '' : null

                    self.editContentData(null,true)

                    self.netWorking(url,'get',paramJson,(xhr)=>{
                        if ( xhr.responseJSON && xhr.responseJSON.code >=200 && xhr.responseJSON.code<400) {
                            let reponse_data = xhr.responseJSON.data
                            //便民服务
                            if ( reponse_data.type == 51) {
                                self.extra_module.hserviefp.data = reponse_data
                                self.extra_module.hserviefp.show = true
                            }else
                               self.extra_module.hserviefp.show = false 

                            //看电视、听广播
                            self.extra_module.watchtv.show = false 

                            //外链链接
                            if ( reponse_data.type == 23 || reponse_data.type == 34) {
                                self.extra_module.outUrlFrame.data = reponse_data
                                self.extra_module.outUrlFrame.show = true
                            }else
                               self.extra_module.outUrlFrame.show = false 


                            //空中课堂
                            if ( item.type == 'combinClassroom') {
                                reponse_data.block && reponse_data.block.length >0 && ( reponse_data.block[0]['type2020'] ? null : reponse_data.block[0]['type2020'] = 1402)
                            }

                            //看微信-更多
                            if ( item.id_wchat == 'more') {
                                reponse_data.block && reponse_data.block.length >0 && ( reponse_data.block[0]['type2020'] ? null : reponse_data.block[0]['type2020'] = 1402)
                            }

                            //菜单按钮
                            reponse_data.block && reponse_data.block.length >0 ? function(){
                                let rblock = reponse_data.block
                                rblock.forEach( (rbcell)=>{
                                    if ( rbcell.templateStyle == 1301 && rbcell.items.length > 0) {
                                        let rbcellItems = rbcell.items,
                                        rbcIndex = rbcellItems.findIndex( (scell)=>{
                                            return scell.link && scell.link.type == 'tip-off'
                                        }),
                                        rbc2Index = rbcellItems.findIndex( (scell)=>{
                                            return scell.link && scell.link.type == 'newspaper'
                                        })
                                        rbcIndex > -1 ? rbcellItems.splice( rbcIndex,1) : null
                                        rbc2Index > -1 ? rbcellItems.splice( rbc2Index,1) : null
                                    }
                                })
                            }() :''

                            self.refreshListdata = reponse_data
                            self.editContentData( reponse_data)
                            
                        }
                        self.extra_module.bottomloading.loading = false
                    })
                }
            },
            editContentData( cdata_,clear){
                let self = this, 
                nl_length = $('.news-list').length,
                $nl_ = $('.news-list').eq( nl_length-1),
                getEle = ( cb)=>{
                    let ele_arr = [],
                    new_block = JSON.parse( JSON.stringify( cdata_.block)),
                    count_1402 = 0
                    cdata_.block.forEach( (content,i)=>{
                        if ( content.templateStyle == '1402') {
                            content.items.reverse()
                            content.items.forEach( ( item,n)=>{
                                item.templateStyle = item.templateStyle
                                new_block.splice(i+count_1402+1,0,item)
                            })
                            count_1402 += content.items.length
                            
                        }
                    })
                    new_block.forEach( (content,ii)=>{
                        content.blocktype = cdata_.id
                        let typeone = content.templateStyle+'',
                        groupType = content.displayTitle,
                        $gatherele = $nl_.children().not('.copy'),
                        $groupHeader = $nl_.children('.groupHeader').not('.copy')

                        //每个组头
                        if ( groupType ) {
                            let $groupClone = $groupHeader.clone()
                            $groupClone.data('baseData',JSON.stringify( content) )
                            ele_arr.push( $groupClone)
                        }

                        $.each($gatherele,(i)=>{
                            let ele_one = $gatherele.eq(i).clone(),
                            className = ele_one.attr('class'),
                            split_arr = className.split(' ')
                            //每个cell单元
                            if ( split_arr[0] == typeone ) {
                                ele_one.data('baseData',JSON.stringify( content) )
                                ele_arr.push( ele_one)
                            }                        
                        })
                        if ( ii == new_block.length -1) 
                            cb && cb( ele_arr)
                    })
                    new_block.length == 0 ? cb && cb( ele_arr) : null
                }
                if ( self.refreshListpage == 1) {
                    $nl_.children().not('.hservie-fp').not('.watch-tv').css('display','none')
                    $nl_.children('.outurl-iframe').css('display','block')
                    $nl_.children('.copy').remove()
                }
                self.extra_module.bottomloading.show = true 
                if ( clear) 
                    return
                
                self.$nextTick( ()=>{
                    getEle( (elep)=>{
                        let toploading = $nl_.children('.loading-warp'),
                        bottomloading = $nl_.children('.bottom-loading'),
                        nlr_string = JSON.stringify( self.nlr),
                        nlr_1402_string = JSON.stringify( self.nlr['1402'][0] || self.nlr['1402']),
                        elep_first_baseData =  elep[0] ? elep[0].data('baseData') : ''
                        toploading.css('display','block')

                        elep.forEach( (ele)=>{
                            let classarr = ele.attr('class').split(' '),
                            classId = classarr[0]
                            if ( classId.length == 3) 
                                ele.data('contentData',nlr_1402_string)
                            else
                                ele.data('contentData',nlr_string)

                            // ele.css('display','block')
                            ele.addClass('copy')
                            $nl_.append( ele)

                            let oldclassName = ele.attr('class'),
                            split_arr = oldclassName.split(' ')
                            split_arr.shift()
                            let newclassName = split_arr.join('.')
                            $('.'+newclassName).data('refresData',true)
                        }) 

                        if ( elep.length > 0) {
                            bottomloading.css('display','block')
                            $nl_.append( bottomloading) 

                            //撑起底部刷新高度
                            if ( $nl_.children('.blctmp').length == 0) {
                                let $blc = bottomloading.clone()
                                $blc.children('span').text('已经是底部了')
                                $blc.css('border','0')
                                $blc.addClass('blctmp')
                                $nl_.append( $blc)
                            } 
                        }else{
                            self.extra_module.bottomloading.show = false
                        }
                        //空中课堂底部刷新省略
                        elep_first_baseData && JSON.parse( elep_first_baseData) && JSON.parse( elep_first_baseData).id == '18956' ? bottomloading.css('display','none') : null
                    })
                })   

            },

            //添加下拉刷新
            downPullrefresh( type__){
                let self = this,
                nl_length = $('.news-list').length,
                $nl_ = $('.news-list').eq( nl_length-1),
                $statu = $nl_.find('.loading-warp').find('.load-text')

                if ( $.allowMachine == 1) {
                    // if ( type__ != 'detail') {
                    //     let pullRefresh = $nl_.pPullRefresh({
                    //         $el: $nl_,
                    //         $loadingEl: $nl_.find('.loading-warp'),
                    //         autoHide: true,
                    //         refreshPx:30,
                    //         callbacks: {
                    //             pullStart: function(){
                    //                 $statu.text('下拉开始刷新')
                    //             },
                    //             pullEnough :function(){
                    //                 $statu.text('松开刷新数据')
                    //             },
                    //             start: function(){
                    //                 $statu.text('数据刷新中···')
                    //                 pullRefresh.reset()
                    //                 $.homelabelbarClick( self.tabItemClicked,1)
                    //             },
                    //         }
                    //     });
                    //     // pullRefresh.setDestroy(true);
                    // }
                    self.$nextTick( ()=>{
                        setTimeout(function() {
                            let use_height = $.newslist_Content_height = $(window).height() - $('.label').height() - $('.navigation').height() - 40 ,
                            use_width  = $(window).width()

                            $nl_.css({
                                minWidth:use_width+'px',
                                width:use_width+'px',
                            })
                            if ( type__ != 'detail') {
                                $nl_.css({
                                    // maxHeight:use_height+ 'px',
                                    // height:use_height + 'px',
                                })  
                            }      
                        }, 900)
                    })

                }
            },
            //底部刷新
            btmClick(){
                let self = this,
                dcblock = self.refreshListdata.block,
                lastIndex = dcblock.length-1

                self.extra_module.bottomloading.loading = true
                // self.tabItemClicked.nextid = dcblock[lastIndex]['id']
                $.homelabelbarClick( self.tabItemClicked,++self.refreshListpage)
            },
            getRandomClassName(){
                let self = this
                return '.'+self.randomMark
            },

            getStr(propName,propVal){
                return propName + ':' + propVal + ';'
            },

            netWorking( url ,method,dataParams,callback ){
                let self = this 
                $.ajax({
                    url:url,
                    type:method,
                    dataType:'json',
                    data:dataParams,
                    headers:{
                      'Content-Type':'application/json',
                    },
                    success:function (argument,message,xhr) {
                        callback(xhr)
                    },
                    error:function( xhr,error){ callback(xhr) }
                })
            },

            /**

            ********************************************************************************
            */
		}
	}
</script>

<style scoped lang="less">
    @import '../../publicStyle';
    @pagebaWidth:375px;
    .news-list{
        position: relative;
        width: @pagebaWidth;
        // max-height: calc(100%);
        background-color: #fff;  
        cursor: pointer;
        z-index: 2;
        // margin-top: 10px;
        overflow-y: auto;
        .loading-warp{
            margin-top: -22px;
            height: 22px;
            text-align: center;
            .load-img{
                vertical-align: middle;
                width: 20px;
            }
            .load-text{
                display: inline-block;
                vertical-align: middle;
                font-size: 0.5em;
            }
        }
        .bottom-loading{
            text-align: center;
            padding: 15px 0;
            border: 1px solid #eee;
            span{
                font-size: 13px;
            }
        }
    }
</style>
<style lang="less">
    .bottom-loading{
        .el-loading-spinner{
            margin-top: -11px !important;
            .circular{
                width: 22px !important; 
                height: 22px !important;
            }
        }  
    }
</style>
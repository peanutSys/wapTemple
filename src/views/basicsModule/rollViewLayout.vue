<template>
	<div class="body-backgroud">
        <div :class="'pic ' + randomMark " :style="style_">
            <div class="content-img-text">
                <div v-for="(fval,fkey) in urls" class="img-package" >
                    <img :src='fval'>
                    <div class="title-package">
                        <span class="title">{{contents[fkey]}}</span>
                    </div>
                </div>
            </div>
            <ul class="index">
                <li v-for="(fval,fkey) in urls" :class="(fkey == 0 ? 'first' : '')"></li> 
            </ul>
            <div class="indexNumber">
                <span>1/4</span>
            </div>
        </div>
	</div>
</template>

<script type="text/javascript">
    import ImageLayout from './imageLayout';
    import LabelLayout from './labelLayout';

	export default {
		data () {
			return {  
                style_:'',
                urls:[],
                contents:[],
                randomMark:(new Date()).getTime(),
			}
		},
        watch:{
            layout_data:function (newVal,oldVal ) {
               let self = this
               self.reLayout(newVal)
               self.roll_operation( newVal)
            }
        },
        props: ['layout_data'],
        created(){
            let self = this 
        },
        mounted(){
            let self = this

            self.reLayout(self._props.layout_data)
            self.roll_operation( self._props.layout_data)
        },
        beforeDestroy(){
            let self = this
            clearInterval(self.timer_roll)
        },
        components:{
            ImageLayout,
            LabelLayout
        },
		methods:{
            reLayout( newdata){
                let self = this
                let all_d = newdata ; let stystrr = ''; if ( !all_d) return;
                let rvl_ = $('.pic'+self.getRandomClassName() )

                if ( all_d.color) {
                    //颜色
                    stystrr += self.getStr('color',self.hexToRgb(all_d.color.textColor,all_d.color.textAlpha) );
                    // stystrr += self.getStr('background-color',self.hexToRgb(all_d.color.bgColor,all_d.color.bgAlpha) );
                    rvl_.find('.title-package').css('background-image','linear-gradient('+self.hexToRgb(all_d.color.bgColorTop,all_d.color.bgAlphaTop)+','+ self.hexToRgb(all_d.color.bgColorBottom,all_d.color.bgAlphaBottom) +')')
                        
                }

                if ( all_d.text) {
                    //文字排列方式
                    stystrr += self.getStr('text-align',all_d.text.textAlignment == 0 ? 'left' : all_d.text.textAlignment == 1 ? 'center' :'right'   );
                    stystrr += self.getStr('font-size',all_d.text.font+'px');
                    stystrr += self.getStr('font-family',all_d.text.familyName || '');

                    if ( all_d.text.content) {
                        self.contents = all_d.text.content
                    }
                }

                if ( all_d.common) {
                    //common
                    stystrr += self.getStr('opacity',all_d.common.isHidden ? 0:1);

                    if ( all_d.common.border) {
                        stystrr += self.getStr('border-color',self.hexToRgb(all_d.common.border.borderColor,1.0) );
                        stystrr += self.getStr('border-width',all_d.common.border.borderWidth+'px');
                        stystrr += self.getStr('border-radius',all_d.common.border.borderRadius+'px');
                        stystrr += self.getStr('border-style','solid');
                    }
                    
                    if ( all_d.common.shadow) {
                        stystrr += self.getStr('box-shadow',all_d.common.shadow.offsetWidth + 'px '+ all_d.common.shadow.offsetHeight + 'px ' + ' 1px ' + self.hexToRgb(all_d.common.shadow.shadowColor,all_d.common.shadow.opacity) );
                    }
                    if ( all_d.common.size) {
                        //宽高度
                        //不支持修改宽度
                        // all_d.common.size.width ? stystrr += self.getStr('width',all_d.common.size.width+'px') : null
                        all_d.common.size.height ? stystrr += self.getStr('height',all_d.common.size.height+'px'): null
                    }

                    if ( all_d.images) {
                        self.urls = all_d.images.urls
                        self.$nextTick( ()=>{
                            rvl_.find('.content-img-text').children('.img-package').css({'width':all_d.images.width+'px'}) 
                        })
                    }  
                }

                {
                    if (all_d.hasOwnProperty('whichControl') ) {
                        rvl_.find('.index').css({'display':'none'})
                        rvl_.find('.indexNumber').css({'display':'none'}) 

                        if (all_d.whichControl == 0){
                            rvl_.find('.index').css({'display':'block'}) 
                        }else if (all_d.whichControl == 1){
                            rvl_.find('.indexNumber').css({'display':'block'}) 
                        }
                        
                    }
                }
                self.style_ = stystrr;
            },
            roll_operation( newdata){
                let self = this

                let rvl_ = $('.pic'+self.getRandomClassName() )
                var index = 0; var indexNumber=0; let all_d = newdata ; let textAlign = 'center'
                if ( !all_d.common) {
                    return;
                }
                let pageControl_alignment = all_d.pageControl.contentHorizontalAlignment

                // $(".index > li").mouseover(function(){
                //     $(this).css("background-color","red")
                //            .siblings().css("background-color","rgba(200,200,200,1.0)");
                //     index = $(this).index();
                //     $(".content").animate({"left":-all_d.width*index},500);
                // })

                if ( pageControl_alignment == 0)
                    textAlign = 'center'
                else if ( pageControl_alignment == 1)
                    textAlign = 'left'
                else if ( pageControl_alignment == 2)
                    textAlign = 'right'                

                rvl_.find('.index').css({
                    textAlign: textAlign 
                })
                rvl_.find('.index').find('li').css({
                    width:all_d.pageControl.currentPageIndicatorSize+'px',
                    height:all_d.pageControl.currentPageIndicatorSize+'px',
                    marginLeft:pageControl_alignment == 2 ? '8px' : '5px',
                    marginRight:pageControl_alignment == 2 ? '0px' : '3px',
                    backgroundColor:all_d.pageControl.pageIndicatorTintColor,
                })
                rvl_.find('.index').find('.first').css({
                    backgroundColor:all_d.pageControl.currentPageIndicatorTintColor,
                })

                //=================/=================/=================/=================
                //=================/=================/=================/=================
                if ( $.allowMachine == 1) {
                    return
                }
                var $content_ = rvl_.find('.content-img-text')
                $content_.children(".img-package.tmp").remove()
                var cloneObject = $content_.children(".img-package").first().clone();
                cloneObject.children('img').attr('src', all_d.images && all_d.images.urls? all_d.images.urls[0] : '')
                cloneObject.addClass('tmp');
                $content_.append(cloneObject);

                indexNumber = self.urls.length+1 //$content_.children(".img-package").length;
 
                clearInterval(self.timer_roll);
                self.timer_roll = setInterval(picLoop,all_d.pageControl.autoScrollInterval*1000);

                function picLoop(vali){
                    index++; var tail = false 
                    if(index == indexNumber){    
                        $content_.css("left","0px");    
                        index = 1;   
                    }    
                    $content_.stop().animate({left:-index* (all_d.images && all_d.images.width? parseFloat(all_d.images.width) : 375) },500); 

                    index == indexNumber-1 ? tail = true : null

                    //索引pagecontrol的移动
                    rvl_.find('.index').children('li').eq( tail==true ? 0 : index).css("background-color",all_d.pageControl.currentPageIndicatorTintColor).siblings().css("background-color",all_d.pageControl.pageIndicatorTintColor);
                    //数字索引的移动
                    if (all_d.whichControl == 1 ) {

                        rvl_.find('.indexNumber').text( (tail==true ? 1 : index+1)+'/'+(indexNumber-1) )
                    }
                }
            },
            getStr(propName,propVal){
                return propName + ':' + propVal + ';'
            },
            getRandomClassName(){
                let self = this
                return '.'+self.randomMark
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
            /**81.pppp**/
        }

	}
</script>

<style scoped lang="less">
    @rollHeight:200px;
    .pic{
        width: 100%;
        height: @rollHeight;
        // margin: 10px auto;
        position: relative;
        overflow: hidden;

        .content-img-text{
            position: absolute;
            width: 99999px;
            height: 100%;
            left: 0px;
            top: 0px;
            .img-package{
                position: relative;
                float: left;
                height: 100%;
                img{
                    height: 100%;
                    width: 100%;
                    object-fit: cover;

                }
                .title-package{
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    padding: 0 10px 10px;
                }
            }
            
        }
    }
    .index{
        position: absolute;
        bottom: 7px;
        // height: 10px;
        width: 100%;
        padding: 0 10px;
        text-align: center;
        list-style: none;
        li{
            display: inline-block;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background-color: #cdcdcd;
            vertical-align: bottom;
        }
    }
    .indexNumber{
        &:extend(.index);
        text-align: right;
        font-size: 13px;
    }

</style>
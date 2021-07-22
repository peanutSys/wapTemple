<template>
	<div class="body-backgroud">
        <div class="pic">
            <div class="content" >
                <div class="img-package" >
                    <img src="http://img01.cztv.com/202008/21/36fcad74b3e88583ce75da884a907204.jpg">
                    <span>口岸出境免税店管理暂行办法</span>
                </div>
                <div class="img-package">
                    <img src="http://img01.cztv.com/202008/21/a47893f6e2733137b64ebe554df44594.png">
                    <span>今年的第8号台风</span>
                </div>
                <div class="img-package">
                    <img src="http://img01.cztv.com/202008/21/8cb68a894866034b9e20f3b43fd2b503.jpg">
                    <span>“天问一号”火星探测器正以每天约30万公里的速度远离地球</span>
                </div>
            </div>

        </div>
	</div>
</template>

<script type="text/javascript">
	export default {
		data () {
			return {  
                common_style_:'',
                sub_style_:'',
                img_width:300,
                img_translate:263,
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

            self._props.layout_data = self.getData() //临时的
            self.reLayout(self._props.layout_data)
            self.roll_operation( self._props.layout_data)
        },
        beforeDestroy(){
            let self = this
            clearInterval(self.timer_infinite)
        },
		methods:{
            reLayout( newdata){
                let self = this
                let all_d = newdata ; let stystrr = ''; let common_stystrr = '';
                if ( all_d.color) {
                    //颜色
                    common_stystrr += self.getStr('color',self.hexToRgb(all_d.color.textColor,all_d.color.textAlpha) );
                    common_stystrr += self.getStr('background-color',self.hexToRgb(all_d.color.bgColor,all_d.color.bgAlpha) );
                }

                if ( all_d.text) {
                    //文字排列方式
                    common_stystrr += self.getStr('text-align',all_d.text.textAlignment == 0 ? 'left' : all_d.text.textAlignment == 1 ? 'center' :'right'   );
                    common_stystrr += self.getStr('font-size',all_d.text.font+'px');
                    common_stystrr += self.getStr('font-family',all_d.text.familyName || '');
                }

                common_stystrr += self.getStr('width',self.img_width+'px');

                if ( all_d.common) {
                    //common
                    stystrr += self.getStr('opacity',all_d.common.isHidden ? 0:1);

                    if ( all_d.common.radius != undefined) {
                        stystrr += self.getStr('border-radius',all_d.common.radius+'px');
                    }
                    if ( all_d.common.border) {
                        stystrr += self.getStr('border-color',self.hexToRgb(all_d.common.border.borderColor,1.0) );
                        stystrr += self.getStr('border-width',all_d.common.border.borderWidth+'px');
                        stystrr += self.getStr('border-radius',all_d.common.border.borderRadius+'px');
                        stystrr += self.getStr('border-style','solid');
                    }
                    
                    if ( all_d.common.shadow) {
                        stystrr += self.getStr('box-shadow',all_d.common.shadow.offsetWidth + 'px '+ all_d.common.shadow.offsetHeight + 'px ' + ' 1px ' + self.hexToRgb(all_d.common.shadow.shadowColor,all_d.common.shadow.opacity) );
                    }
                }
                self.sub_style_ = stystrr;
                self.common_style_ = common_stystrr;
            },
            roll_operation( newdata){
                let self = this
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

                $('.pic .content').children(".img-package.tmp").remove()
                var cloneObject_first = $('.pic .content').children(".img-package").first().clone();
                var cloneObject_second = $('.pic .content').children(".img-package").eq(1).clone();
                var cloneObject_last = $('.pic .content').children(".img-package").last().clone();

                cloneObject_first.addClass('tmp');cloneObject_second.addClass('tmp');cloneObject_last.addClass('tmp');
                $('.pic .content').append(cloneObject_first);$('.pic .content').append(cloneObject_second);$('.pic .content').prepend(cloneObject_last);

                $('.pic .content').children(".img-package").attr('style',self.common_style_)
                $(".pic .content").css("left",'-'+self.img_translate+"px");                

                indexNumber = $('.pic .content').children(".img-package").length;

                {
                    var attractEle = $('.pic .content').children(".img-package").eq(index+1)
                    attractEle.attr('style',self.sub_style_+self.common_style_ ).siblings().css('transform','scaleY(0.8)')
                }
                
                clearInterval(self.timer_infinite);
                self.timer_infinite = setInterval(picLoop,all_d.pageControl.autoScrollInterval*1000);

                function picLoop(){
                    index++;
                    if(index == indexNumber-2){    
                        $(".pic .content").css("left",'-'+self.img_translate+"px");    
                        index = 1;   
                    }    
                    $(".pic .content").stop().animate({left:-index*self.img_width -self.img_translate},500); 
                    setTimeout(function() {
                        var attractEle = $('.pic .content').children(".img-package").eq(index+1)
                        attractEle.attr('style',self.sub_style_+self.common_style_).siblings().attr('style',self.common_style_ +'transform:scaleY(0.8)')
                    }, 250);
                    
                }
            },
            getStr(propName,propVal){
                return propName + ':' + propVal + ';'
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
            getData(){
                return { 
                        "color": {
                            "textColor": "#fff",
                            "bgColor": "#fff",
                            "textAlpha": 1.0,
                            "bgAlpha": 1.0,
                        },
                        "text": {
                            "textAlignment": 0,
                            "familyName": "PingFangSC-Regular", 
                            "numberOfLines": 1, 
                            "font": 12,
                        },
                        "common": {
                            "isUserInterface": false, 
                            "contentMode": 0,   
                            "isHidden": false, // 是否隐藏
                            "clipsToBounds": false, // 切圆角 需要使用
                            "masksToBounds": true, // layer切割
                            "isOpaque": true, // 是否透明
                            "radius": 2, // 圆角
                            "border": {
                                "borderColor": "#fff", // 边框颜色
                                "borderWidth": 0, // 边框宽度
                                "borderRadius": 10 // 边框圆角
                            },
                            "shadow": {
                                "shadowColor": "#fff", //阴影颜色
                                "opacity": 1, // 不透明
                                "offsetWidth": 1, // 偏移
                                "offsetHeight": 1, // 偏移
                                "radius": 3, //圆角
                            },
                            "size": {
                                // 宽，高，大于等于宽，大于等于高，小于等于宽，小于等于高
                                // width, height, greaterWidth, greaterHeight, lessWidth, lessHeight: CGFloat  
                            },
                        },
                        "pageControl": { 
                            "autoScrollInterval": 3,
                            "currentPageIndicatorSize": "6", 
                            "contentHorizontalAlignment": 2, 
                            "currentPageIndicatorTintColor": "#fff", 
                            "pageIndicatorTintColor": "#aaa",
                        }
                }
            },


        }

	}
</script>

<style scoped lang="less">
    @rollWidth:375px;
    @rollHeight:200px;
    .pic{
        width: @rollWidth;
        height: @rollHeight;
        margin: 10px auto;
        position: relative;
        overflow: hidden;

        .content{
            position: absolute;
            width: 99999px;
            height: @rollHeight;
            left: 0px;
            top: 0px;
            .img-package{
                position: relative;
                float: left;
                height: 100%;
                overflow: hidden;
                img{
                    height: 100%;
                    width: 100%;
                }
                span{
                    display: inline-block;
                    position: absolute;
                    bottom: 12px;
                    left: 10px;
                }
            }
        }
    }
    

</style>
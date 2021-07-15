<template>
	<div class="body-backgroud">
        <div class='msg-flash' :style="style_">
            <span class="imgSpan"><img style="height: 100%;object-fit: contain;" :src="require('static/img/news_flash.png') "></span>
            
            <div class="title">
                <div><span>2020年上半年经济数据出炉 19个省份GDP超一万亿元</span></div>
                <div><span>花呗接入央行征信，透支或影响贷款买房？</span></div>
                <div><span>71年来台风7月首次“缺席”？专家为您解密</span></div>
            </div>            
        </div>
	</div>
</template>

<!-- 主要用于快讯..... -->
<script type="text/javascript">
	export default {
		data () {
			return {  
                style_:'',
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
        },
        mounted(){
            let self = this
            self.reLayout(self._props.layout_data)
            self.roll_operation( self._props.layout_data)
        },
		methods:{
            reLayout( newdata){
                let self = this
                let all_d = newdata ; let stystrr = '';
                //宽高度
                stystrr += self.getStr('display','flex');
                stystrr += self.getStr('width',all_d.width+'px');
                stystrr += self.getStr('height',all_d.height+'px');

                if ( all_d.color) {
                    //颜色
                    stystrr += self.getStr('color',self.hexToRgb(all_d.color.textColor,all_d.color.textAlpha) );
                    stystrr += self.getStr('background-color',self.hexToRgb(all_d.color.bgColor,all_d.color.bgAlpha) );
                }

                if ( all_d.text) {
                    //文字排列方式
                    stystrr += self.getStr('text-align',all_d.text.textAlignment == 0 ? 'left' : all_d.text.textAlignment == 1 ? 'center' :'right'   );
                    stystrr += self.getStr('font-size',all_d.text.font+'px');
                    // stystrr += self.getStr('font-family',all_d.text.familyName);
                }

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
                    if ( all_d.common.size) {
                        //宽高度
                        all_d.common.size.width ? stystrr += self.getStr('width',all_d.common.size.width+'px') : null
                        all_d.common.size.height ? stystrr += stystrr += self.getStr('height',all_d.common.size.height+'px'): null
                    }
                    
                }
                self.style_ = stystrr;

            },
            roll_operation( newdata){

                var index = 0; let all_d = newdata.aaa ; let title_count = 3

                $('.msg-flash .imgSpan').css({
                    height:(all_d.height-10) + 'px',
                })

                $('.msg-flash .title').css({
                    width:'1000px',
                })

                $('.msg-flash .title div').css({
                    height:all_d.height,
                    float:'left',
                })

                clearInterval(self.timer);
                self.timer = setInterval(picLoop,all_d.special.sdCyclePageView.autoScrollTimeInterval*1000);

                function picLoop(){
                    index++;
                    if (index== title_count) {
                        index=0;
                        $(".msg-flash .title").css({"marginTop":-all_d.height*index+'px'});
                    }else{
                       $(".msg-flash .title").animate({"marginTop":-all_d.height*index*2+'px'},500); 
                    }
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
        }

	}
</script>

<style scoped lang="less">
    .msg-flash{
        overflow: hidden;
        margin: 10px auto;
        align-items: center;
        .imgSpan{
            margin-left: 10px;
        }

        .title{
            margin-left: 10px;
            display: inline-block;
            height: 100%;
            // font-family: "SourceHanSerif";
            div{
                float: left;
                display: flex;
                text-align: left;
                align-items: center;
            }
        }
    }

</style>
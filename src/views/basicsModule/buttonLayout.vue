<template>
	<div class="body-backgroud">
        <button :style="style_" @mousedown='highlight_button' @mouseup='normal_button'></button>
	</div>
</template>

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
               self.reLayout(1,newVal)
            }
        },
        props: ['layout_data'],
        created(){
            let self = this
            self.reLayout(1,self._props.layout_data)
        },
		methods:{
            reLayout( button_state,newdata){
                let self = this
                let all_d = newdata ; let stystrr = ''; if ( !all_d) return;

                // stystrr += self.getStr('display','block');
                if ( all_d.color) {
                    //颜色
                    stystrr += self.getStr('color',self.hexToRgb(all_d.color.textColor,all_d.color.textAlpha) );
                    stystrr += self.getStr('background-color',self.hexToRgb(all_d.color.bgColor,all_d.color.bgAlpha) );
                }

                if ( all_d.text) {
                    //文字排列方式
                    stystrr += self.getStr('text-align',all_d.text.textAlignment == 0 ? 'left' : all_d.text.textAlignment == 1 ? 'center' :'right'   );
                    stystrr += self.getStr('font-size',all_d.text.font+'px');
                    // stystrr += self.getStr('font-family',all_d.text.familyName || '');
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
                    }else{
                        stystrr += self.getStr('border-width','0px');
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
                
                if ( all_d.buttonState) {
                    //按钮各状态样式
                    if ( button_state == 1 ) {
                        //按钮正常状态
                        stystrr += self.getStr('color',self.hexToRgb(all_d.buttonState.normal.textColor,1) );
                        stystrr += self.getStr('background-color',self.hexToRgb(all_d.buttonState.normal.bgColor,1) );
                        all_d.buttonState.normal.bgImage ? stystrr += self.getStr('background-image','url('+all_d.buttonState.normal.bgImage+')' ) : null ;
                    }else if ( button_state == 2 ) {
                        //按钮高亮状态
                        stystrr += self.getStr('color',self.hexToRgb(all_d.buttonState.highlighted.textColor,1) );
                        stystrr += self.getStr('background-color',self.hexToRgb(all_d.buttonState.highlighted.bgColor,1) );
                        all_d.buttonState.highlighted.bgImage ? stystrr += self.getStr('background-image','url('+all_d.buttonState.highlighted.bgImage+')' ) : null ;
                    }
                }
                self.style_ = stystrr;

            },
            highlight_button(e){
                let self = this
                self.reLayout(2,self._props.layout_data)
            },
            normal_button(e){
                let self = this
                self.reLayout(1,self._props.layout_data)
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

<style scoped>

</style>
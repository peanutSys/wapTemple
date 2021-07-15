<template>
    <div class="body-backgroud" :style="style_"></div>
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
               self.reLayout(newVal)
            }
        },
        props: ['layout_data'],
        created(){
            let self = this
            self.reLayout(self._props.layout_data)
        },
        methods:{
            reLayout( newdata){
                let self = this
                let all_d = newdata ; let stystrr = ''; 
                if ( !all_d) return;
                stystrr += self.getStr('background-repeat','no-repeat');

                if ( all_d.imgUrl) {
                    stystrr += self.getStr('background-image','url('+all_d.imgUrl+')');
                }

                if ( all_d.imgMaskUrl) {
                    stystrr += self.getStr('-webkit-mask','url('+all_d.imgMaskUrl+') no-repeat');
                    stystrr += self.getStr('mask','url('+all_d.imgMaskUrl+') no-repeat');
                    stystrr += self.getStr('-webkit-mask-size','100% 100%');
                    stystrr += self.getStr('mask-size','100% 100%');
                }

                if ( all_d.imgFill) {
                    stystrr += self.getStr('background-size',all_d.imgFill);
                }else{
                    stystrr += self.getStr('background-size','100% 100%');
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
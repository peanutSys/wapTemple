<template>
	<div >
        <input :style="style_" class="input-edit" type="text" placeholder="请输入关键字">
        <img :style='style_img' class="input-edit-img" src="../../../static/img/search.png">
    </div>
</template>

<script type="text/javascript">
	export default {
		data () {
			return {  
                style_:'',
                style_img:'',
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
                let all_d = newdata ; let stystrr = '' ,stystrr_img='';  if ( !all_d) return;

                stystrr += self.getStr('outline','none');
                stystrr += self.getStr('border-width','0');
                if ( all_d.color) {
                    //颜色
                    stystrr += self.getStr('color',self.hexToRgb(all_d.color.textColor,all_d.color.textAlpha) );
                    stystrr += self.getStr('background-color',self.hexToRgb(all_d.color.bgColor,all_d.color.bgAlpha) );
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
                        if ( all_d.common.size.width && all_d.common.size.width >=0) {
                            stystrr += self.getStr('width',all_d.common.size.width+'px')
                        }
                        if ( all_d.common.size.height && all_d.common.size.height>=0) {
                            stystrr += self.getStr('height',all_d.common.size.height+'px')
                            stystrr_img += self.getStr('height',all_d.common.size.height-8+'px')
                        }

                    } 
                }
                self.style_ = stystrr;
                self.style_img = stystrr_img;

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
    .input-edit{
        padding: 10px;
        font-size: 12px;
        vertical-align: middle;
    }
    .input-edit::-webkit-input-placeholder{
        color: #fff;
    }
    .input-edit-img{
        vertical-align: middle;
        margin-left: -25px;
    }
</style>
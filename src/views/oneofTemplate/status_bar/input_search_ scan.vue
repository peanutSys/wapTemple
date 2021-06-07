<template>
    <div :style='style__'>
        <ImageLayout class='search' :layout_data='geted_data.searchbtn'></ImageLayout>
        <input class="input" :style='input_style__' type="text" placeholder="请输入关键字">
        <ImageLayout class='scan' :layout_data='geted_data.scan'></ImageLayout>
    </div>
</template>

<script type="text/javascript">
    import ImageLayout from '../../basicsModule/imageLayout';

    export default {
        data () {
            return {  
                style__:'display: inline-block;white-space: nowrap;background-color: #fff;padding: 3px 5px;',
                input_style__:'',
                geted_data:{},
                randomMark:(new Date()).getTime(),
            }
        },
        watch:{
            layout_data:function (newVal,oldVal ) {
               let self = this
               self.setLayout(newVal)
            }
        },
        created(){
            let self = this;
        },
        mounted(){
            let self = this
            self.setLayout( self._props.layout_data)
        },
        props: ['layout_data'],
        components:{
            ImageLayout,
        },
        methods:{
            setLayout( _data_){
                let self = this, stystrr = '' , input_strr = ''

                //圆角
                if ( _data_.borderRadius) {
                    stystrr += self.getStr('border-radius', _data_.borderRadius+'px');
                }
                //颜色
                if ( _data_.color) {
                    input_strr += self.getStr('color',self.hexToRgb(_data_.color.textColor,_data_.color.textAlpha) )
                }
                //宽高
                if ( _data_.size) {
                    stystrr += self.getStr('width', parseFloat( _data_.size.width) < 0 ? '120px' : _data_.size.width+'px')
                    stystrr += self.getStr('height', parseFloat( _data_.size.height) < 0 ? 'auto' : _data_.size.height+'px')
                }
                self.input_style__ += input_strr
                self.style__ += stystrr

                let getData_ = self.getData()
                self.geted_data = getData_

                self.$nextTick( ()=>{
                    $('.input_edit'+self.getRandomClassName() ).css({
                        marginRight:'10px',
                    })
                })
            },

            getRandomClassName(){
                let self = this
                return '.'+self.randomMark
            },

            getStr(propName,propVal){
                return propName + ':' + propVal + ';'
            },

            hexToRgb(hexstr,opacity){
                if ( !hexstr) 
                    return ''
                opacity = opacity || 1
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
                    "searchbtn":{
                        "imgUrl":'http://shixiantest.oss-cn-hangzhou.aliyuncs.com/57/posts/2021/03/22/b0211e581f6278af606672b852734a0f.png',
                        "common":{
                            "border": {
                                "borderColor": "#fff", 
                                "borderWidth": 0, 
                                "borderRadius": 3 
                            },
                            "size":{
                                "width":18,
                                "height":18
                            },
                        }
                    },
                    "scan":{
                        "imgUrl":'http://shixiantest.oss-cn-hangzhou.aliyuncs.com/57/posts/2021/03/19/f356e656397ec667fcde56a95d131010.png',
                        "common":{
                            "border": {
                                "borderColor": "#fff", 
                                "borderWidth": 0, 
                                "borderRadius": 3 
                            },
                            "size":{
                                "width":18,
                                "height":18
                            },
                        }
                    }
                    
                }
            },

        }
    }
</script>

<style scoped lang="less">
    .search{
        display: inline-block;
        vertical-align: middle;
        float: left;

    }
    .input{
        outline: none;
        border-width: 0;
        width: 50px;
    }
    .scan{
        .search;
        float: right;
    }
</style>
<template>
    <div :style='style__'>
        <ImageLayout :class='"weather-img "+randomMark' :layout_data='geted_data'></ImageLayout>
        <LabelLayout :class='"weather-title "+randomMark' :layout_data='geted_data'></LabelLayout>
    </div>
</template>

<script type="text/javascript">
    import ImageLayout from '../../basicsModule/imageLayout';
    import LabelLayout from '../../basicsModule/labelLayout';

	export default {
		data () {
			return {  
                style__:'',
                geted_data:{},
                weather_temp:'',
                randomMark:(new Date()).getTime(),
			}
		},
        watch:{
            layout_data:function (newVal,oldVal ) {
               let self = this
               self.setLayout(newVal)
            },
            content_data:function (newVal,oldVal ) {
               let self = this
               self.set_temp( newVal)
            },
        },
        created(){
            let self = this;
        },
        mounted(){
            let self = this
            self.setLayout( self._props.layout_data)
        },
        props: ['layout_data','content_data'],
        components:{
            ImageLayout,
            LabelLayout
        },
		methods:{
            setLayout( _data_){
                let self = this,
                new_weather = self._props.content_data

                let getData_ = self.getData()
                _data_&& _data_.fontSize ? getData_.text.font = _data_.fontSize : null
                _data_&& _data_.color ? getData_.color.textColor = _data_.color : null

                self.getImageBase64( getData_.imgMaskUrl,( url)=>{
                    getData_.imgMaskUrl = url
                    self.geted_data = getData_

                    self.style__ += self.getStr('height',self.geted_data.common.size.height+'px');
                    self.style__ += self.getStr('margin-right',self.geted_data.text.font-8+'px');
                })
                
                self.$nextTick( ()=>{
                    {   
                        $('.weather-img'+self.getRandomClassName() ).css({
                            display: 'inline-block',
                            backgroundColor: _data_.color,
                        })

                        $('.weather-title'+self.getRandomClassName() ).css({
                            display: 'inline-block',
                            marginLeft:'-3px',
                            width:'28px',
                        })

                        self.set_temp( new_weather)
                    }
 
                })
            },

            set_temp( new_weather){
                let self = this,
                val_ = (new_weather.temperature || '18') +'°C'
                $('.weather-title'+self.getRandomClassName() ).children('.content').text( val_)
            },

            getRandomClassName(){
                let self = this
                return '.'+self.randomMark
            },

            getStr(propName,propVal){
                return propName + ':' + propVal + ';'
            },

            getData(){
                return {
                    "imgMaskUrl":'http://shixiantest.oss-cn-hangzhou.aliyuncs.com/95/posts/2021/05/10/e161d502eeac5a1e93a3ad4415fc2c31.png',
                    "color":{
                        "textColor":"#ffffff"
                    },
                    "text":{
                        "font":'12',
                        'textAlignment':'1',
                    },
                    "common": {
                        // "border": {
                        //     "borderColor": "#fff", 
                        //     "borderWidth": 1, 
                        //     "borderRadius": 3 
                        // },
                        // "shadow": {
                        //     "shadowColor": "#fff", 
                        //     "opacity": 1, 
                        //     "offsetWidth": 1, 
                        //     "offsetHeight": 1, 
                        // },
                        "size": {
                            "width": 18,
                            "height":20,
                        },
                    },
                }
            },

		}
	}
</script>

<style scoped lang="less">
    .weather-img{
        vertical-align: middle;
        margin-right: 3px;
    }
    .weather-title{
        vertical-align: middle;
    }

</style>
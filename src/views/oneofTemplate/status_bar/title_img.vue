<template>
    <div :style='style__'>
        <ImageLayout :class='"title_img "+randomMark' :layout_data='geted_data'></ImageLayout>
    </div>
</template>

<script type="text/javascript">
    import ImageLayout from '../../basicsModule/imageLayout';

	export default {
		data () {
			return {  
                style__:'',
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
                let self = this,
                getData_ = self.getData()

                _data_&& _data_.color ? getData_.color.textColor = _data_.color : null

                if ( _data_.imageSize && _data_.imageSize.width != undefined) {
                    _data_.imageSize.width < 0 ? null :getData_.common.size.width = _data_.imageSize.width
                }

                if ( _data_.imageSize && _data_.imageSize.height != undefined) {
                    _data_.imageSize.height < 0 ? null :getData_.common.size.height = _data_.imageSize.height
                }

                if ( _data_.imgUrl) {
                    self.getImageBase64( _data_.imgUrl,( url)=>{
                        getData_.imgMaskUrl = url

                        self.style__ += self.getStr('height',getData_.common.size.height+'px')
                        self.geted_data = getData_
                    })
                }
                self.$nextTick( ()=>{
                    $('.title_img'+self.getRandomClassName() ).css({
                        backgroundColor: getData_.color.textColor,
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

            getData(){
                return {
                    "imgMaskUrl":'',
                    "color":{
                        "textColor":"#ffffff"
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
                            "width": 45,
                            "height":18,
                        },
                    },
                }
            },

		}
	}
</script>

<style scoped lang="less">
    .title_img{
        display: inline-block;
    }

</style>
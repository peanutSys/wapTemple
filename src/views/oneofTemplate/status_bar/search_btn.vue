<template>
    <div :style='style__'>
        <ImageLayout :class='"search_btn "+randomMark' :layout_data='geted_data'></ImageLayout>
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
                local_data_ = self.getData()
                
                self.getImageBase64( local_data_.imgMaskUrl,( url)=>{
                    local_data_.imgMaskUrl = url
                    self.geted_data = local_data_
                    self.style__ += self.getStr('height',self.geted_data.common.size.height+'px')
                })

                self.$nextTick( ()=>{
                    $('.search_btn'+self.getRandomClassName() ).css({
                        backgroundColor: _data_.color,
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
                    "imgMaskUrl":'http://shixiantest.oss-cn-hangzhou.aliyuncs.com/95/posts/2021/05/10/11f783ee13405458c30bc83674095ad1.png',
                    "common": {
                        "contentMode":1,
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
                            "height":18,
                        },
                    },
                }
            },

		}
	}
</script>

<style scoped lang="less">
    .search_btn{
        display: inline-block;
    }

</style>
<template>
    <div :style='style__'>
        <ImageLayout :class='"user "+randomMark' :layout_data='geted_data'></ImageLayout>
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
            setLayout(){
                let self = this
                self.geted_data = self.getData()
                self.style__ += self.getStr('height',self.geted_data.common.size.height+'px');

                self.$nextTick( ()=>{
                    {   
                        $('.user'+self.getRandomClassName() ).css({
                            backgroundImage:'url('+require('static/img/user_content.png')+')',
                        })

                    }
 
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
                            "height":20,
                        },
                    },
                }
            },

		}
	}
</script>

<style scoped lang="less">
    .user{
        display: inline-block;
    }

</style>
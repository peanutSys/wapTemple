<template>
    <div :style='style__'>
        <LabelLayout :class='"title_text "+randomMark' :layout_data='geted_data'></LabelLayout>
    </div>
</template>

<script type="text/javascript">
    import LabelLayout from '../../basicsModule/labelLayout';

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
            LabelLayout
        },
		methods:{
            setLayout( _data_){
                let self = this
                let getData_ = self.getData()
                _data_&& _data_.fontSize ? getData_.text.font = _data_.fontSize : null
                _data_&& _data_.color ? getData_.color.textColor = _data_.color : null
                getData_.type = 6
                self.geted_data = getData_

                self.style__ += self.getStr('height',self.geted_data.common.size.height+'px');

                self.$nextTick( ()=>{
                    $('.title_text'+self.getRandomClassName() ).css({
                            display: 'inline-block',
                        })
                    $('.title_text'+self.getRandomClassName() ).children('.content').text(_data_.text)
 
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
                    "color":{
                        "textColor":'#fff',
                        "bgColor":''
                    },
                    "text":{
                        "font":'12',
                        'textAlignment':'1'
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
                            "width": 78,
                            "height":20,
                        },
                    },
                }
            },

		}
	}
</script>

<style scoped lang="less">


</style>
<template>
    <div :style='style__'>
        <InputEdit :class='"input_edit "+randomMark' :layout_data='geted_data'></InputEdit>
    </div>
</template>

<script type="text/javascript">
    import InputEdit from '../../basicsModule/input_edit';

	export default {
		data () {
			return {  
                style__:'display: inline-block;',
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
            InputEdit,
        },
		methods:{
            setLayout( _data_){
                let self = this

                let getData_ = self.getData()
                _data_&& _data_.borderRadius ? getData_.common.border.borderRadius = _data_.borderRadius : null
                _data_&& _data_.width ? getData_.common.size.width = _data_.width : null

                self.geted_data = getData_
                self.style__ += self.getStr('height',self.geted_data.common.size.height+'px');

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

            getData(){
                return {
                    "color":{
                        "textColor":"#ccc",
                        "bgColor":"#ededed",
                        "bgAlpha":'0.3',
                    },
                    "common": {
                        "contentMode":1,
                        "border": {
                            "borderColor": "#fff", 
                            "borderWidth": 0, 
                            "borderRadius": 12 
                        },
                        // "shadow": {
                        //     "shadowColor": "#fff", 
                        //     "opacity": 1, 
                        //     "offsetWidth": 1, 
                        //     "offsetHeight": 1, 
                        // },
                        "size": {
                            "width": 110,
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
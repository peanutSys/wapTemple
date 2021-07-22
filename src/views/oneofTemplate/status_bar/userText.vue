<template>
    <div :style='style__'>
        <LabelLayout :class='"userText "+randomMark' :layout_data='geted_data.title'></LabelLayout>
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
            LabelLayout,
        },
		methods:{
            setLayout( _data_){
                let self = this,
                local_d = self.getData()

                //文字内容
                if ( _data_.text) {
                    local_d.title.textContent = _data_.text
                }
                //字体颜色
                if ( _data_.color) {
                    local_d.title.color.textColor = _data_.color
                }
                //字体大小
                if ( _data_.fontSize) {
                    local_d.title.text.font = _data_.fontSize
                }
                self.geted_data = local_d

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
                    "title":{
                        "textContent":'我的',
                        "textContent_style":'none',
                        "color":{
                            "textColor":"#efefef"
                        },
                        "text":{
                            "textAlignment":0,
                            "font":15,
                            "familyName":"",
                        },
                    },
                }
            },

		}
	}
</script>

<style scoped lang="less">
    .userText{
        display: inline-block;
    }

</style>
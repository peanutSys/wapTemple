<template>
    <div >
        <el-form ref="editform"  label-width="150px" >
            <el-form-item :label="e_data.title+':'" style='margin-bottom: 5px;'>
                <div >
                    <el-radio-group v-model="e_data.data.select" @change='changing' size='mini'>
                        <el-radio 
                            v-for='(val,key) in e_data.data.content' 
                            :key='key' 
                            :label="val.label">{{val.text}}
                        </el-radio>
                    </el-radio-group>
                </div>
            </el-form-item>
        </el-form>
    </div>
</template>

<script type="text/javascript">

	export default {
		data () {
			return {  
                e_data:{
                    data:''
                },
			}
		},
        watch:{
            edit_data:function (newVal,oldVal ) {
               let self = this
               self.basic_data( newVal)
            },
        },
        created(){
            let self = this;
        },
        mounted(){
            let self = this
            self.basic_data( self._props.edit_data)
        },
        props: ['edit_data','change'],
        components:{
            
        },
		methods:{
            basic_data( data){
                let self = this
                self.e_data = data
            },

            changing(){
                let self = this
                self.$emit('change',self.e_data)
            },

            getRandomClassName(){
                let self = this
                return '.'+self.randomMark
            },

            getStr(propName,propVal){
                return propName + ':' + propVal + ';'
            },


		}
	}
</script>

<style scoped lang="less">
    @edit_Input_width :120px;
    
</style>
<style>
    .el-radio-group .el-radio{
        margin-right: 15px;
    }
</style>
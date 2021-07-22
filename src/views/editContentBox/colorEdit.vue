<template>
    <div >
        <el-form ref="editform"  label-width="150px" >
            <el-form-item :label="e_data.title+':'" style='margin-bottom: 5px;'>
                <div style="width: 170px;">
                    <el-input class='edit-input' @change='changing' v-model='e_data.data' size='mini' type="text" placeholder=""></el-input>
                    <el-color-picker style="vertical-align: middle;" @change='changing' v-model="e_data.data" size='mini'></el-color-picker>
                </div>
            </el-form-item>
        </el-form>
    </div>
</template>

<script type="text/javascript">

	export default {
		data () {
			return {  
                e_data:{},

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
    .edit-input{
        display: inline-block;
        width: @edit_Input_width;
        vertical-align: middle;

    }

</style>
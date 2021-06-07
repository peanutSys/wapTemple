<template>
    <div >
        <el-form ref="editform"  label-width="150px" :rules="rules" >
            <el-form-item :label="e_data.title+'(上右下左):'" style='margin-bottom: 5px;'>
                <el-input ref='input1' class='edit-input' @input='changing' v-model='data_top' size='mini' type="text" placeholder=""></el-input>
                <el-input class='edit-input' @input='changing' v-model='data_right' size='mini' type="text" placeholder=""></el-input>
                <el-input class='edit-input' @input='changing' v-model='data_bottom' size='mini' type="text" placeholder=""></el-input>
                <el-input class='edit-input' @input='changing' v-model='data_left' size='mini' type="text" placeholder=""></el-input>
            </el-form-item>

        </el-form>
    </div>
</template>

<script type="text/javascript">

	export default {
		data () {
			return {  
                e_data:{},
                data_top:'',data_right:'',data_bottom:'',data_left:'',
                rules:{
                    // nickName:[
                    //     {message:"",trigger:'blur'},
                    //     {min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur'},
                    // ],
                    // pass: [
                    //     {required:true, validator: this.validatePass, trigger: 'blur' }
                    // ],
                    // input:[
                    //     {type: 'number', message: '只能是数字', trigger: 'blur'},
                    // ],
                },

			}
		},
        watch:{
            edit_data:function (newVal,oldVal ) {
               let self = this
               self.basic_data( newVal)
            }
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
                let arr_data = self.e_data.data.split(',')
                self.data_top = arr_data[0]
                self.data_right = arr_data[1]
                self.data_bottom = arr_data[2]
                self.data_left = arr_data[3]
            },
            changing( ){
                let self = this
                let top = self.data_top || 0
                let right = self.data_right || 0
                let bottom = self.data_bottom || 0
                let left = self.data_left || 0

                self.e_data.data = top+','+right+','+bottom+','+left
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
    @edit_Input_width :100px;
    .edit-input{
        display: inline-block;
        width: @edit_Input_width;

    }

</style>
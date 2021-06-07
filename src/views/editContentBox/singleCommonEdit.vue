<template>
    <div >
        <el-form ref="editform"  label-width="150px" >
            <el-form-item :label="e_data.title+':'" style='margin-bottom: 5px;'>
                <div style="width: 170px;">
                    <el-input class='edit-input' @input='changing' v-model='e_data.data' size='mini' type="text" placeholder=""></el-input>
                    <el-button v-if = 'e_data.isFileUpload' size='mini' class='inputgf-button'>上传图片
                        <input class='inputfile' type="file" accept = "image/png,image/gif,image/jpeg" @change="tirggerFile"></input>
                    </el-button>
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
                let self = this,
                pit = parseFloat(self.e_data.data)
                if ( pit) {
                   self.e_data.data = pit
                }else if ( pit == 0) {
                    (self.e_data.data+'').indexOf('.') > -1 ? null : self.e_data.data = pit
                }
                self.$emit('change',self.e_data)
            },

            tirggerFile(e){
                let self = this
                let file = e.target.files[0],
                url = '/api/v1/updateImg',
                formdata = new FormData()
                formdata.append("image",file )
                self.netWorking(url, 'POST', true,formdata, (xhr)=>{
                    if ( xhr.responseJSON && xhr.responseJSON.code >=200 && xhr.responseJSON.code<400) {
                        self.e_data.data = xhr.responseJSON.data
                        self.changing()
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

            netWorking( url ,method,isFormdata,dataParams,callback ){
                let self = this,
                operator_c = {
                    url:url,
                    type:method,
                    dataType:'json',
                    data:dataParams,
                    success:function (argument,message,xhr) {
                        callback(xhr)
                    },
                    error:function( xhr,error){ callback(xhr) }
                }
                if ( isFormdata) {
                    operator_c.processData =false
                    operator_c.contentType =false
                }
                $.ajax( operator_c)
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
    .inputgf-button{
        position: relative;
        .inputfile {
            outline: none;
            opacity: 0;
            position: absolute;
            top:0;
            left: 0;
            width:100%;
        }
    }
</style>
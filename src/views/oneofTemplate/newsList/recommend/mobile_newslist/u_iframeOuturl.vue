<template>
    <div :class='"outurl "+randomMark' >
        <iframe class="detail-iframe" v-if='framesrc' :src="framesrc" frameborder="0"></iframe>
    </div>
</template>

<script type="text/javascript">

    export default {
        data () {
            return {  
                pageWidth:375,
                randomMark:(new Date()).getTime(),
                framesrc:''
            }
        },
        watch:{
            fData:function(n){
                this.c_iframe( n)
            },
        },components:{},
        props: ['fData'],
        created(){
            let self = this
            self.c_iframe( self._props.fData)
        },
        mounted(){
            let self = this
            self.setLayout()
        },
        methods:{
            setLayout(){
                let self = this
                if ( !$.newslist_Content_height) 
                    self.setLayout()
                else{
                    $('.outurl'+self.getRandomClassName() ).first().css({
                        height: $.newslist_Content_height+'px'
                    }) 
                }
            },
            c_iframe( data_){
                let self = this
                self.framesrc = data_.link_url
            },
            getRandomClassName(){
                let self = this
                return '.'+self.randomMark
            },
            
            netWorking( url ,method,dataParams,callback ){
                let self = this 
                $.ajax({
                    url:url,
                    type:method,
                    dataType:'json',
                    data:dataParams,
                    headers:{
                      'Content-Type':'application/x-www-form-urlencoded',
                    },
                    success:function (argument,message,xhr) {
                        callback(xhr)
                    },
                    error:function( xhr,error){ callback(xhr) }
                })
            },
            /**
            ********************************************************************************
            */
        }
    }
</script>

<style scoped lang="less">
    @ab_postion:{
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
    };
    @width_100 :100%;
    @height_100 :100%;
    @text_color:#555;
    .outurl{
        width: @width_100;
        .detail-iframe{
            width: @width_100;
            height: @height_100;
        }
    }

</style>
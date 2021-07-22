<template>
    <div class="handy-service">
        <div class="category-content"
            v-for='(cval,ckey) in categoryinfo'
            :key='ckey'
        >   
            <div class="category-title">
                <span>{{ cval.name}}</span>
            </div>
            <span class="cell"
                v-for='(listval,listkey) in cval.items.list'
                :key='listkey'
                @click.stop='cellClick( listval)'
            >
                <img :src="listval.logo">
                <p>{{ listval.name}}</p>
            </span>
        </div>
    </div>
</template>

<script type="text/javascript">

    export default {
        data () {
            return {  
                pageWidth:375,
                categoryinfo:[],
            }
        },
        watch:{},components:{},
        props: ['hfpData'],
        created(){
            let self = this
        },
        mounted(){
            let self = this
            self.categoryinfo = self.get_service_data( self._props.hfpData.block && self._props.hfpData.block[0])
        },
        methods:{
            get_service_data( data_){
                let self = this 
                if ( !data_) 
                    return
                let url = $.ajaxGlobalUrl +'/api/v1/wap/serviceList',
                timestamp = (new Date()).getTime()+'',
                region = '浙江-衢州市-开化县',
                paramJson = {
                    'appId':$.clinet_appid,
                    'clientId':$.clinet_clientid,
                    'version':$.clinet_appversion,
                    'region':region,
                    'ts':timestamp,
                    'md5': $.MD5($.clinet_appkey+timestamp+$.clinet_appid+$.clinet_clientid+region+$.clinet_appversion)
                }
                self.netWorking( url,'post',{'Content-Type':'application/json'},JSON.stringify( paramJson),(xhr)=>{
                    if ( xhr.responseJSON && xhr.responseJSON.code >=200 && xhr.responseJSON.code<400) {
                            let reponse_data = xhr.responseJSON.data
                            self.categoryinfo = reponse_data.categoryinfo || []
                            
                        }
                })
            },
            cellClick( data_){
                let self = this 
                data_.hserviefp = 1
                $.click_news_into_particular( data_)
            },
            netWorking( url ,method,header,dataParams,callback ){
                let self = this,
                operatorO = {
                    url:url,
                    type:method,
                    dataType:'json',
                    data:dataParams,
                    success:function (argument,message,xhr) {
                        callback(xhr)
                    },
                    error:function( xhr,error){ callback(xhr) }
                } 
                operatorO.headers = header
                $.ajax(operatorO)
            },
            /**
            ********************************************************************************
            */
        }
    }
</script>

<style scoped lang="less">
    .handy-service{
        width: 100%;
        .category-content{
            width: 100%;
            padding: 0 15px;
            .category-title{
                margin: 15px 0 0 0;
                font-size: 17px;
                padding: 1px 5px;
                text-align: left;
                border-left: 2px solid #000;
            }
            .cell{
                display: inline-block;
                margin: 15px 0;
                width: calc( (100%)/4 );
                text-align: center;
                font-size: 13px;
                img{
                    width: 40px;
                }
                p{
                    margin:5px;
                }
            }
        }
    }

</style>
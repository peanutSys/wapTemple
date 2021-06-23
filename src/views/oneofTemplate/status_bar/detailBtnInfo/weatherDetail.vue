<template>
    <div class="weather-exhibition">
        <img class="weather-bgimg" :src="bgimg">

        <div class="all-weather">
            <div class="today-weather">
                <strong>{{ today_data.city}}</strong>
                <p>{{ today_data.weather}}</p>
                <span>{{ today_data.temperature+'°C'}}</span>
            </div>
            <div class="all_weather" 
                v-for='(aval,akey) in all_weather_data'
                :key='akey'>
                <span class="week">{{'星期'+ week_trans(aval.week) }}</span>
                <span class="wea" v-if='akey != 0'>{{aval.dayweather}}</span>
                <span class="night">{{aval.nighttemp+'°C'}}</span>
                <span class="day">{{aval.daytemp+'°C'}}</span>
                <div  class="today-other" v-if='akey == 0'>
                    <div class="title" 
                        v-for='(a,k) in 2'
                        :key='a'>
                        <span >{{ k==1 ? today_data.windpower+'m/s' :'风力'}}</span>
                        <span >{{ k==1 ? today_data.winddirection :'风向'}}</span>
                        <span >{{ k==1 ? today_data.humidity :'湿度'}}</span>
                        <span >{{ k==1 ? ( today_data.reporttime.split(' ')[1] ) :'时间'}}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script type="text/javascript">

    export default {
        data () {
            return {  
                pageWidth:375,

                bgimg:require('static/img/weatherbg.png'),
                today_data:'',
                all_weather_data:[],

                week_trans:( val_)=>{
                    return val_ == '1' ? '一':
                    val_ == '2' ? '二':
                    val_ == '3' ? '三':
                    val_ == '4' ? '四':
                    val_ == '5' ? '五':
                    val_ == '6' ? '六':
                    val_ == '7' ? '日': ''  
                }

                // weather_img:{
                //     //雨
                //     h:'http://shixiantest.oss-cn-hangzhou.aliyuncs.com/48/posts/2021/01/08/7d9db27fac6d66b5c47503438e5058b9.png',
                //     //晴
                //     c:'http://shixiantest.oss-cn-hangzhou.aliyuncs.com/48/posts/2021/01/08/a8b9c376cc7b418721b55d7ee67b6c5c.png',
                //     //多云
                //     g:'http://shixiantest.oss-cn-hangzhou.aliyuncs.com/48/posts/2021/01/08/0adc3900f0a20ff85bad2206eab907b1.png'
                // }
            }
        },
        watch:{},components:{},
        props: ['cdata'],
        created(){
            let self = this
            self.today_data = self._props.cdata
        },
        mounted(){
            let self = this
            self.get_weather_all()          
        },
        methods:{
            get_weather_all(){
                let self = this,
                putTogether = (...args)=>{
                    let params = ''
                    args.forEach( (item)=>{
                        params+= item.name + '=' +item.value+'&'
                    })
                    return params
                },
                weather_url = $.clinet_host_weather+ '/v3/weather/weatherInfo?',
                url_params = putTogether( 
                    {name:'city',value:$.clinet_CityKey},
                    {name:'key',value:$.clinet_GDWeatherKey},
                    {name:'extensions',value:'all'},
                )
                self.netWorking( weather_url+url_params,'get','',(xhr)=>{
                    if ( xhr.responseJSON && xhr.responseJSON.forecasts){       
                        let t_ = xhr.responseJSON.forecasts[0] || {}
                        self.all_weather_data = t_['casts'] || []
                    }
                })
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
    @all_weather_tc:calc( 100%/4);
    @border_oneside:1px solid #cdcdcd;
    .weather-exhibition{
        width: @width_100;
        height: @height_100;
        position: relative;
        .weather-bgimg{
            @ab_postion();
            width: @width_100;
            height: @height_100;
        }
        .all-weather{
            @ab_postion();
            width: @width_100;
            margin-top: 90px;
            .today-weather{
                width: @width_100;
                color:@text_color;
                text-align: center;
                margin-bottom: 50px;
                strong{
                    font-size: 20px;
                }
                p{
                    margin-top: 10px;
                }
                span{
                    display: inline-block;
                    margin-top: 15px;
                    font-size: 50px;
                }
            }
            .all_weather{
                padding: 20px 20px 0;
                width: @width_100;
                .day{
                    float: right;
                    margin-right: 50px;
                }
                .night{
                    float: right;
                }
                .wea{
                    margin-left: 50px;
                }
                .today-other{
                    width: @width_100;
                    font-size: 0;
                    padding: 20px 0;
                    margin-top: 20px;
                    border-top: @border_oneside;
                    border-bottom: @border_oneside;
                    .title {
                        &:nth-of-type(2){
                            margin-top: 20px;
                        }
                        span{
                            display: inline-block;
                            font-size: 13px;
                            width: @all_weather_tc;
                            text-align: center;
                        }
                    }
                }
            }

        }

    }

</style>
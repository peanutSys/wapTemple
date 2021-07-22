<template>
    <div :class='"leader-gather "+randomMark'>
        <div 
            v-for='(val,key) in gatherdata' 
            :key='key' 
            class="gather" 
            @click.stop='click_which_content( key,val)'
            >
            <img class="header" :src="val.logo">
            <span class="name">{{val.name}}</span>
        </div>
    </div>
</template>

<script type="text/javascript">

    export default {
        data () {
            return {  
                gatherdata:[],
                randomMark:(new Date()).getTime(),
            }
        },
        watch:{
            leaderGaData:function (newVal,oldVal ) {
               let self = this
               self.gatherdata = newVal
               self.click_which_content( 0,newVal[0] || {})
            }
        },
        created(){
            let self = this
            self.gatherdata = self._props.leaderGaData
        },
        mounted(){
            let self = this
            self.click_which_content( 0,self.gatherdata[0] || {})
        },
        props: ['leaderGaData'],
        components:{
        },
        methods:{
            click_which_content( key,val){
                let self = this
                self.$emit('whichClick',val)

                let $lg = $('.leader-gather'+self.getRandomClassName() )
                $lg.find('.gather').removeClass('border-click')
                $lg.find('.gather').eq(key).addClass('border-click')

            },
            getRandomClassName(){
                let self = this
                return '.'+self.randomMark
            },

            /**
            ********************************************************************************
            */
        }
    }
</script>

<style scoped lang="less">
    @images:~static/img;
    @net_image:'http://shixiantest.oss-cn-hangzhou.aliyuncs.com/57/posts/2021/03/08/8b3e638efeff48d55fca3de66ac9d2f0.png';
    .operator{
        .display(@v){
            display: @v;
        }
        .margin(...){
            margin:@arguments;
        }
        .padding(...){
            padding:@arguments;
        }
        .width(@v){
            width: @v;
        }
        .height(@v){
            height: @v;
        }
        .borderBottom(...){
            border-bottom:@arguments;
        }
        .calc(@selec,@total,@value){
            @{selec}:calc( @total - @value );
        }
        .color(@selec,@value){
            @{selec}:@value;
        }
    }
    .leader-gather{
        .operator > .color(background,#fff);
        position: absolute;
        top: 0;
        .operator > .width(100%);
        .gather{
            .operator > .display(inline-block);
            .operator > .margin(12px);
            .operator > .calc(width,50%,25px); 
            text-align: center;
            background: url('@{net_image}') no-repeat;
            background-size: cover;
            border-radius: 7px;
            color:#fff;
            .operator > .padding(10px);
            .header{
                .operator > .height(80px);
                vertical-align: middle;
            }
            .name{
                display: inline-block;
                vertical-align: middle;
            }
        }
    }
    .border-click{
        .operator > .borderBottom(5px solid #acacac);
    }

</style>
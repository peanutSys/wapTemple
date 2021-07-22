<template>
    <div :class='"classroom "+randomMark'>
        <div class="top">
            <img :src="gatherdata.cover" class="cover-img">
            <img :src="gatherdata.logo" class="logo-img">
        </div>
        <div class="middle">
            <div 
                v-for='(val,key) in gatherdata.block' 
                :key='key' 
                class="grade" 
                @click.stop='click_which_content( key,val)'
                >
                <span>{{ val.name }}</span>
            </div>
        </div>
    </div>
</template>

<script type="text/javascript">

    export default {
        data () {
            return {  
                gatherdata:{},
                randomMark:(new Date()).getTime(),
            }
        },
        watch:{
            classroomData:function (newVal,oldVal ) {
                let self = this
                self.gatherdata = newVal
                self.click_which_content( 0,newVal || {})
            }
        },
        created(){
            let self = this
            self.gatherdata = self._props.classroomData
        },
        mounted(){
            let self = this
            self.click_which_content( 0,self.gatherdata && self.gatherdata['block'][0] || {})
            self.get_header_img()
        },
        props: ['classroomData'],
        components:{
        },
        methods:{
            click_which_content( key,val){
                let self = this
                self.$emit('whichClick',val)

                let $lg = $('.classroom'+self.getRandomClassName() )
                $lg.find('.grade').removeClass('border-click')
                $lg.find('.grade').eq(key).addClass('border-click')
            },
            get_header_img(){
                let self = this
                var headerImg = new Image()
                headerImg.src = self.gatherdata.cover
                headerImg.onload = function(){
                    self.$emit('crImgLoaded')
                }
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
    @contentbg:#fff;
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
    .classroom{
        background: @contentbg;
        position: absolute;
        top: 0;
        .top{
            position: relative;
            .operator > .height(fit-content);
            .operator > .width(100%);
            .cover-img{
                .operator > .width(100%);
            } 
            .logo-img{
                .operator > .width(100px);
                position: absolute;
                top: 0;
                bottom: 0;
                right: 0;
                left: 0;
                margin: auto;
                border-radius: 50px;
            }
        }
        .middle{
            text-align: center;
            white-space: nowrap;
            .grade{
                .operator > .display(inline-block);
                .operator > .margin(10px 20px);
                .operator > .padding(0 0 5px 0);
            }
        }
    }
    .border-click{
        .operator > .borderBottom(2px solid #3FB14F);
        .operator > .color(color,#3FB14F);
    }

</style>
<template>
    <div v-on:click="onClick" class="leaseplanButton">
        <div class="leaseplanButton-label">{{ text }}</div>
        <div class="icon-holder">
                <IconBase width="70%" height="60%" viewBox="0 0 500 500" icon-name="location"><Location :is="child_component"></Location></IconBase>
        </div>
            <!--<IconBase icon-name="location"><Location :is="child_component"></Location></IconBase>-->
    </div>
</template>

<script>
    import IconBase from '../../components/IconBase';
    import Location from '../../components/icons/Location'
    import Bicycle from '../../components/icons/bicycle'

    export default {
        name: "leaseplanButtonOrange",
        props:['text', 'iconName'],
        components:{
            IconBase,
            Location,
            Bicycle
        },
        data(){
            return {
                child_component: this.iconName,
                // width: this.width,
                // height: this.height
            }
        },
        methods: {
            onClick: function () {
                //let the algorithm do his job
                console.log("let the algorithm do his job");
            }
        }
    }
</script>

<style scoped>

    .leaseplanButton{
        width: 46%;
        background-color: #fe8d12;
        box-shadow: grey 3px 3px;
        -webkit-border-radius: 6px;
        -moz-border-radius: 6px;
        border-radius: 6px;
        position: relative;
        float: left;
    }
    .leaseplanButton .leaseplanButton-label{
        font-size: 20px;
        font-weight: bold;
        font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
        color: white;
        width: 100%;
        text-align: center;
        margin: 5% 0px;
    }

    .icon-holder{
        padding: 10% 15% 20% 15%;
        text-align: center;
    }
</style>
<template>
    <div v-on:click="onClick" class="leaseplanButton">
        <div class="leaseplanButton-label">{{ textName }}</div>
        <div class="icon-holder">
                <IconBase height="100%" :width="customWidth" :viewBox="customViewBox" icon-name="location"><Location :is="child_component"></Location></IconBase>
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
        props:['textName', 'iconName', 'customViewBox', 'customWidth'],
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
        /*height: 201px;*/

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
        margin: 10% 0px 10px;
    }

    .icon-holder{
        padding: 0% 15% 20% 15%;
        text-align: center;
    }
</style>
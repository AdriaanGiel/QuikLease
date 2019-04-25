<template>
    <div v-on:click="onClick" class="leaseplanButton">
        <div>{{ text }}</div>
        <span>
            <IconBase icon-name="location"><Location :is="child_component"></Location></IconBase>
            <!--<IconBase icon-name="location"><Location :is="child_component"></Location></IconBase>-->
        </span>
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
        width: 160px;
        height: 160px;
        background-color: #fe8d12;
        box-shadow: grey 3px 3px;
        -webkit-border-radius: 6px;
        -moz-border-radius: 6px;
        border-radius: 6px;
        position: relative;
        float: left;
    }

    .leaseplanButton >>> div{
        font-size: 20px;
        font-weight: bold;
        font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
        color: white;
        width: 100%;
        text-align: center;
        position: absolute;
        top: 12%;
    }

    .leaseplanButton >>> span{
        display: block;
        width: 100%;
        height: 75%;
        margin: 19% 0px auto auto;
    }
</style>
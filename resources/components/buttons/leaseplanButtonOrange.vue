<template>
    <div v-on:click="onClick" class="leaseplanButton">
<<<<<<< HEAD
        <div>{{ text }}</div>
        <div class="icon-holder">
                <IconBase width="70%" height="60%" viewBox="0 0 500 500" icon-name="location"><Location :is="child_component"></Location></IconBase>
=======
        <div class="leaseplanButton-label">{{ textName }}</div>
        <div class="icon-holder">
                <IconBase height="100%" :width="customWidth" :viewBox="customViewBox" icon-name="location"><Location :is="child_component"></Location></IconBase>
>>>>>>> refs/remotes/origin/master
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
<<<<<<< HEAD
        height: 201px;
=======
>>>>>>> refs/remotes/origin/master
        background-color: #fe8d12;
        box-shadow: grey 3px 3px;
        -webkit-border-radius: 6px;
        -moz-border-radius: 6px;
        border-radius: 6px;
        position: relative;
        float: left;
    }
<<<<<<< HEAD


    .leaseplanButton >>> div{
=======
    .leaseplanButton .leaseplanButton-label{
>>>>>>> refs/remotes/origin/master
        font-size: 20px;
        font-weight: bold;
        font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
        color: white;
        width: 100%;
        text-align: center;
        margin: 10% 0px 10px;
    }

    .icon-holder{
<<<<<<< HEAD
        padding: 20% 13%;
        text-align: center;
        /*margin-top: 20%;*/
=======
        padding: 0% 15% 20% 15%;
        text-align: center;
>>>>>>> refs/remotes/origin/master
    }
</style>
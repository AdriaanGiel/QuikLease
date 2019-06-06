<template>
    <div class="unlockBike-holder">
        <div class="icon-holder">
            <IconBase width="100%" height="60%" viewBox="0 0 500 500" icon-name="location"><Bicycle fill="orange"></Bicycle></IconBase>
        </div>
        <div>Fiets nummer</div>
        <div><b>0842014</b></div>
        <div class="unlock_btn"><b>Ontgrendel</b></div>
    </div>
</template>

<script>
    import IconBase from '../../components/IconBase';
    import Bicycle from '../../components/icons/bicycle'

    export default {
        name: "unlockBike",
        props: [],
        components:{
            IconBase,
            Bicycle,
        },
        data(){
            return {

            }
        }
    }
</script>

<style scoped>
    .unlockBike-holder{
        border-radius: 8px;
        border: 2px solid #fe8d12;
        width: 25%;
        text-align: center;
        padding: 0px 5px 5px 5px;
        margin: 4% 8% 4% 0%;
        float: left;
        font-size: 16px;
    }
    .unlock_btn{
        color: white;
        background-color: #fe8d12;
        width: 85%;
        border-radius: 3px;
        margin: 9px auto;
        display: block;
        padding: 8px;
    }
    .icon-holder{
        margin: 0px auto;
        width: 35%;
        text-align: center;
    }
</style>
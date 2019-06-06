<template>
    <ul class="location">
        <li class="custom-list-item name" ><span v-text="locationData.name"> </span><a href="#"><icon-base style="float: right;" width="12%" height="100%" viewBox="0 0 270 270" icon-name="arrow-right-2"><Arrowright fill="grey"></Arrowright></icon-base></a></li>
        <li class="custom-list-item type" v-text="locationData.type"></li>
        <li class="custom-list-item amount" v-text="locationData.amount"></li>
    </ul>
</template>

<script>
    import IconBase from "../../components/IconBase";
    import Arrowright from '../../components/icons/arrow-right-2'

    export default {
        name: "locationButton",
        components: {IconBase, Arrowright},
        props: ["location"],
        data: function () {
            return {
               locationData: this.location
            }
        }
    }
</script>

<style scoped>

    .location{
        padding: 5% 0%;
    }
    .location >>> .name{
        font-size: 30px;
    }
    .location >>> .type{
        font-size: 18px;
        border-bottom: 1px solid grey;
    }
    .location >>> .amount{
        font-size: 18px;
        padding: 14px 0px 0px 0px;
    }

    .custom-list-item{
        list-style: none;
    }


</style>
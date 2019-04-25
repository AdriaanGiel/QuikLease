<template>
    <div v-on:click="onStartRoute" class="startRouteBtn"><div>{{ text }}</div></div>
</template>

<script>
    export default {
        name: "Start",
        data: function () {
            return {
                //put data here
                text: "Ophalen Starten"
            }
        },
        methods: {
            onStartRoute: function () {
                //let the algorithm do his job
                console.log("Geklikt op ophalen starten");
            }
        }
    };
</script>

<style scoped>

    .startRouteBtn{
        background-color: white;
        width: 354px;
        height: 160px;
        border: 5px solid #fe8d12;
        box-shadow: grey 3px 3px;
        -webkit-border-radius: 6px;
        -moz-border-radius: 6px;
        border-radius: 6px;
        text-align: center;
        vertical-align: center;
        position: relative;
    }
    .startRouteBtn >>> div{
        font-size: 37px;
        font-weight: bold;
        font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
        color: #fe8d12;
        position: absolute;
        top: 36%;
        left: 8%;
    }

</style>
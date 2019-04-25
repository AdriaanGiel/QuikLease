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

</style>
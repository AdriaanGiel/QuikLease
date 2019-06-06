<template>
    <ol class="breadcrumb">
        <li><a href="#">Home</a></li>
        <li><a href="#">Library</a></li>
        <li class="active">Data</li>
    </ol>
</template>

<script>
    import Bike from '../models/Bike';
    export default {
        name: "login",
        data(){
            return {
                bikes:[]
            }
        },
        async beforeCreate(){
          this.bikes = await Bike.all();
        }
    }
</script>

<style scoped>

</style>
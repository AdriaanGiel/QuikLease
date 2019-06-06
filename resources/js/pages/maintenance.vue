<template>
    <section>
        <div class="container">
            <div class="row">
                <div class="col-sm-12 col-md-12 col-lg-12">
                    <quicklease_nav></quicklease_nav>
                </div>
            </div>
        </div>
        <quicklease_header custom-width="100%" custom-view-box="0 40 500 380" textName="Onderhoud" iconName="bicycle"></quicklease_header>
        <div class="container">
            <div class="row">
                <div class="col-sm-12 col-md-12 col-lg-12">
                    <unlockBike></unlockBike>
                    <unlockBike></unlockBike>
                    <unlockBike></unlockBike>
                    <unlockBike></unlockBike>
                    <unlockBike></unlockBike>
                    <unlockBike></unlockBike>
                    <unlockBike></unlockBike>
                    <unlockBike></unlockBike>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
    import quicklease_nav from "../../components/quicklease-nav";
    import quicklease_header from "../../components/quicklease_header";
    import unlockBike from "../../components/buttons/unlockBike";
    import Logout from "../../components/buttons/logout";

    export default {
        name: "maintenance",
        components:{
            quicklease_nav,
            quicklease_header,
            unlockBike,
            Logout
        },
    }
</script>

<style scoped>

</style>
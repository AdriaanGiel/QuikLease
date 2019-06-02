<template>
    <section>
        <div class="container">
            <div class="row">
                <div class="col-sm-12 col-md-12 col-lg-12">
                    <quicklease_nav></quicklease_nav>
                </div>
            </div>
        </div>
        <quicklease_header></quicklease_header>
    </section>
</template>

<script>
    import quicklease_nav from "../../components/quicklease-nav";
    import quicklease_header from "../../components/quicklease_header";
    import Logout from "../../components/buttons/logout";

    export default {
        name: "locations",
        components:{
            quicklease_nav,
            quicklease_header,
            Logout
        },
    }
</script>

<style scoped>

</style>
<template>
    <section>
        <div class="container">
            <div class="row">
                <div class="col-sm-12 col-md-12 col-lg-12">
                    <div class="logo-holder logo-spacer">
                        <iconbase class="logo" width="100%" height="100%" viewBox="0 0 803 903" icon-name="Logo"><logo></logo></iconbase>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-sm-7 remove-padding">
                    <div class="row">
                        <div class="col-sm-12 col-md-12 col-lg-12">
                            <start></start>
                        </div>
                    </div>
                    <div class="row margin-top-30">
                        <div class="col-sm-12 col-md-12 col-lg-12 remove-padding">
                            <div>
                                <leaseplanButtonOrange class="leaseplanButtonLeft" width="90" height="90" custom-width="75%" custom-view-box="0 0 500 500" textName="Locatie" iconName="Location"></leaseplanButtonOrange>
                                <leaseplanButtonOrange class="" width="90" height="90" textName="Onderhoud" custom-width="100%" custom-view-box="0 40 500 380" iconName="bicycle" viewBox="bicycle"></leaseplanButtonOrange>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-sm-5">
                    <locations_holder></locations_holder>
                </div>
            </div>
        </div>
        <div class="google-map">
            <iframe src="https://snazzymaps.com/embed/160252" width="100%" height="500px" style="border:none;"></iframe>

        </div>
        <Logout></Logout>
        <pop-up></pop-up>
    </section>
</template>


<script>
    import logo from '../../components/icons/Logo'
    import iconbase from "../../components/IconBase";
    import quicklease_nav from "../../components/quicklease-nav";
    import leaseplanButtonOrange from '../../components/buttons/leaseplanButtonOrange';
    import start from '../../components/buttons/start';
    import locations_holder from '../../components/locations_holder';
    // import image from "../../../resources/images/Logo.png"
    import GoogleMap from "../../components/GoogleMap";
    import CustomHeader from "../../components/Custom-Header";
    import Logout from "../../components/buttons/logout";
    import PopUp from "../../components/PopUp";

    export default {
        name: "dashboard",
        props: ['url'],
        components:{
            CustomHeader,
            logo,
            iconbase,
            leaseplanButtonOrange,
            start,
            GoogleMap,
            locations_holder,
            quicklease_nav,
            Logout,
            loactions_holder,
            PopUp
        },
        methods: {

        },
        data() {
            return {
                images:{
                    image: 'https://jp.vuejs.org/images/logo.png'
                }
            }
        }
    }



</script>

<style scoped>

    .leaseplanButtonLeft{
        margin-right: 30px;
    }
    .nav img{
        display: block;
        margin: 0px auto;
    }
    .google-map{
        margin-top: 60px;
    }

    .logo-spacer{
        margin: 50px auto;
    }


</style>
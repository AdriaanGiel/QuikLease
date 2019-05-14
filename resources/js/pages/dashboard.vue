<template>
    <section>
        <div class="container">
            <div class="row">
                <div class="col-sm-12 col-md-12 col-lg-12">
                    <CustomHeader></CustomHeader>
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
                                <leaseplanButtonOrange class="leaseplanButtonLeft" width="90" height="90" text="Locatie" iconName="Location"></leaseplanButtonOrange>
                                <leaseplanButtonOrange class="" width="90" height="90" text="Onderhoud" iconName="bicycle"></leaseplanButtonOrange>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-sm-5">
                    <locations_holder></locations_holder>
                    <div style="
    position: absolute;
    bottom: 0px;
" class="click-button" v-on:click="onClick">
                        verder
                    </div>
                </div>
            </div>
        </div>
        <div class="google-map">
            <google-map />
        </div>
        <Logout></Logout>
    </section>
</template>


<script>
    import * as Vue from "vue";
    import leaseplanButtonOrange from '../../components/buttons/leaseplanButtonOrange';
    import start from '../../components/buttons/start';
    import locations_holder from '../../components/locations_holder';
    // import image from "../../../resources/images/Logo.png"
    import GoogleMap from "../../components/GoogleMap";
    import CustomHeader from "../../components/Custom-Header";
    import Logout from "../../components/buttons/logout";

    export default {
        name: "dashboard",
        props: ['url'],
        components:{
            leaseplanButtonOrange,
            start,
            GoogleMap,
            locations_holder,
            CustomHeader,
            Logout
        },
        methods: {
            onClick: function (index) {
                //let the algorithm do his job
                // console.log(locations[index].id);
                console.log(event.currentTarget.id)
                document.getElementById('id1').style.color = 'red'
            }
        },
        data: function () {
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
    .header img{
        display: block;
        margin: 0px auto;
    }
    .google-map{
        margin-top: 60px;
    }

</style>
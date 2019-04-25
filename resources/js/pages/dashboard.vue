<template>
    <section>
        <div class="container">
            <div class="row">
                <div class="col-sm-12 col-md-12 col-lg-12">
                    <div class="header">
                        <!--<img :src="require('~../../../public/images/Logo_66px.png')" alt="QuickLeaseLogo" height="66" width="66"/>-->
                        <!--<img :src="images.image" alt="QuickLeaseLogo" height="66" width="66"/>-->
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-sm-6 remove-padding">
                    <div class="row">
                        <div class="col-sm-12 col-md-12 col-lg-12">
                            <start></start>
                        </div>
                    </div>
                    <div class="row margin-top-30">
                        <div class="col-sm-12 col-md-12 col-lg-12 remove-padding">
                            <leaseplanButtonOrange class="leaseplanButtonLeft" width="90" height="90" text="Locatie" iconName="Location"></leaseplanButtonOrange>
                            <leaseplanButtonOrange width="90" height="90" text="Onderhoud" iconName="bicycle"></leaseplanButtonOrange>
                        </div>
                    </div>
                </div>
                <div class="col-sm-1"></div>
                <div class="col-sm-5">
                    <loactions_holder></loactions_holder>
                </div>
            </div>
        </div>
        <div class="google-map">
            <google-map />
        </div>
    </section>
</template>


<script>
    import * as Vue from "vue";
    import leaseplanButtonOrange from '../../components/buttons/leaseplanButtonOrange';
    import start from '../../components/buttons/start';
    import loactions_holder from '../../components/locations_holder';
    // import image from "../../../resources/images/Logo.png"
    import GoogleMap from "../../components/GoogleMap";

    export default {
        name: "dashboard",
        props: ['url'],
        components:{
            leaseplanButtonOrange,
            start,
            GoogleMap,
            loactions_holder
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
    .leaseplanButtonLeft{
        margin-right: 30px;
    }

    .header{
        margin: 40px 0px 40px 0px;
    }
    .header img{
        display: block;
        margin: 0px auto;
    }
    .google-map{
        margin-top: 40px;
    }

</style>
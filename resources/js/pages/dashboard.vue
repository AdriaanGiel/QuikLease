<template>
    <section>
        <div class="container">
            <div class="row">
                <div class="col-sm-12 col-md-12 col-lg-12">
<<<<<<< HEAD
                    <CustomHeader></CustomHeader>
=======
                    <div class="logo-holder logo-spacer">
                        <iconbase class="logo" width="100%" height="100%" viewBox="0 0 803 903" icon-name="Logo"><logo></logo></iconbase>
                    </div>
>>>>>>> refs/remotes/origin/master
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
<<<<<<< HEAD
                                <leaseplanButtonOrange class="leaseplanButtonLeft" width="90" height="90" text="Locatie" iconName="Location"></leaseplanButtonOrange>
                                <leaseplanButtonOrange class="" width="90" height="90" text="Onderhoud" iconName="bicycle"></leaseplanButtonOrange>
=======
                                <leaseplanButtonOrange class="leaseplanButtonLeft" width="90" height="90" custom-width="75%" custom-view-box="0 0 500 500" textName="Locatie" iconName="Location"></leaseplanButtonOrange>
                                <leaseplanButtonOrange class="" width="90" height="90" textName="Onderhoud" custom-width="100%" custom-view-box="0 40 500 380" iconName="bicycle" viewBox="bicycle"></leaseplanButtonOrange>
>>>>>>> refs/remotes/origin/master
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-sm-5">
                    <locations_holder></locations_holder>
<<<<<<< HEAD
                    <div style="
    position: absolute;
    bottom: 0px;
" class="click-button" v-on:click="onClick">
                        verder
                    </div>
=======
>>>>>>> refs/remotes/origin/master
                </div>
            </div>
        </div>
        <div class="google-map">
            <iframe src="https://snazzymaps.com/embed/160252" width="100%" height="500px" style="border:none;"></iframe>

            <google-map />
        </div>
        <Logout></Logout>
    </section>
</template>


<script>
    import logo from '../../components/icons/Logo'
    import iconbase from "../../components/IconBase";
    import quicklease_nav from "../../components/quicklease-nav";
    import leaseplanButtonOrange from '../../components/buttons/leaseplanButtonOrange';
    import start from '../../components/buttons/start';
    import locations_holder from '../../components/locations_holder';
<<<<<<< HEAD
    // import image from "../../../resources/images/Logo.png"
    import GoogleMap from "../../components/GoogleMap";
    import CustomHeader from "../../components/Custom-Header";
    import Logout from "../../components/buttons/logout";

=======
    import GoogleMap from "../../components/GoogleMap";
    import Logout from "../../components/buttons/logout";
>>>>>>> refs/remotes/origin/master
    export default {
        name: "dashboard",
        props: ['url'],
        components:{
            logo,
            iconbase,
            leaseplanButtonOrange,
            start,
            GoogleMap,
            locations_holder,
<<<<<<< HEAD
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
=======
            quicklease_nav,
            Logout
        },
        methods: {
            // onClick: function (index) {
            //     //let the algorithm do his job
            //     // console.log(locations[index].id);
            //     console.log(index);
            //
            //     console.log('targetid = ' + event.target.id);
            //     console.log("event id = " + event.currentTarget.id);
            //     let targetId = event.currentTarget.id;
            //
            //
            //     let para = document.querySelector('.locations');
            //     console.log("para = " + para);
            //     let elemtentPosition = document.getElementById('locations').style.left;
            //     console.log('element position = ' + elemtentPosition);
            //     slide(elemtentPosition);
            // }
>>>>>>> refs/remotes/origin/master
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
<<<<<<< HEAD

    .leaseplanButtonLeft{
        margin-right: 30px;
    }
    .header img{
=======
    .leaseplanButtonLeft{
        margin-right: 30px;
    }
    .nav img{
>>>>>>> refs/remotes/origin/master
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
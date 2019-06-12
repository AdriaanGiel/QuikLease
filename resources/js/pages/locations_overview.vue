<template>
    <section>
        <div class="container">
            <div class="row">
                <div class="col-sm-12 col-md-12 col-lg-12">
                    <quicklease_nav></quicklease_nav>
                </div>
            </div>
        </div>
        <quicklease_header custom-width="75%" custom-view-box="0 0 500 500" textName="Location" iconName="Location"></quicklease_header>
        <div class="container">
            <div class="row">
                <div class="col-sm-12 col-md-12 col-lg-12">
                    <location-button @click="$router.push({ name: 'single-location', params: { id: location.id } })" class="location-overview-grid location-button-padding" :location="location" v-for="location in locations"></location-button>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
    import quicklease_nav from "../../components/quicklease-nav";
    import quicklease_header from "../../components/quicklease_header";
    import LocationButton from "../../components/buttons/locationButton";
    import Logout from "../../components/buttons/logout";
    import School from "../models/School";

    export default {
        name: "locations",
        components:{
            quicklease_nav,
            quicklease_header,
            LocationButton,
            Logout
        },
        data: function () {
            return {
                locations: []
            }
        },
        beforeCreate(){
            School.all().then((result) => {
                console.log(result.data);
                this.locations = result.data.schools.map((school) => {
                    school.type = 'HogeSchool locatie';
                    school.amount = school.BikeRacks.length;
                    return school;
                });

            });

        }
    }
</script>

<style scoped>
    .location-overview-grid{
        width: 50%;
        float: inherit;
    }
    .location-button-padding{
        padding: 40px 50px 0px 40px;
    }
</style>
<template>
    <section>
        <div class="container">
            <div class="row">
                <div class="col-sm-12 col-md-12 col-lg-12">
                    <quicklease_nav></quicklease_nav>
                </div>
            </div>
        </div>
        <quicklease_header textName="Ophalen" iconName="bicycle"></quicklease_header>
        <div class="container">
            <div class="row">
                <div class="col-sm-5 col-md-5 col-lg-5">
                    <location-button class="location-overview-grid" :location="location" v-for="location in locations"></location-button>
                </div>
                <div class="col-sm-7 col-md-7 col-lg-7">
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
    import LocationButton from "../../components/buttons/locationButton";
    import Logout from "../../components/buttons/logout";

    export default {
        name: "collect",
        components:{
            quicklease_nav,
            quicklease_header,
            unlockBike,
            LocationButton,
            Logout
        },
        data: function () {
            return {
                newarray: [],
                locations: [{
                    id: "1",
                    name: "Wijnhaven",
                    type: "Hogeschool locatie",
                    amount: "15 fietsen ophalen"
                },
                    {
                        id: "2",
                        name: "Museumpark",
                        type: "Hogeschool locatie",
                        amount: "45 fietsen brengen"
                    },
                    {
                        id: "3",
                        name: "Kralingse Zoom",
                        type: "Hogeschool locatie",
                        amount: "60 fietsen brengen"
                    }, {
                        id: "4",
                        name: "Wijnhaven",
                        type: "Hogeschool locatie",
                        amount: "13 fietsen ophalen"
                    }, {
                        id: "5",
                        name: "Museumpark",
                        type: "Hogeschool locatie",
                        amount: "12 fietsen ophalen"
                    }, {
                        id: "6",
                        name: "Wijnhaven",
                        type: "Hogeschool locatie",
                        amount: "28 fietsen ophalen"
                    }, {
                        id: "7",
                        name: "Wijnhaven",
                        type: "Hogeschool locatie",
                        amount: "6 fietsen ophalen"
                    }, {
                        id: "8",
                        name: "Museumpark",
                        type: "Hogeschool locatie",
                        amount: "17 fietsen ophalen"
                    }, {
                        id: "9",
                        name: "Museumpark",
                        type: "Hogeschool locatie",
                        amount: "17 fietsen ophalen"
                    }, {
                        id: "10",
                        name: "Museumpark",
                        type: "Hogeschool locatie",
                        amount: "17 fietsen ophalen"
                    }, {
                        id: "11",
                        name: "Museumpark",
                        type: "Hogeschool locatie",
                        amount: "17 fietsen ophalen"
                    }, {
                        id: "12",
                        name: "Museumpark",
                        type: "Hogeschool locatie",
                        amount: "17 fietsen ophalen"
                    }, {
                        id: "13",
                        name: "Museumpark",
                        type: "Hogeschool locatie",
                        amount: "17 fietsen ophalen"
                    }, {
                        id: "14",
                        name: "Museumpark",
                        type: "Hogeschool locatie",
                        amount: "17 fietsen ophalen"
                    }, {
                        id: "15",
                        name: "Museumpark",
                        type: "Hogeschool locatie",
                        amount: "17 fietsen ophalen"
                    }, {
                        id: "16",
                        name: "Museumpark",
                        type: "Hogeschool locatie",
                        amount: "17 fietsen ophalen"
                    }
                ]
            }
        }
    }
</script>

<style scoped>
    .unlockBike-holder{
        width: 41%;
    }
    .location{
        padding: 15% 8%;
    }
</style>
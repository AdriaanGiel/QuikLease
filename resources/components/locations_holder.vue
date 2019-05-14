<template>
    <div class="locations_holder">
        <ul id="locations" class="clearfix">
            <li class="float-left custom-list-item-holder custom-list-item">
                <ul>
                    <li class="custom-list-item">1.1</li>
                    <li class="custom-list-item">1.2</li>
                    <li class="custom-list-item">1.3</li>
                </ul>
            </li>
            <li class="float-left custom-list-item-holder custom-list-item">
                <ul>
                    <li class="custom-list-item">2.1</li>
                    <li class="custom-list-item">2.2</li>
                    <li class="custom-list-item">2.3</li>
                </ul>
            </li>
            <li class="float-left custom-list-item-holder custom-list-item">
                <ul>
                    <li class="custom-list-item">3.1</li>
                    <li class="custom-list-item">3.2</li>
                    <li class="custom-list-item">3.3</li>
                </ul>
            </li>
        </ul>
        <!--<ul id="locations">-->
            <!--<li class="custom-list-item" v-for="(location, index) in locations" @click="onClick(index)" v-bind:id="location.id">-->
                <!--<div :key="index">-->
                    <!--<div class="location-name clearfix">-->
                        <!--&lt;!&ndash;<div>{{ location.id }}</div>&ndash;&gt;-->
                        <!--&lt;!&ndash;<div>{{ index }}</div>&ndash;&gt;-->
                        <!--<div class="name"> {{ location.name }}</div>-->
                        <!--<div class="arrow">&ndash;&gt;</div>-->
                    <!--</div>-->
                    <!--<div class="location-type"> {{ location.type }}</div>-->
                    <!--<div class="bicycle-amount">{{ location.amount }}</div>-->
                <!--</div>-->
            <!--</li>-->
        <!--</ul>-->
        <!--<ul>-->
            <!--<li class="custom-list-item" v-for="(location, index) in locations" @click="onClick(index)" v-bind:id="location.id">-->
                <!--<div :key="index">-->
                    <!--<div class="location-name clearfix">-->
                        <!--&lt;!&ndash;<div>{{ location.id }}</div>&ndash;&gt;-->
                        <!--&lt;!&ndash;<div>{{ index }}</div>&ndash;&gt;-->
                        <!--<div class="name"> {{ location.name }}</div>-->
                        <!--<div class="arrow">&ndash;&gt;</div>-->
                    <!--</div>-->
                    <!--<div class="location-type"> {{ location.type }}</div>-->
                    <!--<div class="bicycle-amount">{{ location.amount }}</div>-->
                <!--</div>-->
            <!--</li>-->
        <!--</ul>-->
    </div>
</template>

<script>
    import * as Vue from "vue";

    // import Logo from '../components/icons/Logo'

    export default {
        name: "locations_holder",
        components: { },
        data: function () {
            return {
                locations: [{
                        id: "1",
                        name: "Wijhaven",
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
                    },{
                        id: "4",
                        name: "Wijhaven",
                        type: "Hogeschool locatie",
                        amount: "15 fietsen ophalen"
                    },{
                        id: "5",
                        name: "Wijhaven",
                        type: "Hogeschool locatie",
                        amount: "15 fietsen ophalen"
                    },{
                        id: "5",
                        name: "Wijhaven",
                        type: "Hogeschool locatie",
                        amount: "15 fietsen ophalen"
                    },{
                        id: "5",
                        name: "Wijhaven",
                        type: "Hogeschool locatie",
                        amount: "15 fietsen ophalen"
                    },{
                        id: "5",
                        name: "Wijhaven",
                        type: "Hogeschool locatie",
                        amount: "15 fietsen ophalen"
                    }
                ]
            }
        },
        methods: {
            onClick: function (index) {
                //let the algorithm do his job
                // console.log(locations[index].id);
                console.log(event.currentTarget.id)
                document.getElementById('id1').style.color = 'red'
            }
        }
    }

</script>


<style scoped>
    .locations_holder {
        /*float: right;*/
        /*width: 90%;*/
        /*width: 400px;*/
        box-shadow: grey 3px 3px;
        margin-left: 12px;
        position: absolute;
        width: 100%;
        overflow: hidden;
        height: 400px;
    }

    .click-button{

    }

    .custom-list-item{
        list-style: none;
        /*padding: 24px 24px;*/
    }
    .custom-list-item-holder{
        /*position: absolute;*/
        width: 200px;
        float: left ;
    }

    .float-left ul{
        padding-left: 0px;
    }

    #locations{
        padding-left: 0px;
        /*width: 200px;*/
        width: 1000%;
        height: 400px;
        position: absolute;
    }

    #locations li:nth-child(2){
        left: 200px;
    }

    #locations li:nth-child(3){
        left: 400px;
    }

    .location-name >>> .name {
        float: left;
        font-size: 22px;
    }
    .location-name >>> .arrow {
        float: right;
    }
    .location-type {
        color: grey;
        border-bottom: 1px solid black;
    }
    .bicycle-amount{
        margin-top: 10px;
    }

    ul li:nth-child(3n+4) {
        color: red;
        /*float: right;*/
    }
</style>
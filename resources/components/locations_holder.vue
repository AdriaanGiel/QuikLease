<template>
        <div id="locations_holder" class="locations_holder">
            <ul id="locations" class="clearfix locations">
                <li class="float-left custom-list-item-holder custom-list-item" v-for="(locations) in newarray">
                    <Location-button :location="location" v-for="location in locations"></Location-button>
                </li>
            </ul>
            <div class="arrow point-left" @click="slideRight()">
                <IconBase width="100%" height="100%" viewBox="0 0 803 903" icon-name="arrow-left"><Arrowleft fill="grey"></Arrowleft></IconBase>
            </div>
            <div class="arrow point-right" @click="slideLeft()">
                <IconBase width="100%" height="100%" viewBox="0 0 803 903" icon-name="arrow-right"><Arrowright fill="grey"></Arrowright></IconBase>
            </div>
        </div>
</template>

<script>
    import IconBase from "../components/IconBase";
    import LocationButton from "../components/buttons/locationButton";
    import Arrowleft from '../components/icons/arrow-left'
    import Arrowright from '../components/icons/arrow-right'

    export default {
        name: "locations_holder",
        components: {IconBase, LocationButton, Arrowleft, Arrowright},
        props: ["classname"],
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
                    },{
                        id: "4",
                        name: "Wijnhaven",
                        type: "Hogeschool locatie",
                        amount: "13 fietsen ophalen"
                    },{
                        id: "5",
                        name: "Museumpark",
                        type: "Hogeschool locatie",
                        amount: "12 fietsen ophalen"
                    },{
                        id: "6",
                        name: "Wijnhaven",
                        type: "Hogeschool locatie",
                        amount: "28 fietsen ophalen"
                    },{
                        id: "7",
                        name: "Wijnhaven",
                        type: "Hogeschool locatie",
                        amount: "6 fietsen ophalen"
                    },{
                        id: "8",
                        name: "Museumpark",
                        type: "Hogeschool locatie",
                        amount: "17 fietsen ophalen"
                    },{
                        id: "9",
                        name: "Museumpark",
                        type: "Hogeschool locatie",
                        amount: "17 fietsen ophalen"
                    },{
                        id: "10",
                        name: "Museumpark",
                        type: "Hogeschool locatie",
                        amount: "17 fietsen ophalen"
                    },{
                        id: "11",
                        name: "Museumpark",
                        type: "Hogeschool locatie",
                        amount: "17 fietsen ophalen"
                    },{
                        id: "12",
                        name: "Museumpark",
                        type: "Hogeschool locatie",
                        amount: "17 fietsen ophalen"
                    },{
                        id: "13",
                        name: "Museumpark",
                        type: "Hogeschool locatie",
                        amount: "17 fietsen ophalen"
                    },{
                        id: "14",
                        name: "Museumpark",
                        type: "Hogeschool locatie",
                        amount: "17 fietsen ophalen"
                    },{
                        id: "15",
                        name: "Museumpark",
                        type: "Hogeschool locatie",
                        amount: "17 fietsen ophalen"
                    },{
                        id: "16",
                        name: "Museumpark",
                        type: "Hogeschool locatie",
                        amount: "17 fietsen ophalen"
                    }
                ]
            }
        },
        computed: {
        },
        mounted() {
            this.getLocations();
            // this.$el.children[0].style.left = "-311px";
            // console.log(this.$el.children[0].style.left);
        },
        methods: {
            getLocations(){
                var i,j,temparray,chunk = 3;
                for (i=0,j=this.locations.length; i<j; i+=chunk) {
                    temparray = this.locations.slice(i,i+chunk);
                    // do whatever
                    this.newarray.push(temparray)
                }

            },
            slideLeft: function (index) {

                let position = this.$el.children[0].offsetLeft;
                let element = this.$el.children[0];

                // console.log(element);
                // console.log(position);

                // //let the algorithm do his job
                // // console.log(locations[index].id);
                // console.log(index);
                //
                // console.log(this);
                //
                // console.log('targetid = ' + event.target.id);
                // console.log("event id = " + event.currentTarget.id);
                // let targetId = event.currentTarget.id;
                //
                //
                // let para = document.querySelector('.locations');
                // console.log("para = " + para);
                // let locations = document.getElementById('locations');
                // console.log("locations = "+ locations);
                //
                //
                // let postion = locations.style.left = "-311px";
                //
                // console.log('postion = ' + postion);


                // console.log('element position = ' + elemtentPosition);
                slide(element, position);
            },
            slideRight: function (index) {

                let position = this.$el.children[0].offsetLeft;
                let element = this.$el.children[0];

                slideRight(element, position);
            },
        }
    }

    function slide(el, position) {
        let element = el;
        console.log('el', el);
        let oldpos = position;
        console.log("oldpos",oldpos);
        let elements = 18 / 6;
        // console.log(position);
        // element.style.left = position + 100 +"px";

        if(oldpos <= (elements *(-313)) +313){
            console.log("groter");
            oldpos = 0+"px";
            position = 0+"px";
            element.style.setProperty('left', 0 + "px");
            element.style.setProperty('--currentX', 0 + "px");
            element.style.setProperty('--nextX', 0 + "px");
        }

        element.style.setProperty('left', position - 313 + "px");
        element.style.setProperty('--currentX', oldpos + "px");
        element.style.setProperty('--nextX', position - 313 + "px");
        // console.log(element);

        //
        // document.getElementById('locations').className ='example';
        // document.querySelector('.locations').style.setProperty('--m',position + 100);
    }

    function slideRight(el, position) {
        let element = el;
        console.log('el', el);
        let oldpos = position;
        console.log("oldpos",oldpos);

        console.log("right");


        // console.log(position);
        // element.style.left = position + 100 +"px";

        element.style.setProperty('left', position + 313 + "px");

        element.style.setProperty('--currentX', oldpos + "px");

        element.style.setProperty('--nextX', position + 313 + "px");
        // console.log(element);

        //
        // document.getElementById('locations').className ='example';
        // document.querySelector('.locations').style.setProperty('--m',position + 100);
    }



</script>


<style scoped>

    .locations {
        animation-duration: 2s;
        --currentX: 0px;
        --nextX: 0px;
        animation-name: slidein;
    }

    @keyframes slidein {
        from {left: var(--currentX);}
        to {left: var(--nextX);}
    }

    .locations_holder {
        box-shadow: grey 3px 3px;
        margin-left: 12px;
        position: absolute;
        width: 100%;
        overflow: hidden;
        height: 400px;
    }


    .custom-list-item{
        list-style: none;
    }
    .custom-list-item-holder{
        width: 313px;
        float: left;
        padding: 0px 32px;
    }

    #locations{
        padding-left: 0px;
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

    .arrow{
        width: 50px;
        position: absolute;
        top: 170px;
    }
    .point-left{
        left: -6px;
    }
    .point-right{
        right: -26px;
    }


</style>
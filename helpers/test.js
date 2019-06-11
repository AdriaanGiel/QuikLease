let {History,BikeRack, Bike, School} = require("../database");
const Seq = require('sequelize');
const Op = Seq.Op;
const Moment = require('moment');

async function index(){

    let hourlyRecords = [];
    const racks = await BikeRack.findAll({
        where:{
            SchoolId: 1
        },
        raw: true,
        attributes: ['id']
    });

    let rackIds = racks.map((item) => item.id);
    let date = Moment('20180101');
    date.hours(0).minutes(0);
    let previousBikes = {
        parked:[],
        active:[]
    };
    // Days
    for(let i = 0; i < 20; i++){
        // Hours
        for(let y = 0; y < 24; y++){
            let endDate = date;
            let hourlyArray = [];

            try {
                let records = await History.findAll({
                    where:{
                        BikeRackId: rackIds,
                        createdAt:{
                            [Op.between]:[date.format(), endDate.add(1,'h').format()]
                        }
                    },
                    attributes:['BikeId', 'BikeRackId','park']
                });


                if(records.length){
                    hourlyArray = records;

                    let activeBikes = hourlyArray.filter((rec) => { return (rec.park === false) }).map((rec) => { return rec.BikeId; });
                    let parkedBikes = hourlyArray.filter((rec) => { return (rec.park === true) }).map((rec) => { return rec.BikeId; });

                    let addedBikes = parkedBikes.filter((bike) => {
                        return !previousBikes.parked.includes(bike);
                    });

                    let removedBikes = previousBikes.parked.filter((bike) => {
                       return activeBikes.includes(bike);
                    });

                    
                    let data = {
                        school_id: 1,
                        current_bikes: parkedBikes,
                        added_bikes: addedBikes,
                        removed_bikes: removedBikes,
                        timestamp: date.format(),
                    };

                    hourlyRecords.push(data);

                    previousBikes = {
                        active: activeBikes,
                        parked: parkedBikes
                    }
                }




            }catch (e) {
                console.log("Error", e.message);
            }


            date.add(1,'h');
        }

        date.add(1,'days');
    }



}

index();
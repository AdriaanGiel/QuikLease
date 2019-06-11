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
    let previousBikes = {};
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
                    hourlyArray.push(records);
                    let activeBikes = hourlyArray.filter((rec) => { return rec.park === false }).map((rec) => rec.BikeId);
                    let parkedBikes = hourlyArray.filter((rec) => { return rec.park === true }).map((rec) => rec.BikeId);


                    let addedBikes = previousBikes;


                    let data = {
                        school_id: 1,
                        current_bikes: parkedBikes,
                        added_bikes: ,
                        removed_bikes: ,
                        timestamp: date.format(),
                    };

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

    console.log(hourlyRecords);
}

index();
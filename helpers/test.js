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

    // Days
    for(let i = 0; i < 20; i++){
        // Hours
        for(let y = 0; y < 24; y++){
            let endDate = date;

            try {
                let records = await History.findAll({
                    where:{
                        BikeRackId: rackIds,
                        createdAt:{
                            [Op.between]:[date.format(), endDate.add(1,'h').format()]
                        }
                    },
                    raw: true,
                    attributes:['BikeId', 'BikeRackId','park']
                });


                if(records.length){
                    hourlyRecords.push(records);
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
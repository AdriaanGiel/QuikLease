let {History,BikeRack, Bike, School} = require("../database");
const Seq = require('sequelize');
const Op = Seq.Op;
const Moment = require('moment');

module.exports = {
    async index(req,res){

        const racks = await BikeRack.findAll({
            where:{
                SchoolId: 1
            },
            raw: true,
            attributes: ['id']
        });

        let rackIds = racks.map((item) => item.id);

        let startDate = Moment('20180102').hours(7).minutes(30);
        let endDate = Moment(startDate.format('YYYY') + startDate.format('MM') + startDate.format('DD')).hours(8).minutes(30);

        try {
            let records = await History.findAll({
                where:{
                    BikeRackId: rackIds,
                    createdAt:{
                        [Op.between]:[startDate.format(), endDate.format()]
                    }
                },
                raw: true,
                attributes:['BikeId', 'BikeRackId','park']
            });

            let foundRecords = record.map((rec) => rec.BikeRackId);

            let notActiveRacks = rackIds.filter((id) => {
                return !foundRecords.includes(id)
            });

            console.log(records);
        }catch (e) {
            console.log("Error", e.message);
        }

    }
};

function getTimeArray(){
    return [
        {between: '06:00', and: '07:00'},
        {between: '07:00', and: '08:00'},
        {between: '08:00', and: '09:00'},
        {between: '09:00', and: '10:00'},
        {between: '10:00', and: '11:00'},
        {between: '11:00', and: '12:00'},
        {between: '12:00', and: '13:00'},
        {between: '13:00', and: '14:00'},
        {between: '14:00', and: '15:00'},
        {between: '15:00', and: '16:00'},
        {between: '16:00', and: '17:00'},
        {between: '17:00', and: '18:00'},
        {between: '18:00', and: '19:00'},
        {between: '19:00', and: '20:00'},
        {between: '20:00', and: '21:00'},
        {between: '21:00', and: '22:00'},
        {between: '22:00', and: '23:00'},
        {between: '23:00', and: '00:00'},
    ];
}


function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}

async function ogIndex(){
    let data = [];
    try{
        const schools = await School.findAll({
            include:[{model:BikeRack,
                where: {occupied: true},
                include:[{model:History,
                    include: [{model:Bike, where:{active: 0}}]
                }]
            }]
        });

        schools.forEach((school) => {
            let rem = [];
            for(let i = 0; i < parseInt(school.bikes_total) - parseInt(school.BikeRacks.length); i++){
                rem.push(getRandomIntInclusive(1,500));
            }

            data.push({
                school_id: school.id,
                school_name: school.name,
                timestamp: Date.now(),
                total_bikes: school.bikes_total,
                current_bikes: school.BikeRacks.map((rack) => {return rack.id }),
                removed_bikes: rem
            });
        });
        return res.json({school: data});

    }catch (e) {
        console.log("error", e);
    }
}
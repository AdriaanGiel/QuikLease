const {History, Bike,User,BikeRack,School,sequelize} = require('../database');
const Seq = require('sequelize');
const Op = Seq.Op;
const Moment = require('moment');
async function getAllData() {
    let bikes = await Bike.findAll();
    let users = await User.findAll();
    const school = await School.findOne({
        where:{
            id: 1
        },
        include:[{model:BikeRack,
            where: {occupied: true}
        }]
    });

    let idArray = school.BikeRacks.map((rack) => {return rack.id});
    let histories = await History.findAll({where:{
            BikeRackId: idArray,
    }, order: [sequelize.literal('random()')], limit: 12});

    return {idCollection:idArray, histories: histories};
}
getAllData().then(async (data) => {

    let startDate = Moment("20180101");
    let startHour = 6;

    startDate.hours(startHour).minutes(30);

    for(let i = 0; i < 20; i++){

        if(weekend(startDate)){
            // console.log("Weekend");
            startDate.add(1, 'days');
            continue;
        }

        await createHistoryRecords(data.histories, startDate,data.idCollection, getPercentage(startDate));

        startDate.add(1, 'days');
    }


});

module.exports = {
    run() {
        getAllData().then((data) => {

        });
    }
};

function weekend(date){

    console.log(date.format('dddd'));
    return date.format('dddd') === "Saturday" || date.format('dddd') === "Sunday" ;
}

async function createHistoryRecords(historyData, date, idArrays, bikePercentage){

    let bikesUsedHours = Math.ceil(Math.floor(Math.random() * 20));
    let histories = historyData;
    let counter = 0;
    for(let y = 0; y < bikesUsedHours; y++){

        await histories.forEach(async (history) => {
            let latestRecords = await History.findOne({
                where:{
                    UserId: history.UserId,
                    BikeId: history.BikeId,
                    BikeRackId: history.BikeRackId,
                },
                order: [ [ 'createdAt', 'DESC' ]],
            });

            if(latestRecords.park === true){
                console.log("Parked");
                latestRecords.park = false;
                let user = await User.findOne({ order: [sequelize.literal('random()')] });
                latestRecords.UserId = user.id;
            }else{
                latestRecords.park = true;
            }

            await History.create({
                park: latestRecords.park,
                UserId: latestRecords.UserId,
                BikeId: latestRecords.BikeId,
                BikeRackId: latestRecords.BikeRackId,
                createdAt: date.format()
            });

        });


        if(date.format('k') === '24'){
            console.log("Break");
            date.hours(6).minutes(30);
            break;
        }else{
            date.add(1,'hours');

        }


        let limit = Math.ceil(20 * (bikePercentage / 100));

        // Add random limit
        histories = await History.findAll({
            where:{
                BikeRackId: idArrays,
                createdAt:{
                    [Op.between]:[Moment('20180101').format(), date.format()]
                }
            },order: [sequelize.literal('random()'), [ 'createdAt', 'DESC' ]],
            limit: limit
        });

        counter = 0;
    }

    return date;
}

let seasons = {
    winter:['December','January','February', 'March'],
    spring:['March','April','May','June',],
    summer:['June','July','August','September'],
    fall:['September','October','November','December']
};

function getPercentage(date){
    let month = date.format('MMMM');
    let percentage = 100;

    if(seasons.winter.includes(month)){
        percentage -= 50;
    }

    if(seasons.spring.includes(month)){
        if(percentage === 50){
            percentage += 35;
        }else{
            percentage -= 25
        }
    }

    if(seasons.summer.includes(month)){
        percentage = 95;
    }


    if(seasons.fall.includes(month)){
        if(percentage === 50){
            percentage += 15;
        }else{
            percentage -= 40
        }

        if(percentage === 95){
            percentage = 65;
        }
    }

    
    return percentage;
}




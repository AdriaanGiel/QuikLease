const {History, Bike,User,BikeRack,School,sequelize} = require('../database');
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
getAllData().then((data) => {

    let startDate = Moment("20180101");
    let startHour = 6;

    startDate.hours(startHour).minutes(30);

    for(let i = 0; i < 60; i++){

        if(weekend(startDate)){
            continue;
        }

        console.log(startDate.format());
        createHistoryRecords(data.histories, startDate,data.idCollection, getPercentage(startDate)).then((d) => {
            startDate = d;
            startDate.add(1, 'days');
        });

    }


});

module.exports = {
    run() {
        getAllData().then((data) => {

        });
    }
};

function weekend(date){

    return date.format('dddd') === "Saturday" || date.format('dddd') === "Sunday" ;
}

async function createHistoryRecords(historyData, date, idArrays, bikePercentage){

    let bikesUsedHours = Math.ceil(Math.floor(Math.random() * 20));
    let histories = historyData;

    console.log(date.format('kk'));

    let counter = 0;
    for(let y = 0; y < bikesUsedHours; y++){

        counter++;

        histories.forEach(async (history) => {
            let parked = true;
            let user = history.UserId;
            let randomUse = Math.round(Math.random());

            // Check to randomize bike usage in a day
            if(!randomUse){
                // console.log("Random");
                return;
            }


            // Check if bike is parked
            if(history.park && counter !== bikesUsedHours){
                // console.log("Parked");
                parked = false;
                let completeUser = await User.findOne({ order: [sequelize.literal('random()')] });
                user = completeUser.id;
            }

            if(counter === bikesUsedHours){
                // console.log("Ending");
                parked = true;
            }

            // Create a new history record
            try {
                await History.create({
                    park: parked,
                    UserId: user,
                    BikeId: history.BikeId,
                    BikeRackId: history.BikeRackId,
                    createdAt: date.format()
                })
            }catch (e) {
                console.log("Error", e.message);
            }
        });

        if(date.format('k') === '24'){
            date.hours(6).minutes(30);
        }

        if(date.format('k') !== '06'){
            date.add(1,'hours');
        }

        let limit = Math.ceil(20 * (bikePercentage / 100));

        // TODO get random id of users that arent active on a bike

        // Add random limit
        histories = await History.findAll({
            where:{
                BikeRackId: idArrays
            },order: [sequelize.literal('random()')],
            limit: limit
        });



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




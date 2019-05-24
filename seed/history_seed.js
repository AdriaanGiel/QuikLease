const {History, Bike,User,BikeRack} = require('../database');
const Moment = require('moment');
async function getAllData()
{
    let bikes = await Bike.findAll();
    let users = await User.findAll();
    let BikeRacks = await BikeRack.findAll();

    return {bikes: bikes, users: users, racks: BikeRacks};
    
    
}



let startDate = Moment("20180101");
let startHour = 6;
let endHour = 24;

console.log(startDate.hours(13).minutes(30).format('MMMM Do YYYY, h:mm:ss a'));

for(let i = 0; i < 60; i++){





    startDate.add(1,"days");
    if(i % 6 === 0){
        startDate.add(1,"days");
    }
}

console.log(Moment("20180101").fromNow());

module.exports = {
    run() {
        getAllData().then((data) => {
            for(let i = 0; i < 1000; i++){
                History.create({
                    BikeId: data.bikes[Math.floor((Math.random()*data.bikes.length -1) + 1)].id,
                    UserId: data.users[Math.floor((Math.random()*data.users.length -1) + 1)].id,
                    BikeRackId: data.racks[Math.floor((Math.random()*data.racks.length -1) + 1)].id
                });
            }

            console.log('History Records created');
        });
    }
};




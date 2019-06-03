const {History, Bike,User,BikeRack,School} = require('../database');
const Moment = require('moment');
async function getAllData()
{
    let bikes = await Bike.findAll();
    let users = await User.findAll();
    const schools = await School.findAll({
    include:[{model:BikeRack,
        where: {occupied: true},
        include:[{model:History,
            include: [{model:Bike, where:{active: 0}}]
        }]
    }]
});



    return {bikes: bikes, users: users, schools: schools};
    
    
}
getAllData().then((data) => {

    let startDate = Moment("20180101");
    let startHour = 6;
    let endHour = 24;
    let schools = data.schools;

// console.log(startDate.hours(13).minutes(30).format('MMMM Do YYYY, h:mm:ss a'));
    let weekenddays = 0;
    console.log();
    for(let i = 0; i < 364; i++){
        startDate.add(1,"days");
        startDate.hours(6);

        if(weekend(i)){
            continue;
        }

        for($y = 0; $y < 18; $y++){

            // schools[0];
            // schools[1];
            // schools[2];
            // schools[3];
            // schools[4];
            // schools[5];
            // schools[6];
            // schools[7];
            // schools[8];
            // schools[9];
            // schools[10];
            // schools[11];
        }




    }
    
    console.log('schools',data.schools.length);
    console.log('date', startDate.format('MMMM Do YYYY, h:mm:ss a'));
    console.log('weekenddays', weekenddays);

});


//
// console.log(Moment("20180101").fromNow());

module.exports = {
    run() {
        getAllData().then((data) => {
            for(let i = 0; i < 1000; i++){
                let match = Math.floor(Math.random()* Math.floor(2));
                History.create({
                    park: match,
                    BikeId: data.bikes[Math.floor((Math.random()*data.bikes.length -1) + 1)].id,
                    UserId: data.users[Math.floor((Math.random()*data.users.length -1) + 1)].id,
                    BikeRackId: data.racks[Math.floor((Math.random()*data.racks.length -1) + 1)].id
                });
            }

            console.log('History Records created');
        });
    }
};

function weekend(num){
    return num % 6 === 0 || num % 7 === 0;
}




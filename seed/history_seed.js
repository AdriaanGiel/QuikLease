const {History, Bike,User,BikeRack,School} = require('../database');
const Moment = require('moment');
async function getAllData() {
    let bikes = await Bike.findAll();
    let users = await User.findAll();
    const school = await School.findOne({
    where:{
        name: "Botsford - Jast"
    },
    include:[{model:BikeRack,
        where: {occupied: true}
    }]
});
    console.log("School",school.BikeRacks );
    let idArray = school.BikeRacks.map((rack) => {return rack.id});
    let histories = await History.findAll({where:{
            id: {in: idArray},
            park: 1
    }});


    return {bikes: bikes, users: users, school: school, histories: histories};
}
getAllData().then((data) => {

    let startDate = Moment("20180101");
    let startHour = 6;
    let endHour = 24;
    let school = data.school;

    console.log("Data",data.histories);
    
    // data.school.BikeRacks.forEach((rack) => {
    //
    //
    //
    // });




// console.log(startDate.hours(13).minutes(30).format('MMMM Do YYYY, h:mm:ss a'));
//     let weekenddays = 0;
//     console.log();
//     for(let i = 0; i < 364; i++){
//         startDate.add(1,"days");
//         startDate.hours(6);
//
//         if(weekend(i)){
//             continue;
//         }
//
//         let bikesUsedDaily1 = Math.floor(Math.random() * 21);

//         let bikesUsedHourly1 = Math.ceil(Math.floor(Math.random() * (bikesUsedDaily1 / 7)));
//
//         let bikesUsedTotal = 0;

//
//         for(let y = 0; y < 18; y++){
//
//             schools[0]
//
//             // schools[0];
//             // schools[1];
//             // schools[2];
//
//     }

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




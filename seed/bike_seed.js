const {Bike,BikeRack,School} = require('../database');

let bikes = [];
let racks = [];

School.findAll({}).then((schools) => {
    for(let i = 0; i < (45 * 1500); i++){
        let match = Math.floor(Math.random()* Math.floor(2));
        let school = schools[Math.floor((Math.random()*schools.length - 1) + 1)].id;

        bikes.push({active: match});
        if(match === 1){
            racks.push({occupied: 0, school: school});
        }else{
            racks.push({occupied: 1, school: school});
        }
    }
});


module.exports =  {
    async run(){
        Bike.bulkCreate(bikes)
            .then(() => console.log("Bikes seeded"));

        BikeRack.bulkCreate(racks)
            .then(() => console.log("racks seeded"));
    }
};




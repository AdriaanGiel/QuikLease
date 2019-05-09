const {Bike,BikeRack,School} = require('../database');

let bikes = [];
let racks = [];

School.findAll({}).then((schools) => {
    for(let i = 0; i < (45 * 15); i++){
        let match = Math.floor(Math.random()* Math.floor(2));
        let schoolIndex = Math.floor((Math.random()*schools.length - 1) + 1);
        let school = schools[schoolIndex].id;
        
        console.log(match);

        bikes.push({active: match});
        if(match === 1){
            racks.push({occupied: 0, SchoolId: school});
        }else{
            racks.push({occupied: 1, SchoolId: school});
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




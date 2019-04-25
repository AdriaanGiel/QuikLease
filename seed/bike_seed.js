const {Bike} = require('../database');

let bikes = [];

for(let i = 0; i < (45 * 15); i++){
    bikes.push({active: Math.floor(Math.random()* Math.floor(2))});
}


module.exports =  {
    run(){
        Bike.bulkCreate(bikes)
            .then(() => console.log("Bikes seeded"));
    }
};




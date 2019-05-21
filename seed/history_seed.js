const {History, Bike,User,BikeRack} = require('../database');

async function getAllData()
{
    let bikes = await Bike.findAll();
    let users = await User.findAll();
    let BikeRacks = await BikeRack.findAll();



    return {bikes: bikes, users: users, racks: BikeRacks};
}

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




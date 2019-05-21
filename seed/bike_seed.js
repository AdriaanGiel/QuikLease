const {Bike,BikeRack,School,History} = require('../database');

let histories = [];

School.findAll({}).then((schools) => {

    schools.forEach((school) => {
        let racks = [];
        let bikes = [];

        for(let i = 0; i < 20; i++){
            racks.push({
                occupied: true,
                schoolId: school.id
            });

            bikes.push({
                active: false
            });
        }

        createHistories(bikes,racks).then(async () => {

            await

        });



    });
});


async function createHistories(bikes,racks){

    let added_bikes = await Bike.bulkCreate(bikes);
    let added_racks = await BikeRack.bulkCreate(racks);

    added_bikes.map((i, bike) => {
        histories.push({
            park: true,
            BikeId: bike.id,
            UserId: 1,
            BikeRackId: added_racks[i].id
        });
    });

}

module.exports =  {
    async run(){

    }
};




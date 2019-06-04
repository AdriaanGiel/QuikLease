const {School,Bike,BikeRack, History} = require('../database');

const faker = require('faker');

let schools = [];

module.exports = {
    run() {
        for(let i = 0; i < 15; i++){
            schools.push({
                name: faker.company.companyName(),
                bikes_total: 45,
                street: faker.address.streetName(),
                number: faker.random.number(),
                insertion: "",
                zipcode: faker.address.zipCode(),
                location: "Rotterdam"
            });
        }

        School.bulkCreate(schools,{returning: true})
            .then((result) => {
                console.log("Schools added");
                result.forEach((school) => {
                    let localRacks = [];
                    for(let y = 0; y < 20; y++){
                        // Create 20 racks for location i
                        localRacks.push({
                            SchoolId:school.id,
                            occupied: true
                        });
                    }

                    BikeRack.bulkCreate(localRacks).then((racks) => {
                        racks.forEach((rack) => {
                           Bike.create({active:true}).then((bike) => {

                               History.create({
                                   park:true,
                                   BikeId: bike.id,
                                   BikeRackId: rack.id,
                                   UserId: 1
                               });

                           });
                        });
                    });
                });

            });
    }
};

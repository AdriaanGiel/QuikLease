const {School,Bike,BikeRack} = require('../database');

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
                    let localBikes = [];

                    console.log(school);
                    
                    for(let y = 0; y < 20; y++){
                        // Create 20 racks for location i
                        localRacks.push({
                            SchoolId:school.id,
                            occupied: true
                        });

                        // Create 20 bikes for location i
                        localBikes.push({
                            active: false
                        });
                    }

                    BikeRack.bulkCreate(localRacks).then((racks) => {

                        Bike.bulkCreate(localBikes).then(() => console.log("bikes added"));
                    });
                });

            });
    }
};

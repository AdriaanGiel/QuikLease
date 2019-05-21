const {School} = require('../database');

const faker = require('faker');

let schools = [];


for (let i = 0; i < 15; i++) {
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

schools.forEach((school) => {

    let CreatedSchool = "";


});


module.exports = {
    run() {
        for (let i = 0; i < 15; i++) {
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

        schools.forEach((school) => {
            console.log(school);
        });
        //
        // School.bulkCreate(schools)
        //     .then(() => console.log("schools seeded"));
    }
};

const {User,Profile} = require('../database');

const faker = require('faker');

async function createUser(faker){
    await User.create({
        email: faker.internet.email(),
        password: 'password',
        student_nr: faker.random.number()
    }).then((user) => {
        Profile.create({
            firstname: faker.name.firstName(),
            lastname: faker.name.lastName(),
            insertion: "",
            course: faker.lorem.words(),
            year: 2,
            age: 20,
            origin: "",
            UserId: user.id
        });
    });
}

module.exports = {
    run() {
        for(let i = 0; i < 15; i++){
            createUser(faker);
        }

        console.log("Users seeded");
    }
};


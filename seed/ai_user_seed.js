const {User} = require('../ai_database');

const faker = require('faker');

async function createUser(faker){
    // await User.create({
    //     username: faker.internet.userName(),
    //     email: faker.internet.email(),
    //     password: 'password'
    // });
    await User.create({
        username: "Adriaan",
        email: "adriaan@test.nl",
        password: 'hoi'
    });


}

module.exports = {
    run() {
       createUser(faker);
    }
};
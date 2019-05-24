const {User} = require('../ai_database');

const faker = require('faker');

async function createUser(faker){
    await User.create({
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: 'password'
    });
}

module.exports = {
    run() {
       createUser(faker);
    }
};
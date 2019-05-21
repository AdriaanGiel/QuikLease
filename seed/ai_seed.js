let {second_sequelize} = require('../ai_database');
let UserSeed = require('./ai_user_seed');

second_sequelize.sync({force:true})
    .then(async function () {
        await UserSeed.run();
    });
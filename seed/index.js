const {sequelize} = require('../database');
const Promise = require('bluebird');
const BikeSeed = require('./bike_seed');
const HistorySeed = require('./history_seed');
const SchoolSeed = require('./school_seed');
const UserSeed = require('./user_seed');


sequelize.sync({force:true})
    .then(async function () {

        await SchoolSeed.run();
        await UserSeed.run();
        await BikeSeed.run();

        await HistorySeed.run();
    });
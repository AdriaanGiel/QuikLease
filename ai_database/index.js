require('dotenv').config();
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const config = require('../config');
const dbs = {};

const second_sequelize = new Sequelize(
    config.dbs.database,
    config.dbs.user,
    config.dbs.password,
    config.dbs.options,
);

fs.readdirSync(__dirname)
    .filter((file) => {
        return file !== 'index.js' && file !== 'seed.js';
    })
    .forEach((file) => {
        const model = second_sequelize.import(path.join(__dirname,file));
        dbs[model.name] = model;
    });

dbs.second_sequelize = second_sequelize;
dbs.Sequelize = Sequelize;

module.exports = dbs;


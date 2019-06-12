require('dotenv').config();
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const config = require('../config');
const db = {};

const sequelize = new Sequelize(
    config.db.database,
    config.db.user,
    config.db.password,
    config.db.options,
);

fs.readdirSync(__dirname)
    .filter((file) => {
        return file !== 'index.js' && file !== 'seed.js';
    })
    .forEach((file) => {
        const model = sequelize.import(path.join(__dirname,file));
        db[model.name] = model;
    });

db.sequelize = sequelize;
db.Sequelize = Sequelize;



// Associations
db.History.belongsTo(db.User);
db.History.belongsTo(db.Bike);
db.History.belongsTo(db.BikeRack);

db.User.hasMany(db.History);
db.User.hasOne(db.Profile);

db.Profile.belongsTo(db.School);
db.Profile.belongsTo(db.User);

db.Bike.hasMany(db.History);

db.BikeRack.hasMany(db.History);
db.BikeRack.belongsTo(db.School);

db.School.hasMany(db.BikeRack);
db.School.hasMany(db.User);


module.exports = db;
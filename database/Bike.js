const {History} = require('../database');

module.exports = (sequelize,DataTypes) => {

    const Bike = sequelize.define('Bike',{
        active:DataTypes.BOOLEAN,
        location:DataTypes.TEXT
    });

    Bike.associate = function(models){
      models.Bike.hasMany(models.History);
    };

    // Bike.hasMany(History, { as: 'bikes', foreignKey: 'bike'});

    return Bike;
};


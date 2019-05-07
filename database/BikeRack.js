const {School} = require('../database');

module.exports = (sequelize,DataTypes) => {

    const Bike = sequelize.define('BikeRack',{
        occupied:DataTypes.BOOLEAN,
        school:DataTypes.INTEGER
    });

    Bike.associate = function(models){
        models.Bike.belongsTo(models.School);
    };

    return Bike;
};


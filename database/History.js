const {User,Bike,BikeRack} = require('../database');
module.exports = (sequelize,DataTypes) => {


    const History = sequelize.define('History',{
        bike_rack:DataTypes.INTEGER,
        user:DataTypes.INTEGER,
        bike:DataTypes.INTEGER
    });


    // History.belongsTo(User);
    // History.belongsTo(Bike);
    // History.belongsTo(BikeRack);

    History.associate = function(models){
        models.History.belongsTo(models.User);
        models.History.belongsTo(models.Bike);
        models.History.belongsTo(models.BikeRack);
    };

    return History;
};
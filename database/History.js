const {User,Bike,School} = require('../database');
module.exports = (sequelize,DataTypes) => {


    const History = sequelize.define('History',{
        school:DataTypes.INTEGER,
        user:DataTypes.INTEGER,
        bike:DataTypes.INTEGER
    });


    History.associate = function(models){
        models.History.belongsTo(models.User);
        models.History.belongsTo(models.Bike);
        models.History.belongsTo(models.School);
    };

    return History;
};
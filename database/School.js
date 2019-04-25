const {History} = require('../database');
module.exports = (sequelize,DataTypes) => {

    const School = sequelize.define('School',{
        name:DataTypes.STRING,
        bikes_total:DataTypes.INTEGER,
        street:DataTypes.STRING,
        number:DataTypes.INTEGER,
        insertion:DataTypes.STRING,
        zipcode:DataTypes.STRING,
        location:DataTypes.STRING
    });

    School.associate = function(models){
        models.School.hasMany(models.History);
        models.School.hasMany(models.User);
    };

    return School;


};
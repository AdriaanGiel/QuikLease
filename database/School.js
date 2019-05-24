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

    return School;


};
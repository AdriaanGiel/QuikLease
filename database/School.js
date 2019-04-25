module.exports = (sequelize,DataTypes) => {
    return sequelize.define('school',{
        name:DataTypes.STRING,
        bikes_total:DataTypes.INTEGER,
        street:DataTypes.STRING,
        number:DataTypes.INTEGER,
        insertion:DataTypes.STRING,
        zipcode:DataTypes.STRING,
        location:DataTypes.STRING
    });
};
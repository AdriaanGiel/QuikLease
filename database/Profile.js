module.exports = (sequelize,DataTypes) => {
    return sequelize.define('profile',{
        firstname:DataTypes.STRING,
        lastname:DataTypes.STRING,
        insertion:DataTypes.STRING,
        year:DataTypes.INTEGER,
        origin:DataTypes.STRING,
        course :DataTypes.STRING,
    });
};
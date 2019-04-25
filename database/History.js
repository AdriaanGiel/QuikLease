module.exports = (sequelize,DataTypes) => {
    return sequelize.define('history',{
        school:DataTypes.INTEGER,
        user:DataTypes.INTEGER,
        bike:DataTypes.INTEGER
    });
};
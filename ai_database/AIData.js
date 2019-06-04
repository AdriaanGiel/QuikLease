module.exports = (sequelize,DataTypes) => {
    return sequelize.define('AI_data',{
        data:DataTypes.STRING,
        weather: DataTypes.STRING
    });
};
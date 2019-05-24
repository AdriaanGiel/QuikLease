module.exports = (sequelize,DataTypes) => {
    return sequelize.define('AI_settings',{
        settings:DataTypes.STRING
    });
};
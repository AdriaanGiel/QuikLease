module.exports = (sequelize,DataTypes) => {
    return sequelize.define('AIdata',{
        row:DataTypes.STRING
    });
};
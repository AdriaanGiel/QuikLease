module.exports = (sequelize,DataTypes) => {
    return sequelize.define('History',{
        park:DataTypes.BOOLEAN
    });

};
module.exports = (sequelize,DataTypes) => {
    return sequelize.define('bike',{
        active:DataTypes.BOOLEAN,
        location:DataTypes.TEXT
    });
};
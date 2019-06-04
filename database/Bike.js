module.exports = (sequelize,DataTypes) => {

    const Bike = sequelize.define('Bike',{
        active:DataTypes.BOOLEAN,
        location:DataTypes.TEXT
    });

    return Bike;
};


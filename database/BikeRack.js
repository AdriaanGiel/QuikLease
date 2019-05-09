module.exports = (sequelize,DataTypes) => {

    const Bike = sequelize.define('BikeRack',{
        occupied:DataTypes.BOOLEAN
    });

    return Bike;
};


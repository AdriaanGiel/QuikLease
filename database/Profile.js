const {User} = require('../database');

module.exports = (sequelize,DataTypes) => {

    const Profile = sequelize.define('Profile',{
        firstname:DataTypes.STRING,
        lastname:DataTypes.STRING,
        insertion:DataTypes.STRING,
        year:DataTypes.INTEGER,
        age:DataTypes.INTEGER,
        origin:DataTypes.STRING,
        course :DataTypes.STRING,
        user:DataTypes.INTEGER
    });

    Profile.associate = function(models){
        models.Profile.belongsTo(models.User);
    };

    return Profile;
};
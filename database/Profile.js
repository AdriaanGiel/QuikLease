module.exports = (sequelize,DataTypes) => {

    const Profile = sequelize.define('Profile',{
        firstname:DataTypes.STRING,
        lastname:DataTypes.STRING,
        insertion:DataTypes.STRING,
        year:DataTypes.INTEGER,
        age:DataTypes.INTEGER,
        origin:DataTypes.STRING,
    });

    return Profile;
};
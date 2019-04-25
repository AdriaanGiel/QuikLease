const {History, Bike,User,School} = require('../database');

async function getAllData()
{
    let bikes = await Bike.findAll();
    let users = await User.findAll();
    let schools = await School.findAll();

    return {bikes: bikes, users: users, schools: schools};
}


module.exports = {
    run() {
        getAllData().then((data) => {

            console.log("school_id", data.schools);
            for(let i = 0; i < 1000; i++){
                History.create({
                    bike: data.bikes[Math.floor(Math.random()*data.bikes.length)].id,
                    user: data.users[Math.floor(Math.random()*data.users.length)].id,
                    school: data.schools[Math.floor(Math.random()*data.schools.length)].id
                });
            }

            console.log('History Records created');
        });
    }
};




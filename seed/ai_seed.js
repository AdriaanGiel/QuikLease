let {second_sequelize} = require('../ai_database');
let UserSeed = require('./ai_user_seed');

second_sequelize.sync({force:true})
    .then(async function () {
        await UserSeed.run();
    });

let dataObject = {
    school_id: "",
    current_bikes: "",
    added_bikes:"",
    removed_bikes:"",
    timestamp: ""
};

weather = {
    temparature:"",
    windspeed:"",
    thunderstorm:"",
    drizzle:"",
    rain:"",
    snow:"",
    atmosphere:"",
    clouds: ""
};
let {History,BikeRack, Bike, School} = require("../database");

module.exports = {
    async index(req,res){

        let data = [];
        try{
            const schools = await School.findAll({
                include:[{model:BikeRack,
                    where: {occupied: true},
                    include:[{model:History,
                        include: [{model:Bike, where:{active: 0}}]
                    }]
                }]
            });



            schools.forEach((school) => {
                let rem = [];
                for(let i = 0; i < parseInt(school.bikes_total) - parseInt(school.BikeRacks.length); i++){
                    rem.push(getRandomIntInclusive(1,500));
                }

                data.push({
                    school_id: school.id,
                    school_name: school.name,
                    timestamp: Date.now(),
                    total_bikes: school.bikes_total,
                    current_bikes: school.BikeRacks.map((rack) => {return rack.id }),
                    removed_bikes: rem
                });
            });


            return res.json({school: data});

        }catch (e) {
            console.log("error", e);
        }



    }
};

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}
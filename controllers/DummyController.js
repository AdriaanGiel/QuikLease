let {School,BikeRack} = require("../database");

module.exports = {
    async index(req,res){

        const school = await School.findAll({
            include:[{model:BikeRack}]
        });

        return res.json({school: school});

        // const logs = await History.findAll({
        //     include:[{all:true}]
        // });
        //
        // return res.json({test: logs});
    }
};
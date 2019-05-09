let {History,BikeRack} = require("../database");

module.exports = {
    async index(req,res){

        const logs = await History.findAll({
            include:[{model:BikeRack}]
        });



        return res.json({test: logs});
    }
};
const {School,BikeRack} = require("../database");
const ErrorHandler = require('../helpers/ErrorHandler');

class SchoolController{

    async index(req,res){

        ErrorHandler.handleTryAndCatch(async () => {

            let schools = await School.findAll({include:[{
                    model:BikeRack
                }]});


            return res.json({schools});
        },res);

    }

    async insert(req,res){
        let data = req.body;

        ErrorHandler.handleTryAndCatch(async () => {

            let school = await School.create(data);

            return res.json({school});
        },res);

    }

    async single(req,res) {

        ErrorHandler.handleTryAndCatch(async () => {
            let school = await School.findOne({
                where: {
                    id: req.params.id
                },
                include:[{model: BikeRack}]
            });

            return res.json({school});


        }, res);

    }


    async delete(req,res){

        ErrorHandler.handleTryAndCatch(async () => {
            let school = await School.findByPk(req.params.id);

            ErrorHandler.handleTryAndCatch(async () => {

                await school.destroy();

                return res.json({destroyed: true});

            },res);

        }, res);

    }
}

module.exports = new SchoolController();
const {Bike} = require("../database");
const ErrorHandler = require('../helpers/ErrorHandler');

class BikeController{


    async index(req,res){

        ErrorHandler.handleTryAndCatch(async () => {

            let bikes = await Bike.findAll({});

            return res.json({bikes});

        },res);

    }

    async single(req,res){

        ErrorHandler.handleTryAndCatch(async () => {

            let bike = await Bike.findByPk(req.params.id);

            return res.json({bike});

        },res);

    }

    async delete(req,res){
        ErrorHandler.handleTryAndCatch(async () => {

            let bike = await Bike.findByPk(req.params.id);

            ErrorHandler.handleTryAndCatch(async () => {

                await bike.destroy();

                return res.json({destroyed: true});

            },res);

        },res);
    }
}

module.exports = new BikeController();
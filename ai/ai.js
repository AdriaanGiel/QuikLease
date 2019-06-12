// setup requirements
const { AI_data } = require('../ai_database')
const brain = require('brain.js')
const jsonfile = require('jsonfile')
const file = './ai/network.json'
const util = require('util')

// Retrieve data from database
AI_data.findAll().then(async (results) => {
    //console.log(results)
    let AiData = [];
    let trainingData = [];
    
    
    // Get all entries
    for (let result of results) {
        // empty the array
        AiData = [];
        // Convert back from JSON
        let bikesDataWithOutput = JSON.parse(result.data)
        let bikesData = [];
        let output = 0;
        // Seperate output from the data
        for (let bikeData of bikesDataWithOutput) {
            output = bikeData["output"];
            delete bikeData["output"];
            bikesData.push(bikeData);
        }
        // trainingData.push({inputbikesData[0], output: output}); 
        let dataIndex = {}    
        dataIndex.input = bikesData[0]
        dataIndex.output = {bikes: output}
        trainingData.push(dataIndex)
    }
    //console.log(trainingData);
    /*
        AI
    */

    // function to map a number (input, original min, original max, desired min, desired max)
    const map_range = (num, in_min, in_max, out_min, out_max) => {
        return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
    }

    // Save current network to file
    function saveNetwork() {
        jsonfile.writeFile(file, network.toJSON(), function (err) {
            if (err) {
                console.error(err)
            } else {
                console.log("Succesfully saved network to file")
            }
        })
    }

    // Configuration
    const config = {
        errorThresh: 0.005,             // error threshold to reach
        iterations: 20000,              // maximum training iterations
        log: true,                      // console.log() progress periodically
        logPeriod: 1000,                // number of iterations between logging
        learningRate: 0.1               // learning rate
    }

    // Setup network
    const network = new brain.NeuralNetwork(config); //<- output: NaN | NaN

    // Train network
    network.train(trainingData, config);
    
    // Save network after training
    saveNetwork();
    
    //ask for meaning
    let testNumber = 5
    for (let index = 1; index <= testNumber; index++) {
        let expected = Math.floor(map_range(trainingData[index].output.bikes, 0, 1, 0, 100));

        let prediction = network.run(trainingData[index].input);
        prediction = Math.floor(map_range(prediction.bikes, 0 , 1, 0, 100));

        console.log("Training verification " + index + " | Expected: " + expected + " Prediction: " + prediction);
    }
})
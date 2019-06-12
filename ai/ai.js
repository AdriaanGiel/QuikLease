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
    let formattedInput = [];
    let output = 0;
    
    // Get all entries
    for (let result of results) {
        // empty the array
        AiData = [];
        // Convert back from JSON
        let bikesData = JSON.parse(result.data)
        let weatherData = JSON.parse(result.weather)

        // Add the bike data from all locations
        for (let bikeData of bikesData) {
            // remove output from array and save value seperately
            output = bikeData["output"];
            delete bikeData["output"];
            // Add the data from location x to AiData
            AiData.push(Object.values(bikeData));
        }

        // Add the weather data
        //AiData.push(Object.values(weatherData));

        // Convert to one array
        AiData = [].concat.apply([], AiData);

        formattedInput.push(
            {
                //"id": result.id,
                "data": AiData,
                "output": output
            }
        )
    }
    //console.log(formattedInput);

    // Add each line as input and seperate output
    let trainingData = [];
    for (const id in formattedInput) {
        if (formattedInput.hasOwnProperty(id)) {
            const inputPerId = formattedInput[id]
            trainingData.push({ input: inputPerId.data, output: inputPerId.output});
        }
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
        iterations: 100,                // maximum training iterations
        log: true,                      // console.log() progress periodically
        logPeriod: 10,                  // number of iterations between logging
        hiddenLayers: [3, 4],           // ammount of hidden layers
        learningRate: 0.3,              // learning rate
        reinforce: true
    }

    // Setup network
    // const network = new brain.NeuralNetwork(); //<- output: NaN | NaN
    const network = new brain.recurrent.RNN(); //<- output: 0.26 | infinity error
    // const network = new brain.recurrent.LSTM(); //<- output: _ | 0.6 - 0.1 error
  

    // Train network
    network.train(trainingData, config);
    //ask for meaning
    network.maxPredictionLength = 1;
    for (let index = 0; index < 5; index++) {
        console.log("expected: " + formattedInput[index].output);
        let prediction = network.run(formattedInput[index].data);
        //prediction = Math.floor(map_range(prediction, 0 , 1, 0, 100));
        console.log("Ammount of bikes needed is: " + prediction);
    }

    // Save network after training
    saveNetwork();
})
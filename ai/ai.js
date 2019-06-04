// setup requirements
const { AI_data } = require('../ai_database')
const util = require('util')
const brain = require('brain.js')

// Retrieve data from database
AI_data.findAll().then((results) => {
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

        // Add bike data from location 0 <- For testing we only use data from one location as input
        // remove output from array and save value seperately
        // output = bikesData[0]["output"];
        // delete bikesData[0]["output"];
        // // Add the data from location x to AiData
        // AiData.push(Object.values(bikesData[0]));
        // Add the bike data from all 12 locations <- Use this to get the data from all 12 locations
        for (let bikeData of bikesData) {
            // remove output from array and save value seperately
            output = bikeData["output"];
            delete bikeData["output"];
            // Add the data from location x to AiData
            AiData.push(Object.values(bikeData));
        }

        // Add the weather data
        AiData.push(Object.values(weatherData));

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

    // Setup brain.js
    // create a simple recurrent neural network because assumption that two successive inputs are independent of each other
    const network = new brain.recurrent.RNN();

    // Add each line as input and seperate output
    let trainingData = [];
    for (const id in formattedInput) {
        if (formattedInput.hasOwnProperty(id)) {
            const inputPerId = formattedInput[id]
            trainingData.push({ input: inputPerId.data, output: inputPerId.output});
        }
    }
    //console.log(trainingData);
    //Train network
    network.train(trainingData, {
        errorThresh: 0.005,  // error threshold to reach
        iterations: 10000,   // maximum training iterations
        log: true,           // console.log() progress periodically
        logPeriod: 10,       // number of iterations between logging
        learningRate: 0.9    // learning rate
    })

    // Save the ai model
    //let Ai_model = network.toJSON()
    //console.log(Ai_model);
    //network.fromJSON(trainingData);

    //ask for meaning
    //const prediction = network.run(0, 0.02, 0.36, 0.5, 0.08, 0.1558616137727, 0.083, 0.24, 0.38, 0.14, 0, 0.1558616137727, 0.167, 0.02, 0.48, 0.94, 0.08, 0.1558616137727, 0.25, 0.04, 0.36, 0.32, 0.02, 0.1558616137727, 0.333, 0.4, 0.58, 0.18, 0.02, 0.1558616137727, 0.417, 0.38, 0.74, 0.36, 0.04, 0.1558616137727, 0.5, 0.02, 0.18, 0.84, 0, 0.1558616137727, 0.583, 0.1, 0.96, 0.86, 0.02, 0.1558616137727, 0.667, 0.7, 0.9, 0.2, 0.06, 0.1558616137727, 0.75, 0.32, 0.54, 0.22, 0.02, 0.1558616137727, 0.833, 0.02, 0.38, 0.72, 0.04, 0.1558616137727, 0.917, 0.02, 0.06, 0.32, 0.02, 0.1558616137727, 0.4, 0.4, 0.2, 0, 0, 0, 0, 0)
    // console.log(`Ammount of bikes needed is: ${prediction}`)
})
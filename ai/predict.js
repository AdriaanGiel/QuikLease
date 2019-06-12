// setup requirements
const brain = require('brain.js');
const jsonfile = require('jsonfile');
const file = './ai/network.json'

// function to map a number (input, original min, original max, desired min, desired max)
const map_range = (num, in_min, in_max, out_min, out_max) => {
    return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

// Load trained network from file
async function getNetwork() {
    try {
        return await jsonfile.readFile(file);
    } catch (error) {
        console.error(error);
    }
}

/*
    Numbers to predict for

*/
// Numbers to ask for a prediction <- Get these from the webpage in the future
let school_id = 0;
let current_bikes = 0.12;
let added_bikes = 0.82;
let removed_bikes = 0.7;
let demand = 0.08;
// Automaticaly set time
let timestamp = map_range(('0' + new Date().getHours()).slice(-2), 0, 100, 0, 1);

// Setup brain.js
const network = new brain.NeuralNetwork();

// Train network with existing network
async function predict(){
    let trainedNetwork = await getNetwork();
    if (trainedNetwork != null) {
        network.fromJSON(trainedNetwork);
        console.log("Network loaded");

        //ask for meaning
        let prediction = network.run({
            school_id: school_id,
            current_bikes: current_bikes,
            added_bikes: added_bikes,
            removed_bikes: removed_bikes,
            demand: demand,
            timestamp: timestamp
        });
        prediction = Math.floor(map_range(prediction.bikes, 0, 1, 0, 100));
        
        console.log("Amount of bikes needed is: " + prediction);
    } else {
        console.log("No network found");
    }
}

//predict
predict();
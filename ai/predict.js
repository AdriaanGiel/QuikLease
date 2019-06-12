// setup requirements
const brain = require('brain.js');
const jsonfile = require('jsonfile');
const file = './ai/network.json'

// Numbers to ask for a prediction
let query = [0, 0.02, 0.82, 0.88, 0.06, 0.38321] // 0.47
let query2 = [0, 0.64, 0.78, 0.14, 0.02, 0.38321] // 0.08
let query3 = [0, 0.04, 0.1, 0.06, 0.02, 0.38321] // 0.04
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

// Setup brain.js
// const network = new brain.NeuralNetwork();
const network = new brain.recurrent.RNN();
// const network = new brain.recurrent.LSTM();
// const network = new brain.recurrent.GRU();

// Train network with existing network
async function predict(){
    let trainedNetwork = await getNetwork();
    if (trainedNetwork != null) {
        network.fromJSON(trainedNetwork);
        console.log("Network loaded");
    } else {
        console.log("No network found");
    }

    //ask for meaning
    // let prediction = network.run(query);
    // prediction = Math.floor(map_range(prediction, 0, 1, 0, 100));
    // console.log(`Ammount of bikes needed is: ${prediction}`);
    console.log(network.run([query]));
    console.log(network.run(query2));
    console.log(network.run(query3));
}

//predict
predict();
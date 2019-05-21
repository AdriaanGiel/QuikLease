// setup requirements
const { AI_data } = require('../ai_database')
const util = require('util')
const brain = require('brain.js')

// Retrieve data from database
AI_data.findAll().then((results) => {
    // Debug 
    //console.log(util.inspect(results));

    // TRAINING DATA
    let AiData = []

    // Get all entries
    for (let result of results) {
        // Convert back from JSON
        let BikesData = JSON.parse(result.data)
        let weatherData = JSON.parse(result.weather)
        
        console.log("________________________________________________________________________")

        // Combine data from one period of HR locations
        for (let bikeData of BikesData) {
            AiData.push(Object.values(bikeData))
        }
        // Add the weather data after data form the 12 HR locations
        AiData.push(Object.values(weatherData))
        // Convert to one array
        AiData = [].concat.apply([], AiData);
    }
    // Debug
    console.log(AiData)
    


    // Setup brain.js
    const network = new brain.NeuralNetwork()
    
    // TRAINING DATA
    let trainingData = [
        // for each array of data (id's)
        { input: {/*AiData.index*/}, output: { fietesen: /* OriginalData.Demand */ } },
    ]

    // Train network
    // network.train(trainingData, {
    //     iterations: 2
    // })

    // Save the ai model
    //let Ai_model = network.toJSON()

    //network.fromJSON(trainingData);

    //ask for meaning
    // const prediction = network.run({ locatie: 1, weer: 30 })
    // console.log(`Ammount of bikes needed is: ${prediction}`)
})


/*/ Opbouw array
    [
        AI_data {
            id: 1{
                data:[{"school_id":0.083,"current_bikes":0.5,"added_bikes":0.52,"removed_bikes":0.4,"timestamp":0.1557840881637"},{},{} <-- voor elke locatie 1!],
                weather:[{"temperature":0.4,"windspeed":0.4,"thunderstorm":0,"drizzle":0,"rain":0,"snow":0,"atmosphere":0,"clouds":1}]
            },
            id: 2{
                data:[{"school_id":0.083,"current_bikes":0.5,"added_bikes":0.52,"removed_bikes":0.4,"timestamp":0.1557840881637"},{},{} <-- voor elke locatie 1!],
                weather:[{"temperature":0.4,"windspeed":0.4,"thunderstorm":0,"drizzle":0,"rain":0,"snow":0,"atmosphere":0,"clouds":1}]
            }
        }
    ]
    */
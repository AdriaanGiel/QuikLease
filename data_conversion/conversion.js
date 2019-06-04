// setup requirements
const { AI_data } = require('../ai_database')
const axios = require('axios');
const util = require('util');

let HRlocationsAmmount = 1; // How many locations to generate for
let iterations = 100;       // How many data entries to generate per location

// FUNCTIONS TO USE IN CODE
// generate random int between two values
function random_int(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}
// generate a given amount of random ints
const getRandomBikeIds = (ammount, min, max) => {
    let ids = []
    for (let index = 0; index < ammount; index++) {
        ids.push(random_int(min, max))
    }
    return ids
}
// function to map a number (input, original min, original max, desired min, desired max)
const map_range = (num, in_min, in_max, out_min, out_max) => {
    return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

// GET WEATHER DATA
async function getWeatherData() {
    let response = await axios.get("https://api.openweathermap.org/data/2.5/weather?q=Rotterdam&appid=3f34fa54268254527865437906d9f5bd")
    // GET THE WEATHER INFO
    let weathertype = response.data.weather[0].id;
    // get the temperature and convert to celsius
    let temperature = (response.data.main.temp - 272.15);
    // get the wind speed
    let windspeed = response.data.wind.speed
    let thunderstorm = 0;
    let drizzle = 0;
    let rain = 0;
    let snow = 0;
    let atmosphere = 0;
    let clouds = 0;

    // CONVERT TEMPERATURE
    if (-20 <= temperature <= -8) {
        temperature = 0.2;
    } else if (-9 <= temperature <= 4) {
        temperature = 0.4;
    } else if (5 <= temperature <= 16) {
        temperature = 0.6;
    } else if (17 <= temperature <= 29) {
        temperature = 0.8;
    } else if (30 <= temperature <= 40) {
        temperature = 1.0;
    }
    // CONVERT WIND SPEED
    if (0 <= windspeed <= 0.2) {
        windspeed = 0.2; //windkracht 0
    } else if (0.3 <= windspeed <= 1.5) {
        windspeed = 0.4; //windkracht 1
    } else if (1.6 <= windspeed <= 3.3) {
        windspeed = 0.6; //windkracht 2
    } else if (3.4 <= windspeed <= 5.4) {
        windspeed = 0.8; //windkracht 3
    } else if (windspeed >= 5.5) {
        windspeed = 1.0; //windkracht 4 of meer
    }
    // CONVERT THUNDERSTORM
    if (weathertype < 300) {
        if (200 <= weathertype <= 206) {
            thunderstorm = 0.2;
        } else if (207 <= weathertype <= 213) {
            thunderstorm = 0.4;
        } else if (214 <= weathertype <= 219) {
            thunderstorm = 0.6;
        } else if (220 <= weathertype <= 225) {
            thunderstorm = 0.8;
        } else if (226 <= weathertype <= 232) {
            thunderstorm = 1.0;
        }
    }
    // CONVERT DRIZZLE
    else if (weathertype < 400) {
        if (300 <= weathertype <= 303) {
            drizzle = 0.2;
        } else if (304 <= weathertype <= 307) {
            drizzle = 0.4;
        } else if (308 <= weathertype <= 312) {
            drizzle = 0.6;
        } else if (313 <= weathertype <= 316) {
            drizzle = 0.8;
        } else if (317 <= weathertype <= 321) {
            drizzle = 1.0;
        }
    }
    // CONVERT RAIN
    else if (weathertype < 600) {
        if (500 <= weathertype <= 206) {
            rain = 0.2;
        } else if (507 <= weathertype <= 513) {
            rain = 0.4;
        } else if (514 <= weathertype <= 519) {
            rain = 0.6;
        } else if (520 <= weathertype <= 525) {
            rain = 0.8;
        } else if (526 <= weathertype <= 531) {
            rain = 1.0;
        }
    }
    // CONVERT SNOW
    else if (weathertype < 700) {
        if (600 <= weathertype <= 603) {
            snow = 0.2;
        } else if (604 <= weathertype <= 607) {
            snow = 0.4;
        } else if (608 <= weathertype <= 612) {
            snow = 0.6;
        } else if (613 <= weathertype <= 616) {
            snow = 0.8;
        } else if (617 <= weathertype <= 622) {
            snow = 1.0;
        }
    }
    // CONVERT ATMOSPHERE
    else if (weathertype < 799) {
        if (701 <= weathertype <= 717) {
            atmosphere = 0.2;
        } else if (718 <= weathertype <= 733) {
            atmosphere = 0.4;
        } else if (734 <= weathertype <= 749) {
            atmosphere = 0.6;
        } else if (750 <= weathertype <= 766) {
            atmosphere = 0.8;
        } else if (767 <= weathertype <= 781) {
            atmosphere = 1.0;
        }
    }
    // CONVERT CLOUDS
    else if (weathertype < 900) {
        if (weathertype == 800) {
            clouds = 0.2;
        } else if (weathertype == 801) {
            clouds = 0.4;
        } else if (weathertype == 802) {
            clouds = 0.6;
        } else if (weathertype == 803) {
            clouds = 0.8;
        } else if (weathertype == 804) {
            clouds = 1.0;
        }
    }
    result = {
        "temperature": temperature,
        "windspeed": windspeed,
        "thunderstorm": thunderstorm,
        "drizzle": drizzle,
        "rain": rain,
        "snow": snow,
        "atmosphere": atmosphere,
        "clouds": clouds
    }
    return result
}

async function getBikeData() {
    // GET BIKE RACKS DATA
    // get data from raw data database

    // instead of getting it from a server we make a temporary data array
    //let students = [];
    let school_id;
    let added_bikes = [];
    let removed_bikes = [];
    let current_bikes = [];
    let demand;
    let timestamp;
    let output;

    let locationsData = [];
    //Generate bike data

    for (let index = 0; index < HRlocationsAmmount; index++) {
        //students.push(random_int(1000, 4000));
        school_id = index;
        // calculate bike id's and the total bikes at location based on bikes added and removed
        let added = random_int(0, 50);
        let removed = random_int(0, 50);
        let total = added - removed;
        if (total < 0) {
            total = 1;
        } else if (total > 50) {
            total = 50;
        }
        // get arrays with bike id's
        added_bikes = getRandomBikeIds(added, 0, 500);
        removed_bikes = getRandomBikeIds(removed, 0, 500);
        current_bikes = getRandomBikeIds(total, 0, 500);
        demand = random_int(0, 4);
        // get time in hh:mm
        let today = new Date();
        timestamp = today.getHours() + "" + ('0' + today.getMinutes()).slice(-2);
        output = (removed_bikes.length + demand)

        // add to final array
        locationsData.push(
            {
                "school_id": school_id,
                //"students": students,
                "added_bikes": added_bikes,
                "removed_bikes": removed_bikes,
                "current_bikes": current_bikes,
                "demand": demand,
                "timestamp": timestamp
            }
        )
    }
    let school_data = {
        "school": locationsData
    }

    // loop trough all entries in school data
    let mapped_school_data = school_data.school.map((school) => {

        // CONVERT LOCATION ID
        let school_id = parseFloat(map_range(school.school_id, 0, 12, 0, 1).toFixed(3));

        // CONVERT TOTAL AMOUNT OF BIKES
        // first calculate how much bikes there are (sum of all bike id's)
        let current_bikes = map_range(school.current_bikes.length, 0, 50, 0, 1);

        // CONVERT BIKES ADDED
        // first calculate how much bikes there are (sum of all bike id's)
        let added_bikes = map_range(school.added_bikes.length, 0, 50, 0, 1);

        // CONVERT BIKES REMOVED
        // first calculate how much bikes there are (sum of all bike id's)
        let removed_bikes = map_range(school.removed_bikes.length, 0, 50, 0, 1);

        // CONVERT DEMAND
        let demand = parseFloat(map_range(school.demand, 0, 50, 0, 1).toFixed(3));

        // CONVERT TIMESTAMP
        let timestamp = map_range(school.timestamp, 0, 2359, 0, 1);

        return {
            school_id: school_id,
            current_bikes: current_bikes,
            added_bikes: added_bikes,
            removed_bikes: removed_bikes,
            demand: demand,
            timestamp: timestamp,
            output: output
        }
    });
    //console.log(mapped_school_data)
    return mapped_school_data
}

// SEND CONVERTED DATA TO AI DATABASE
async function sendData() {
    let bike_data = await getBikeData()
    let weather_data = await getWeatherData()

    let data = await AI_data.create({
        data: JSON.stringify(bike_data),
        weather: JSON.stringify(result)
    })
}

for (let iteration = 0; iteration < iterations; iteration++) {
    sendData()
}
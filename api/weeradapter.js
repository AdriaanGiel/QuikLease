
const axios = require('axios');
const util = require('util');

function getWeather(){

    
    console.log("in weer function")
    url = "https://api.openweathermap.org/data/2.5/weather?q=Rotterdam&appid=3f34fa54268254527865437906d9f5bd"

    axios.get("https://api.openweathermap.org/data/2.5/weather?q=Rotterdam&appid=3f34fa54268254527865437906d9f5bd"
    )
        .then(function (response) {

            // get temp
            let temp= response.data.main.temp
            console.log("temp in kelvin" + temp)
            //temp is in kelvin change to celsius
            let temperature = temp - 272.15
            console.log("temp in celsius " +temperature)
            //change value temp to value in 0-1
            // get weathertype
             let weathertype = response.data.weather[0].id
            // console.log("weathertype = " + weathertype);
            console.log("weathertype:" + weathertype);
            
            let AiDataWeathertype;
            let thunderstorm = 0;
            let drizzle = 0;
            let rain = 0;
            let snow = 0;
            let atmosphere = 0;
            let clouds = 0;
            let Aitemperature

            console.log("tempur",temperature >= -20);
            console.log("tempur8",temperature <= -8);

            console.log("tempur cel",temperature);

            if (temperature > -20  && temperature <= -8){
                console.log("in temp 0.2")
                Aitemperature = 0.2
            } else if (temperature > -9 && temperature <= 4){
                console.log("in temp 0.4")
                Aitemperature = 0.4
            } else if (temperature > 5 && temperature <= 16){
                console.log("in temp 0.6")
                Aitemperature = 0.6
            } else if (temperature > 16 && temperature <= 29){
                console.log("in temp 0.8")
                Aitemperature = 0.8
            } else if (temperature > 29 && temperature <= 40){
                console.log("in temp 1")
                Aitemperature = 1.0
            }

            if(weathertype < 300){
                
                if(200 <=  weathertype <= 206){
                    thunderstorm = 0.2;
                } else if(207 <= weathertype <= 213){
                    thunderstorm = 0.4;
                } else if(214 <= weathertype <= 219){
                    thunderstorm = 0.6;
                } else if(220 <= weathertype <= 225){
                    thunderstorm = 0.8;
                } else if(226 <= weathertype <= 232){
                    thunderstorm = 1.0;
                } 
                console.log("thunderstorm: " + thunderstorm)


            } else if(weathertype < 400){
                //weathertype = drizzle change to 0-1 value
                if(300 <=  weathertype <= 303){
                    drizzle = 0.2;
                } else if(304 <= weathertype <= 307){
                    drizzle = 0.4;
                } else if(308 <= weathertype <= 312){
                    drizzle = 0.6;
                } else if(313 <= weathertype <= 316){
                    drizzle = 0.8;
                } else if(317 <= weathertype <= 321){
                    drizzle = 1.0;
                } 
                console.log("drizzle: " + drizzle)

            } else if(weathertype < 600){
                //weathertype = rain change to 0-1 value
                if(500 <=  weathertype <= 206){
                    rain = 0.2;
                } else if(507 <= weathertype <= 513){
                    rain = 0.4;
                } else if(514 <= weathertype <= 519){
                    rain = 0.6;
                } else if(520 <= weathertype <= 525){
                    rain = 0.8;
                } else if(526 <= weathertype <= 531){
                    rain = 1.0;
                }

                console.log("rain: " + rain)

            } else if(weathertype < 700){
                //weathertype = snow change to 0-1 value
                if(600 <=  weathertype <= 603){
                    snow = 0.2;
                } else if(604 <= weathertype <= 607){
                    snow = 0.4;
                } else if(608 <= weathertype <= 612){
                    snow = 0.6;
                } else if(613 <= weathertype <= 616){
                    snow = 0.8;
                } else if(617 <= weathertype <= 622){
                    snow = 1.0;
                } 
                //snow = map_range(weathertype, 600, 622, 0.043478, 1);
                console.log("snow: "+ snow);

            } else if(weathertype < 799){
                //weathertype = atmosphere change to 0-1 value
                //atmosphere = map_range(weathertype, 701, 781, 0.01234568, 1);
                if(701 <=  weathertype <= 717){
                    atmosphere = 0.2;
                } else if(718 <= weathertype <= 733){
                    atmosphere = 0.4;
                } else if(734 <= weathertype <= 749){
                    atmosphere = 0.6;
                } else if(750 <= weathertype <= 766){
                    atmosphere = 0.8;
                } else if(767 <= weathertype <= 781){
                    atmosphere = 1.0;
                } 
                console.log("atmosphere : "+ atmosphere);

            } else if(weathertype < 900){
                //weathertype = clouds change to 0-1 value
                clouds = map_range(weathertype, 800, 804, 0.2, 1);
                if(weathertype = 800){
                    drizzle = 0.2;
                } else if(weathertype = 801){
                    drizzle = 0.2;
                } else if(weathertype = 802){
                    drizzle = 0.2;
                } else if(weathertype = 803){
                    drizzle = 0.2;
                } else if(weathertype = 804){
                    drizzle = 0.2;
                } 
                console.log("clouds:"+ clouds)
            }

            result = {
                "temperature" : Aitemperature,
                "thunderstorm" : thunderstorm,
                "drizzle" : drizzle,
                "rain" : rain,
                "snow" : snow,
                "atmosphere" : atmosphere,
                "clouds" : clouds
            }

            console.log(util.inspect(result))
                
            console.log("aidata: "+ AiDataWeathertype);
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
        .then(function () {
            // always executed
        });

   
}

// map low1/high1 are old values (-20 - 40), low2/high2 are new values(0-1)
function map_range(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

getWeather();

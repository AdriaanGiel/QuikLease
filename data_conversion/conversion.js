// GET WEATHER DATA
const {AI_data} = require('../ai_database')
const axios = require('axios');
const util = require('util');

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

    // instead of getting it from a server we make a temporary data array
    let school_data = 
    {
        school: [
            {
                school_id: 1,
                school_name: "Nicolas Inc",
                timestamp: 1557840881637,
                total_bikes: 45,
                current_bikes: [
                    2,
                    26,
                    78,
                    81,
                    84,
                    92,
                    99,
                    126,
                    145,
                    173,
                    218,
                    220,
                    294,
                    313,
                    350,
                    373,
                    385,
                    419,
                    508,
                    515,
                    519,
                    544,
                    567,
                    575,
                    625
                ],
                added_bikes: [
                    109,
                    117,
                    140,
                    157,
                    637,
                    661,
                    62,
                    217,
                    47,
                    338,
                    32,
                    126,
                    109,
                    396,
                    420,
                    51,
                    230,
                    474,
                    351,
                    269,
                    152,
                    228,
                    187,
                    63,
                    408,
                    135
                ],
                removed_bikes: [
                    199,
                    328,
                    51,
                    117,
                    145,
                    201,
                    136,
                    326,
                    175,
                    403,
                    25,
                    414,
                    155,
                    106,
                    408,
                    148,
                    189,
                    184,
                    12,
                    267
                ]
            },
            {
                school_id: 2,
                school_name: "Gibson Inc",
                timestamp: 1557840881638,
                total_bikes: 45,
                current_bikes: [
                    6,
                    24,
                    35,
                    40,
                    70,
                    153,
                    190,
                    236,
                    266,
                    334,
                    364,
                    370,
                    472,
                    476,
                    477,
                    492,
                    505,
                    582,
                    604,
                    629
                ],
                added_bikes: [
                    398,
                    443,
                    453,
                    490,
                    546,
                    576,
                    584,
                    637,
                    661,
                    62,
                    455,
                    373,
                    10,
                    367,
                    225,
                    331,
                    408,
                    135
                ],
                removed_bikes: [
                    56,
                    416,
                    250,
                    475,
                    187,
                    301,
                    67,
                    47,
                    127,
                    193,
                    378,
                    302,
                    298,
                    303,
                    139,
                    114,
                    448,
                    111,
                    253,
                    231,
                    391,
                    15,
                    280,
                    314,
                    58
                ]
            },
            {
                school_id: 3,
                school_name: "Kilback LLC",
                timestamp: 1557840881638,
                total_bikes: 45,
                current_bikes: [
                    7,
                    41,
                    136,
                    169,
                    204,
                    243,
                    269,
                    331,
                    344,
                    368,
                    493,
                    498,
                    532,
                    547,
                    603,
                    647
                ],
                added_bikes: [
                    398,
                    443,
                    453,
                    490,
                    546,
                    576,
                    584,
                    637,
                    661,
                    62,
                    455,
                    373,
                    10,
                    367,
                    225,
                    331,
                    408,
                    135
                ],
                removed_bikes: [
                    32,
                    379,
                    219,
                    174,
                    270,
                    25,
                    453,
                    480,
                    487,
                    58,
                    472,
                    465,
                    71,
                    131,
                    175,
                    45,
                    297,
                    287,
                    138,
                    283,
                    274,
                    43,
                    437,
                    93,
                    283,
                    317,
                    245,
                    21,
                    263
                ]
            },
            {
                school_id: 4,
                school_name: "Lakin LLC",
                timestamp: 1557840881638,
                total_bikes: 45,
                current_bikes: [
                    9,
                    29,
                    34,
                    105,
                    115,
                    120,
                    142,
                    174,
                    175,
                    189,
                    208,
                    285,
                    293,
                    297,
                    303,
                    311,
                    333,
                    341,
                    365,
                    372,
                    422,
                    438,
                    464,
                    585,
                    591,
                    592,
                    609,
                    613,
                    634,
                    659,
                    667
                ],
                added_bikes: [
                    109,
                    117,
                    140,
                    157,
                    637,
                    661,
                    62,
                    217,
                    47,
                    338,
                    32,
                    126,
                    109,
                    396,
                    420,
                    51,
                    230,
                    474,
                    351,
                    269,
                    152,
                    228,
                    187,
                    63,
                    408,
                    135
                ],
                removed_bikes: [
                    88,
                    111,
                    361,
                    141,
                    1,
                    125,
                    434,
                    466,
                    133,
                    289,
                    469,
                    263,
                    475,
                    332
                ]
            },
            {
                school_id: 5,
                school_name: "Bailey - Breitenberg",
                timestamp: 1557840881638,
                total_bikes: 45,
                current_bikes: [
                    11,
                    42,
                    57,
                    60,
                    64,
                    91,
                    113,
                    180,
                    193,
                    213,
                    240,
                    242,
                    288,
                    378,
                    446,
                    461,
                    482,
                    594,
                    605,
                    618
                ],
                added_bikes: [
                    157,
                    170,
                    254,
                    275,
                    302,
                    318,
                    330,
                    398,
                    443,
                    453,
                    490,
                    217,
                    47,
                    338,
                    32,
                    126,
                    109,
                    396,
                    420,
                    51,
                    230,
                    474,
                    351,
                    491,
                    305,
                    29,
                    455,
                    373,
                    10,
                    367,
                    225,
                    331,
                    269,
                    152,
                    228,
                    187,
                    63,
                    408,
                    135
                ],
                removed_bikes: [
                    490,
                    407,
                    82,
                    225,
                    255,
                    210,
                    359,
                    124,
                    265,
                    371,
                    93,
                    404,
                    497,
                    147,
                    423,
                    474,
                    117,
                    135,
                    258,
                    456,
                    224,
                    124,
                    303,
                    46,
                    135
                ]
            },
            {
                school_id: 6,
                school_name: "Turner - O'Hara",
                timestamp: 1557840881638,
                total_bikes: 45,
                current_bikes: [
                    15,
                    54,
                    85,
                    88,
                    98,
                    133,
                    186,
                    203,
                    256,
                    307,
                    312,
                    371,
                    380,
                    388,
                    396,
                    400,
                    430,
                    437,
                    444,
                    445,
                    450,
                    452,
                    468,
                    521,
                    527,
                    578,
                    620,
                    632,
                    655
                ],
                added_bikes: [
                    109,
                    117,
                    140,
                    157,
                    170,
                    254,
                    275,
                    302,
                    318,
                    135
                ],
                removed_bikes: [
                    153,
                    475,
                    79,
                    367,
                    354,
                    97,
                    143,
                    347,
                    239,
                    248,
                    386,
                    30,
                    447,
                    471,
                    13,
                    23
                ]
            },
            {
                school_id: 7,
                school_name: "Grimes and Sons",
                timestamp: 1557840881638,
                total_bikes: 45,
                current_bikes: [
                    16,
                    111,
                    132,
                    158,
                    224,
                    246,
                    250,
                    277,
                    325,
                    339,
                    345,
                    379,
                    401,
                    409,
                    420,
                    426,
                    428,
                    442,
                    451,
                    457,
                    524,
                    541,
                    564,
                    573,
                    624,
                    656,
                    674
                ],
                added_bikes: [
                    109,
                    491,
                    305,
                    29,
                    455,
                    373,
                    10,
                    367,
                    225,
                    331,
                    269,
                    152,
                    228,
                    187,
                    63,
                    408,
                    135
                ],
                removed_bikes: [
                    439,
                    141,
                    130,
                    326,
                    204,
                    211,
                    351,
                    257,
                    329,
                    21,
                    57,
                    422,
                    45,
                    314,
                    376,
                    390,
                    93,
                    95
                ]
            },
            {
                school_id: 8,
                school_name: "Balistreri - Smith",
                timestamp: 1557840881638,
                total_bikes: 45,
                current_bikes: [
                    18,
                    32,
                    93,
                    118,
                    129,
                    159,
                    160,
                    185,
                    211,
                    225,
                    227,
                    228,
                    239,
                    253,
                    384,
                    480,
                    528,
                    539,
                    562,
                    595,
                    672
                ],
                added_bikes: [
                    367,
                    225,
                    331,
                    269,
                    152,
                    228,
                    187,
                    63,
                    408,
                    135
                ],
                removed_bikes: [
                    139,
                    135,
                    483,
                    295,
                    193,
                    89,
                    353,
                    251,
                    110,
                    434,
                    225,
                    461,
                    285,
                    147,
                    128,
                    396,
                    458,
                    212,
                    470,
                    200,
                    58,
                    405,
                    75,
                    38
                ]
            },
            {
                school_id: 9,
                school_name: "Kiehn Inc",
                timestamp: 1557840881638,
                total_bikes: 45,
                current_bikes: [
                    19,
                    58,
                    124,
                    165,
                    194,
                    199,
                    234,
                    289,
                    358,
                    360,
                    366,
                    403,
                    540,
                    583,
                    597,
                    653
                ],
                added_bikes: [
                    398,
                    443,
                    453,
                    490,
                    546,
                    576,
                    584,
                    637,
                    661,
                    62,
                    455,
                    373,
                    10,
                    367,
                    225,
                    331,
                    408,
                    135
                ],
                removed_bikes: [
                    81,
                    303,
                    88,
                    150,
                    480,
                    332,
                    28,
                    192,
                    448,
                    479,
                    243,
                    219,
                    255,
                    494,
                    172,
                    21,
                    238,
                    323,
                    29,
                    5,
                    446,
                    459,
                    219,
                    246,
                    338,
                    43,
                    276,
                    355,
                    260
                ]
            },
            {
                school_id: 10,
                school_name: "Walker - Flatley",
                timestamp: 1557840881638,
                total_bikes: 45,
                current_bikes: [
                    20,
                    21,
                    27,
                    63,
                    83,
                    112,
                    192,
                    284,
                    359,
                    402,
                    407,
                    432,
                    473,
                    510,
                    555,
                    608,
                    639,
                    650
                ],
                added_bikes: [
                    109,
                    187,
                    135
                ],
                removed_bikes: [
                    453,
                    354,
                    222,
                    429,
                    464,
                    457,
                    398,
                    41,
                    179,
                    430,
                    442,
                    69,
                    282,
                    181,
                    388,
                    248,
                    386,
                    349,
                    434,
                    299,
                    126,
                    333,
                    366,
                    435,
                    410,
                    497,
                    320
                ]
            },
            {
                school_id: 11,
                school_name: "Schimmel, Toy and Hand",
                timestamp: 1557840881638,
                total_bikes: 45,
                current_bikes: [
                    25,
                    36,
                    37,
                    39,
                    75,
                    79,
                    187,
                    197,
                    209,
                    259,
                    271,
                    298,
                    348,
                    361,
                    362,
                    375,
                    418,
                    441,
                    499,
                    500,
                    522,
                    523,
                    531,
                    553,
                    558,
                    560,
                    574,
                    589,
                    599,
                    627,
                    636,
                    662,
                    669,
                    671
                ],
                added_bikes: [
                    109,
                    117,
                    330,
                    398,
                    443,
                    453,
                    490,
                    546,
                    576,
                    584,
                    637,
                    230,
                    474,
                    351,
                    491,
                    305,
                    29,
                    455,
                    373,
                    10,
                    367,
                    225,
                    331,
                    269,
                    152,
                    228,
                    187,
                    63,
                    408,
                    135
                ],
                removed_bikes: [
                    163,
                    367,
                    416,
                    477,
                    30,
                    442,
                    8,
                    7,
                    248,
                    176,
                    29
                ]
            },
            {
                school_id: 11,
                school_name: "Reichel LLC",
                timestamp: 1557840881638,
                total_bikes: 45,
                current_bikes: [
                    50,
                    67,
                    69,
                    74,
                    108,
                    144,
                    146,
                    154,
                    171,
                    216,
                    222,
                    238,
                    286,
                    324,
                    355,
                    356,
                    399,
                    429,
                    447,
                    481,
                    483,
                    511,
                    549,
                    577,
                    610,
                    645
                ],
                added_bikes: [
                    109,
                    117,
                    140,
                    157,
                    170,
                    254,
                    135
                ],
                removed_bikes: [
                    147,
                    317,
                    233,
                    455,
                    118,
                    371,
                    80,
                    36,
                    428,
                    277,
                    370,
                    47,
                    284,
                    429,
                    300,
                    29,
                    8,
                    285,
                    153
                ]
            },
            {
                school_id: 12,
                school_name: "Nikolaus - Reinger",
                timestamp: 1557840881638,
                total_bikes: 45,
                current_bikes: [
                    55,
                    95,
                    96,
                    106,
                    195,
                    223,
                    232,
                    233,
                    270,
                    273,
                    283,
                    292,
                    300,
                    340,
                    353,
                    377,
                    414,
                    440,
                    478,
                    491,
                    612,
                    616,
                    630,
                    631
                ],
                added_bikes: [
                    157,
                    170,
                    254,
                    275,
                    302,
                    318,
                    330,
                    398,
                    443,
                    453,
                    490,
                    217,
                    47,
                    338,
                    32,
                    126,
                    109,
                    396,
                    420,
                    51,
                    230,
                    474,
                    351,
                    491,
                    305,
                    29,
                    455,
                    373,
                    10,
                    367,
                    225,
                    331,
                    269,
                    152,
                    228,
                    187,
                    63,
                    408,
                    135
                ],
                removed_bikes: [
                    284,
                    145,
                    131,
                    228,
                    187,
                    138,
                    408,
                    191,
                    433,
                    18,
                    145,
                    166,
                    356,
                    308,
                    279,
                    91,
                    485,
                    221,
                    198,
                    123,
                    498
                ]
            },
            {
                school_id: 12,
                school_name: "Ruecker LLC",
                timestamp: 1557840881638,
                total_bikes: 45,
                current_bikes: [
                    90,
                    97,
                    119,
                    183,
                    184,
                    191,
                    252,
                    261,
                    346,
                    376,
                    425,
                    513,
                    556,
                    569,
                    588,
                    648
                ],
                added_bikes: [
                    109,
                    117,
                    140,
                    157,
                    170,
                    254,
                    275,
                    302,
                    318,
                    330,
                    398,
                    443,
                    453,
                    490,
                    546,
                    576,
                    225,
                    331,
                    269,
                    152,
                    228,
                    187,
                    63,
                    408,
                    135
                ],
                removed_bikes: [
                    62,
                    217,
                    47,
                    338,
                    32,
                    126,
                    109,
                    396,
                    420,
                    51,
                    230,
                    474,
                    351,
                    491,
                    305,
                    29,
                    455,
                    373,
                    10,
                    367,
                    225,
                    331,
                    269,
                    152,
                    228,
                    187,
                    63,
                    408,
                    135
                ]
            },
            {
                school_id: 12,
                school_name: "Doyle and Sons",
                timestamp: 1557840881638,
                total_bikes: 45,
                current_bikes: [
                    109,
                    117,
                    140,
                    157,
                    170,
                    254,
                    275,
                    302,
                    318,
                    330,
                    398,
                    443,
                    453,
                    490,
                    546,
                    576,
                    584,
                    637,
                    661
                ],
                added_bikes: [
                    109,
                    117,
                    140,
                    157,
                    637,
                    661,
                    62,
                    217,
                    47,
                    338,
                    32,
                    126,
                    109,
                    396,
                    420,
                    51,
                    230,
                    474,
                    351,
                    269,
                    152,
                    228,
                    187,
                    63,
                    408,
                    135
                ],
                removed_bikes: [
                    347,
                    307,
                    229,
                    170,
                    283,
                    414,
                    29,
                    399,
                    45,
                    98,
                    28,
                    378,
                    116,
                    102,
                    75,
                    366,
                    67,
                    298,
                    421,
                    157,
                    398,
                    439,
                    228,
                    410,
                    329,
                    275
                ]
            }
        ]
    }

    // function to map a number (input, original min, original max, desired min, desired max)
    const map_range = (num, in_min, in_max, out_min, out_max) => {
        return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
    }

    // loop trough all entries in mega data
    let mapped_school_data = school_data.school.map((school) => {
        
        // CONVERT LOCATION ID
        let school_id = map_range(school.school_id, 0, 12, 0, 1).toFixed(3);

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

        // CONVERT TIMESTAMP
        let timestamp = "0,"+ school.timestamp

        return {
            school_id: school_id,
            current_bikes: current_bikes,
            added_bikes: added_bikes,
            removed_bikes: removed_bikes,
            timestamp: timestamp,
        } 
    });
    return mapped_school_data
}

// SEND CONVERTED DATA TO AI DATABASE
async function sendData(){
    let bike_data = await getBikeData()
    let weather_data = await getWeatherData()
    let data = await AI_data.create({
        data: JSON.stringify(bike_data),
        weather: JSON.stringify(result)
    })
    // debug result
    //console.log("bike data: " + util.inspect(bike_data));
    //console.log("weather data: " + util.inspect(weather_data));
    console.log(data)
}

sendData()
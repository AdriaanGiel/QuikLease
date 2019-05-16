// GET WEATHER DATA
/*
axios.get("https://api.openweathermap.org/data/2.5/weather?q=Dallas&appid=3f34fa54268254527865437906d9f5bd")
.then(function (response) {

    // get temperature and convert to *C
    let temp = (response.data.main.temp - 272.15);
    // // get weathertype
    let weathertype = response.data.weather[0].id;
    let AiDataWeathertype;
    let thunderstorm = 0;
    let drizzle = 0;
    let rain = 0;
    let snow = 0;
    let atmosphere = 0;
    let clouds = 0;
})
*/

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
    let school_id = map_range(school.school_id, 0, 12, 0, 1);
    console.log(current_bikes)

    // CONVERT TOTAL AMOUNT OF BIKES
    // first calculate how much bikes there are (sum of all bike id's)
    let current_bikes = map_range(school.current_bikes.length, 0, 50, 0, 1);
    current_bikes = map_range(0,10,0,1)
    console.log(current_bikes)

    // CONVERT BIKES ADDED

    // CONVERT BIKES REMOVED

    // CONVERT DEMAND

    // CONVERT TIMESTAMP

    return {
        school_id: school.school_id,
        //current_bikes: school.current_bikes,
        //omgevormt: school.timestamps
    } 
});

// SEND CONVERTED DATA TO AI DATABASE
// temporary log the data for debugging
//console.log(mapped_school_data);
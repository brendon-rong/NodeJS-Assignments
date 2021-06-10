//Imports
const request = require('request');
const express = require('express');
const {
    createLogger,
    winston,
    format,
    transports
} = require('winston');
var admin = require("firebase-admin");
var serviceAccount = require("C:\\Users\\bmjr\\Desktop\\Desktop\\Refreshers\\NodeJS\\NodeJS-Course\\firebase testing\\weather-api-529a3-firebase-adminsdk-jb5ps-ca659df1a2.json");

const app = express();

//Logger format
const {
    combine,
    timestamp,
    label,
    printf
} = format;
const logFormat = printf(({
    level,
    message,
    label,
    timestamp
}) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
});

//Creating a logger to log actions in a log file
const logger = createLogger({
    transports: [
        // new transports.Console(),
        new transports.File({
            filename: 'apiExecution.log'
        })
    ],
    format: combine(
        label({
            label: 'Hello'
        }),
        timestamp(),
        logFormat
    )
});
//Level for error and info
const loggerLevels = {
    error: 0,
    info: 1,
};

//Using dotenv
require('dotenv').config();

// Initialize the app with a service account, granting admin privileges
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://weather-api-529a3-default-rtdb.firebaseio.com/"
});

const db = admin.database();
const ref = db.ref('city');

//Declaring the api key as a key pair secret
//Declaring the default city and
const apiKey = process.env.apiKey;
// let city = 'Brampton';

//Get input from the user showing them a simple hmtl form
app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.get('/getweather', function (req, res) {

    let city = req.query.city_field;
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    request(url, function (error, response, body) {

        if (error) {
            console.log('error', error);
            logger.error(error);
        } else {

            let cityRef = ref.child(city);
            // res.send(`body ${body}`);
            let weather = JSON.parse(body);

            // console.log(weather);

            if (weather.message == 'city not found') {
                res.sendFile(__dirname + "/error.html");
                logger.log({
                    level: 'error',
                    message: 'Error city not found!'
                });
            } else {

                try {
                    cityRef.once('value', (snapshot => {
                        snapshot.exists();
                    }));
                } catch (err) {
                    logger.error(err);
                }

                //Getting db time 
                let dbTime = 0;
                cityRef.child('time').once('value', (data) => {

                    dbTime = data.val();
                    // console.log(`===========Inside query dbTime ${dbTime}===========`);

                    //Check to return weather details from API or or from DB
                    let curTime = Math.floor(Date.now() / 1000);
                    // console.log(`curTime: ${curTime} dbTime: ${dbTime} diff: ${curTime - dbTime}`);
                    // console.log(`curTime: ${curTime} `);

                    // Comparing current time and db time to check < 20 secs
                    logger.info('Checking to see if time has been > 20 secs');
                    if ((curTime - dbTime) < 20) {
                        console.log('<20seconds');
                        //Query for the db and return db info
                        cityRef.once('value', (snapshot => {
                            res.send(snapshot.val());
                        }));
                        logger.info('Time is < 20 seconds! Dislpayed weather from db table');
                    } else {
                        console.log('>20seconds');
                        //Get the newest weather from API and set it on DB as well as respond
                        //Dumping the weather info onto the DB table
                        cityRef.set(weather);
                        cityRef.child('time').set(Math.floor(Date.now() / 1000));
                        res.send('It has been ' + (curTime - dbTime) + 's \n this is the new API info' + body);
                        logger.info('Time is > 20 seconds! Dumped weather into db table');
                    }
                });
            }
        }
    });

});

app.listen(3000, () => console.log('Server started on port 3000'));

module.exports = app;
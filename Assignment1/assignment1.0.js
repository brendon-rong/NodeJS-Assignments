//Import modules
const https = require('https');

//Creating an array of promises
var promises = [];
var online = [];

//Creating a list of servers
var urlArr = [{
        "url": "https://www.doesNotExist.boldtech.co/",
        "priority": 1
    },
    {
        "url": "https://www.google.com/",
        "priority": 4
    },
    {
        "url": "https://github.com/",
        "priority": 7
    },
    {
        "url": "https://www.offline.boldtech.co/",
        "priority": 2
    },
    {
        "url": "https://www.youtube.com/",
        "priority": 3
    }
];

//Function to get requests to all servers
function getRequests(urlObj) {

    //Return a promise for each request
    return new Promise(function (resolve, reject) {
        //Making an http request
        let req = https.request(urlObj.url, (resp) => {
            //Check if within range for online
            if (200 >= resp.statusCode && resp.statusCode <= 299) {
                resolve(urlObj);
            } else {
                reject();
            }
        });
        //Reject the promise if theres an error with the request
        req.on('error', (e) => {
            reject();
        });

        //Ending the request if timeout > 5 seconds
        req.setTimeout(5000, () => {
            req.end();
            reject();
        });
        //End the request
        req.end();

    }).catch((error) => {
        // console.log(`error with url ${urlObj.url}\n`);
        // console.log(error.url + 'failed');

    });
}

//Making multiple GET requests simultaneously
for (let i = 0; i < urlArr.length; i++) {
    promises.push(getRequests(urlArr[i]));
}

//Check if servers are offline or not
Promise.all(promises).then(results => {
    console.log(results);
    online = [...results];
    // console.log(online);
    findServer();
});

//Function to find server
function findServer() {

    //Promise to find if all servers are offline or not
    return new Promise(function (resolve, reject) {

        //Filtering the array of online servers removing the undefineds
        online = online.filter(function (value, index, arr) {
            return value != undefined;
        });
        // console.log(online);
        //Sorting the array using a comparator to sort by priority property
        online.sort(compare);

        //Using a try catch to enact the resolve and reject flow
        try {
            //Promise resolved if there is a lowest prio server
            resolve(online[0]);
        } catch (err) {
            //Promise rejected if no servers online
            reject();
        }

        //If promise fulfilled resolve with the url
    }).then((urlObj) => {
        console.log(`Url: ${urlObj.url} has the lowest priority of ${urlObj.priority}`);
        //If promise rejected notify no servers
    }).catch(() => {
        console.log('No Servers online! Promise rejected!');
    });
}

//Creating a comparator to sort by priority
function compare(a, b) {
    if (a.priority < b.priority)
        return -1;
    if (a.priority > b.priority)
        return 1;
    return 0;
}

module.exports = {
    getRequests,
    findServer,
    compare,
    urlArr
};
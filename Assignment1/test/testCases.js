const assert = require('assert');
const assignment1 = require('../assignment1.0');

describe('Requests function test', function () {

    it('getRequest should return type Promise', function () {
        let urlObj = assignment1.urlArr[0];
        assert.rejects(assignment1.getRequests(urlObj), 'Promise');
    });

    it('getRequest should return the url object', function () {
        let urlObj = assignment1.urlArr[2];
        console.log(assignment1.getRequests(urlObj));
        assert.rejects(assignment1.getRequests(urlObj), 'Promise');
    });

});

describe('Findserver test', function () {

    it('should return https://www.youtube.com/ ', function () {
        let promises = [];
        assignment1.urlArr.forEach(element => {
            promises.push(assignment1.getRequests(element));
        });
        Promise.all(promises).then(results => {
            online = [...results];
            assignment1.findServer();
        });

    });

    it('should return lowest priority', function () {
        let promises = [];
        assignment1.urlArr.forEach(element => {
            promises.push(assignment1.getRequests(element));
        });
        Promise.all(promises).then(results => {
            online = [...results];
            assignment1.findServer();
        });
    });
});

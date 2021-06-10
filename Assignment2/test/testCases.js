const assert = require('assert');
const { expect } = require('chai');
const chai = require('chai');
const chaiHttp = require("chai-http");
const request = require('supertest');

const app = require('../weatherAPI');

const apiKey = process.env.apiKey;

const baseUrl = "http://localhost:3000/";

chai.use(chaiHttp);

describe("API is online", function(){
    it('Application online', function(done){
        chai.request(app)
        .get('/')
        .end(function (err, res){
            expect(res).to.have.status(200);
            done();
        });
    });
});

describe("Weather test", function(){
    it('Return Toronto weather', function(done){
        chai.request(app)
        .get('/getweather?city_field=toronto')
        .end(function (err, res) {
            expect(res).to.have.status(200);
            done();
        });
    });

    it('Return Toronto weather', function(done){
        chai.request(app)
        .get('/getweather?city_field=toronto')
        .end(function (err, res) {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('weather');
            done();
        });
    });

    it('Fail return weather', function(done){
        chai.request(app)
        .get('/getweather?city_field=torontod')
        .end(function (err, res) {
            expect(res).to.have.status(200);
            done();
        });
    });

});


// describe('GET /getweather', function () {

//     // let city = 'To';
//     // let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

//     it('has a json response containing the weather', () => request('http://localhost:3000')
//     .get('/getweather?city_field=tokyo').expect('Content-Type', /json/));


// });
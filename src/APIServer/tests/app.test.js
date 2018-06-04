const Promise = require('bluebird'); // eslint-disable-line no-unused-vars
const request = require('supertest');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const app = require('../app');

describe('Test Mongoose database connection', () => {
  test('Test connection', (done) => {
    mongoose.connect('mongodb://127.0.0.1/TWbackend').then(() => {
      expect(mongoose.connection.readyState).toBe(1); // eslint-disable-line no-unused-vars
    });
    done(); // eslint-disable-line no-undef
  });
});

describe('Test GET all notices', () => {
  test('Test if socket is open and routers work', (done) => {
    request(app).get('/notice').then((response) => { // eslint-disable-line no-unused-vars
      expect(response.statusCode).toBe(200); // eslint-disable-line no-undef
      done(); // eslint-disable-line no-undef
    });
  });
  test('Getting all notices', (done) => {
    request(app).get('/notices').then((response) => { // eslint-disable-line no-unused-vars
      fail('Not implemented yet'); // eslint-disable-line no-undef
      done(); // eslint-disable-line no-undef
    });
  });
});

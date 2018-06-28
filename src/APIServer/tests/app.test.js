const Promise = require('bluebird'); // eslint-disable-line no-unused-vars
const request = require('supertest');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const app = require('../app');
const Notice = require('../model/notice');

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
  test('Inserting a test notice and testing getting whether we get a list of notices', (done) => {
    const newnotice = new Notice({ objectid: 123456789, worktype: 'testinsert' });
    newnotice.save((err) => {
      if (err) fail(`Insert error: ${err}`); // eslint-disable-line no-undef
    });
    request(app).get('/notice').then((response) => { // eslint-disable-line no-unused-vars
      console.log(response.body);
      expect(response.statusCode).toBe(200);
      expect(response.body.length).toBeGreaterThan(1);
      done(); // eslint-disable-line no-undef
    });
    // TODO: Delete the test notice
  });
});

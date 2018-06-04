const Promise = require('bluebird'); // eslint-disable-line no-unused-vars
const request = require('supertest');
const app = require('../app');

describe('Test GET all notices', () => {
  test('Getting all notices', () => request(app)
    .get('/notices')
    .then((response) => { // eslint-disable-line no-unused-vars
      fail('Not implemented yet'); // eslint-disable-line no-undef
    }));
});

var request = require('supertest');
var app = require('../app')
describe('Test GET all notices', () => {
    test('Getting all notices', () => {
        return request(app).get("/notices").then(response => {
            fail("Not implemented yet");
        })
    });
})
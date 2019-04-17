const expect = require('chai').expect;
const request = require('supertest');
const app = require('../app');

describe('GET /apps', () => {
    it('Should respond with an array of objects', () => {
        return request(app)
            .get('/apps')
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array');
                expect(res.body).to.have.lengthOf.at.least(1);
                expect(res.body[0]).to.include.all.keys("App", "Genres");
            })
    })
    it('Should sort by App name', () => {
        return request(app)
            .get('/apps')
            .query({ sort: 'App' })
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                let i = 0;
                let sorted = true;
                while (sorted && i < res.body.length - 1) {
                    sorted = sorted && res.body[i].App < res.body[i + 1].App;
                    i++;
                }
                expect(sorted).to.be.true;
            })
    })
    it('Should sort by App rating', () => {
        return request(app)
            .get('/apps')
            .query({ sort: 'Rating' })
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                let i = 0;
                let sorted = true;
                while (sorted && i < res.body.length - 1) {
                    sorted = sorted && res.body[i].Rating <= res.body[i + 1].Rating;
                    i++;
                }
                expect(sorted).to.be.true;
            })
    })
    it("Should return 400 if sort query isn't App or Rating", () => {
        return request(app)
            .get('/apps')
            .query({ sort: 'Banana' })
            .expect(400, 'Sort must be either Rating or App!');
    })
    it('Should filter by App genre Action', () => {
        return request(app)
            .get('/apps')
            .query({ genre: 'Action' })
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                res.body.forEach(app => {
                    expect(app.Genres).to.include('Action');
                })
            })
    })
    it('Should filter by App genre Puzzle', () => {
        return request(app)
            .get('/apps')
            .query({ genre: 'Puzzle' })
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                res.body.forEach(app => {
                    expect(app.Genres).to.include('Puzzle');
                })
            })
    })
    it("Should return 400 if genre query isn't one of: 'Action', 'Puzzle', 'Strategy', 'Casual', 'Arcade', 'Card'", () => {
        return request(app)
            .get('/apps')
            .query({ genre: 'Banana' })
            .expect(400, 'Genres must be either Action, Puzzle, Strategy, Casual, Arcade, or Card!');
    })
})



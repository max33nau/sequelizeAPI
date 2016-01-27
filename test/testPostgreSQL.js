'use strict';

require('assert');
var chai = require('chai');
var chaiHttp = require('chai-http');
var start = require('../lib/app');
chai.use(chaiHttp);
if (!global.Promise) {
  // Checks to see if there is a global promise
  var q = require('q');
  chai.request.addPromises(q.Promise);
}
var expect = chai.expect;

describe('single source API converted from mongodb to sequelize', function () {

  // Used for running crud need the values of what I created in the database
  var server;
  var firstName;
  var lastName;
  var id;
  var chaiRequest;

  before(function (done) {
    server = start(done);
    chaiRequest = chai.request('localhost:8484');
  });

  it('should add player Bugs Bunny to the database using a POST request (create)', function (done) {
    chaiRequest.post('/player').send({
      "name": "Bugs Bunny",
      "position": "Point Guard",
      "team": "Tune Squad",
      "age": 25,
      "feet": 6,
      "inches": 7,
      "rookie": true,
      "numberOfGamesPlayed": 5,
      "totalPoints": 100,
      "totalRebounds": 25,
      "totalAssists": 30,
      "totalSteals": 20,
      "totalBlocks": 10
    }).then(function (response) {
      var responseArray = response.text.split(' ');
      firstName = responseArray[0];
      lastName = responseArray[1];
      id = responseArray[responseArray.length - 1];
      expect(firstName).to.deep.equal('BUGS');
      expect(lastName).to.deep.equal('BUNNY');
      expect(response).to.have.status(200);
      done();
    }).catch(done);
  });

  it('should get all of the current players in the database', function (done) {
    chaiRequest.get('/player').then(function (response) {
      expect(response).to.have.status(200);
      done();
    }).catch(done);
  });

  it('should get the player we just created and have the keys we assigned to it (read)', function (done) {
    chaiRequest.get('/player/' + id).then(function (response) {
      expect(response.body).to.have.any.keys('name', 'team', 'age', 'position', 'totals', 'average', 'rookie');
      expect(response).to.have.status(200);
      done();
    }).catch(done);
  });

  it('should update only the parameters I set for it (update)', function (done) {
    chaiRequest.patch('/player/' + id).send({ "name": "LITTLE PIGGY",
      "position": "Power Forward",
      "team": "Anti Wolf",
      "age": 50 }).then(function (response) {
      expect(response).to.have.status(200);
      return chaiRequest.get('/player/' + id);
    }).then(function (response) {
      expect(response.body.name).to.deep.equal('LITTLE PIGGY');
      expect(response.body.rookie).to.deep.equal(true);
      done();
    }).catch(done);
  });

  it('should update the whole object and anything that isnt updated is turned to null (update)', function (done) {
    chaiRequest.put('/player/' + id).send({ "name": "Daphy Duck",
      "position": "Center",
      "team": "Monstars",
      "age": 10 })
      .then(function (response) {
      expect(response.body.name).to.deep.equal('DAPHY DUCK');
      expect(response.body.rookie).to.be.null;
      expect(response).to.have.status(200);
      done();
    }).catch(done);
  });

  it('should delete the previous person just added to the database (remove)', function (done) {
    chaiRequest.delete('/player/' + id).then(function (response) {
      expect(response).to.have.status(200);
      var idDeletedArray = response.text.split(' ');
      expect(idDeletedArray[0]).to.deep.equal(id);
      done();
    }).catch(done);
  });

  after(function (done) {
    server.close(done);
  });
});

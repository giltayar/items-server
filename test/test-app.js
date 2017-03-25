const {describe, it} = require('mocha')
const {expect} = require('chai')
const app = require('../src/app');
const fetch = require('node-fetch');
const fs  = require('fs');
const os = require('os');

describe('app', function() {
  let server;

  beforeEach((done) => {
    server = app.listen(3000, done);
  });

  beforeEach(removeDatabase);

  afterEach((done) => {
    server.close(done);
  });

  afterEach(removeDatabase);

  it('should initially return an empty array', function () {
    return fetch('http://localhost:3000/people')
      .then(response => {
        expect(response.ok).to.be.ok;

        return response.json();
      })
      .then(json => {
        expect(json).to.deep.equal([]);
      })
  });

  it('should return the clinton family after reset', function () {
    return fetch('http://localhost:3000/reset', {method: 'POST'})
      .then(response => {
        expect(response.ok).to.be.ok;

        return fetch('http://localhost:3000/people');
      })
      .then(response => {
        expect(response.ok).to.be.ok;

        return response.json();
      })
      .then(json => {
        expect(json).to.have.length(2);
        expect(json[0].name).to.equal('Hillary Clinton');
      })
  });

  it('should enable getting a specific person', function () {
    return fetch('http://localhost:3000/reset', { method: 'POST' })
      .then(response => {
        expect(response.ok).to.be.ok;

        return fetch('http://localhost:3000/people/0')
      })
      .then(response => {
        expect(response.ok).to.be.ok;

        return response.json();
      })
      .then(json => {
        expect(json.name).to.deep.equal('Hillary Clinton');
      })
  });
})

function removeDatabase(done) {
    fs.unlink(os.tmpdir() + '/db.json',
      (err) => !err || err.code === 'ENOENT' ? done() : done(err));
}
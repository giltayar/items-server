const {describe, it} = require('mocha')
const {expect} = require('chai')
const app = require('../src/app');
const fetch = require('node-fetch');
const fs  = require('fs');
const os = require('os');

describe('app', function() {
  let server;

  before((done) => {
    server = app.listen(3000, done);
  });

  before(removeDatabase);

  after((done) => {
    server.close(done);
  });

  after(removeDatabase);

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
})

function removeDatabase(done) {
    fs.unlink(os.tmpdir() + '/db.json',
      (err) => !err || err.code === 'ENOENT' ? done() : done(err));
}
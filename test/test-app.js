const {describe, it, beforeEach, afterEach} = require('mocha')
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
    return fetch('http://localhost:3000/items')
      .then(response => {
        expect(response.ok).to.be.ok;

        return response.json();
      })
      .then(json => {
        expect(json).to.deep.equal([]);
      })
  });

  it('should return the clinton family after reset', function () {
    return fetch('http://localhost:3000/items/reset', {method: 'POST'})
      .then(response => {
        expect(response.ok).to.be.ok;

        return fetch('http://localhost:3000/items');
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

  it('should enable getting a specific person by index', function () {
    return fetch('http://localhost:3000/items/reset', { method: 'POST' })
      .then(response => {
        expect(response.ok).to.be.ok;

        return fetch('http://localhost:3000/items/0')
      })
      .then(response => {
        expect(response.ok).to.be.ok;

        return response.json();
      })
      .then(json => {
        expect(json.name).to.deep.equal('Hillary Clinton');
      })
  });

  it('should enable getting a specific person by id', function () {
    return fetch('http://localhost:3000/items/reset', { method: 'POST' })
      .then(response => {
        expect(response.ok).to.be.ok;

        return fetch('http://localhost:3000/items/hill')
      })
      .then(response => {
        expect(response.ok).to.be.ok;

        return response.json();
      })
      .then(json => {
        expect(json.name).to.deep.equal('Hillary Clinton');
      })
  });

  it('should enable updating a specific person by index', function () {
    return fetch('http://localhost:3000/items/reset', { method: 'POST' })
      .then(response => {
        expect(response.ok).to.be.ok;

        return fetch('http://localhost:3000/items/0', {
          method: 'PUT', body: JSON.stringify({
            name: 'Billary Flintsones', age: 88
          }), headers: { 'Content-Type': 'application/json' }
        })
      })
      .then(response => {
        expect(response.ok).to.be.ok;
        return fetch('http://localhost:3000/items/0')
      })
      .then(response => {
        expect(response.ok).to.be.ok;

        return response.json();
      })
      .then(json => {
        expect(json.name).to.deep.equal('Billary Flintsones');
      })
  });

  it('should enable updating a specific person by id', function () {
    return fetch('http://localhost:3000/items/reset', { method: 'POST' })
      .then(response => {
        expect(response.ok).to.be.ok;

        return fetch('http://localhost:3000/items/bill', {
          method: 'PUT', body: JSON.stringify({
            name: 'Billary Flintsones', age: 88
          }), headers: { 'Content-Type': 'application/json' }
        })
      })
      .then(response => {
        expect(response.ok).to.be.ok;
        return fetch('http://localhost:3000/items/bill')
      })
      .then(response => {
        console.log('status', response.status);
        expect(response.ok).to.be.ok;

        return response.json();
      })
      .then(json => {
        expect(json.name).to.deep.equal('Billary Flintsones');
      })
  });

  it('should enable adding a person', function () {
    return fetch('http://localhost:3000/items/reset', { method: 'POST' })
      .then(response => {
        expect(response.ok).to.be.ok;

        return fetch('http://localhost:3000/items', {
          method: 'POST', body: JSON.stringify({
            name: 'Billary Flintsones', age: 88
          }), headers: { 'Content-Type': 'application/json' }
        })
      })
      .then(response => {
        expect(response.ok).to.be.ok;
        return fetch('http://localhost:3000/items')
      })
      .then(response => {
        expect(response.ok).to.be.ok;

        return response.json();
      })
      .then(json => {
        expect(json).to.have.length(3);
        expect(json[2].name).to.deep.equal('Billary Flintsones');
      })
  });

  it('should enable deleting a person by index', function () {
    return fetch('http://localhost:3000/items/reset', { method: 'POST' })
      .then(response => {
        expect(response.ok).to.be.ok;

        return fetch('http://localhost:3000/items/0', {method: 'DELETE'})
      })
      .then(response => {
        expect(response.ok).to.be.ok;
        return fetch('http://localhost:3000/items')
      })
      .then(response => {
        expect(response.ok).to.be.ok; 

        return response.json();
      })
      .then(json => {
        expect(json).to.have.length(1);
        expect(json[0].name).to.deep.equal('Bill Clinton');
      })
  });

  it('should enable deleting a person by id', function () {
    return fetch('http://localhost:3000/items/reset', { method: 'POST' })
      .then(response => {
        expect(response.ok).to.be.ok;

        return fetch('http://localhost:3000/items/hill', { method: 'DELETE' })
      })
      .then(response => {
        expect(response.ok).to.be.ok;
        return fetch('http://localhost:3000/items')
      })
      .then(response => {
        expect(response.ok).to.be.ok;

        return response.json();
      })
      .then(json => {
        expect(json).to.have.length(1);
        expect(json[0].name).to.deep.equal('Bill Clinton');
      })
  });
})


function removeDatabase(done) {
    fs.unlink(os.tmpdir() + '/db-items.json',
      (err) => !err || err.code === 'ENOENT' ? done() : done(err));
}
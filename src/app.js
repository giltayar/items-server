const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const os = require('os');

const app = express();

const DB = path.join(os.tmpdir(), 'db.json');

app.use(cors({allowedOrigins: ['*']}));

app.get('/people', (req, res) => {
  fs.readFile(DB, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.json([]);
      }
      else {
        res.status(500).send(err);
      }
    }
    else {
      res.json(JSON.parse(content));
    }
  })
});

app.get('/people/:index', (req, res) => {
  fs.readFile(DB, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.json([]);
      }
      else {
        res.status(500).send(err);
      }
    }
    else {
      res.json(JSON.parse(content)[req.params.index]);
    }
  })
});

app.use('/people/:index', bodyParser.json());

app.put('/people/:index', (req, res) => {
  fs.readFile(DB, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.json([]);
      }
      else {
        res.status(500).send(err);
      }
    }
    else {
      const people = JSON.parse(content);

      people[req.params.index] = req.body;

      fs.writeFile(DB, JSON.stringify(people), err => {
        if (err) {
          return res.status(500).send(err);
        }
        res.status(200).end()
      })
    }
  })
});

app.post('/reset', (req, res) => {
  fs.writeFile(DB, JSON.stringify([{
    name: 'Hillary Clinton',
    age: 69,
    gender: 'female'
  },
  {
    name: 'Bill Clinton',
    age: 70,
    gender: 'male'
  }]), (err) => {
    if (err) {
      res.status(500).send(err);
    }
    else {
      res.sendStatus(200);
    }
  })
});


module.exports = app;
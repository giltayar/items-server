const express = require('express');
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